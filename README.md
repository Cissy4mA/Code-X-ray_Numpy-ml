# Code X-Ray · NumPy-ML 机器学习算法源码透视与交互式学习平台

Code X-Ray 把 NumPy-ML 算法仓库转换成可搜索、可学习的交互式网站，提供模块浏览、算法检索、数学卡片、学习路径、相关函数、调用结构和算法对比。

仓库已经包含新版 React 前端、FastAPI 后端和 SQLite 演示索引。clone 后无需安装 MySQL，也无需重新导入 NumPy-ML 数据。

## 项目结构

```text
Code-X-ray_Numpy-ml/
├── backend/                  # FastAPI、检索、学习模块和数据库适配
├── frontend/
│   ├── dist/                 # 已构建的 React 网站，FastAPI 直接托管
│   └── index.html            # 旧版页面，仅作为构建缺失时的备用页
├── web/                      # React + TypeScript + Vite 前端源码
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

仓库自带约 4.8MB 的 SQLite 索引，因此部署脚本会跳过重新导入。第一次执行语义搜索时，`sentence-transformers` 可能下载本地模型；下载完成后会使用本机缓存。

## 前端开发

先在仓库根目录启动后端：

```bash
bash scripts/run.sh
```

再开一个终端：

```bash
cd web
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
cd web
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

## 主要 API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/stats` | 数据库统计 |
| GET | `/api/modules` | 模块列表和 README |
| POST | `/api/modules/search` | 模块检索 |
| POST | `/api/search` | 算法混合检索 |
| GET | `/api/learn/card` | 数学原理卡片 |
| GET | `/api/learn/compare` | 算法对比 |
| GET | `/api/learn/path` | 学习路径 |
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
cd web
npm run build
cd ..
python -m pytest
```

至少还应启动一次网站并检查：

- 首页、Browse 和 Learn 页面可以切换
- GitHub 图标跳转到本仓库
- 模块搜索和算法搜索能返回数据
- `Open the Learn Page` 能进入所选算法的学习页面
