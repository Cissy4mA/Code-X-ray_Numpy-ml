"""Code parsing + pluggable embedding (v2: ML algorithm class-level splitting).

- Splitting: four levels - module / class / function / method; class level is the main unit for ML algorithms
- Each chunk extracts:
    module        top-level directory in the repository (e.g. neural_nets)
    family        algorithm family (Neural Networks / Tree-based / ...)
    task          task type (classification / regression / ...)
    math_methods  math method tags extracted from the docstring
    params        __init__ parameter schema
    references    references (e.g. Bishop 2006)
    docstring_math structured math description (objective function / assumptions)
    complexity    complexity heuristic
    ref_edges     reference edges: base classes / imports
    call_edges    call edges: symbols called inside methods
- embedding: prefer an OpenAI-compatible API; without a key, use local sentence-transformers (default)
"""
import ast
import re
import math
import json
import os
import urllib.request
import hashlib
import threading

PY_STOP = set(
    "def return if else elif for while import from as class try except with lambda "
    "none true false and or not in is pass break continue global nonlocal yield "
    "async await print self cls int str float list dict set tuple range len enumerate "
    "zip map filter open read write close super object init new call".split()
)

DIM = 384  # all-MiniLM-L6-v2 output dimension; API embedding dimension is determined by the model

# Repository top-level directories -> algorithm families (numpy-ml directory structure)
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

# Non-algorithm directories excluded from retrieval/statistics (tests, plots)
NON_ALGO_MODULES = {"tests", "plots"}

# Full names / abbreviations / English aliases for the 13 algorithm modules, written to modules.aliases at
# indexing time and matched during module search, so both full names and abbreviations are recognized.
MODULE_ALIASES = {
    "bandits": [
        "Bandits", "Multi-armed Bandits", "MAB", "Contextual Bandits",
        "Multi-armed Bandit", "Multi-armed Bandit Problem", "Bandit Algorithm", "Bandit Problem",
    ],
    "factorization": [
        "Matrix Factorization", "Factorization Machines", "MF", "FM",
        "Matrix Factorization Model", "Factorization Machine", "Matrix Factorization Machine",
    ],
    "gmm": [
        "Gaussian Mixture Model", "Gaussian Mixture Models", "GMM",
        "Mixture of Gaussians", "Mixture of Gaussian", "Gaussian Mixture Modeling", "Gaussian Mixture",
    ],
    "hmm": [
        "Hidden Markov Model", "Hidden Markov Models", "HMM",
        "Hidden Markov Modeling", "Hidden Markov", "Hidden Markov Chain",
    ],
    "lda": [
        "Latent Dirichlet Allocation", "LDA", "Topic Model", "Topic Models",
        "Topic Modeling", "Latent Dirichlet Distribution", "Latent Dirichlet Allocation Model",
    ],
    "linear_models": [
        "Linear Models", "Generalized Linear Models", "GLM",
        "Linear Regression", "Logistic Regression", "Ridge Regression", "Lasso",
        "Naive Bayes", "Gaussian Naive Bayes", "GaussianNB", "Naive Bayes Classifier",
        "Linear Regression Model", "Logistic Regression Model", "Ridge Regression Model", "Lasso Regression", "Linear Model", "Generalized Linear Model",
    ],
    "neural_nets": [
        "Neural Networks", "Neural Network", "Deep Learning", "Deep Neural Network",
        "DNN", "NN", "Feedforward Network", "Artificial Neural Network",
        "Neural Net", "Deep Learning Models", "Deep Neural Networks", "Feedforward Neural Network",
    ],
    "ngram": [
        "N-Gram", "N-Grams", "N-Gram Language Model", "Ngram", "Ngrams",
        "N-Gram Grammar", "N-Gram Model", "Language Model", "N-Gram Language Modeling",
    ],
    "nonparametric": [
        "Nonparametric Models", "Non-parametric Models", "Nonparametric", "Kernel Density Estimation",
        "KDE", "Kernel Density Estimator", "Nonparametric Model", "Nonparametric Method",
    ],
    "preprocessing": [
        "Preprocessing", "Data Preprocessing", "Feature Scaling", "Normalization",
        "Standardization", "Min-Max Scaling", "Data Preprocessing Pipeline", "Feature Scaling and Normalization", "Z-score Normalization", "Min-Max Normalization",
    ],
    "rl_models": [
        "Reinforcement Learning", "RL", "Agents", "Markov Decision Process", "MDP",
        "Reinforcement Learning Models", "Agent", "Reinforcement Learning Agent", "Markov Decision Processes",
    ],
    "trees": [
        "Decision Trees", "Random Forest", "Gradient Boosted Trees", "GBDT",
        "XGBoost", "CART", "Decision Tree", "Random Forests", "Gradient Boosting Trees", "Gradient Boosted Decision Trees",
    ],
    "utils": [
        "Utilities", "Utils", "Helper Functions", "Utility Functions",
        "Utility Function", "Helper Function", "Utility Module",
    ],
}

