"""XAMPP MySQL 连接与建表（零额外配置，root 空密码）。

这就是「前端 ↔ SQL」链路里最底层的那根线：
后端 FastAPI 通过 pymysql 连到本地 XAMPP 的 MySQL，
所有 chunk / 文件 / 项目元数据都落在这三张表里。

v2 扩展：为支持 ML 算法类级切分 + 检索过滤 + 学习型展示，
code_chunks 增加了 module / family / task / math_methods / params /
references / docstring_math / complexity / ref_edges / call_edges 等列。
"""
import os
import pymysql

# 支持环境变量覆盖，方便队友按本地 XAMPP 配置调整（默认值针对本机 XAMPP）
HOST = os.environ.get("MYSQL_HOST", "127.0.0.1")        # XAMPP MySQL 监听地址
USER = os.environ.get("MYSQL_USER", "root")            # XAMPP 默认账号
PASSWORD = os.environ.get("MYSQL_PASSWORD", "")        # XAMPP 默认 root 空密码
PORT = int(os.environ.get("MYSQL_PORT", "3306"))
DB = os.environ.get("MYSQL_DB", "code_x_ray")


def get_conn():
    return pymysql.connect(host=HOST, user=USER, password=PASSWORD,
                           port=PORT, database=DB, charset="utf8mb4",
                           autocommit=True)


# 首次启动时若库/表不存在就建好，保证 demo 一键可跑
_CREATE_DB = f"CREATE DATABASE IF NOT EXISTS `{DB}` CHARACTER SET utf8mb4"

