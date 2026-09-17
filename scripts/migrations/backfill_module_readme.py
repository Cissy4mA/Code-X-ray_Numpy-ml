"""为已导入的模块回填 README 原文（不重新 embed）。"""
import os
import subprocess
import tempfile
import shutil
import db
import parser


def main():
    tmp = tempfile.mkdtemp(prefix="codexray_readme_")
    try:
        subprocess.run(
            ["git", "clone", "--depth", "1", "-b", "master",
             "https://github.com/ddbourgin/numpy-ml", tmp],
            check=True, capture_output=True, text=True, timeout=300,
        )
    except Exception as e:
        shutil.rmtree(tmp, ignore_errors=True)
        print("clone failed", e)
        return

    readme_sections = {}
    for candidate in (os.path.join(tmp, "README.md"), os.path.join(tmp, "numpy_ml", "README.md")):
        readme_sections = parser.extract_module_readmes(candidate)
        if readme_sections:
            print(f"parsed {len(readme_sections)} sections from {candidate}")
            break

    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM modules WHERE name NOT IN %s", (tuple(parser.NON_ALGO_MODULES),))
    updated = 0
    for mid, name in cur.fetchall():
        readme = readme_sections.get(name, "")
        if readme:
            cur.execute("UPDATE modules SET readme=%s WHERE id=%s", (readme, mid))
            updated += 1
            print(f"updated {name}: {len(readme)} chars")
    conn.close()
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"done, updated {updated} modules")


if __name__ == "__main__":
    main()
