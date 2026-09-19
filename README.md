# Code X-Ray · NumPy-ML 机器学习算法源码透视与交互式学习平台

把 NumPy-ML 这类算法仓库，像做 X 光一样“透视”给学习者看：精确/模糊双模式检索 +
知识卡片 + 算法对比 + 学习路径 + 调用关系图，降低机器学习源码的学习门槛。

> 产品命名、问题陈述、目标人群见 [`docs/项目简介与命名.md`](docs/项目简介与命名.md)；
> 小组分工与三周计划见 [`docs/分工方案.md`](docs/分工方案.md)；
> 协作与贡献流程（分支 / PR / 每人负责的文件）见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

---

## 一、目录结构（已按人拆分，合并互不冲突）

```
code-x-ray/
├── backend/                 # 后端（FastAPI）
│   ├── app.py              # 装配入口 + 元接口（只接线）
│   ├── db.py               # 数据库连接 + 建表（agent 维护，人不改）
│   ├── parser.py           # 代码切分 + embedding（agent 维护，人不改）
│   ├── index_pipeline.py   # 入库管线：粘贴代码 / 导入 GitHub 仓库（稳定）
│   ├── retrieval.py        # 检索精度【分工1】核心改动区
│   ├── learn.py            # 学习板块功能【分工2：两人】
│   └── eval_test.py        # 检索评估与测试【分工3】
├── frontend/
│   └── index.html          # 前端单页（由 FastAPI 同源托管，无需 CORS）
├── scripts/
│   ├── deploy.sh           # 一键部署（建 venv→装依赖→建库→恢复/重建数据→启动）
│   ├── run.sh              # 日常启动
│   ├── export_db.sh        # 导出数据库 dump
│   ├── migrations/         # 历史迁移/工具脚本（留档）
│   └── test_demo.py
├── data/
│   ├── learn_content.json  # 学习板块内容模板（分工2 维护）
│   └── code_x_ray.sql      # （可选·非必须）数据库 dump，仅用于加速部署；队友无需准备，deploy.sh 会自动从 numpy-ml 导入
├── docs/                   # 项目文档（简介/分工/设计）
├── sample/
├── requirements.txt
├── .env.example
└── .gitignore
```

**各分工改对应文件，合并时几乎零冲突：**
| 分工 | 负责人 | 文件 |
|------|--------|------|
| 检索精度提升 | 1 人 | `backend/retrieval.py`（权重/重排）、`backend/parser.py` 的 `embed()` |
| 学习板块开发 | 2 人 | `backend/learn.py` + `data/learn_content.json` |
| 检索评估与测试 | 1 人 | `backend/eval_test.py` |
| 页面设计美化 | 1 人 | `frontend/index.html`（视觉/布局） |
| 检索结果可视化 | 1 人 | `frontend/index.html`（Search 页） |
| 学习板块可视化 | 1 人 | `frontend/index.html`（Learn 页） |

---

## 二、环境要求

- Python 3.10+（开发机用 3.13）
- 本机 MySQL（推荐 XAMPP，默认 `root` 空密码，端口 3306）**需先启动**
- 首次运行会下载 `all-MiniLM-L6-v2` embedding 模型（国内网络建议设 `HF_ENDPOINT` 镜像）

---

## 三、一键部署（队友照做即可跑起来）

```bash
git clone https://github.com/Cissy4mA/Code-X-ray_Numpy-ml.git
cd Code-X-ray_Numpy-ml
cp .env.example .env        # 按需改 MySQL 账号；国内网络改 HF_ENDPOINT 镜像
bash scripts/deploy.sh
```
> 把上面这串命令直接丢给 agent,它会自己 clone → 建 venv → 装依赖 → 建库表 → 导入数据 → 启动。

`deploy.sh` 会：建 venv → 装依赖 → 建库表 →
**从 numpy-ml 自动导入数据**（无需准备数据库，与组长导入流程完全一致）→ 启动后端。
> 部署加速（可选）：若仓库里存在 `data/code_x_ray.sql`，脚本会优先恢复它跳过导入；
> 但**队友不用管这个文件**——没有它也能跑，只是首次导入会多花几分钟下载模型+编码。
启动后访问 http://127.0.0.1:8000 。

日常只启动（已部署过）：`bash scripts/run.sh`

（可选）导出数据库 dump 加速队友部署——**非必须**，仅当想省去队友首次导入时间时执行：
```bash
bash scripts/export_db.sh   # 生成 data/code_x_ray.sql，本地用，不进版本库
```

---

## 四、API 速查

| 方法 | 路径 | 说明 |
|------|------|------|
| GET  | `/api/sample` | 示例代码 |
| POST | `/api/index` | 粘贴代码入库 |
| POST | `/api/index_repo` | 从 GitHub 导入仓库（默认 numpy-ml） |
| POST | `/api/search` | 混合检索（top_k / module / family / task 过滤） |
| GET  | `/api/modules` | 模块列表 + README 原文 |
| GET  | `/api/debug/chunks` | 浏览全部 chunk 与向量头 |
| POST | `/api/debug/search` | 拆解一次检索的打分明细 |
| GET  | `/api/learn/modules` `/card` `/compare` `/path` `/call_graph` | 学习板块 |
| GET  | `/api/eval` | 跑评测集，返回 MRR / Hit@k |
| GET  | `/api/smoke` | 连通性冒烟 |

---

## 五、本地开发约定

1. **不要改别人的文件**：检索改 `retrieval.py`、学习板块改 `learn.py`、评估改 `eval_test.py`，
   其余（`app.py`/`db.py`/`parser.py`/`index_pipeline.py`）由组长/agent 维护。
2. 前端三人各认领一块，改 `frontend/index.html` 前先和后端对好接口字段。
3. 每个人随时用中文记流水账，最后发给论文主笔汇总。
