# Code X-Ray - NumPy-ML Machine Learning Algorithm Source Inspector & Interactive Learning Platform

Code X-Ray turns the NumPy-ML algorithm repository into a searchable, learnable interactive website, providing module browsing, algorithm retrieval, math cards, learning paths, related functions, call structures, and algorithm comparison.

The repo already includes the new React frontend, FastAPI backend, and a SQLite demo index. After cloning there is no need to install MySQL or re-import NumPy-ML data.

## Project Structure

```text
Code-X-ray_Numpy-ml/
├── backend/                  # FastAPI, retrieval, learning modules, and DB adapters
├── frontend/                 # React + TypeScript + Vite frontend source
│   ├── src/
│   ├── dist/                 # Built website, served directly by FastAPI
│   └── legacy-index.html     # Legacy page, only a fallback when the build is missing
├── data/
│   ├── code_x_ray.sqlite3    # Pre-indexed demo database
│   └── learn_content.json
├── tests/                    # Retrieval evaluation and tests
├── scripts/
│   ├── deploy.sh             # First-time install and start
│   └── run.sh                # Daily start after installation
├── Dockerfile                # Container deployment entry point
├── requirements.txt
└── .env.example
```

## One-Command Local Run

Requirements:

- Python 3.10 or newer
- Internet access is needed for the first dependency install and the first semantic retrieval
- Node.js is only needed when modifying the frontend; running the site does not require Node.js

```bash
git clone https://github.com/Cissy4mA/Code-X-ray_Numpy-ml.git
cd Code-X-ray_Numpy-ml
cp .env.example .env
bash scripts/deploy.sh
```

After starting, visit:

```text
http://127.0.0.1:8000
```

To start again later:

```bash
bash scripts/run.sh
```

The repo ships a SQLite semantic index, so the deploy script skips re-importing. Querying and indexing both use a fixed version of `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions). The first run needs the model files; if a complete local cache exists it can load offline, otherwise it will download them.

### Semantic Model and Index Migration

`.env` uses `EMBEDDING_BACKEND=local`; see `.env.example` for the model name and version. Once `local` is set explicitly, the presence of an API key will not switch to the API. Module retrieval uses RRF fusion of keyword and semantic ranks; algorithm retrieval uses 0.2 keyword / 0.8 semantic weights by default and no longer falls back to hash demo weights just because the DB is SQLite.

When changing the model or migrating from an old hash index, a full rebuild is required - updating only module vectors is not enough:

```bash
set -a
source .env
set +a
.venv/bin/python scripts/reembed_all.py
```

The script only supports SQLite. It first saves a backup in `backups/` next to the database, then updates all vectors for modules, algorithm classes, and functions/methods in a single transaction. Any failure rolls back, leaving no mixed-model index; source code, parameters, and other raw data remain unchanged. DB writes are locked during migration, so pause admin-side import operations. The old entry point `scripts/reembed_modules.py` also performs a full migration.

The DB's `embedding_index` table records the model, pinned version, and dimensions. If the query config does not match, or an old DB has no model record, the search endpoint returns 503 with a rebuild hint rather than silently using wrong vectors. After editing `.env` or backend code, or completing a migration, stop the old process and start again with `bash scripts/run.sh`; a running process does not reload config automatically. MySQL is not covered by this migration script or the model identity check.

Enabling the real model does not mean retrieval accuracy has been validated. Chinese alias matching is still retained; Chinese natural-language retrieval needs separate evaluation, and complete cross-language semantic capability should not be claimed on that basis.

## Frontend Development

First start the backend from the repo root:

```bash
bash scripts/run.sh
```

Then open another terminal:

```bash
cd frontend
npm ci
npm run dev
```

Dev page URL:

```text
http://127.0.0.1:3000
```

Vite proxies `/api` to `http://127.0.0.1:8000`.

After edits, build the production page:

```bash
cd frontend
npm run build
```

The build output goes directly into `frontend/dist/`; afterwards only FastAPI needs to run, and the frontend and API share the same domain.

