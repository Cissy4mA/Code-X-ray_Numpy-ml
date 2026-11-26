"""Automated verification script: runs the full chain of indexing -> hybrid retrieval -> citation-aware Q&A.

Does not depend on the frontend; calls backend endpoints directly via urllib to confirm the whole chain really works.
Usage: code-x-ray/.venv/bin/python test_demo.py
"""
import json
import time
import urllib.request

# Connect to localhost directly, bypassing possible system/IDE proxies that could forward localhost requests and cause 404
urllib.request.install_opener(urllib.request.build_opener(urllib.request.ProxyHandler({})))

BASE = "http://127.0.0.1:8000"


def _post(path, obj):
    body = json.dumps(obj).encode()
    req = urllib.request.Request(
        BASE + path, data=body, headers={"Content-Type": "application/json"}
    )
    return json.loads(urllib.request.urlopen(req, timeout=30).read())


def main():
        # Wait for the service to start
    for _ in range(20):
        try:
            urllib.request.urlopen(BASE + "/api/sample", timeout=2)
            break
        except Exception:
            time.sleep(0.5)

        # Clear first so each run starts with a clean set of 13 chunks
    _post("/api/reset", {})

    sample = json.loads(urllib.request.urlopen(BASE + "/api/sample").read())
    print("Sample file:", sample["filename"], "chars:", len(sample["code"]))

    r = _post("/api/index", {"code": sample["code"], "filename": sample["filename"]})
    print("Index result:", r)

    queries = [
        "calculate order total",
        "prevent SQL injection",
        "send email to user",
        "cache value with ttl",
    ]
    for q in queries:
        s = _post("/api/search", {"query": q, "top_k": 3})
        print("\n=== Search:", q, "===")
        for x in s["results"]:
            print(f"  fused={x['fused']} kw={x['keyword']} sem={x['semantic']}  "
                  f"{x['entity']} [{x['type']}] {x['path']}:{x['lines']}")
        a = _post("/api/ask", {"query": q, "top_k": 3})
        print("  ANSWER>>", a["answer"][:240].replace("\n", " "))


if __name__ == "__main__":
    main()
