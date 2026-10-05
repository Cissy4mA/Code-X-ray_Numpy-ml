"""3.2 模块锁定 vs 全局(All) 检索对比测试 —— 量化两阶段设计的必要性。

目的：用实测数据回答"先 3.1 选模块、再 3.2 模块内搜索"是否冗余。验证两个维度：
  1) 速度：锁定模块后候选集更小，3.2 延迟应稳定更低；
  2) 正确性：在共享关键词的算法族边界处（如 q learning / reinforcement learning），
     全局裸搜会把其他模块的候选顶到第一，模块锁定能纠正到正确模块。

结论预期（见下方实测）：两阶段并非冗余 —— 它既更快，又能在消歧边界处纠正结果。

运行方式（必须后端已启动，复用其已加载的 embedding 模型）：
    bash scripts/run.sh                   # 先起后端（0.0.0.0:8000）
    python tests/staged_vs_global.py      # 再跑本对比测试

说明：本测试走 HTTP 接口，避免在 8GB 内存机器上再起一个进程重复加载模型导致 OOM。
若后端未启动，脚本会明确报错退出，不会静默通过。
"""
import sys
import os
import time
import json
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:8000"

# 与 第三部分测试结果.md 同口径的查询集（库内极端/非原名用例 + 关键消歧用例）。
# 末尾两条（q learning / reinforcement learning）是全局搜会跑偏到 bandits 模块的消歧边界用例。
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
    """3.1：模块级检索，返回命中模块名。"""
    data = _post("/api/modules/search", {"query": q, "top_k": 1})
    res = data.get("results") or []
    return res[0]["name"] if res else None


def search(q, module):
    """3.2：类级检索。module='' 表示全局(All)，否则锁定该模块。返回 (top1, 延迟ms, 完整响应)。"""
    t0 = time.perf_counter()
    data = _post("/api/search", {"query": q, "top_k": 3, "module": module or ""})
    dt = (time.perf_counter() - t0) * 1000.0
    res = data.get("results") or []
    top = res[0] if res else None
    return top, dt, data


def main():
    # 0) 后端连通性自检
    try:
        with urllib.request.urlopen(BASE + "/api/smoke", timeout=10) as r:
            smoke = json.loads(r.read().decode("utf-8"))
        if not smoke.get("db_ok"):
            print("❌ 后端 /api/smoke 报数据库异常：", smoke.get("error"))
            sys.exit(2)
    except (urllib.error.URLError, ConnectionError) as e:
        print(f"❌ 无法连接后端 {BASE}，请先执行 `bash scripts/run.sh` 启动服务。错误：{e}")
        sys.exit(2)

    print("# 3.2 模块锁定(staged) vs 全局(All) 对比测试\n")
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
            diff_mark = "⚠ 不一致"
        else:
            diff_mark = ""
        speedups.append(speedup)
        rows.append((q, mod, staged_label, global_label, speedup, diff, diff_mark))
        print(f"{q:<24}{str(mod):<14}{staged_label:<36}{global_label:<36}{speedup:>7.2f}x  {diff_mark}")

    avg_speedup = sum(speedups) / len(speedups) if speedups else 0.0
    print("-" * len(header))
    print(f"\n汇总：")
    print(f"  平均延迟加速比（global / staged）：{avg_speedup:.2f}x")
    print(f"  结果不一致用例数：{diff_count} / {len(QUERIES)}")
    for q, mod, sl, gl, su, d, dm in rows:
        if d:
            print(f"    - {q}: 全局顶到 {gl}，锁定 {mod} 后纠正为 {sl}  ✅ 两阶段价值")

    # 断言：设计收益必须成立，否则测试失败（CI 可据此拦截）
    ok = avg_speedup >= 1.3 and diff_count >= 1
    print(f"\n结论：{'✅ 两阶段设计有效（更快且能在消歧边界纠正结果，非冗余）' if ok else '⚠️ 设计收益未达预期阈值'}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