## Docker / Public Deployment

Validate the container locally:

```bash
docker build -t code-x-ray .
docker run --rm -p 8000:8000 code-x-ray
```

Then visit `http://127.0.0.1:8000`.

Cloud platforms that support Dockerfiles can deploy directly from this repo. The service startup command is already compatible with the platform-provided `PORT` environment variable.

Recommended for production:

```env
DB_BACKEND=sqlite
SQLITE_PATH=data/code_x_ray.sqlite3
ENABLE_ADMIN_API=0
```

`ENABLE_ADMIN_API=0` disables the DB reset, re-import, debug, and evaluation endpoints, preventing public users from operating on the DB or triggering heavy tasks. Normal search, module browsing, learning pages, and health checks are unaffected.

If the platform uses an ephemeral filesystem, the bundled SQLite data still works for read-only demos; if users will later be allowed to import repos and persist data, switch to a persistent disk or managed database.

## Site Retrieval Flow

The site is named **Code-X-Ray**, full title *Code-X-Ray - A Machine Learning Code Retrieval and Learning Platform for NumPy-ML*.

The home page shows the Code-X-Ray brand and the ML Code Retrieval & Learning title over an optimized background image. The title, platform description, and search bar use an adaptive vertical layout; long queries scroll inside the input box without covering the submit button.

The Browse page offers two sequential steps, not two side-by-side methods:

1. **Step 1 - Find a module**: search the entire repo by algorithm name, topic, or task description, and read the matched module's README.
2. **Step 2 - Find an algorithm**: after selecting a module, the original query is carried over to search algorithm classes within that module; you can refine the query and then open the Learn page.

Home-page search also starts with module location. No global algorithm search runs until a module is selected; algorithms not in the repo are flagged at step 1 and drilling down stops.

## Learning Page

- **Math Card**: shows curated math cards with real indexed tags, parameters, docs, and source; when there are no cards no extra empty-state hint is shown, and on API failure the error and applicable retry control are still shown.
- **Path**: generates a four-step reading suggestion for the current algorithm, with progress check-off, reset, and switching between algorithms in the same module. Progress is saved only in the current browser; the module list is sorted by name and does not imply prerequisite or difficulty order.
- **Related Functions**: shows the member functions actually indexed for the current algorithm; no similarity scores are generated.
- **Call Graph**: reads the static call graph, showing only resolvable indexed edges and listing unresolved symbols separately; it is not runtime tracing.
- **Compare**: pick another algorithm in the same module and compare real indexed fields.
- **Complexity**: shows AST structural evidence and indexed heuristic metrics; source scores are not presented as Big-O.
- **Self-check**: the backend parses the current algorithm's Python AST and builds up to 12 reading self-check questions from real parameters and defaults, loop objects, branch behavior, assignments, call arguments, comprehensions, return expressions, and math metadata. The `quiz` field of `/api/learn/algorithm` returns question text, answer, question type, and source line numbers; the frontend shows only the questions returned for the current object, without regex or fixed-five-question substitutes. With no source, only existing metadata is used; if information is insufficient an empty state is shown, implementation details are never fabricated, and no generative model or auto-grading is involved.
- **Recommend**: the 8th learning card. Following main's renderRec, it queries `/api/search` top 10 using the current algorithm's entity, task, and first four math_methods, excludes itself, deduplicates, and ranks by main's recommendationScore (fused + same source directory / algorithm family / task / math-method overlap), showing the top 6 with the same per-item reasons as main; clicking "Study xx" opens the target algorithm's math card. The semantic score is shown separately and not confused with the final ranking score.

Step 2 of Browse also shows a relevance bubble field: following main's `renderBubbles`, `.bubble` and `.bubble-field`, normalized by `fused / max(fused)`, with diameter `62 + 74 x ratio` pixels. Bubbles move freely in an absolutely positioned field, with boundary bounce, pairwise collision separation, and hover avoidance; on hover or keyboard focus they pause drifting and enlarge 1.1x, and clicking jumps to and focuses the matching result card. On narrow screens or with many results the field height grows automatically, and reduced-motion is supported.

