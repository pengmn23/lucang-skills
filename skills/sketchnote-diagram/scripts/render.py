#!/usr/bin/env python3
"""把一份配图 JSON 渲染成 PNG（手绘笔记风，见 sketchnote.html）。

出图：
  python3 render.py specs/P1_01_封面.json                 # 输出到 JSON 里 "output" 指定的位置
  python3 render.py specs/P1_01_封面.json 输出.png        # 指定输出位置
  python3 render.py specs/*.json                           # 一次渲染多份（各自按 "output"）
选项：
  --scale 2     放大倍数，默认 2（默认画布 1600×900 → 3200×1800）
  --svg         同时保存一份 SVG（和 PNG 同名），方便在 Figma、Illustrator 里改
其他命令：
  python3 render.py --check specs/xxx.json          只检查排版（重叠、超出画布），不出图，很快
  python3 render.py --new P1_04_三种学法 [--from 2] [--dir specs] [--output 图片路径]
                                                    从模板新建 <dir>/P1_04_三种学法.json（dir 默认是当前位置的 specs/）；
                                                    不写 --output 时，往上找「P1_*.md」正文，出图位置指向它旁边的同名文件夹
  python3 render.py --edit specs/xxx.json           在 Chrome 里打开编辑器并载入这份 JSON（拖动、点选修改）
  python3 render.py --templates                     把 模板/ 里的 JSON 打包成 templates.js（改了模板以后跑一次）
  python3 render.py --list-templates                列出可用的模板
原理：用本机的 Google Chrome 无界面打开 sketchnote.html#spec=<JSON>，截图保存。
"""
import base64, json, os, re, subprocess, sys, tempfile, html
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOOL = HERE / "sketchnote.html"
CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
]


def chrome():
    for c in CHROME_CANDIDATES:
        if Path(c).exists():
            return c
    sys.exit("找不到 Google Chrome 或 Microsoft Edge，请先安装。")


def check(spec, src):
    ids = {n.get("id") for n in spec.get("nodes", [])}
    for e in spec.get("edges", []):
        for k in ("from", "to"):
            if e.get(k) not in ids:
                sys.exit(f"{src}：连线 {e.get('from')} → {e.get('to')} 里的节点 {e.get(k)} 不存在")
    for n in spec.get("nodes", []):
        if n.get("type") not in ("input", "produce", "feedback"):
            sys.exit(f"{src}：节点 {n.get('id')} 的 type 只能是 input / produce / feedback")


def b64url(spec):
    return base64.urlsafe_b64encode(json.dumps(spec, ensure_ascii=False).encode("utf-8")).decode().rstrip("=")


def check_only(spec_path):
    spec = json.loads(Path(spec_path).read_text(encoding="utf-8"))
    check(spec, spec_path)
    cv = spec.get("canvas", {})
    W, H = cv.get("width", 1600), cv.get("height", 900)
    with tempfile.TemporaryDirectory() as prof:
        dom = run([chrome(), "--headless=new", "--disable-gpu", f"--user-data-dir={prof}", "--allow-file-access-from-files",
                   f"--window-size={W},{H}", "--virtual-time-budget=6000", "--dump-dom", TOOL.as_uri() + "#spec=" + b64url(spec)]).stdout
    if 'data-done="error"' in dom:
        m = re.search(r'data-error="([^"]*)"', dom)
        print(f"{spec_path}：渲染出错：{html.unescape(m.group(1)) if m else '未知错误'}"); return 1
    m = re.search(r'data-warn="([^"]*)"', dom)
    warns = json.loads(html.unescape(m.group(1))) if m else []
    print(f"{spec_path}：{'没有提醒 ✓' if not warns else str(len(warns)) + ' 处提醒'}")
    for w in warns:
        print(f"  提醒：{w}")
    return 1 if warns else 0


TPL_DIR = HERE / "模板"


def templates():
    out = []
    for f in sorted(TPL_DIR.glob("*.json")):
        d = json.loads(f.read_text(encoding="utf-8"))
        name, desc = d.pop("模板名", f.stem), d.pop("模板说明", "")
        out.append({"name": name, "desc": desc, "file": f.name, "spec": d})
    return out


def build_templates():
    ts = templates()
    js = "/* 自动生成：python3 render.py --templates（来源：模板/*.json）。不要手改这个文件。 */\nwindow.SKETCH_TEMPLATES = " + json.dumps(ts, ensure_ascii=False, indent=1) + ";\n"
    (HERE / "templates.js").write_text(js, encoding="utf-8")
    print(f"已打包 {len(ts)} 个模板到 templates.js：" + "、".join(t["name"] for t in ts))


def find_chapter(chap, specs_dir):
    """往上找「<章节号>_*.md」的正文笔记（在上面几层文件夹的下一层里）。"""
    for up in [specs_dir, *list(specs_dir.parents)[:4]]:
        for md in sorted(up.glob("*/" + chap + "_*.md")):
            if specs_dir not in md.parents:
                return md
    return None


