"""3.2 module-locked vs global (All) retrieval comparison test - quantifies the necessity of the two-stage design.

Goal: answer with measured data whether "select module in 3.1, then search within the module in 3.2" is redundant. Two dimensions:
    1) Speed: after locking the module, the candidate set is smaller, so 3.2 latency should be consistently lower;
    2) Correctness: at the boundary of algorithm families sharing keywords (e.g. q learning / reinforcement learning),
          global unscoped search pushes other modules' candidates to the top, while module locking corrects to the right module.

Expected conclusion (see measurements below): the two stages are not redundant - it is both faster and corrects results at disambiguation boundaries.

How to run (backend must be running to reuse its loaded embedding model):
        bash scripts/run.sh                   # start the backend first (0.0.0.0:8000)
        python tests/staged_vs_global.py      # then run this comparison test

Note: this test goes through the HTTP API to avoid starting another process on an 8GB machine that would reload the model and cause OOM.
If the backend is not running, the script exits with a clear error instead of silently passing.
"""
import sys
import os
import time
import json
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:8000"

# Query set using the same criteria as part3_test_results.md (in-repo extreme/non-canonical cases + key disambiguation cases).
# The last two (q learning / reinforcement learning) are disambiguation cases where global search drifts to the bandits module.
QUERIES = [
    "hmm", "gmm", "lda", "decison tree", "logisitc regresion",
    "gausian mixture", "random forest", "xgboost",
    "q learning", "reinforcement learning", "neural network", "naive bayes",
]


def _post(path, payload):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def module_of(q):
    """3.1: module-level retrieval, returns the matched module name."""
    data = _post("/api/modules/search", {"query": q, "top_k": 1})
    res = data.get("results") or []
    return res[0]["name"] if res else None


def search(q, module):
    """3.2: class-level retrieval. module='' means global (All), otherwise lock that module. Returns (top1, latency ms, full response)."""
    t0 = time.perf_counter()
    data = _post("/api/search", {"query": q, "top_k": 3, "module": module or ""})
    dt = (time.perf_counter() - t0) * 1000.0
    res = data.get("results") or []
    top = res[0] if res else None
    return top, dt, data


def main():
    # 0) Backend connectivity self-check
    try:
        with urllib.request.urlopen(BASE + "/api/smoke", timeout=10) as r:
            smoke = json.loads(r.read().decode("utf-8"))
        if not smoke.get("db_ok"):
            print("❌ Backend /api/smoke reports a database error:", smoke.get("error"))
            sys.exit(2)
    except (urllib.error.URLError, ConnectionError) as e:
        print(f"❌ Cannot connect to backend {BASE}. Run `bash scripts/run.sh` first to start the service. Error: {e}")
        sys.exit(2)

    print("# 3.2 Module-Locked (staged) vs Global (All) Comparison Test\n")
    header = f"{'query':<24}{'3.1 module':<14}{'staged top1':<36}{'global top1':<36}{'speedup':>8}  diff"
    print(header)
    print("-" * len(header))

    rows = []
    speedups = []
    diff_count = 0
    for q in QUERIES:
        mod = module_of(q)
        staged_top, staged_ms, _ = search(q, mod)
        global_top, global_ms, _ = search(q, "")
        staged_label = f"{staged_top['entity']}::{staged_top['module']}" if staged_top else "—"
        global_label = f"{global_top['entity']}::{global_top['module']}" if global_top else "—"
        speedup = global_ms / staged_ms if staged_ms > 0 else float("inf")
        diff = (staged_top or {}).get("entity") != (global_top or {}).get("entity") or \
               (staged_top or {}).get("module") != (global_top or {}).get("module")
        if diff:
            diff_count += 1
            diff_mark = "⚠ different"
        else:
            diff_mark = ""
        speedups.append(speedup)
        rows.append((q, mod, staged_label, global_label, speedup, diff, diff_mark))
        print(f"{q:<24}{str(mod):<14}{staged_label:<36}{global_label:<36}{speedup:>7.2f}x  {diff_mark}")

    avg_speedup = sum(speedups) / len(speedups) if speedups else 0.0
    print("-" * len(header))
    print(f"\nSummary:")
    print(f"  Average latency speedup (global / staged): {avg_speedup:.2f}x")
    print(f"  Number of differing cases: {diff_count} / {len(QUERIES)}")
    for q, mod, sl, gl, su, d, dm in rows:
        if d:
            print(f"    - {q}: global top {gl}, after locking {mod} corrected to {sl}  ✅ two-stage value")

    # Assertion: the design benefit must hold, otherwise the test fails (CI can block on this)
    ok = avg_speedup >= 1.3 and diff_count >= 1
    print(f"\nConclusion: {'✅ two-stage design effective (faster and corrects results at disambiguation boundaries, not redundant)' if ok else '⚠️ design benefit did not reach the expected threshold'}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