Cards do not auto-rotate by default, to avoid switching while reading. Retrieval relevance shows only backend ranking scores, not probability of correctness.

Returning from Learn to Browse restores the query, module, and results from this site visit. Standalone functions are shown alongside algorithm classes, and result cards keep the three retrieval scores and source. On a temporary API failure you can click Retry directly.

## API Reference

| Method | Path | Description |
|---|---|---|
| GET | `/api/stats` | Database statistics |
| GET | `/api/modules` | Module list and READMEs |
| POST | `/api/modules/search` | Module retrieval |
| POST | `/api/search` | Algorithm hybrid retrieval |
| GET | `/api/learn/card` | Math principle cards |
| GET | `/api/learn/algorithm` | Real algorithm details and source-structure evidence by module, algorithm, path |
| GET | `/api/learn/compare` | Algorithm comparison |
| GET | `/api/learn/path` | Reading path and module list by module, algorithm, path |
| GET | `/api/learn/call_graph` | Call relationship graph |
| GET | `/api/smoke` | Database smoke check |

The following endpoints are controlled by `ENABLE_ADMIN_API`:

- `/api/reset`
- `/api/index`
- `/api/index_repo`
- `/api/debug/*`
- `/api/eval*`

## Database Choice

Use the bundled SQLite by default:

```env
DB_BACKEND=sqlite
SQLITE_PATH=data/code_x_ray.sqlite3
```

To switch to MySQL:

```env
DB_BACKEND=mysql
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_PORT=3306
MYSQL_DB=code_x_ray
```

## Pre-submit Checks

```bash
cd frontend
npm run build
cd ..
python -m pytest
```

The learning-endpoint regression tests do not need to download the semantic model:

```bash
python -m unittest discover -s tests -p 'test_learn_api.py' -v
cd frontend && npm run test:learning
```

If `playwright-core` and Chrome are available, you can run browser regressions after starting the site:

```bash
node tests/test_browser.cjs
node tests/test_api_display.cjs
```

`PLAYWRIGHT_MODULE` sets the Playwright module location, `CHROME_PATH` the Chrome executable, and `TEST_BASE_URL` the site address (default `http://127.0.0.1:8000`). Tests use isolated browser contexts and cover two-stage retrieval, standalone functions, progress, retry, back/forward, and four screen widths.

`test_api_display.cjs` additionally checks module match reasons, comparison-table math descriptions and references, missing values, and API error classification. Error responses and comparison field samples are simulated only in the test browser, never written to the DB.

`tests/test_discovery_browser.cjs` uses mocked APIs to check bubble size, hover pause and enlarge, jump-and-focus, responsive bounds, recommendation request/dedup/switching, and that different sources generate different self-check questions. First run `npm run build` and `npm run preview -- --host 127.0.0.1 --port 4173` in `frontend`, then run `node tests/test_discovery_browser.cjs` from the project root. It also supports `PLAYWRIGHT_MODULE` and `CHROME_PATH`; its `TEST_BASE_URL` defaults to `http://127.0.0.1:4173`; no DB or semantic model is needed.

Unit tests for vector migration and model identity checks need no model download and do not modify the real DB:

```bash
python -m unittest discover -s tests -p 'test_embedding_index.py' -v
```

`hash` is for demo only, not a semantic model; the full production migration script rejects this config.

With a complete model cache and a completed semantic index migration, you can run the real-model two-stage endpoint smoke test (using a DB copy):

```bash
set -a; source .env; set +a
RUN_SEMANTIC_TESTS=1 HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1 \
  .venv/bin/python -m unittest discover -s tests -p 'test_semantic_search.py' -v
```

These are functional regression cases, not retrieval-accuracy evaluation on an independent test set.

You should also start the site at least once and check:

- Home, Browse, and Learn pages can be switched
- The GitHub icon links to this repo
- Module search and algorithm search return data
- `Open the Learn Page` enters the learning page for the selected algorithm
