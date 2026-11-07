# JSON 写法

**默认画布 1600×900（16:9）**，出图 3200×1800。要 3:4 竖版就写 `"canvas": {"width": 1200, "height": 1600}`。坐标都是像素，原点在左上角；节点的 `x`、`y` 是中心点。

16:9 的常用分区：标题一行 `y≈74`，副标题 `y≈152`；主图区 `x 30–1080`、`y 190–880`；右侧栏 `x 1110–1570`，从上到下放图例、关键关系、便利贴或边界说明；署名放左下角 `(40, 862)` 或侧栏底部 `(1120, 852)`。

```json
{
  "说明": "给人看的备注，不画出来",
  "output": "../正文/<章节文件名>/01.png",
  "canvas": { "width": 1600, "height": 900, "seed": 7 },
  "title": { "lines": ["一行标题"], "x": 48, "y": 74, "size": 64, "mark": "要高亮的几个字", "maxWidth": 1150 },
  "subtitle": { "text": "ENGLISH SUBTITLE", "x": 330, "y": 152, "size": 28 },
  "nodes": [ { "id": "a", "type": "input", "x": 210, "y": 470, "size": 160, "icon": "bulb", "label": "想法", "note": "讲什么\n给谁看" } ],
  "edges": [ { "from": "a", "to": "b", "bend": 0.1, "label": "可选标签" } ],
  "notes": [ { "text": "手写批注", "x": 300, "y": 380, "size": 24, "rotate": -6 } ],
  "blocks": [ { "kind": "list", "title": "关键关系", "x": 1110, "y": 520, "w": 460, "rowH": 48, "size": 22, "items": ["……"] } ],
  "legend": { "x": 1110, "y": 230, "w": 460, "rowH": 42, "items": [ { "type": "input", "text": "蓝=输入", "desc": "……" } ], "arrowText": "箭头=先后顺序" },
  "doodles": [ { "type": "sparkle", "x": 120, "y": 360, "s": 0.8 } ],
  "signature": { "text": "你的署名", "x": 40, "y": 862 }
}
```

## 各部分的字段

| 部分 | 字段 | 说明 |
|---|---|---|
| `canvas` | `width` `height` `seed` | `seed` 是随机种子，换一个数字，手抖的样子就变一下 |
| `title` | `lines` `x` `y` `size` `mark` `highlight` `maxWidth` | `mark` 只高亮标题里的某几个字；不写 `mark` 时，`highlight` 是整行高亮的行号（从 0 数）；超过 `maxWidth` 自动缩小 |
| `subtitle` | `text` `x` `y` `size` `band` | 英文副标题，`band` 是高亮颜色，默认粉色 |
| `nodes` | `id` `type` `x` `y` `size` `w` `icon` `label` `note` `notePos` `noteDx` `noteDy` `labelSize` | `type`：`input` / `produce` / `feedback`；`w` 让方块、六边形变宽；`note` 是下面的说明块，`notePos` 可选 `below`（默认）、`above`、`left`、`right` |
| `edges` | `from` `to` `bend` `ctrl` `label` `labelAt` `labelDx` `labelDy` `labelColor` `labelRotate` `dash` `both` `arrow` | `bend` 是弯曲程度（正负决定往哪边弯）；`ctrl: [x, y]` 直接指定弯曲的控制点；`dash: true` 画虚线 |
| `notes` | `text` `x` `y` `size` `rotate` `anchor` `highlight` `arrow` | 手写批注；`anchor` 可选 `start`、`middle`、`end`；`arrow: [x, y, 角度]` 加一个小箭头 |
| `blocks` | `kind` 和各自的字段 | 见下表 |
| `legend` | `x` `y` `w` `rowH` `items` `arrowText` `arrowDesc` | 节点图例，高度按行数自动算 |
| `doodles` | `type` `x` `y` `s` | 小涂鸦，`s` 是大小倍数 |
| `signature` | `text` `x` `y` `tagline` | 可选的署名，不写就不画；`text` 是署名文字，`tagline` 是署名上方的一行小字 |

## 版块（blocks 的 kind）

| kind | 用途 | 字段 |
|---|---|---|
| `list` | 关键关系、要点清单（带彩色编号）；装不下自动加高 | `title` `icon` `x` `y` `w` `h` `items` `rowH` `size` |
| `loop` | 关键回路（一行流程压荧光黄） | `title` `x` `y` `w` `h` `flow` `desc`；文字太长自动缩小 |
| `sign` | 边界说明路牌 | `title` `x` `y` `w` `text`；高度按文字自动算 |
| `sticky` | 黄色便利贴 | `x` `y` `w` `h` `text` `rotate` `color` |
| `box` | 虚线框：有 `text` 是文字框；没有 `text` 是装节点的分组框（不查重叠） | `title` `titleColor` `icon` `x` `y` `w` `h` `text` `textX` `textY` `size` `fill` |

## 图标（nodes 的 icon）

`bulb` 灯泡、`doc` 文档、`target` 靶心、`pen` 笔、`image` 图片、`plane` 纸飞机、`chart` 柱状图、`layers` 叠层、`check` 对勾、`checklist` 清单、`chat` 对话、`search` 放大镜、`loop` 循环、`eye` 眼睛、`palette` 调色盘、`list` 列表、`book` 书、`user` 人、`flag` 旗子、`braces` 大括号、`camera` 相机、`wand` 魔法棒、`hand` 手、`brush` 画笔、`star` 星星、`key` 钥匙。

## 小涂鸦（doodles 的 type）

`bulb` 发光灯泡、`sparkle` 闪光、`star` 星星、`exclaim` 感叹号、`pin` 图钉、`grass` 小草、`megaphone` 喇叭、`link` 链条、`warn` 警示三角、`arrow` 小箭头（加 `angle`）、`heart` 爱心。

## 颜色名（highlight、band、labelColor、titleColor）

`yellow` 荧光黄、`pink` 樱花粉、`mint` 薄荷绿、`blue` 浅蓝、`orange` 浅橙、`green` 浅绿。

# 已知的局限

- 代码画的手绘风，比生图模型出的更规整，图标也更简单。要更自然的手绘质感，用生图模型出图（风格规定里的关键词）。
- 「导出 PNG」走的是浏览器，存到「下载」文件夹；正式出图用 `render.py`。
- 「保存回原文件」需要 Chrome；用 Safari 打开时，保存会变成下载。
- 中文换行要自己写（JSON 里写 `\n`，双击改文字时用「/」），不会自动折行。
- 切换 16:9 和 3:4 时，元素位置不会自动换算，要按提醒重新排。
