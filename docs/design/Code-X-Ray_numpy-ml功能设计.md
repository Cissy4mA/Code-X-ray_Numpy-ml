# Code X-Ray · numpy-ml 内核功能设计

> 内核锁定：`https://github.com/ddbourgin/numpy-ml`
> 定位：纯 Python（零 Cython）ML 算法库，62 个 `.py` 文件，数学实现与推导全部写在 docstring / 注释里。我们的 `ast` 解析器开箱即用，无需为 `.pyx` 写额外解析器。

---

## 0. 为什么 numpy-ml 是正确内核（再钉一次）

| 维度 | sklearn | numpy-ml（选它） |
|---|---|---|
| 数学实现位置 | 75%+ 在 `.pyx`（Cython），`.py` 只是 API 壳 | 100% 在 `.py`，数学在 docstring + 注释 |
| 我们的 `ast` 解析器能吃吗 | 只能吃到 API 壳，数学内核全跳过 | 整段数学直接入库 |
| 检索单元 | 薄包装类 | 自包含算法类，天然干净 |
| 契合"偏数学算法检索" | 反着来 | 正中靶心 |

**结论：要检索"数学"，就必须索引到数学所在的 `.py`，所以 numpy-ml 压死 sklearn。**

---

## 1. 精准检索怎么做到（技术核心，现在的第一优先级）

"精准"不靠堆功能，靠**检索单元 + 嵌入内容 + 混合策略 + 结构化约束**四件事。

### 1.1 切分单元：算法类级（不是函数级）
numpy-ml 每个算法是一个独立类（`LogisticRegression` / `GaussianMixture` / `LDA` / `DecisionTree`…），类内自带 `__init__` 参数、`fit` / `predict` 签名、完整数学 docstring。
**检索单元 = 一个算法类**，而非任意函数。这正好是你"类型感知切分"论点的落点。

### 1.2 每个 chunk 的字段 Schema（建议）
```
{
  "entity_name": "LogisticRegression",
  "chunk_type": "algorithm_class",
  "module": "numpy_ml/glm",          # 所属模块
  "family": "generalized_linear_model",# 算法族
  "task": "classification",           # 任务类型：分类/回归/聚类/生成/序列建模
  "math_methods": ["sigmoid","cross_entropy","gradient_descent"],  # 用到的数学方法
  "params": ["lr","tol","max_iter"],  # 关键参数
  "docstring_math": "目标函数 min Σlog(1+exp(-y·wᵀx))…",  # 数学描述原文
  "references": ["Bishop 2006 §4.3"], # 文献引用
  "code_text": "class LogisticRegression: …",
  "embedding_text": "Logistic regression: 用于二分类的线性模型，通过梯度下降/牛顿法最小化交叉熵…",  # 合成的自然语言摘要
  "ref_edges": ["_BaseGLM","softmax"],# 引用边：基类 / 调用工具
  "path":"…/glm/logistic.py", "start_line":12, "end_line":210
}
```

### 1.3 嵌入什么（关键，决定召回质量）
**嵌入 `embedding_text`（自然语言摘要），不嵌入 `code_text`（原始代码）。**
Greptile 实测：嵌入"自然语言摘要"比嵌入 raw code 在代码问答上高 ~12%。对 numpy-ml 尤其对——数学语义藏在 docstring 里，raw code 反而稀释语义。
摘要可由 `parser.py` 自动拼装：`类名 + family + task + docstring 数学段 + 参数名`。

### 1.4 混合检索 + 数学术语 boosting
- **向量检索**：语义，"怎么估计高斯混合模型的参数" → 命中 GMM。
- **关键词检索（FULLTEXT）**：精确匹配数学术语 `EM` / `Gaussian` / `backprop` / `softmax` / `Gibbs` / `MLE`。ML 术语极精确，关键词召回往往比语义更准。
- **数学术语 boosting**：query 命中已知数学词表时，对该词的精确匹配加权，压住语义漂移。
- **融合**：沿用现有 `fused = 0.5·keyword + 0.5·semantic`，前端把三项分数摊开（你的"透视"卖点）。

### 1.5 结构化过滤 = 检索前先缩圈（精度放大器）
numpy-ml 有明确模块族：`neural_nets` / `rl` / `trees` / `glm` / `clustering` / `naive_bayes` / `hmm` / `gmm` / `lda` / `kernel` / `unsupervised`…
前端让用户先选 `module` / `family` / `task`，把这些变成 SQL `WHERE` 约束，**先在候选集里缩圈再检索**——这是"类级切分"相比朴素函数级检索最大的精度优势，也是你可量化的贡献点（naive vs type-aware 的 Recall@k 对比）。

---

## 2. 前端功能矩阵：检索型 vs 学习型

用户来这个系统有两种姿态，功能要分两栏设计。

### 2.1 检索型
目标：从库里**精准定位**某个算法 / 函数 / 数学概念。