_TABLES = [
    """CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        name VARCHAR(128) NOT NULL,
        family VARCHAR(128),
        task VARCHAR(64),
        description TEXT,
        readme TEXT,                              -- 模块对应的 GitHub README 原文（numpy_ml/<module>/README.md）
        aliases TEXT,                             -- 模块全称/缩写/中英文别名 JSON 数组，模块搜索时一并匹配
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_module_name (project_id, name),
        INDEX idx_modules_project (project_id)
    ) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS code_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        module_id INT,
        path VARCHAR(512) NOT NULL,
        module VARCHAR(128),
        language VARCHAR(32) DEFAULT 'python',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_files_project (project_id),
        INDEX idx_files_module (module_id)
    ) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS code_chunks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_id INT NOT NULL,
        chunk_type VARCHAR(32) NOT NULL,          -- class / function / method
        entity_name VARCHAR(255),
        parent_class VARCHAR(255),                -- method 所属的 class name（冗余展示用）
        class_id INT NULL,                        -- 第 4 层外键：function/method 指向所属 class 那一行
        module VARCHAR(128),                      -- 仓库内顶层目录（如 neural_nets）
        family VARCHAR(128),                      -- 算法族（如 Neural Networks / Tree-based）
        task VARCHAR(64),                         -- 任务类型（classification/regression/...）
        math_methods TEXT,                        -- 从 docstring 抽取的数学方法标签
        params TEXT,                              -- __init__ 参数 schema
        `references` TEXT,                        -- 参考文献（Bishop 2006 等）
        docstring_math TEXT,                      -- 结构化数学描述（目标函数/假设）
        complexity FLOAT,                         -- 复杂度启发式
        ref_edges JSON,                           -- 引用边：基类 / import
        call_edges JSON,                         -- 调用边：方法内调用的符号
        start_line INT,
        end_line INT,
        code_text TEXT NOT NULL,
        embedding_text TEXT,                      -- 用于生成向量的原始富文本（便于调试/重算）
        embedding_json TEXT,                      -- 向量 JSON 数组
        chunk_metadata JSON,                      -- 扩展字段：注释、调用关系等
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FULLTEXT INDEX ft_code (code_text, entity_name, embedding_text),  -- 关键词检索
        INDEX idx_chunks_file (file_id),
        INDEX idx_chunks_class (class_id),
        INDEX idx_chunks_type (chunk_type),
        INDEX idx_chunks_family (family),
        INDEX idx_chunks_task (task),
        INDEX idx_chunks_module (module),
        FOREIGN KEY (file_id) REFERENCES code_files(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES code_chunks(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS algorithms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_id INT NOT NULL,
        name VARCHAR(255),
        module VARCHAR(128),
        family VARCHAR(128),
        task VARCHAR(64),
        math_methods TEXT,
        params TEXT,
        `references` TEXT,
        docstring_math TEXT,
        complexity FLOAT,
        ref_edges JSON,
        call_edges JSON,
        start_line INT,
        end_line INT,
        code_text TEXT NOT NULL,
        embedding_text TEXT,
        embedding_json TEXT,
        chunk_metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FULLTEXT INDEX ft_alg (code_text, name, embedding_text),
        INDEX idx_alg_file (file_id),
        INDEX idx_alg_module (module),
        INDEX idx_alg_family (family),
        INDEX idx_alg_task (task),
        FOREIGN KEY (file_id) REFERENCES code_files(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS functions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_id INT NOT NULL,
        class_id INT,
        name VARCHAR(255),
        parent_class VARCHAR(255),
        module VARCHAR(128),
        family VARCHAR(128),
        task VARCHAR(64),
        math_methods TEXT,
        params TEXT,
        `references` TEXT,
        docstring_math TEXT,
        complexity FLOAT,
        ref_edges JSON,
        call_edges JSON,
        start_line INT,
        end_line INT,
        code_text TEXT NOT NULL,
        embedding_text TEXT,
        embedding_json TEXT,
        chunk_metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FULLTEXT INDEX ft_fn (code_text, name, embedding_text),
        INDEX idx_fn_file (file_id),
        INDEX idx_fn_class (class_id),
        INDEX idx_fn_module (module),
        INDEX idx_fn_family (family),
        INDEX idx_fn_task (task),
        FOREIGN KEY (file_id) REFERENCES code_files(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES algorithms(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
]

# 旧版本表结构迁移：新增字段 + 重建 FULLTEXT 索引以覆盖 embedding_text
# MariaDB 支持 ADD COLUMN IF NOT EXISTS；其他 MySQL 分支若不支持会被 try/except 忽略。
_MIGRATIONS = [
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS parent_class VARCHAR(255)",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS embedding_text TEXT",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS chunk_metadata JSON",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS module VARCHAR(128)",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS family VARCHAR(128)",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS task VARCHAR(64)",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS math_methods TEXT",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS params TEXT",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS `references` TEXT",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS docstring_math TEXT",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS complexity FLOAT",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS ref_edges JSON",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS call_edges JSON",
    "ALTER TABLE code_chunks ADD COLUMN IF NOT EXISTS class_id INT NULL",
    "ALTER TABLE code_chunks ADD INDEX IF NOT EXISTS idx_chunks_class (class_id)",
    "ALTER TABLE code_chunks ADD CONSTRAINT fk_chunk_class FOREIGN KEY (class_id) REFERENCES code_chunks(id) ON DELETE CASCADE",
    """CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        name VARCHAR(128) NOT NULL,
        family VARCHAR(128),
        task VARCHAR(64),
        description TEXT,
        readme TEXT,                              -- 模块对应的 GitHub README 原文（numpy_ml/README.md 分段）
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_module_name (project_id, name),
        INDEX idx_modules_project (project_id)
    ) ENGINE=InnoDB""",
    "ALTER TABLE modules ADD COLUMN IF NOT EXISTS readme TEXT",
    "ALTER TABLE modules ADD COLUMN IF NOT EXISTS aliases TEXT",
    "ALTER TABLE code_files ADD COLUMN IF NOT EXISTS module VARCHAR(128)",
    "ALTER TABLE code_files ADD COLUMN IF NOT EXISTS module_id INT",
    "DROP INDEX IF EXISTS ft_code ON code_chunks",
    "CREATE FULLTEXT INDEX ft_code ON code_chunks(code_text, entity_name, embedding_text)",
]


def init_db():
    c = pymysql.connect(host=HOST, user=USER, password=PASSWORD, port=PORT, charset="utf8mb4")
    try:
        c.cursor().execute(_CREATE_DB)
    finally:
        c.close()

    conn = get_conn()
    try:
        cur = conn.cursor()
        for t in _TABLES:
            cur.execute(t)
        for m in _MIGRATIONS:
            try:
                cur.execute(m)
            except Exception:
                # 字段/索引已存在或当前分支不支持该语法时忽略
                pass
    finally:
        conn.close()
