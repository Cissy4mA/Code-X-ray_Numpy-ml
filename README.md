# Code X-Ray · NumPy-ML 机器学习算法源码透视与交互式学习平台

Code X-Ray 把 NumPy-ML 算法仓库转换成可搜索、可学习的交互式网站，提供模块浏览、算法检索、数学卡片、学习路径、相关函数、调用结构和算法对比。

仓库已经包含新版 React 前端、FastAPI 后端和 SQLite 演示索引。clone 后无需安装 MySQL，也无需重新导入 NumPy-ML 数据。

## 项目结构

```text
Code-X-ray_Numpy-ml/
├── backend/                  # FastAPI、检索、学习模块和数据库适配
├── frontend/                 # React + TypeScript + Vite 前端源码
│   ├── src/
│   ├── dist/                 # 已构建的网站，FastAPI 直接托管
│   └── legacy-index.html     # 旧版页面，仅作为构建缺失时的备用页
├── data/
│   ├── code_x_ray.sqlite3    # 已建立索引的演示数据库
│   └── learn_content.json
├── tests/                    # 检索评估与测试
├── scripts/
│   ├── deploy.sh             # 首次安装并启动
│   └── run.sh                # 已安装后的日常启动
├── Dockerfile                # 公网容器部署入口
├── requirements.txt
└── .env.example
```

## 一键在本机运行

环境要求：

- Python 3.10 或更高版本
- 首次安装依赖和首次语义检索需要联网
- Node.js 只在修改前端时需要；直接运行网站不需要 Node.js

```bash
git clone https://github.com/Cissy4mA/Code-X-ray_Numpy-ml.git
cd Code-X-ray_Numpy-ml
cp .env.example .env
bash scripts/deploy.sh
```

启动后访问：

```text
http://127.0.0.1:8000
```

以后再次启动：

```bash
bash scripts/run.sh
```

仓库自带 SQLite 语义索引，因此部署脚本会跳过重新导入。查询和索引统一使用固定版本的 `sentence-transformers/all-MiniLM-L6-v2`（384 维）。首次使用需要模型文件，本地已有完整缓存时可离线加载；没有缓存时会下载。

### 语义模型与索引迁移

`.env` 使用 `EMBEDDING_BACKEND=local`，模型名称和版本见 `.env.example`。显式设置 `local` 后，即使环境中存在 API key，也不会切换到 API。模块检索使用关键词与语义名次的 RRF 融合；算法检索默认使用 0.2 关键词、0.8 语义权重，不再因为数据库是 SQLite 就采用 hash 演示权重。

更换模型或从旧 hash 索引迁移时，必须全量重建，不能只更新模块向量：

```bash
set -a
source .env
set +a
.venv/bin/python scripts/reembed_all.py
```

脚本仅支持 SQLite，先在数据库旁的 `backups/` 保存备份，再在同一事务内更新模块、算法类和函数／方法的全部向量。任一步失败会回滚，不会留下混合模型索引；源码、参数等原始数据保持不变。迁移期间会锁定数据库写入，建议暂停管理端导入操作。旧入口 `scripts/reembed_modules.py` 也会执行全量迁移。

数据库的 `embedding_index` 表记录模型、固定版本和维度。查询配置不匹配或旧库没有模型记录时，搜索接口返回 503 和重建提示，不会悄悄使用错误向量。修改 `.env`、后端代码或完成迁移后，停止旧进程，再用 `bash scripts/run.sh` 启动；运行中的进程不会自动载入新配置。MySQL 不在此次迁移脚本及模型身份校验的支持范围内。

启用真实模型不代表检索准确率已经得到验证。中文别名匹配仍保留；中文自然语言检索效果需要单独评估，不应据此宣称完整的跨语言语义能力。

## 前端开发

先在仓库根目录启动后端：

```bash
bash scripts/run.sh
```

再开一个终端：

```bash
cd frontend
npm ci
npm run dev
```

开发页面地址：

```text
http://127.0.0.1:3000
```

Vite 会把 `/api` 代理到 `http://127.0.0.1:8000`。

修改完成后生成正式页面：

```bash
cd frontend
npm run build
```

构建结果会直接写入 `frontend/dist/`，之后只需运行 FastAPI，前端和 API 就会使用同一个域名。

## Docker / 公网部署

本地验证容器：

```bash
docker build -t code-x-ray .
docker run --rm -p 8000:8000 code-x-ray
```

然后访问 `http://127.0.0.1:8000`。

支持 Dockerfile 的云平台可以直接连接本仓库部署。服务启动命令已经兼容平台提供的 `PORT` 环境变量。

生产环境建议保留：

```env
DB_BACKEND=sqlite
SQLITE_PATH=data/code_x_ray.sqlite3
ENABLE_ADMIN_API=0
```

`ENABLE_ADMIN_API=0` 会关闭清库、重新导入、调试和评测接口，避免公网用户操作数据库或触发高负载任务。普通搜索、模块浏览、学习页面和健康检查不受影响。

如果平台使用临时文件系统，内置 SQLite 数据仍然可用于只读演示；若未来允许用户导入仓库并长期保存数据，应改用持久磁盘或托管数据库。

## 网站检索流程

