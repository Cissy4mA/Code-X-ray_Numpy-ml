# Code X-Ray（Code X-Ray）— 设计草案 v0.1

> 课程：DSC5003 数据存储与检索 / Track 1 数据库应用开发（小组作业）
> 形态：用户丢入一个「本地文件夹」或「GitHub 链接」→ 系统解析、索引、向量化 → 支持语义检索 + 带引用的自然语言问答
> 目标：9 周周期，争取第 7 周完成，留 2 周缓冲

---

## 1. 技术栈（降配版，贴合本机 8GB Mac + XAMPP/MySQL）

| 层 | 选型 | 理由 |
|---|---|---|
| 后端 | Python + FastAPI | 解析/嵌入/检索链路全 Python，生态最熟 |
| 关系型存储 | 本机 MySQL（XAMPP 已装） | 零新增依赖，存元数据 + chunk 文本 |
| 向量 | embedding 存 MySQL `JSON` 列，检索时 Python 暴力余弦 | 一个代码库几千个函数，暴力余弦毫秒级，足够；规模上来再换 pgvector/Chroma |
| 关键词检索 | MySQL `FULLTEXT`（可加 `ngram` parser 增强代码子串匹配） | 精确匹配函数名/变量名，补足向量的短板 |
| 代码解析 | `tree-sitter`（Python 优先，后续可扩 Java） | 按函数/类粒度切分，而非按行盲切 |
| LLM / Embedding | DeepSeek 或 Qwen API（demo 实时调用） | 便宜、中文友好，避免本地大模型吃 8GB 内存 |

**核心考点对齐（评分点）**：非结构化代码的结构化切片、混合检索（关键词+语义）、元数据过滤、索引优化（FULLTEXT / 向量索引思路）、检索中间态可视化。

---

## 2. 数据库 Schema（DDL，MySQL）

```sql
-- 项目（一次上传 = 一个 project）
CREATE TABLE projects (
  project_id   INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  source_type  ENUM('folder','github') NOT NULL,
  source_url   VARCHAR(1024),          -- github 链接或原始路径
  description  TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文件级元数据
CREATE TABLE code_files (
  file_id       INT AUTO_INCREMENT PRIMARY KEY,
  project_id    INT NOT NULL,
  file_path     VARCHAR(1024) NOT NULL,  -- 如 src/utils/auth.py
  language      VARCHAR(50),
  content       LONGTEXT,                -- 完整文件（大库可改存对象存储）
  last_modified TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

-- 检索单元：函数/类级 chunk（RAG 的灵魂）
CREATE TABLE code_chunks (
  chunk_id      INT AUTO_INCREMENT PRIMARY KEY,
  file_id       INT NOT NULL,
  chunk_content LONGTEXT NOT NULL,       -- 切分后的代码片段
  chunk_type    VARCHAR(50),             -- function / class / method / comment / import
  entity_name   VARCHAR(255),            -- 提取出的函数名或类名
  start_line    INT,
  end_line      INT,
  embedding     JSON,                    -- float 数组，维度依模型而定
  FOREIGN KEY (file_id) REFERENCES code_files(file_id),
  FULLTEXT INDEX ft_chunk (chunk_content)  -- 可加 WITH PARSER ngram 增强子串匹配
);
```

> 进阶（非 MVP）：调用关系图可用 `call_edges(from_chunk_id, to_chunk_id, kind)` 表表达，MVP 不做。

---

## 3. Ingestion 流程（接受文件夹 / GitHub 链接）

```
输入(路径 或 URL)
  └─ URL → git clone 到临时目录
  └─ 遍历目录，按扩展名过滤(.py 优先)
       └─ tree-sitter 解析每个文件
            ├─ 抽取 function / class / method 节点
            ├─ 记录 entity_name / start_line / end_line
            └─ 每个节点作为 1 个 chunk
       └─ 调用 Embedding API 生成向量
  └─ 批量写入 MySQL（projects → code_files → code_chunks）
```