| 功能 | 说明 | 对应图书馆类比 |
|---|---|---|
| 自然语言检索 | "哪个算法用 EM 估计参数" | 搜"讲爱情的小说" |
| 符号名精确搜 | 输入 `LDA` / `DecisionTree` 直达类 | 按书名精确查 |
| 数学概念检索 | "假设特征服从高斯分布的模型" | 按主题/标签查 |
| 多条件过滤 | module + family + task 组合缩圈 | 多条件组合查询 |
| 引用 / 继承关系 | "谁继承自 `_BaseGLM`"、"谁调用了 `softmax`" | 看"同系列/同作者" |
| 接口速览 | 点开类即看 `__init__` 参数 + `fit/predict` 签名 | 图书详情页 |

### 2.2 学习型
目标：不是找到就走，而是**围绕一个算法把它学懂**。这是 numpy-ml 才撑得起来的差异化——数学 docstring 是金矿。

| 功能 | 说明 | 价值 |
|---|---|---|
| 数学 docstring 渲染 | 把 docstring 里的公式 / 目标函数按 LaTeX 渲染成可读卡片 | 直接当复习笔记 |
| "给我看数学"卡片 | 从类里抽取：目标函数 / 假设 / 参数分布 / 参考文献，结构化呈现 | 一眼看懂一个算法 |
| 算法对比（side-by-side） | "比 LDA vs GMM"、"logistic vs SVM"，并排展示参数/假设/数学 | 建立知识网络 |
| 概念 → 学习路径 | "我想懂 LDA" → 自动排出 Dirichlet + 多项分布 + EM 的依赖顺序 | 自学路线图 |
| 相似算法推荐 | 看 LR 时推荐 softmax / SVM / 朴素贝叶斯（按 family/引用共现） | 发散学习 |
| "当我在复习"讲解 | 取 chunk + LLM 生成教程式讲解（带代码段） | 把代码变讲义 |

**一句话区分**：检索型回答"在哪"，学习型回答"是什么、怎么学"。图书馆只能检索，你的系统能教——这是你区别于所有"又一个代码问答 demo"的护城河。

---

## 3. 相关度可视化（后续，你提的泡泡图）

你描述的"相关度越高泡泡越大"完全可行，且正好强化"X-Ray 透视"品牌：

- **泡泡大小** ∝ `fused` 分数（越大越相关）
- **泡泡位置**：按 embedding 二维投影（PCA/t-SNE）排布 → 语义相近的算法自然聚在一起；或按 `module` 聚类成几团
- **泡泡颜色** ∝ `chunk_type` / `module`（一眼分清是哪一类）
- **点击泡泡** → 右侧弹出"学习型"卡片（数学 / 对比 / 讲解）
- **交互**：hover 显示三项分数（keyword/semantic/fused），拖拽缩放，按 module 过滤显隐

这页同时承担了"检索结果可解释"和"视觉记忆点"双重角色，答辩时一句"我把不可见的检索分数变成了可见的泡泡拓扑"就很能打。

---

## 4. 范围决策与落地顺序

### 已定范围（用户拍板）
- **不接大模型（LLM / `/api/ask` 问答）**：暂时舍弃，放最后，且大概率不做。理由：① 本系统只针对 numpy-ml 单一仓库做"检索 + 学习"，接 LLM 泛化生成反而失去针对性；② 数学 docstring 本身就是内容，把已有数学"渲染好、结构化好、对比好"比"让模型新生成文字"价值更高；③ 用户已在别的项目踩过接入 LLM 的复杂度，不重复投入。
- **可视化定位**：不是独立新模块，而是"检索型"的最后一步——把检索命中的结果用更好的视觉形式呈现（泡泡图等），属于优化检索呈现，非新增能力。
- **结论**：核心链路 = 精准检索（类级切分 + 数学嵌入 + 混合 + 过滤）→ 检索型 UI → 学习型 UI（数学渲染 / 对比 / 路径 / 推荐，**均不依赖 LLM**）→ 检索结果可视化。LLM 问答整体出局或最后再说。

### 落地顺序
1. **第一刀（底座，占 20% 大部分分数）**：clone numpy-ml → 类级切分 + 数学 docstring 嵌入 + 多条件过滤检索。先把"精准"做出来。
2. **检索型 UI**：多条件过滤面板 + 类 / 符号详情页，替代现有问答框。
3. **学习型 UI**：数学 docstring 渲染 + 算法对比页（不依赖 LLM）。这是差异化。
4. **最后**：检索结果可视化（泡泡图等），优化检索型呈现。

**第一刀最该做的验证**：构造一组"数学向 query"（如"用 EM 估参数的算法""哪些假设高斯分布""show me backprop"），跑 naive 功能级切分 vs 算法类级切分的 Recall@k / MRR 对比——这个对比本身就是你这门《数据存储与检索》的作业贡献，不用等 UI 全做好。