def new_spec(name, pick, specs_dir, output):
    ts = templates()
    if not ts:
        sys.exit("模板/ 文件夹里没有模板")
    t = None
    if pick is None:
        t = ts[0]
    elif pick.isdigit() and int(pick) < len(ts):
        t = ts[int(pick)]
    else:
        t = next((x for x in ts if pick in x["name"] or pick in x["file"]), None)
    if not t:
        sys.exit("找不到模板：" + pick + "。可用的：" + "；".join(f"{i} {x['name']}" for i, x in enumerate(ts)))
    specs_dir = Path(specs_dir).resolve()
    specs_dir.mkdir(parents=True, exist_ok=True)
    head = {"说明": "【这张图讲什么、放在正文哪里】"}
    if output:
        head["output"] = output
    else:
        m = re.match(r"([A-Za-z]?\d+)_(\d+)_", name)
        md = find_chapter(m.group(1), specs_dir) if m else None
        if md:
            head["output"] = os.path.relpath(md.parent / md.stem / f"{m.group(2)}.png", specs_dir)
    spec = {**head, **t["spec"]}
    dst = specs_dir / (name + ".json")
    if dst.exists():
        sys.exit(f"{dst.name} 已经存在，换个名字")
    dst.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"已从模板「{t['name']}」新建：{dst}")
    if "output" in spec:
        print(f"  出图位置：{spec['output']}（相对这份 JSON）")
    else:
        print("  提醒：没有设置 output。出图前在 JSON 里补上，或新建时加 --output <图片路径>")


def open_editor(spec_path):
    spec = json.loads(Path(spec_path).read_text(encoding="utf-8"))
    from urllib.parse import quote
    url = TOOL.as_uri() + "#edit&file=" + quote(Path(spec_path).name) + "&spec=" + b64url(spec)
    subprocess.Popen([chrome(), url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"已在 Chrome 里打开编辑器：{Path(spec_path).name}。改完按 ⌘S，选择存回 {spec_path}")


def run(args, timeout=60):
    return subprocess.run(args, capture_output=True, text=True, timeout=timeout)


def render_one(spec_path, out_path, scale, want_svg):
    spec = json.loads(Path(spec_path).read_text(encoding="utf-8"))
    check(spec, spec_path)
    cv = spec.get("canvas", {})
    W, H = cv.get("width", 1600), cv.get("height", 900)  # 默认 16:9
    if out_path is None:
        if not spec.get("output"):
            sys.exit(f"{spec_path}：没有指定输出位置（命令行第二个参数，或 JSON 里的 \"output\"）")
        out_path = (Path(spec_path).resolve().parent / spec["output"]).resolve()
    out_path = Path(out_path).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    url = TOOL.as_uri() + "#spec=" + b64url(spec)
    with tempfile.TemporaryDirectory() as prof:
        base = [chrome(), "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                "--no-default-browser-check", f"--user-data-dir={prof}", "--allow-file-access-from-files",
                f"--window-size={W},{H}", f"--force-device-scale-factor={scale}", "--virtual-time-budget=6000"]
        dom = run(base + ["--dump-dom", url]).stdout
        if 'data-done="error"' in dom:
            m = re.search(r'data-error="([^"]*)"', dom)
            sys.exit(f"{spec_path}：渲染出错：{html.unescape(m.group(1)) if m else '未知错误'}")
        m = re.search(r'data-warn="([^"]*)"', dom)
        warns = json.loads(html.unescape(m.group(1))) if m else []
        r = run(base + [f"--screenshot={out_path}", url])
        if not out_path.exists():
            sys.exit(f"{spec_path}：截图失败\n{r.stderr[-800:]}")
        if want_svg:
            m = re.search(r"<svg[\s\S]*?</svg>", dom)
            if m:
                out_path.with_suffix(".svg").write_text(m.group(0), encoding="utf-8")
    print(f"已生成：{out_path}（{W * scale}×{H * scale}）")
    for w in warns:
        print(f"  提醒：{w}")


def main():
    args = sys.argv[1:]
    if args[:1] == ["--templates"]:
        return build_templates()
    if args[:1] == ["--list-templates"]:
        for i, t in enumerate(templates()):
            print(f"{i}  {t['name']}：{t['desc']}")
        return
    if args[:1] == ["--new"] and len(args) >= 2:
        opt = lambda k, d=None: args[args.index(k) + 1] if k in args else d
        return new_spec(args[1], opt("--from"), opt("--dir", "specs"), opt("--output"))
    if args[:1] == ["--edit"] and len(args) == 2:
        return open_editor(args[1])
    if args[:1] == ["--check"]:
        sys.exit(max([check_only(a) for a in args[1:] if a.endswith(".json")] or [0]))
    scale, want_svg = 2, False
    if "--scale" in args:
        i = args.index("--scale"); scale = float(args[i + 1]); del args[i:i + 2]
        scale = int(scale) if scale.is_integer() else scale
    if "--svg" in args:
        want_svg = True; args.remove("--svg")
    if not args:
        sys.exit(__doc__)
    specs = [a for a in args if a.endswith(".json")]
    outs = [a for a in args if not a.endswith(".json")]
    if outs and len(specs) != 1:
        sys.exit("指定输出位置时，一次只能渲染一份 JSON")
    for s in specs:
        render_one(s, outs[0] if outs else None, scale, want_svg)


if __name__ == "__main__":
    main()