网站名称为 **Code-X-Ray**，完整标题为 *Code-X-Ray — A Machine Learning Code Retrieval and Learning Platform for NumPy-ML*。

首页展示 Code-X-Ray 品牌及 ML Code Retrieval & Learning 标题，使用优化后的背景图。标题、平台说明与搜索栏采用自适应纵向布局；长查询在输入框内滚动，不覆盖提交按钮。

Browse 页面提供前后衔接的两步检索，而不是两种并列方法：

1. **Step 1 · Find a module**：用算法名、主题或任务描述搜索整个仓库，阅读匹配模块的 README。
2. **Step 2 · Find an algorithm**：选择模块后，自动沿用原查询，在该模块内检索算法类；可继续细化查询，再打开 Learn 页面。

首页搜索也从模块定位开始。未选择模块时不会执行全局算法搜索；仓库未收录的算法在第一步提示并停止下钻。

## 学习页面

- **Math Card**：展示已收录的数学卡片及真实索引标签、参数、文档和源码；没有卡片时不显示额外的空状态提示，接口加载失败时仍显示错误和适用的重试入口。
- **Path**：按当前算法生成四步阅读建议，支持勾选进度、重置及同模块算法切换。进度只保存在当前浏览器；模块列表按名称排序，不代表先修或难度顺序。
- **Related Functions**：展示当前算法实际索引的成员函数，不生成相似度分数。
- **Call Graph**：读取静态调用图，只展示可解析的索引边，另列未解析符号；不代表运行时追踪。
- **Compare**：选择另一个同模块算法，对比真实索引字段。
- **Complexity**：展示 AST 结构证据与索引启发式指标，不把源码评分当作 Big-O。
- **Self-check**：基于算法元数据生成阅读自测，可展开参考答案，不自动评分。

卡牌默认不自动轮播，避免阅读时切换。检索相关性仅展示后端排序分数，不表示正确概率。

从 Learn 返回 Browse 时会恢复本次打开网站期间的查询、模块和结果。独立函数与算法类一同展示，结果卡片保留三项检索得分和源码。接口暂时失败时可直接点击 Retry 重试。

## API 列表

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/stats` | 数据库统计 |
| GET | `/api/modules` | 模块列表和 README |
| POST | `/api/modules/search` | 模块检索 |
| POST | `/api/search` | 算法混合检索 |
| GET | `/api/learn/card` | 数学原理卡片 |
| GET | `/api/learn/algorithm` | 按 module、algorithm、path 获取真实算法详情和源码结构证据 |
| GET | `/api/learn/compare` | 算法对比 |
| GET | `/api/learn/path` | 按 module、algorithm、path 生成阅读路径和模块列表 |
| GET | `/api/learn/call_graph` | 调用关系图 |
| GET | `/api/smoke` | 数据库冒烟检查 |

以下接口受 `ENABLE_ADMIN_API` 控制：

- `/api/reset`
- `/api/index`
- `/api/index_repo`
- `/api/debug/*`
- `/api/eval*`

## 数据库选择

默认使用仓库内置 SQLite：

```env
DB_BACKEND=sqlite
SQLITE_PATH=data/code_x_ray.sqlite3
```

如需切换 MySQL：

```env
DB_BACKEND=mysql
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_PORT=3306
MYSQL_DB=code_x_ray
```

## 提交前检查

```bash
cd frontend
npm run build
cd ..
python -m pytest
```

学习接口回归测试不需要下载语义模型：

```bash
python -m unittest discover -s tests -p 'test_learn_api.py' -v
cd frontend && npm run test:learning
```

若环境已提供 `playwright-core` 和 Chrome，可在网站启动后运行浏览器回归：

```bash
node tests/test_browser.cjs
node tests/test_api_display.cjs
```

可用 `PLAYWRIGHT_MODULE` 指定 Playwright 模块位置，`CHROME_PATH` 指定 Chrome 可执行文件，`TEST_BASE_URL` 指定网站地址（默认 `http://127.0.0.1:8000`）。测试使用隔离浏览器上下文，覆盖两阶段检索、独立函数、进度、重试、前后退和四种屏幕宽度。

`test_api_display.cjs` 额外检查模块匹配理由、对比表数学说明与参考文献、缺失值及接口错误分类。异常响应和对比字段样本仅在测试浏览器中模拟，不写入数据库。

向量迁移与模型身份校验的单元测试不需要下载模型，也不会修改真实数据库：

```bash
python -m unittest discover -s tests -p 'test_embedding_index.py' -v
```

`hash` 只用于演示，不是语义模型；全量正式迁移脚本会拒绝此配置。

已有完整模型缓存且已完成语义索引迁移时，可运行真实模型的两阶段接口冒烟测试（使用数据库副本）：

```bash
set -a; source .env; set +a
RUN_SEMANTIC_TESTS=1 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 \
  .venv/bin/python -m unittest discover -s tests -p 'test_semantic_search.py' -v
```

这些是功能回归用例，不是独立测试集上的检索准确率评测。

至少还应启动一次网站并检查：

- 首页、Browse 和 Learn 页面可以切换
- GitHub 图标跳转到本仓库
- 模块搜索和算法搜索能返回数据
- `Open the Learn Page` 能进入所选算法的学习页面