**亮点（数据工程体现）**：不是按行/按字符盲切，而是按语法结构切，保证一个函数逻辑完整，且带上 `entity_name` 等结构化字段供精确过滤。

---

## 4. 混合检索逻辑（Hybrid Retrieval）

```
用户提问
  ├─ 关键词分：MySQL FULLTEXT MATCH(chunk_content) AGAINST(查询)
  ├─ 语义分：Python 算 cosine(query_embed, chunk.embedding)
  ├─ 归一化后加权融合：score = α·norm(kw) + β·norm(cosine)
  ├─ （可选）Rerank：用轻量重排模型对 Top-N 再排序
  └─ 取 Top-K chunk → 拼进 Prompt → LLM 生成带 [1][2] 引用的答案
```

示例（关键词阶段，语义阶段在 Python 算余弦后合并）：

```sql
SELECT chunk_id,
       MATCH(chunk_content) AGAINST(%s IN NATURAL LANGUAGE MODE) AS kw_score
FROM code_chunks c
JOIN code_files f ON f.file_id = c.file_id
WHERE f.project_id = %s
  AND MATCH(chunk_content) AGAINST(%s);
```

> 元数据过滤是纯数据库强项（也是 AI 做不到的）：检索前先用 `file_type='py' AND project_id=?` 缩小范围，再算相似度。

---

## 5. 小组分工（6 人）

| # | 角色 | 职责 | 备注 |
|---|---|---|---|
| 1 | Ingestion / 解析 | tree-sitter 解析、chunking、调 Embedding API 入库 | 需 Python + 一点编译原理 |
| 2 | 数据库 / 后端 | MySQL schema、检索 API、混合检索实现 | 课程核心，安排最强的人 |
| 3 | 检索 / 排序 | 混合加权、rerank、检索质量评估 | 推荐算法背景者主导（用户的差异化优势） |
| 4 | LLM 问答层 | Prompt 设计、引用格式化、API 调用 | 与角色 3 紧密配合 |
| 5 | 前端 | 上传文件夹/GitHub 链接 UI、聊天 UI、代码高亮查看器 | 2 人可合并或加 1 人做测试 |
| 6 | 集成 / 测试 / 文档 / Demo | 联调、测试、报告、Demo 剧本、兼项目经理 | 把控进度 |

---

## 6. 时间线（目标第 7 周完成）

| 周 | 里程碑 |
|---|---|
| W1 | 需求固化、schema 定稿、技术 spike（tree-sitter 可行性、API key 申请） |
| W2–3 | Ingestion pipeline（文件夹 + GitHub → chunk → MySQL + 向量） |
| W3–4 | 检索层（FULLTEXT + 余弦 + 混合 + rerank）+ 后端 API |
| W4–5 | LLM 问答层 + 引用 |
| W5–6 | 前端（上传/链接、聊天、代码查看器） |
| W6–7 | 集成 + 在 demo 库上测试 + Demo 剧本打磨 |
| W8–9 | 缓冲 / 报告撰写 / 彩排 |

---

## 7. Demo 代码库建议

产品本身是「repo-agnostic」的（任何文件夹/链接都能吃），demo 只需挑 1–2 个有代表性的：

- **主演示（乱而大，体现考古价值）**：`youtube-dl` 或中等体量 Django 应用 —— 函数命名随意、跨文件调用多，最能展示「按含义搜到命名不相关的函数」。
- **干净对照（可选）**：`requests` / `Flask` —— 结构清晰，证明基础检索也准。
- **真实感备选**：往届/祖传课程作业仓库（最贴近「接手旧项目」场景，注意脱敏与授权）。

Demo 剧本示例：上传某 OSS 仓库 → 问「系统是怎么防止 SQL 注入的？」→ 代码里可能只有 `parameterized query` / `prepared statement`，无「SQL 注入」字样 → 系统语义检索命中 `db_utils.py` 并高亮关键行。

---

## 8. 风险与降级

