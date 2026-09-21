"""代码解析 + 可插拔 Embedding（v2：ML 算法类级切分）。

- 切分：module / class / function / method 四级；class 级为 ML 算法主单元
- 每个 chunk 抽取：
    module       仓库内顶层目录（如 neural_nets）
    family       算法族（Neural Networks / Tree-based / ...）
    task         任务类型（classification / regression / ...）
    math_methods 从 docstring 抽取的数学方法标签
    params       __init__ 参数 schema
    references   参考文献（Bishop 2006 等）
    docstring_math 结构化数学描述（目标函数 / 假设）
    complexity   复杂度启发式
    ref_edges    引用边：基类 / import
    call_edges   调用边：方法内调用的符号
- embedding：优先调用 OpenAI-compatible API；无 key 则本地 sentence-transformers（默认）
"""
import ast
import re
import math
import json
import os
import urllib.request

PY_STOP = set(
    "def return if else elif for while import from as class try except with lambda "
    "none true false and or not in is pass break continue global nonlocal yield "
    "async await print self cls int str float list dict set tuple range len enumerate "
    "zip map filter open read write close super object init new call".split()
)

DIM = 384  # all-MiniLM-L6-v2 输出维度；API embedding 维度由模型决定

# 仓库顶层目录 -> 算法族（numpy-ml 目录结构）
FAMILY_MAP = {
    "neural_nets": "Neural Networks",
    "trees": "Tree-based Models",
    "glm": "Generalized Linear Models",
    "linear_models": "Generalized Linear Models",
    "gmm": "Gaussian Mixture Models",
    "hmm": "Hidden Markov Models",
    "kmeans": "Clustering",
    "naive_bayes": "Naive Bayes",
    "bayesian": "Bayesian Methods",
    "lda": "Topic Models",
    "rl": "Reinforcement Learning",
    "rl_models": "Reinforcement Learning",
    "bandits": "Reinforcement Learning",
    "ngram": "Sequence Models",
    "factorization": "Matrix Factorization",
    "nonparametric": "Nonparametric Models",
    "preprocessing": "Preprocessing",
    "utils": "Utilities",
    "docs": "Documentation",
}

# 不参与检索/统计的非算法目录（测试、绘图）
NON_ALGO_MODULES = {"tests", "plots"}

# 13 个算法模块的「全称 / 缩写 / 中英文别名」，入库时写入 modules.aliases，
# 模块搜索时一并匹配，解决「只认缩写、不认全称 / 初学者看不懂缩写」的问题。
MODULE_ALIASES = {
    "bandits": [
        "Bandits", "Multi-armed Bandits", "MAB", "Contextual Bandits",
        "多臂老虎机", "多臂赌博机", "强盗算法", "老虎机问题",
    ],
    "factorization": [
        "Matrix Factorization", "Factorization Machines", "MF", "FM",
        "矩阵分解", "分解机", "矩阵分解机",
    ],
    "gmm": [
        "Gaussian Mixture Model", "Gaussian Mixture Models", "GMM",
        "Mixture of Gaussians", "Mixture of Gaussian", "高斯混合模型", "高斯混合",
    ],
    "hmm": [
        "Hidden Markov Model", "Hidden Markov Models", "HMM",
        "隐马尔可夫模型", "隐马尔可夫", "隐马模型",
    ],
    "lda": [
        "Latent Dirichlet Allocation", "LDA", "Topic Model", "Topic Models",
        "主题模型", "隐含狄利克雷分布", "潜在狄利克雷分配",
    ],
    "linear_models": [
        "Linear Models", "Generalized Linear Models", "GLM",
        "Linear Regression", "Logistic Regression", "Ridge Regression", "Lasso",
        "线性回归", "逻辑回归", "岭回归", "套索回归", "线性模型", "广义线性模型",
    ],
    "neural_nets": [
        "Neural Networks", "Neural Network", "Deep Learning", "Deep Neural Network",
        "DNN", "NN", "Feedforward Network", "人工神经网络",
        "神经网络", "深度学习", "深度神经网络", "前馈神经网络",
    ],
    "ngram": [
        "N-Gram", "N-Grams", "N-Gram Language Model", "Ngram", "Ngrams",
        "N元文法", "N元语法", "语言模型", "n元模型",
    ],
    "nonparametric": [
        "Nonparametric Models", "Non-parametric Models", "Nonparametric", "Kernel Density Estimation",
        "KDE", "核密度估计", "非参数模型", "非参数方法",
    ],
    "preprocessing": [
        "Preprocessing", "Data Preprocessing", "Feature Scaling", "Normalization",
        "Standardization", "Min-Max Scaling", "数据预处理", "特征缩放", "标准化", "归一化",
    ],
    "rl_models": [
        "Reinforcement Learning", "RL", "Agents", "Markov Decision Process", "MDP",
        "强化学习", "智能体", "强化学习智能体", "马尔可夫决策过程",
    ],
    "trees": [
        "Decision Trees", "Random Forest", "Gradient Boosted Trees", "GBDT",
        "XGBoost", "CART", "决策树", "随机森林", "梯度提升树", "梯度提升决策树",
    ],
    "utils": [
        "Utilities", "Utils", "Helper Functions", "Utility Functions",
        "工具函数", "辅助函数", "工具模块",
    ],
}

