# Collaboration & Contribution Guide (Code X-Ray group project)

This repo is **Cissy4mA/Code-X-ray_Numpy-ml**; `main` is a protected branch. **Nobody should push directly to main**. Always follow "create branch -> edit your files -> open PR -> lead merges".

## 1. Standard Development Flow

```bash
# 1. Clone the main repo (option A) or your own fork (option B)
git clone https://github.com/Cissy4mA/Code-X-ray_Numpy-ml.git
cd Code-X-ray_Numpy-ml

# 2. Sync the latest main
git checkout main && git pull origin main

# 3. Create a branch for your assigned role (naming in section 3)
git checkout -b feat/<assigned-role>

# 4. Run locally (the first run imports data from numpy-ml automatically, no DB setup needed)
cp .env.example .env
bash scripts/deploy.sh

# 5. Only edit the files you are responsible for, then commit
git add <changed-files>
git commit -m "feat: <role> <what-you-did>"
git push origin feat/<assigned-role>

# 6. Open a PR to main on GitHub and wait for the lead to review and merge
```

---

## 3. Branch and File Ownership per Member (ensures conflict-free merges)

| Role | Branch | Only edit these files |
|------|--------|----------------------|
| Retrieval accuracy | `feat/retrieval` | `backend/retrieval.py`, `embed()` in `backend/parser.py` |
| Learning module | `feat/learn` | `backend/learn.py`, `data/learn_content.json` |
| Retrieval evaluation & tests | `feat/eval-test` | `tests/eval_test.py` |
| Page design & styling | `feat/frontend-style` | `frontend/index.html` (visual/layout sections) |
| Retrieval result visualization | `feat/frontend-search` | `frontend/index.html` (Search page sections) |
| Learning module visualization | `feat/frontend-learn` | `frontend/index.html` (Learn page sections) |
| Coordination / integration (lead) | `feat/main` | `backend/app.py`, `backend/db.py`, `README.md`, etc. |

**Golden rule: only touch the files assigned to you in the table above.** The integration layer `app.py` / `db.py` / `parser.py` / `index_pipeline.py` is maintained by the coordinator/agent; members should not edit them, or merges will definitely conflict.

---

## 4. Database Does Not Need to Be Shared (Important)

The data is derived from the public repo `numpy-ml`, not proprietary. After cloning, `bash scripts/deploy.sh` automatically runs `index_repo()` to import from numpy-ml, and the result is **byte-for-byte identical** to the lead's local DB (all cleaning rules are hard-coded).

- Do not export / upload `data/code_x_ray.sql` (excluded by `.gitignore`).
- Do not try to send your local database to others.

---

## 5. Conflict Warning: Frontend Is a Single File

`frontend/index.html` is currently a **single file**. Although the three frontend members claim different sections, editing the same file can still conflict. Avoidance measures (by priority):

1. **Run `git pull origin main` before editing** to get the latest, and **open a PR promptly** after editing to shorten the concurrency window.
2. Try to have one person make changes to the same section, and merge PRs at staggered times.
3. Long-term: split `index.html` by page into `index.html` (shell) + `search.html` + `learn.html`, with each frontend member owning a separate file.

The backend is already split into separate `.py` files per person, so it rarely conflicts; only the frontend needs this reminder.

---

## 6. PR Conventions

- One PR does **one role** only; do not mix edits to multiple files.
- PR title: `feat: <role> <one-line description>`.
- PR description must state: what changed and how to verify locally (e.g. which endpoint/page to visit after `bash scripts/run.sh`).
- Merge after the lead approves; use **Squash and merge** to keep the main history clean.

---

## 7. Lead Local Verification and Merge

After a member opens a PR, the lead runs the branch locally to see the real effect and only merges after confirming it works. For local verification, the agent deploys directly on the machine and the effect can be viewed by opening `localhost` in the browser.

**Prerequisite**: **MySQL must be running locally** (click Start in the XAMPP GUI; GUI startup usually bypasses leftover-pid permission issues). Without MySQL, the backend cannot run or import from numpy-ml.

**Verification steps (the lead can simply tell the agent one line, e.g. "please verify the feat/learn branch"):**
```bash
cd Code-X-ray_Numpy-ml
git fetch origin
git checkout feat/<role>          # switch to the member branch
cp .env.example .env              # if not set up yet
bash scripts/deploy.sh            # auto-create DB + import from numpy-ml + start
# open http://127.0.0.1:8000 in the browser to see the effect
```

**Important: do not overwrite the existing stable service.** Use a different port when verifying a branch (e.g. `uvicorn backend.app:app --port 8001`); do not touch the main service running on port 8000, so a crash in the branch under test cannot bring down the running system.

**After confirming OK, merge:**
- On the GitHub PR page click Merge (Squash and merge); or locally `git checkout main && git merge feat/<role> && git push`; both merge into main and everyone sees it.
- If verification fails: comment on the PR to request changes; have the member fix and re-open, do not merge.
