# 协作与贡献指南（Code X-Ray 小组作业）

本仓库是 **Cissy4mA/Code-X-ray_Numpy-ml**，`main` 为保护分支，**任何人不要直接 push 到 main**，一律走「开分支 → 改自己文件 → 提 PR → 组长合并」。

---

## 一、两种接入方式（组长选一种）

### 方式 A：加为协作者（推荐，最省事）
1. 组长在 GitHub 仓库 `Settings → Collaborators` 里加入 5 位组员的 GitHub 账号，权限选 **Write**。
2. 组员直接 clone 主仓库（见下），无需 fork。

### 方式 B：Fork 工作流（组员无 write 权限时）
1. 组员在 GitHub 上 Fork 本仓库到自己的账户。
2. clone 自己的 fork，改完 push 到 fork，再提 PR 回主仓库的 `main`。

> 小组作业 6 人，方式 A 最顺；只有有人没 GitHub 账号或不想给权限时才用 B。

---

## 二、标准开发流程

```bash
# 1. 克隆主仓库（方式 A）或自己的 fork（方式 B）
git clone https://github.com/Cissy4mA/Code-X-ray_Numpy-ml.git
cd Code-X-ray_Numpy-ml

# 2. 同步最新 main
git checkout main && git pull origin main

# 3. 开自己的分支（命名见第三节）
git checkout -b feat/<你的分工>

# 4. 本地跑起来（首次会自动从 numpy-ml 导入数据，无需准备数据库）
cp .env.example .env
bash scripts/deploy.sh

# 5. 只改自己负责的文件，改完提交
git add <你改的文件>
git commit -m "feat: <分工> <做了什么>"
git push origin feat/<你的分工>

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

**铁律：只碰上表自己的文件。** 装配层 `app.py` / `db.py` / `parser.py` / `index_pipeline.py` 由组长/agent 维护，组员不要改，否则合并必冲突。

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