# numpy-ml README.md 中“Available models”标题 -> 模块目录名
README_MODULE_MAP = {
    "gaussian mixture model": "gmm",
    "hidden markov model": "hmm",
    "latent dirichlet allocation": "lda",
    "neural networks": "neural_nets",
    "tree-based models": "trees",
    "linear models": "linear_models",
    "n-gram sequence models": "ngram",
    "multi-armed bandit models": "bandits",
    "reinforcement learning models": "rl_models",
    "nonparameteric models": "nonparametric",
    "matrix factorization": "factorization",
    "preprocessing": "preprocessing",
    "utilities": "utils",
}

# 数学方法词典（小写匹配 docstring / code）
MATH_TERMS = [
    "expectation-maximization", "em algorithm", "gaussian", "multivariate normal",
    "normal distribution", "bayesian", "markov", "monte carlo", "gibbs sampling",
    "metropolis", "variational", "elbo", "kl divergence", "cross-entropy", "softmax",
    "sigmoid", "logistic", "relu", "gradient descent", "stochastic gradient",
    "backpropagation", "maximum likelihood", "mle", "map estimation", "prior",
    "posterior", "conjugate", "regularization", "lasso", "ridge", "eigenvalue",
    "eigenvector", "spectral", "covariance", "precision matrix", "cholesky",
    "forward-backward", "baum-welch", "viterbi", "attention", "dropout",
    "batch normalization", "momentum", "adagrad", "adam", "learning rate",
    "loss function", "objective function", "probabilistic", "likelihood",
    "generative", "discriminative", "kernel", "svm", "decision tree", "random forest",
    "gradient boosting", "boosting", "bagging", "k-means", "kmeans", "hierarchical",
    "mixture", "latent", "topic model", "dirichlet", "beta", "gamma", "bernoulli",
    "poisson", "exponential family", "sufficient statistic", "mean-field", "gibbs",
    "forward pass", "backward pass", "chain rule", "jacobian", "hessian",
]

KNOWN_AUTHORS = [
    "Bishop", "Murphy", "Hastie", "Goodfellow", "MacKay", "Barber",
    "Christopher Bishop", "Kevin Murphy", "Kevin P. Murphy",
]


