import ast
import textwrap


def generate_quiz(algorithm, limit=12):
    name = algorithm.get("entity") or algorithm.get("name") or "Algorithm"
    source = textwrap.dedent(algorithm.get("code") or "")
    groups = {}
    seen = set()
    source_lines = source.splitlines()
    path = algorithm.get("path") or "indexed source"
    try:
        offset = int(str(algorithm.get("lines") or "1").split("-")[0]) - 1
    except ValueError:
        offset = 0

    def expression(node):
        return ast.unparse(node)[:500]

    def add(kind, question, answer, node=None, evidence=None):
        if question in seen:
            return
        seen.add(question)
        if node is not None:
            start = node.lineno
            end = min(getattr(node, "end_lineno", start), start + 6)
            excerpt = "\n".join(source_lines[start - 1:end])
            evidence = f"{path}:{offset + start}-{offset + end}\n{excerpt}"
        groups.setdefault(kind, []).append({
            "question": question, "answer": answer,
            "evidence": evidence or "当前算法元数据", "kind": kind,
        })

    def visit(node, owner):
        current_owner = owner
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            current_owner = f"{owner}.{node.name}"
            positional = node.args.posonlyargs + node.args.args
            defaults = [None] * (len(positional) - len(node.args.defaults)) + node.args.defaults
            arguments = []
            for argument, default in zip(positional, defaults):
                if argument.arg in {"self", "cls"}:
                    continue
                arguments.append(argument.arg + (f"={expression(default)}" if default is not None else "（必填）"))
            for argument, default in zip(node.args.kwonlyargs, node.args.kw_defaults):
                arguments.append(argument.arg + (f"={expression(default)}" if default is not None else "（关键字必填）"))
            if node.args.vararg:
                arguments.append("*" + node.args.vararg.arg)
            if node.args.kwarg:
                arguments.append("**" + node.args.kwarg.arg)
            add("signature", f"{current_owner} 接收哪些参数？哪些参数在源码中声明了默认值？",
                "、".join(arguments) or "除绑定对象外没有显式参数。", node)
            documentation = ast.get_docstring(node)
            if documentation:
                add("documentation", f"源码文档如何描述 {current_owner}？", documentation, node.body[0])
        elif isinstance(node, (ast.For, ast.AsyncFor)):
            add("loop", f"{owner} 中变量 {expression(node.target)} 遍历哪个对象？",
                f"{expression(node.target)} 从 {expression(node.iter)} 中依次取值。循环体成本及实际次数需另行分析。", node)
        elif isinstance(node, ast.While):
            add("loop", f"{owner} 的 while 循环用什么条件决定继续执行？",
                f"继续条件为 {expression(node.test)}；break、异常或返回仍可能提前结束循环。", node)
        elif isinstance(node, ast.If):
            add("branch", f"{owner} 在条件 {expression(node.test)} 成立时首先执行哪条语句？",
                expression(node.body[0]) if node.body else "没有分支体。", node)
        elif isinstance(node, ast.Return) and node.value is not None:
            add("return", f"{owner} 在该返回点输出什么表达式？", expression(node.value), node)
        elif isinstance(node, (ast.Assign, ast.AnnAssign, ast.AugAssign)):
            targets = node.targets if isinstance(node, ast.Assign) else [node.target]
            if node.value is not None:
                target_text = ", ".join(expression(target) for target in targets)
                add("state", f"{owner} 中 {target_text} 的这次赋值依赖什么计算？",
                    expression(node), node)
        elif isinstance(node, ast.Call):
            function = expression(node.func)
            arguments = [expression(argument) for argument in node.args]
            arguments.extend((keyword.arg + "=" if keyword.arg else "**") + expression(keyword.value)
                             for keyword in node.keywords)
            add("call", f"{owner} 调用 {function} 时传入了哪些实际参数？",
                "、".join(arguments) or "没有显式实参。", node)
        elif isinstance(node, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
            clauses = []
            for generator in node.generators:
                clauses.append(f"{expression(generator.target)} 遍历 {expression(generator.iter)}")
                clauses.extend(f"筛选条件：{expression(condition)}" for condition in generator.ifs)
            add("comprehension", f"{owner} 的推导式从哪里取值，使用哪些筛选条件？",
                "；".join(clauses), node)
        for child in ast.iter_child_nodes(node):
            visit(child, current_owner)

    try:
        tree = ast.parse(source) if source.strip() else None
    except (SyntaxError, ValueError, RecursionError):
        tree = None
    if tree is not None:
        visit(tree, name)

    for method in algorithm.get("math_methods") or []:
        add("math", f"{name} 的索引标注了数学方法 {method}。这一标签是否等同于实现正确性证明？",
            f"math_methods 包含 {method}。它是索引标签，仍须结合上述真实运算核对实现，不是正确性证明。",
            evidence=f"math_methods: {method}")
    for parameter in algorithm.get("params") or []:
        add("parameter", f"{name} 的结构化参数中是否收录 {parameter}？",
            f"params 包含 {parameter}。默认值以 AST 签名题为准；源码未提供时不能推断默认值或作用。",
            evidence=f"params: {parameter}")
    if not source.strip() or tree is None:
        for member in algorithm.get("functions") or []:
            if isinstance(member, dict) and member.get("meaning"):
                add("documentation", f"{name}.{member.get('name', '')} 的收录说明是什么？",
                    member["meaning"], evidence=f"functions.{member.get('name', '')}.meaning")
        if algorithm.get("docstring_math"):
            add("documentation", f"{name} 当前收录了哪些数学说明？", algorithm["docstring_math"],
                evidence="docstring_math")
    selected = []
    position = 0
    while len(selected) < limit:
        round_items = [items[position] for items in groups.values() if position < len(items)]
        if not round_items:
            break
        selected.extend(round_items[:limit - len(selected)])
        position += 1
    return selected