# "Available models" headings in numpy-ml README.md -> module directory names
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

# Math method dictionary (lowercase matching against docstring / code)
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
# 1. Code splitting + metadata extraction
# -----------------------------------------------------------------------------
def extract_chunks(source, filename="pasted.py", module_path=""):
    """Split source code into four-level chunks - module / class / function / method - and extract ML metadata."""
    chunks = []
    lines = source.splitlines()
    total_lines = len(lines)
    try:
        tree = ast.parse(source)
    except SyntaxError:
        # Non-Python / broken syntax: fall back to a whole-file module chunk
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

    # Keep only meaningful class/function-level units; skip file-level module chunks and __init__ methods
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

            # 3) methods inside a class (skip __init__; its parameters were extracted into the class chunk's params)
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
                # Include default value hints
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
    """Build a natural-language summary for embedding (rather than raw code) to improve semantic retrieval accuracy."""
    head = f"{family} algorithm for {task}. Class name: {name}."
    # First two sentences of the docstring
    doc1 = ""
    if doc:
        parts = re.split(r"(?<=[.!?])\s+", doc.strip())
        doc1 = " ".join(parts[:2])[:400]
    param_s = f" Key parameters: {params}." if params else ""
    return f"{head} {doc1}{param_s}".strip()


# -----------------------------------------------------------------------------
# 2. README sections: split the numbered "Available models" list in numpy_ml/README.md
#    by module directory name, for verbatim display during module search (no summary generated).
# -----------------------------------------------------------------------------
def extract_module_readmes(readme_path):
    """Return {module_name: markdown_section_text}."""
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
            # Remove parenthetical notes, e.g. "latent dirichlet allocation (topic model)"
            heading = heading.split("(")[0].strip()
            current_module = README_MODULE_MAP.get(heading)
            current_lines = [line.strip()]
        elif current_module is not None:
            current_lines.append(line)
    if current_module and current_lines:
        sections[current_module] = "\n".join(current_lines).strip()
    return sections


def rewrite_image_paths(readme: str, module: str, repo_url: str, branch: str = "master") -> str:
    """Rewrite relative image paths in module READMEs to absolute GitHub raw URLs, to avoid broken images in the frontend."""
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
# 3. Embedding: API first, with local sentence-transformers as fallback (default)
# -----------------------------------------------------------------------------
_MODEL = None
_MODEL_CONFIG = None
_MODEL_LOCK = threading.Lock()
DEFAULT_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
DEFAULT_REVISION = "1110a243fdf4706b3f48f1d95db1a4f5529b4d41"


def embedding_config():
    backend = os.environ.get("EMBEDDING_BACKEND", "").strip().lower()
    if not backend:
        backend = "api" if os.environ.get("EMBEDDING_API_KEY") else "local"
    if backend == "hash":
        return {"backend": backend, "model": "sha256-token-hash-v1", "recipe": 1}
    if backend == "local":
        model = os.environ.get("EMBEDDING_LOCAL_MODEL", DEFAULT_MODEL)
        revision = os.environ.get("EMBEDDING_LOCAL_REVISION")
        if not revision:
            if model != DEFAULT_MODEL:
                raise ValueError("Set EMBEDDING_LOCAL_REVISION to pin the local model version.")
            revision = DEFAULT_REVISION
        return {"backend": backend, "model": model, "revision": revision, "recipe": 1}
    if backend == "api":
        return {"backend": backend,
                "model": os.environ.get("EMBEDDING_MODEL", "text-embedding-3-small"),
                "endpoint": os.environ.get("EMBEDDING_BASE_URL", "https://api.openai.com/v1").rstrip("/"),
                "recipe": 1}
    raise ValueError(f"Unknown EMBEDDING_BACKEND: {backend}")


