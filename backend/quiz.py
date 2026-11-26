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
            "evidence": evidence or "Current algorithm metadata", "kind": kind,
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
                arguments.append(argument.arg + (f"={expression(default)}" if default is not None else " (required)"))
            for argument, default in zip(node.args.kwonlyargs, node.args.kw_defaults):
                arguments.append(argument.arg + (f"={expression(default)}" if default is not None else " (keyword required)"))
            if node.args.vararg:
                arguments.append("*" + node.args.vararg.arg)
            if node.args.kwarg:
                arguments.append("**" + node.args.kwarg.arg)
            add("signature", f"What parameters does {current_owner} accept? Which parameters have default values declared in the source code?",
                ", ".join(arguments) or "No explicit parameters besides the bound object.", node)
            documentation = ast.get_docstring(node)
            if documentation:
                add("documentation", f"How does the source documentation describe {current_owner}?", documentation, node.body[0])
        elif isinstance(node, (ast.For, ast.AsyncFor)):
            add("loop", f"In {owner}, which object does the variable {expression(node.target)} iterate over?",
                f"{expression(node.target)} takes successive values from {expression(node.iter)}. The loop body cost and actual iteration count require separate analysis.", node)
        elif isinstance(node, ast.While):
            add("loop", f"What condition does the while loop in {owner} use to decide whether to continue?",
                f"The continue condition is {expression(node.test)}; a break, exception, or return may still end the loop early.", node)
        elif isinstance(node, ast.If):
            add("branch", f"When the condition {expression(node.test)} holds in {owner}, which statement executes first?",
                expression(node.body[0]) if node.body else "No branch body.", node)
        elif isinstance(node, ast.Return) and node.value is not None:
            add("return", f"What expression does {owner} output at this return point?", expression(node.value), node)
        elif isinstance(node, (ast.Assign, ast.AnnAssign, ast.AugAssign)):
            targets = node.targets if isinstance(node, ast.Assign) else [node.target]
            if node.value is not None:
                target_text = ", ".join(expression(target) for target in targets)
                add("state", f"What computation does this assignment to {target_text} in {owner} depend on?",
                    expression(node), node)
        elif isinstance(node, ast.Call):
            function = expression(node.func)
            arguments = [expression(argument) for argument in node.args]
            arguments.extend((keyword.arg + "=" if keyword.arg else "**") + expression(keyword.value)
                             for keyword in node.keywords)
            add("call", f"What actual arguments does {owner} pass when calling {function}?",
                ", ".join(arguments) or "No explicit arguments.", node)
        elif isinstance(node, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)):
            clauses = []
            for generator in node.generators:
                clauses.append(f"{expression(generator.target)} iterates over {expression(generator.iter)}")
                clauses.extend(f"filter condition: {expression(condition)}" for condition in generator.ifs)
            add("comprehension", f"Where does the comprehension in {owner} get its values, and what filter conditions does it use?",
                "; ".join(clauses), node)
        for child in ast.iter_child_nodes(node):
            visit(child, current_owner)

    try:
        tree = ast.parse(source) if source.strip() else None
    except (SyntaxError, ValueError, RecursionError):
        tree = None
    if tree is not None:
        visit(tree, name)

    for method in algorithm.get("math_methods") or []:
        add("math", f"The index for {name} tagged the math method {method}. Is this tag equivalent to a proof of implementation correctness?",
            f"math_methods contains {method}. It is an index tag; the implementation must still be checked against the actual operations above. It is not a correctness proof.",
            evidence=f"math_methods: {method}")
    for parameter in algorithm.get("params") or []:
        add("parameter", f"Is {parameter} included in the structured parameters of {name}?",
            f"params contains {parameter}. Default values are determined by the AST signature question; if the source does not provide one, neither the default nor its role can be inferred.",
            evidence=f"params: {parameter}")
    if not source.strip() or tree is None:
        for member in algorithm.get("functions") or []:
            if isinstance(member, dict) and member.get("meaning"):
                add("documentation", f"What is the recorded description of {name}.{member.get('name', '')}?",
                    member["meaning"], evidence=f"functions.{member.get('name', '')}.meaning")
        if algorithm.get("docstring_math"):
            add("documentation", f"Which math descriptions are currently recorded for {name}?", algorithm["docstring_math"],
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
