# 协作与贡献指南（Code X-Ray 小组作业）

本仓库是 **Cissy4mA/Code-X-ray_Numpy-ml**，`main` 为保护分支，**任何人不要直接 push 到 main**，一律走「开分支 → 改对应文件 → 提 PR → 组长合并」。

## 一、标准开发流程

```bash
# 1. 克隆主仓库（方式 A）或自己的 fork（方式 B）
git clone https://github.com/Cissy4mA/Code-X-ray_Numpy-ml.git
cd Code-X-ray_Numpy-ml

# 2. 同步最新 main
git checkout main && git pull origin main

# 3. 开对应分工的分支（命名见第三节）
git checkout -b feat/<对应分工>

# 4. 本地跑起来（首次会自动从 numpy-ml 导入数据，无需准备数据库）
cp .env.example .env
bash scripts/deploy.sh

# 5. 只改对应负责的文件，改完提交
git add <改动的文件>
git commit -m "feat: <分工> <做了什么>"
git push origin feat/<对应分工>

# 6. 在 GitHub 提 PR 到 main，等组长 review 合并
```

---

## 三、每人负责的分支与文件（决定合并零冲突）

| 分工 | 分支名 | 只改这些文件 |
|------|--------|--------------|
| 检索精度提升 | `feat/retrieval` | `backend/retrieval.py`、`backend/parser.py` 的 `embed()` |
| 学习板块开发 | `feat/learn` | `backend/learn.py`、`data/learn_content.json` |
| 检索评估与测试 | `feat/eval-test` | `backend/eval_test.py` |
| 页面设计美化 | `feat/frontend-style` | `frontend/index.html`（视觉/布局区块） |
| 检索结果可视化 | `feat/frontend-search` | `frontend/index.html`（Search 页区块） |
| 学习板块可视化 | `feat/frontend-learn` | `frontend/index.html`（Learn 页区块） |
| 统筹 / 装配（组长） | `feat/main` | `backend/app.py`、`backend/db.py`、`README.md` 等 |

**铁律：只碰上表对应文件。** 装配层 `app.py` / `db.py` / `parser.py` / `index_pipeline.py` 由统筹/agent 维护，组员不要改，否则合并必冲突。

---

## 四、数据库不用传（重要）

数据是从公开仓库 `numpy-ml` 派生的，不是独家内容。clone 后 `bash scripts/deploy.sh` 会自动 `index_repo()` 从 numpy-ml 导入，结果与组长本地数据库**逐字节一致**（清洗规则全写死在代码里）。

- 不要导出 / 上传 `data/code_x_ray.sql`（已被 `.gitignore` 排除）。
- 不要试图把本地数据库发给别人。

---

## 五、冲突预警：前端是单文件

`frontend/index.html` 目前是**单文件**，前端三人虽认领不同区块，但改同一文件仍可能冲突。规避办法（按优先级）：

1. **改前先 `git pull origin main`** 拿到最新，改完**尽快提 PR**，缩短并发窗口。
2. 同一区块的改动尽量由一人完成，PR 错开时间合并。
3. 长期方案：把 `index.html` 按页拆成 `index.html`（壳）+ `search.html` + `learn.html`，前端各自认领独立文件。

后端已按人拆成独立 `.py` 文件，基本不会冲突；只有前端需要这条提醒。

---

## 六、PR 规范

- 一个 PR 只做**一个分工**，不要混改多个文件。
- PR 标题：`feat: <分工> <一句话说明>`。
- PR 描述写清：改了什么、本地怎么验证（如 `bash scripts/run.sh` 后访问哪个接口/页面）。
- 组长 review 通过后合并；合并方式用 **Squash and merge**，保持 main 历史干净。

---

## 七、组长本地验证与合并

组员提 PR 后，组长在本机把分支跑起来看真实效果，确认没问题再合并。本机验证时，agent 直接在当前电脑部署，浏览器开 `localhost` 即可查看效果。

**前置条件**：本地 **MySQL 必须在运行**（XAMPP 图形界面点 Start 即可；残留 pid 权限问题用 GUI 启动通常能绕过）。MySQL 没开，后端跑不起来、也没法从 numpy-ml 导入。

**验证步骤（组长交给 agent 一句话即可，如「请验证 feat/learn 分支」）：**
```bash
cd Code-X-ray_Numpy-ml
git fetch origin
git checkout feat/<分工>          # 切到组员分支
cp .env.example .env              # 若还没配
bash scripts/deploy.sh            # 自动建库 + 从 numpy-ml 导入 + 启动
# 浏览器开 http://127.0.0.1:8000 看效果
```

**重要：不要覆盖现有稳定服务。** 验证分支时另开端口（如 `uvicorn backend.app:app --port 8001`），别动当前 8000 上跑的 main 服务，免得待验分支崩溃把现有系统带挂。

**确认 OK 后合并：**
- 在 GitHub PR 页面点 Merge（Squash and merge）；或本地 `git checkout main && git merge feat/<分工> && git push`，都能合进 main，全员即见。
- 验证不通过：在 PR 里评论打回，让组员改完重提，不要合并。