def _get_model():
    global _MODEL, _MODEL_CONFIG
    config = embedding_config()
    if _MODEL is not None and _MODEL_CONFIG == config:
        return _MODEL
    with _MODEL_LOCK:
        if _MODEL is not None and _MODEL_CONFIG == config:
            return _MODEL
        from sentence_transformers import SentenceTransformer
        from huggingface_hub import snapshot_download
        options = {"revision": config["revision"]}
        try:
            snapshot = snapshot_download(config["model"], local_files_only=True, **options)
            model = SentenceTransformer(snapshot, local_files_only=True)
        except OSError:
            model = SentenceTransformer(config["model"], **options)
        _MODEL = model
        _MODEL_CONFIG = config
    return _MODEL


def embed(text):
    """Generate a unit vector using the same explicitly configured model."""
    config = embedding_config()
    if config["backend"] == "hash":
        return _embed_hash(text)
    if config["backend"] == "api":
        key = os.environ.get("EMBEDDING_API_KEY")
        if not key:
            raise ValueError("EMBEDDING_BACKEND=api requires EMBEDDING_API_KEY")
        return normalize_vector(_embed_api(text, key))
    model = _get_model()
    vec = model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
    return vec.tolist()


def embed_many(texts, batch_size=32):
    if embedding_config()["backend"] == "local":
        return _get_model().encode(texts, batch_size=batch_size, convert_to_numpy=True,
                                   normalize_embeddings=True).tolist()
    return [embed(text) for text in texts]


def normalize_vector(vector):
    values = [float(value) for value in vector]
    if not values or not all(math.isfinite(value) for value in values):
        raise ValueError("Embedding must be nonempty and finite")
    norm = math.sqrt(sum(value * value for value in values))
    if not math.isfinite(norm) or norm == 0:
        raise ValueError("Embedding must have finite nonzero norm")
    return [value / norm for value in values]


def module_embed_text(name, family, aliases, readme):
    """Build the enriched text used for the "module-level" semantic vector: name + algorithm family + aliases + README.

    Aliases are the module's "concept anchors" (e.g. Normalization / Feature Scaling /
    Standardization for preprocessing). Encoding only the README would leave natural-language
    queries such as "normalize and scale features" unable to find preprocessing semantically.
    Encoding the aliases lets semantic retrieval hit the module's concept layer.
    """
    alias_str = " ".join(aliases) if isinstance(aliases, list) else (aliases or "")
    parts = [name, family or "", alias_str, (readme or "")[:3500]]
    return " ".join(p for p in parts if p).strip()


def embed_module(name, family, aliases, readme):
    """Module-level semantic vector: name + algorithm family + aliases + README, enriched then encoded."""
    return embed(module_embed_text(name, family, aliases, readme))


def tokenize(text):
    toks = re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", text.lower())
    return [t for t in toks if t not in PY_STOP and len(t) > 1]


def _embed_hash(text):
    """Explicit demo mode: stable token hashing with no semantic capability."""
    vec = [0.0] * DIM
    for t in tokenize(text):
        h = int.from_bytes(hashlib.sha256(t.encode("utf-8")).digest()[:8], "big")
        idx = (h % DIM + DIM) % DIM
        vec[idx] += 1.0
    norm = math.sqrt(sum(v * v for v in vec))
    if norm > 0:
        vec = [v / norm for v in vec]
    return vec


def cosine(a, b):
    """The dot product of two normalized vectors is their cosine similarity."""
    if not a or len(a) != len(b):
        raise ValueError("Embedding dimensions differ; rebuild the complete index")
    return sum(x * y for x, y in zip(a, b))


def _embed_api(text, key):
    """Call an OpenAI-compatible embedding API (OpenAI / Zhipu / Qwen / local vLLM, etc.)."""
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
        raise RuntimeError(f"Embedding API call failed (model={model}, base={base}): {e}")
