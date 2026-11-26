"""Code X-Ray backend package.

Module responsibilities:
- db.py               database connection and table creation
- parser.py           code splitting and embedding
- index_pipeline.py   indexing pipeline (pasted code / import GitHub repos)
- retrieval.py        retrieval accuracy (task 1)
- learn.py            learning module features (task 2)
- tests/eval_test.py  retrieval evaluation and tests (task 3; also loaded by the app to provide /api/eval endpoints)
- app.py             FastAPI assembly entry point + meta endpoints
"""