# -----------------------------------------------------------------------------
# 1. 代码切分 + 元数据抽取
# -----------------------------------------------------------------------------
def extract_chunks(source, filename="pasted.py", module_path=""):
    """把源码切成 module / class / function / method 四级 chunk，并抽取 ML 元数据。"""
    chunks = []
    lines = source.splitlines()
    total_lines = len(lines)
    try:
        tree = ast.parse(source)
    except SyntaxError:
        # 非 Python / 语法损坏，退化为整文件 module chunk
        family = FAMILY_MAP.get(module_path, "Other")
        return [{
            "chunk_type": "module", "entity_name": filename, "parent_class": None,
            "module": module_path, "family": family, "task": "other",
            "math_methods": "[]", "params": "", "references": "[]",
            "docstring_math": "", "complexity": 0.0,
            "ref_edges": json.dumps({"bases": [], "imports": []}),
            "call_edges": "[]",
            "start_line": 1, "end_line": total_lines,
            "code_text": source,
            "embedding_text": _build_summary(filename, family, "other", "", "", ""),
        }]

    module_doc = ast.get_docstring(tree) or ""
    import_names = _collect_import_names(tree)
    family = FAMILY_MAP.get(module_path, "Other")

    # 只保留有意义的 class / function 级单元；文件级 module chunk 和 __init__ 方法跳过
    for node in tree.body:
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            continue
        start, end = node.lineno, node.end_lineno
        code = "\n".join(lines[start - 1:end])
        doc = ast.get_docstring(node) or ""
        ctype = "class" if isinstance(node, ast.ClassDef) else "function"

        if isinstance(node, ast.ClassDef):
            task = infer_task(node.name, doc)
            params = _init_params(node)
            bases = [ast.unparse(b) for b in node.bases]
            chunk = {
                "chunk_type": ctype,
                "entity_name": node.name,
                "parent_class": None,
                "module": module_path, "family": family, "task": task,
                "math_methods": json.dumps(_match_math(doc + " " + code)),
                "params": params,
                "references": json.dumps(extract_references(doc)),
                "docstring_math": extract_math_text(doc),
                "complexity": complexity_of(node),
                "ref_edges": json.dumps({"bases": bases, "imports": import_names}),
                "call_edges": json.dumps(call_names(node)),
                "start_line": start, "end_line": end, "code_text": code,
                "embedding_text": _build_summary(node.name, family, task, doc, params),
            }
            chunks.append(chunk)

            # 3) class 内部的方法（__init__ 跳过，参数已抽到 class chunk 的 params）
            for child in node.body:
                if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)) and child.name != "__init__":
                    cs, ce = child.lineno, child.end_lineno
                    ccode = "\n".join(lines[cs - 1:ce])
                    cdoc = ast.get_docstring(child) or ""
                    chunks.append({
                        "chunk_type": "method",
                        "entity_name": f"{node.name}.{child.name}",
                        "parent_class": node.name,
                        "module": module_path, "family": family, "task": task,
                        "math_methods": json.dumps(_match_math(cdoc + " " + ccode)),
                        "params": "",
                        "references": json.dumps(extract_references(cdoc)),
                        "docstring_math": extract_math_text(cdoc),
                        "complexity": complexity_of(child),
                        "ref_edges": json.dumps({"bases": [], "imports": import_names}),
                        "call_edges": json.dumps(call_names(child)),
                        "start_line": cs, "end_line": ce, "code_text": ccode,
                        "embedding_text": _build_summary(
                            f"{node.name}.{child.name}", family, task, cdoc, ""),
                    })
        else:
            chunks.append({
                "chunk_type": ctype,
                "entity_name": node.name,
                "parent_class": None,
                "module": module_path, "family": family, "task": infer_task(node.name, doc),
                "math_methods": json.dumps(_match_math(doc + " " + code)),
                "params": _func_params(node),
                "references": json.dumps(extract_references(doc)),
                "docstring_math": extract_math_text(doc),
                "complexity": complexity_of(node),
                "ref_edges": json.dumps({"bases": [], "imports": import_names}),
                "call_edges": json.dumps(call_names(node)),
                "start_line": start, "end_line": end, "code_text": code,
                "embedding_text": _build_summary(node.name, family, infer_task(node.name, doc), doc, _func_params(node)),
            })
    return chunks


def _collect_import_names(tree):
    names = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for a in node.names:
                names.append(a.asname or a.name)
        elif isinstance(node, ast.ImportFrom):
            for a in node.names:
                names.append(a.asname or a.name)
    return names


def _init_params(cls_node):
    for n in cls_node.body:
        if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name == "__init__":
            try:
                args = [a.arg for a in n.args.args if a.arg != "self"]
                # 带上默认值提示
                out = []
                defaults = n.args.defaults
                n_pos = len(n.args.args) - len(defaults)
                for i, a in enumerate(args):
                    if i >= n_pos:
                        d = defaults[i - n_pos]
                        try:
                            out.append(f"{a}={ast.unparse(d)}")
                        except Exception:
                            out.append(a)
                    else:
                        out.append(a)
                return ", ".join(out)[:300]
            except Exception:
                return ""
    return ""


def _func_params(fn_node):
    try:
        args = [a.arg for a in fn_node.args.args if a.arg != "self"]
        return ", ".join(args)[:200]
    except Exception:
        return ""


def infer_task(name, doc):
    n = name.lower()
    d = doc.lower()
    if "classifier" in n or "classification" in d:
        return "classification"
    if "regressor" in n or "regression" in n or "regression" in d:
        return "regression"
    if "cluster" in n or "clustering" in d:
        return "clustering"
    if "generator" in n or "generative" in d or "vae" in n or "gmm" in n:
        return "generation"
    if "hmm" in n or "markov" in n or "baum" in n or "em " in d:
        return "density-estimation"
    if "policy" in n or "agent" in n or "qnetwork" in n or "q-network" in d:
        return "control"
    if "autoencoder" in n or "pca" in n or "embed" in n or "representation" in d:
        return "representation"
    if "lda" in n or "topic" in n or "latent" in d:
        return "topic-modeling"
    return "other"


