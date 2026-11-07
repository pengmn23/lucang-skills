---
name: sketchnote-diagram
description: >
  用代码画手绘笔记风（sketchnote）的中文教学配图：写一份 JSON（标题、蓝圆输入 / 橙方生产 / 绿六边形反馈节点、
  箭头、批注、图例、清单、便利贴），scripts/render.py 用本机 Chrome 出 PNG，图里每个字都来自 JSON，不会写错字。
  适合字多、要反复改的教程图解、流程图、对比图、封面；默认 16:9（3200×1800），竖版平台用 3:4。
  也能在浏览器里打开编辑器，让用户拖动、双击改字、⌘S 存回。
  触发语："用配图工具画一张图""给这一章配图""画一张手绘笔记风的图""把这段做成图解""改一下这张配图的 JSON""出一下配图"。
  需要 macOS（系统自带手写字体）和 Google Chrome。
license: MIT
metadata:
  version: "1.0.0"
  author: 陆苍
  repository: https://github.com/pengmn23/lucang-skills
---

# 手绘笔记风配图（代码画图）

一张图 = 一份 JSON。`scripts/render.py` 用本机的 Google Chrome（或 Microsoft Edge）无界面打开 `scripts/sketchnote.html`，按 JSON 画好后截图。文字全部来自 JSON，所以不会出错字；代价是比生图模型规整一些。

需要：macOS 自带的「手札体」（Hannotate SC）和「翩翩体」（HanziPen SC），Google Chrome，Python 3（只用标准库）。

## 文件

| 位置 | 是什么 | 什么时候读 |
|---|---|---|
| `scripts/render.py` | 命令行：新建、检查、出图、打开编辑器 | 每次 |
| `scripts/sketchnote.html`、`editor.js` | 画图程序和浏览器编辑器 | 不用读，render.py 会调用 |
| `scripts/模板/*.json` | 新建图用的 5 个模板 | `--list-templates` 看说明 |
| `scripts/templates.js` | 模板打包给编辑器用，自动生成，不手改 | 改了模板后跑 `--templates` |
| `references/json-format.md` | JSON 每个字段、版块、图标、涂鸦、颜色名，已知局限 | 改 JSON 前 |
| `references/style.md` | 风格规定：版面分区、配色、形状的意思、字数、不要这样画、出图后检查 | 第一次画、定节点类型和字数时 |
| `references/editor.md` | 浏览器编辑器怎么用 | 要交给用户手动调时 |
| `assets/示例/` | 一张 3:4 竖版、一张 16:9 横版（JSON + PNG） | 拿不准排版时对照 |

下面的命令里，`R` 指本 skill 的 `scripts/render.py`（用绝对路径调用）。**每张图的 JSON 和出的图放在用户的项目里，不放进 skill。**

## 命令

```bash
python3 R --list-templates                          # 看有哪些模板
python3 R --new 03_02_字段顺序 --from 1              # 从模板 1 新建 specs/03_02_字段顺序.json（specs 在当前文件夹下）
python3 R --new 封面 --dir specs --output ../图片/封面.png   # 自己指定 JSON 放哪、图出到哪
python3 R --check specs/03_02_字段顺序.json          # 只查排版（重叠、超出画布），几秒；有提醒时退出码 1
python3 R specs/03_02_字段顺序.json --scale 1        # 出 1 倍小图看效果（1600×900）
python3 R specs/03_*.json                           # 出 2 倍正式图（3200×1800），按各自的 output 存
python3 R specs/xxx.json --svg                      # 同时存一份 SVG
python3 R --edit specs/xxx.json                     # 在 Chrome 里打开编辑器，交给用户拖动调整
python3 R --templates                               # 改了 scripts/模板/ 以后重新打包
```

- `--new` 的名字写成 `<章节号>_<图号>_<内容>` 时，会往上几层找 `<章节号>_*.md` 的正文笔记，把 `output` 设成它旁边同名文件夹里的 `<图号>.png`。找不到就不设，出图前补上 `output` 或加 `--output`。
- `output` 是相对这份 JSON 的路径。

## 画一张图的流程

1. **先定这张图讲哪一件事、放在正文哪里。**图里的字只用正文里有的话，不新增说法。字多的图，先在对话里把文案和用户定好，再写 JSON。
2. **选模板**：`--list-templates`，挑结构最接近的（流程闭环、上下两组对比、四步循环、空白横版、竖版 3:4），`--new` 新建。
3. **改 JSON**：照 `references/json-format.md` 换文字和坐标（坐标按 1600×900 估，节点 `x`、`y` 是中心点）。按 `references/style.md` 第五节定每个节点的类型：
   - `input` 蓝圆：资料、想法、灵感、来源
   - `produce` 橙方：做出来的东西、动作
   - `feedback` 绿六边形：检查、复盘、沉淀
   同一张图里同一类东西用同一种形状；放一个图例说明。
4. **`--check` 到没有提醒**，再出 1 倍小图，**实际打开看一眼**：箭头方向、文字有没有被挡、留白是否均匀、字数是否符合 style.md 第六节。排版很难调时，用 `--edit` 交给用户在浏览器里拖，用户 ⌘S 存回后再出图。
5. **出 2 倍正式图**，存到 `output`。
6. **告诉用户放在哪**：每张图放在正文哪一句后面、嵌入写法。

## 注意

- 中文不会自动换行：JSON 里用 `\n`，编辑器里双击改字用「/」。
- 16:9 和 3:4 互换时，元素位置不会自动换算，要按 `--check` 的提醒重排。
- 署名默认不画。用户要署名，在 JSON 里加 `"signature": { "text": "署名", "x": 40, "y": 862 }`；问一次用户想写什么，之后的图沿用。
- 改了 `references/style.md` 里的颜色，`scripts/sketchnote.html` 里的颜色常量也要跟着改。