- **tree-sitter 解析失败**：对解析不了的语言/语法，降级为按文件 + 按固定行数切分，保证不阻塞。
- **API 限流/断网**：embedding 与 LLM 调用加本地缓存（同一 chunk 只算一次；同一问题可复用）。
- **8GB 内存**：不本地跑大模型；MySQL + 轻量后端足够。
- **调用关系图**：明确列为 stretch goal，时间不够直接砍。

---

## 9. 与评分方案 / 交付物对齐

> 依据课程交付物与评分方案（Source Code 30% / Video 20% / Written Report 50%）

### 9.1 Source Code（30%）

- **必须交付**：数据库 schema、后端逻辑、前端、数据生成/测试脚本。
- **对应安排**：schema 已出；后端 FastAPI；前端 Vue/React；测试脚本（入库脚本、检索基准脚本）由集成/测试角色负责。
- **必须项**：GitHub 公开仓库 + README（结构说明、依赖、运行方式）。

### 9.2 Video Demonstration（20%）

- **时长 8–10 分钟**，需覆盖：用户界面、查询执行、数据流、后端操作。
- **建议 Demo 剧本**：
  1. 开场（0:00–0:30）：问题背景——接手旧代码的痛苦。
  2. 入库流程（0:30–2:00）：粘贴 GitHub 链接 → 后台解析 → 展示 MySQL 中生成的 projects / files / chunks。
  3. 语义检索演示（2:00–4:00）：问"怎么防止 SQL 注入"，命中命名不含关键词的函数。
  4. 关键词检索演示（4:00–5:30）：直接搜函数名 `authenticate_user`。
  5. 混合检索与引用（5:30–7:30）：复杂问题"订单创建流程"，看 Top-K 块、相似度、LLM 带引用回答、点击跳转高亮。
  6. 元数据过滤/后端查询（7:30–9:00）：展示 MySQL 中的检索 SQL 与执行计划。
  7. 总结（9:00–9:30）。

### 9.3 Written Report（50%）—— 项目核心得分区

报告关键章节与我们已有产出的对应：

| 报告章节 | 我们已有的 | 还需补的 |
|---|---|---|
| 1. Group Information | 成员名单 | 无 |
| 2. Contribution Statement | 分工表 | 每个人具体贡献清单 |
| 3. Project Overview | 目标用户/痛点 | 问题陈述、应用目标 |
| 4. Technical Design | 技术栈 | 系统架构图（MVC/分层）、系统图 |
| **5. Database Design** | schema DDL | **ER 图、范式说明、索引策略、示例查询** |
| 6. Evaluation and Results | 暂无 | **查询效率、可扩展性、可用性评估** |
| 7. Challenges and Lessons | 暂无 | 开发中记录 |
| 8. References | 无 | 引用 tree-sitter、embedding API 文档 |
| 9. Links | 无 | GitHub 仓库、视频链接 |

### 9.4 还需补强的清单（下一步）

1. **ER 图**：projects → code_files → code_chunks 一对多关系，明确主外键。
2. **范式说明**：当前 schema 基本满足 3NF，需写明理由（无部分依赖、无传递依赖、每张表单一主题）。
3. **索引策略**：
   - 主键聚簇索引（project_id / file_id / chunk_id）
   - 外键索引：`code_files(project_id)`、`code_chunks(file_id)` 加速 JOIN
   - 全文索引：`FULLTEXT(chunk_content)` 关键词检索
   - 可选过滤索引：`code_chunks(chunk_type)`、`code_chunks(entity_name)`
4. **示例查询**：准备 5–8 条覆盖入库统计、关键词检索、元数据过滤、JOIN 查询的 SQL。
5. **评估方案**：
   - **查询效率**：分别测关键词检索、语义检索、混合检索的耗时。
   - **可扩展性**：不同代码库规模（文件数 / chunk 数）下的入库时间与检索延迟。
   - **可用性**：设计 3–5 个真实问题，记录系统能否正确召回相关函数。
6. **架构图**：画出 MVC/分层架构图，放进报告 Technical Design 章节。

---

_草案 v0.1，待小组讨论后修订。重点待定：demo 具体代码库、是否上 pgvector、前端框架选型。_
