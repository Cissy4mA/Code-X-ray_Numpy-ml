"""自动化验证脚本：跑通 入库 → 混合检索 → 带引用问答 全链路。

不依赖前端，直接用 urllib 调后端接口，方便你确认整条链路真的通了。
用法：code-x-ray/.venv/bin/python test_demo.py
"""
import json
import time
import urllib.request

# 直连 localhost，绕过可能存在的系统/IDE 代理，避免 localhost 请求被转发到代理而 404
urllib.request.install_opener(urllib.request.build_opener(urllib.request.ProxyHandler({})))

BASE = "http://127.0.0.1:8000"


def _post(path, obj):
    body = json.dumps(obj).encode()
    req = urllib.request.Request(
        BASE + path, data=body, headers={"Content-Type": "application/json"}
    )
    return json.loads(urllib.request.urlopen(req, timeout=30).read())


def main():
    # 等服务起来
    for _ in range(20):
        try:
            urllib.request.urlopen(BASE + "/api/sample", timeout=2)
            break
        except Exception:
            time.sleep(0.5)

    # 先清空，保证每次跑出来都是干净的 13 个 chunk
    _post("/api/reset", {})

    sample = json.loads(urllib.request.urlopen(BASE + "/api/sample").read())
    print("示例文件:", sample["filename"], "字符数:", len(sample["code"]))

    r = _post("/api/index", {"code": sample["code"], "filename": sample["filename"]})
    print("入库结果:", r)

    queries = [
        "calculate order total",
        "prevent SQL injection",
        "send email to user",
        "cache value with ttl",
    ]
    for q in queries:
        s = _post("/api/search", {"query": q, "top_k": 3})
        print("\n=== 检索:", q, "===")
        for x in s["results"]:
            print(f"  fused={x['fused']} kw={x['keyword']} sem={x['semantic']}  "
                  f"{x['entity']} [{x['type']}] {x['path']}:{x['lines']}")
        a = _post("/api/ask", {"query": q, "top_k": 3})
        print("  ANSWER>>", a["answer"][:240].replace("\n", " "))


if __name__ == "__main__":
    main()
