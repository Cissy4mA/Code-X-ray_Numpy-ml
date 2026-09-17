"""Code X-Ray 后端包。

模块归属（按人拆分，合并时互不冲突）：
- db.py        数据库层（agent 维护，人不改）
- parser.py    代码切分 + embedding（agent 维护，人不改）
- index_pipeline.py  入库管线（agent/你 维护，稳定不常改）
- retrieval.py 检索精度（你 / 分工1 拥有，核心改动区）
- learn.py     学习板块功能（分工2 两人拥有）
- eval_test.py 检索评估与测试（分工3 拥有）
- app.py       FastAPI 装配 + 元接口（你拥有，只做接线）
"""