def _match_math(text):
    t = text.lower()
    hits = []
    for term in MATH_TERMS:
        if term in t and term not in hits:
            hits.append(term)
    return hits[:12]


def extract_references(doc):
    found = []
    for auth in KNOWN_AUTHORS:
        for m in re.finditer(rf"{re.escape(auth)}\s*(?:et al\.?)?\s*\(?((?:19|20)\d{{2}})\)?", doc):
            found.append(f"{auth} {m.group(1)}")
    for m in re.finditer(r"([A-Z][a-z]+),\s*((?:19|20)\d{2})", doc):
        found.append(f"{m.group(1)} {m.group(2)}")
    seen, out = set(), []
    for f in found:
        if f not in seen:
            seen.add(f)
            out.append(f)
    return out[:6]


def extract_math_text(doc):
    keep = []
    for ln in doc.splitlines():
        s = ln.strip()
        if not s:
            continue
        low = s.lower()
        if ("$" in s or "maximize" in low or "minimize" in low or "objective" in low
                or "likelihood" in low or "loss" in low or s.startswith("P(")
                or "argmin" in low or "argmax" in low or "e[" in low or "var[" in low):
            keep.append(s)
    return "\n".join(keep[:8])


def complexity_of(node):
    branches = sum(1 for n in ast.walk(node)
                   if isinstance(n, (ast.If, ast.For, ast.While, ast.IfExp, ast.comprehension)))
    lines = (node.end_lineno - node.lineno + 1) if hasattr(node, "end_lineno") else 0
    return round(branches + lines / 10.0, 2)


def call_names(node):
    names = []
    for n in ast.walk(node):
        if isinstance(n, ast.Call):
            if isinstance(n.func, ast.Name):
                names.append(n.func.id)
            elif isinstance(n.func, ast.Attribute):
                names.append(n.func.attr)
    return sorted(set(names))


def _build_summary(name, family, task, doc, params):
    """构造用于 embedding 的自然语言摘要（而非原始代码），提升语义检索精度。"""
    head = f"{family} algorithm for {task}. Class name: {name}."
    # docstring 前两句
    doc1 = ""
    if doc:
        parts = re.split(r"(?<=[.!?])\s+", doc.strip())
        doc1 = " ".join(parts[:2])[:400]
    param_s = f" Key parameters: {params}." if params else ""
    return f"{head} {doc1}{param_s}".strip()


# -----------------------------------------------------------------------------
# 2. README 分段：把 numpy_ml/README.md 里“Available models”的编号列表
#    按模块目录名切分，供模块搜索时原样展示（不生成摘要）。
# -----------------------------------------------------------------------------
def extract_module_readmes(readme_path):
    """返回 {module_name: markdown_section_text}。"""
    if not os.path.isfile(readme_path):
        return {}
    text = open(readme_path, encoding="utf-8", errors="replace").read()
    lines = text.splitlines()
    sections = {}
    heading_re = re.compile(r"^\d+\.\s+\*\*(.+?)\*\*")

    current_module = None
    current_lines = []
    for i, line in enumerate(lines):
        m = heading_re.match(line.strip())
        if m:
            if current_module and current_lines:
                sections[current_module] = "\n".join(current_lines).strip()
            heading = m.group(1).lower()
            # 去掉括号注释，如 "latent dirichlet allocation (topic model)"
            heading = heading.split("(")[0].strip()
            current_module = README_MODULE_MAP.get(heading)
            current_lines = [line.strip()]
        elif current_module is not None:
            current_lines.append(line)
    if current_module and current_lines:
        sections[current_module] = "\n".join(current_lines).strip()
    return sections


