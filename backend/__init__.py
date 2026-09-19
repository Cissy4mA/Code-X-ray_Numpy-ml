"""Code X-Ray 后端包。

模块职责：
- db.py              数据库连接与建表
- parser.py          代码切分与 embedding
- index_pipeline.py  入库管线（粘贴代码 / 导入 GitHub 仓库）
- retrieval.py       检索精度（分工 1）
- learn.py           学习板块功能（分工 2）
- eval_test.py       检索评估与测试（分工 3）
- app.py             FastAPI 装配入口 + 元接口
"""