def rewrite_image_paths(readme: str, module: str, repo_url: str, branch: str = "master") -> str:
    """把模块 README 里的相对图片路径改写成 GitHub raw 绝对路径，避免前端展示破图。"""
    base = repo_url.rstrip("/")
    if base.endswith(".git"):
        base = base[:-4]
    # github.com -> raw.githubusercontent.com
    base = re.sub(r"https?://github\.com/([^/]+)/([^/]+)", r"https://raw.githubusercontent.com/\1/\2", base)
    prefix = f"{base}/{branch}/numpy_ml/{module}/"

    def _is_absolute(path: str) -> bool:
        return path.startswith(("http://", "https://", "data:"))

    # Markdown: ![alt](path)
    def md_repl(m):
        alt = m.group(1)
        path = m.group(2).strip()
        if _is_absolute(path):
            return m.group(0)
        if path.startswith("/"):
            path = path.lstrip("/")
            if path.startswith("numpy_ml/"):
                return f"![{alt}]({base}/{branch}/{path})"
            path = f"numpy_ml/{module}/{path}"
            return f"![{alt}]({base}/{branch}/{path})"
        return f"![{alt}]({prefix}{path})"

    readme = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", md_repl, readme)

    # HTML <img src="..."> / <img src='...'>
    def src_repl(m):
        quote = m.group(1)
        path = m.group(2).strip()
        if _is_absolute(path):
            return m.group(0)
        if path.startswith("/"):
            path = path.lstrip("/")
            if path.startswith("numpy_ml/"):
                new_src = f"{base}/{branch}/{path}"
            else:
                new_src = f"{base}/{branch}/numpy_ml/{module}/{path}"
        else:
            new_src = f"{prefix}{path}"
        return f"src={quote}{new_src}{quote}"

    readme = re.sub(r"src=(['\"])([^'\"]+)\1", src_repl, readme)
    return readme


# -----------------------------------------------------------------------------
# 3. Embedding：API 优先，本地 sentence-transformers 兜底（默认）
# -----------------------------------------------------------------------------
_MODEL = None


def _get_model():
    global _MODEL
    if _MODEL is None:
        from sentence_transformers import SentenceTransformer
        # 国内镜像优先；HF_ENDPOINT 可在环境中设置
        _MODEL = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return _MODEL


def embed(text):
    """生成文本向量。有 EMBEDDING_API_KEY 走 API，否则本地模型（默认）。"""
    key = os.environ.get("EMBEDDING_API_KEY")
    if key:
        return _embed_api(text, key)
    model = _get_model()
    vec = model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
    return vec.tolist()


def module_embed_text(name, family, aliases, readme):
    """构造「模块级」语义向量用的富集文本：名称 + 算法族 + 别名 + README。

    别名是模块的「概念锚点」（如 preprocessing 的 Normalization / Feature Scaling /
    Standardization），只拿 README 编码会让「normalize and scale features」这类自然语言
    查询语义上找不到 preprocessing。把别名编进来后，语义检索才能命中模块的概念层。
    """
    alias_str = " ".join(aliases) if isinstance(aliases, list) else (aliases or "")
    parts = [name, family or "", alias_str, (readme or "")[:3500]]
    return " ".join(p for p in parts if p).strip()


def embed_module(name, family, aliases, readme):
    """模块级语义向量：name + 算法族 + 别名 + README 富集后编码。"""
    return embed(module_embed_text(name, family, aliases, readme))


def tokenize(text):
    toks = re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", text.lower())
    return [t for t in toks if t not in PY_STOP and len(t) > 1]


def _embed_hash(text):
    """本地哈希 embedding（无语义兜底，仅在无模型且 API key 时也缺失时使用）。"""
    vec = [0.0] * DIM
    for t in tokenize(text):
        h = hash(t)
        idx = (h % DIM + DIM) % DIM
        vec[idx] += 1.0
    norm = math.sqrt(sum(v * v for v in vec))
    if norm > 0:
        vec = [v / norm for v in vec]
    return vec


def cosine(a, b):
    """两个归一化向量的点积即余弦相似度。"""
    return sum(x * y for x, y in zip(a, b))


def _embed_api(text, key):
    """调用 OpenAI-compatible Embedding API（OpenAI / 智谱 / 千问 / 本地 vLLM 等）。"""
    base = os.environ.get("EMBEDDING_BASE_URL", "https://api.openai.com/v1")
    model = os.environ.get("EMBEDDING_MODEL", "text-embedding-3-small")
    body = json.dumps({
        "model": model,
        "input": text[:8000],
        "encoding_format": "float",
    }).encode("utf-8")
    req = urllib.request.Request(
        base.rstrip("/") + "/embeddings",
        data=body,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    proxy_handler = urllib.request.ProxyHandler({})
    opener = urllib.request.build_opener(proxy_handler)
    try:
        with opener.open(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data["data"][0]["embedding"]
    except Exception as e:
        raise RuntimeError(f"Embedding API 调用失败（model={model}, base={base}）: {e}")
