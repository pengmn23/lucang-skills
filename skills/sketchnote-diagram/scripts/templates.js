/* 自动生成：python3 render.py --templates（来源：模板/*.json）。不要手改这个文件。 */
window.SKETCH_TEMPLATES = [
 {
  "name": "空白横版（16:9）",
  "desc": "只有标题、三种节点各一个、图例、清单和署名，从这里自己搭。",
  "file": "00_空白横版.json",
  "spec": {
   "canvas": {
    "width": 1600,
    "height": 900,
    "seed": 7
   },
   "title": {
    "lines": [
     "标题写在这里，最关键的几个字高亮"
    ],
    "x": 48,
    "y": 74,
    "size": 64,
    "mark": "最关键的几个字",
    "maxWidth": 1150
   },
   "subtitle": {
    "text": "ENGLISH SUBTITLE",
    "x": 330,
    "y": 152,
    "size": 28
   },
   "nodes": [
    {
     "id": "in1",
     "type": "input",
     "x": 200,
     "y": 470,
     "size": 130,
     "icon": "bulb",
     "label": "输入",
     "note": "资料、想法"
    },
    {
     "id": "do1",
     "type": "produce",
     "x": 560,
     "y": 470,
     "size": 130,
     "icon": "pen",
     "label": "生产",
     "note": "做出来的东西"
    },
    {
     "id": "fb1",
     "type": "feedback",
     "x": 920,
     "y": 470,
     "size": 130,
     "icon": "check",
     "label": "反馈",
     "note": "检查、复盘"
    }
   ],
   "edges": [
    {
     "from": "in1",
     "to": "do1",
     "bend": 0
    },
    {
     "from": "do1",
     "to": "fb1",
     "bend": 0
    }
   ],
   "legend": {
    "x": 1110,
    "y": 230,
    "w": 460,
    "rowH": 42,
    "arrowText": "箭头=先后顺序"
   },
   "blocks": [
    {
     "kind": "list",
     "title": "关键关系",
     "x": 1110,
     "y": 520,
     "w": 460,
     "rowH": 48,
     "size": 22,
     "items": [
      "第一条",
      "第二条",
      "第三条"
     ]
    }
   ]
  }
 },
 {
  "name": "流程闭环（16:9）",
  "desc": "几个步骤连成一圈，左边进、右边出，底下绕回来；右侧栏放图例、清单和边界说明。",
  "file": "01_流程闭环.json",
  "spec": {
   "canvas": {
    "width": 1600,
    "height": 900,
    "seed": 21
   },
   "title": {
    "lines": [
     "AI 作图，真正要学的不是提示词，是一套方法"
    ],
    "x": 48,
    "y": 74,
    "size": 64,
    "mark": "是一套方法",
    "maxWidth": 1150
   },
   "subtitle": {
    "text": "FOUR CORE METHODS",
    "x": 330,
    "y": 152,
    "size": 28
   },
   "nodes": [
    {
     "id": "idea",
     "type": "input",
     "x": 150,
     "y": 320,
     "size": 130,
     "icon": "bulb",
     "label": "想法",
     "note": "讲什么\n给谁看"
    },
    {
     "id": "content",
     "type": "input",
     "x": 150,
     "y": 640,
     "size": 130,
     "icon": "book",
     "label": "内容",
     "note": "先有对的内容\n才有对的图"
    },
    {
     "id": "prompt",
     "type": "produce",
     "x": 520,
     "y": 440,
     "size": 140,
     "w": 210,
     "icon": "list",
     "label": "结构化提示词",
     "note": "把要求一项一项说清楚",
     "notePos": "above"
    },
    {
     "id": "draw",
     "type": "produce",
     "x": 900,
     "y": 440,
     "size": 140,
     "icon": "image",
     "label": "出图",
     "note": "AI 负责画"
    },
    {
     "id": "judge",
     "type": "feedback",
     "x": 900,
     "y": 735,
     "size": 140,
     "icon": "eye",
     "label": "判断",
     "note": "对不对\n好不好",
     "notePos": "right"
    },
    {
     "id": "tweak",
     "type": "feedback",
     "x": 520,
     "y": 735,
     "size": 140,
     "w": 190,
     "icon": "loop",
     "label": "只改一处",
     "note": "改一处\n看一次变化",
     "notePos": "left"
    }
   ],
   "edges": [
    {
     "from": "idea",
     "to": "prompt",
     "bend": -0.08
    },
    {
     "from": "content",
     "to": "prompt",
     "bend": 0.08
    },
    {
     "from": "prompt",
     "to": "draw",
     "bend": 0
    },
    {
     "from": "draw",
     "to": "judge",
     "bend": 0
    },
    {
     "from": "judge",
     "to": "tweak",
     "bend": 0
    },
    {
     "from": "tweak",
     "to": "prompt",
     "bend": 0,
     "label": "最小闭环",
     "labelColor": "mint",
     "labelDx": 72,
     "labelRotate": -6
    }
   ],
   "notes": [
    {
     "text": "开口之前，先想清楚！",
     "x": 238,
     "y": 236,
     "size": 22,
     "rotate": -5
    },
    {
     "text": "改不好，\n别急着重新抽卡！",
     "x": 660,
     "y": 605,
     "size": 21,
     "rotate": -5
    }
   ],
   "blocks": [
    {
     "kind": "sign",
     "title": "边界说明",
     "x": 1240,
     "y": 12,
     "w": 330,
     "text": "AI 画得很快，\n但它不会替你负责。",
     "size": 21
    },
    {
     "kind": "list",
     "title": "四条底层方法",
     "x": 1110,
     "y": 556,
     "w": 460,
     "h": 0,
     "rowH": 48,
     "size": 22,
     "items": [
      "用结构化的提示词作图",
      "内容先行",
      "先走完最小闭环，一次只改一处",
      "AI 负责画，你负责判断"
     ]
    }
   ],
   "legend": {
    "x": 1110,
    "y": 274,
    "w": 460,
    "rowH": 42,
    "items": [
     {
      "type": "input",
      "text": "蓝=输入",
      "desc": "想法和内容"
     },
     {
      "type": "produce",
      "text": "橙=生产",
      "desc": "提示词和出图"
     },
     {
      "type": "feedback",
      "text": "绿=反馈",
      "desc": "判断和修改"
     }
    ],
    "arrowText": "箭头=先后顺序"
   },
   "doodles": [
    {
     "type": "sparkle",
     "x": 70,
     "y": 225,
     "s": 0.7
    },
    {
     "type": "star",
     "x": 1070,
     "y": 600,
     "s": 0.7
    }
   ]
  }
 },
 {
  "name": "上下两组对比（16:9）",
  "desc": "两个分组框，上面一组、下面一组，各自装几个节点；右侧栏放图例和关键关系。",
  "file": "02_两栏分组.json",
  "spec": {
   "canvas": {
    "width": 1600,
    "height": 900,
    "seed": 32
   },
   "title": {
    "lines": [
     "AI 拿走了手艺门槛，留下了想法门槛"
    ],
    "x": 48,
    "y": 74,
    "size": 64,
    "mark": "留下了想法门槛",
    "maxWidth": 1150
   },
   "subtitle": {
    "text": "CRAFT GOES, IDEAS STAY",
    "x": 330,
    "y": 152,
    "size": 28
   },
   "blocks": [
    {
     "kind": "sticky",
     "x": 1270,
     "y": 26,
     "w": 270,
     "h": 150,
     "text": "就像拍照：\n人人都会按快门，\n拍得好看的\n还是那么几个人",
     "size": 19,
     "rotate": 3
    },
    {
     "kind": "box",
     "title": "手艺门槛",
     "x": 30,
     "y": 195,
     "w": 1050,
     "h": 290,
     "titleColor": "orange"
    },
    {
     "kind": "box",
     "title": "想法门槛",
     "x": 30,
     "y": 505,
     "w": 1050,
     "h": 370,
     "titleColor": "blue"
    },
    {
     "kind": "list",
     "title": "关键关系",
     "x": 1110,
     "y": 510,
     "w": 460,
     "rowH": 50,
     "size": 21,
     "items": [
      "手艺门槛：AI 把「画」接了过去",
      "想法门槛：还在，而且更重要",
      "跨过想法门槛，靠的是方法"
     ]
    }
   ],
   "legend": {
    "x": 1110,
    "y": 228,
    "w": 460,
    "rowH": 42,
    "items": [
     {
      "type": "input",
      "text": "蓝=输入",
      "desc": "讲什么、给谁看"
     },
     {
      "type": "produce",
      "text": "橙=生产",
      "desc": "画出来"
     },
     {
      "type": "feedback",
      "text": "绿=反馈",
      "desc": "对不对、好不好"
     }
    ],
    "arrowText": "箭头=先后顺序"
   },
   "nodes": [
    {
     "id": "draw",
     "type": "produce",
     "x": 150,
     "y": 335,
     "size": 110,
     "icon": "brush",
     "label": "画画",
     "note": "以前得会画画"
    },
    {
     "id": "ai",
     "type": "produce",
     "x": 555,
     "y": 335,
     "size": 130,
     "icon": "wand",
     "label": "AI 来画",
     "note": "这道门槛几乎没有了"
    },
    {
     "id": "soft",
     "type": "produce",
     "x": 960,
     "y": 335,
     "size": 110,
     "icon": "palette",
     "label": "设计软件",
     "note": "或者会用设计软件"
    },
    {
     "id": "what",
     "type": "input",
     "x": 140,
     "y": 615,
     "size": 100,
     "icon": "chat",
     "label": "讲什么",
     "note": "这张图要讲什么？",
     "notePos": "right"
    },
    {
     "id": "who",
     "type": "input",
     "x": 140,
     "y": 790,
     "size": 100,
     "icon": "user",
     "label": "给谁看",
     "note": "给谁看？",
     "notePos": "right"
    },
    {
     "id": "clear",
     "type": "produce",
     "x": 590,
     "y": 690,
     "size": 130,
     "w": 160,
     "icon": "list",
     "label": "讲清楚",
     "note": "怎么讲才清楚？"
    },
    {
     "id": "judge",
     "type": "feedback",
     "x": 920,
     "y": 690,
     "size": 130,
     "w": 160,
     "icon": "check",
     "label": "判断",
     "note": "画出来以后，\n对不对、好不好？"
    }
   ],
   "edges": [
    {
     "from": "draw",
     "to": "ai",
     "bend": 0,
     "label": "交给 AI",
     "labelColor": "mint",
     "labelDy": -30
    },
    {
     "from": "soft",
     "to": "ai",
     "bend": 0,
     "label": "交给 AI",
     "labelColor": "mint",
     "labelDy": -30
    },
    {
     "from": "what",
     "to": "clear",
     "bend": -0.06
    },
    {
     "from": "who",
     "to": "clear",
     "bend": 0.06
    },
    {
     "from": "clear",
     "to": "judge",
     "bend": 0
    },
    {
     "from": "ai",
     "to": "judge",
     "bend": -0.1,
     "dash": true
    }
   ],
   "notes": [
    {
     "text": "挡住了很多人",
     "x": 280,
     "y": 238,
     "size": 21,
     "rotate": -4
    },
    {
     "text": "变得更重要了！",
     "x": 280,
     "y": 548,
     "size": 21,
     "rotate": -4
    }
   ],
   "doodles": [
    {
     "type": "exclaim",
     "x": 460,
     "y": 548,
     "s": 0.6
    },
    {
     "type": "sparkle",
     "x": 1250,
     "y": 200,
     "s": 0.6
    }
   ]
  }
 },
 {
  "name": "四步循环（16:9）",
  "desc": "四个节点围成一圈，中间一句高亮的话；右侧栏放图例、清单和一句结论。",
  "file": "03_四步循环.json",
  "spec": {
   "canvas": {
    "width": 1600,
    "height": 900,
    "seed": 43
   },
   "title": {
    "lines": [
     "方法有了，怎么学？我的四条建议"
    ],
    "x": 48,
    "y": 74,
    "size": 64,
    "mark": "我的四条建议",
    "maxWidth": 1150
   },
   "subtitle": {
    "text": "LEARN BY DOING",
    "x": 300,
    "y": 152,
    "size": 28
   },
   "legend": {
    "x": 1110,
    "y": 200,
    "w": 460,
    "rowH": 42,
    "items": [
     {
      "type": "input",
      "text": "蓝=输入",
      "desc": "问 AI"
     },
     {
      "type": "produce",
      "text": "橙=生产",
      "desc": "做和说"
     },
     {
      "type": "feedback",
      "text": "绿=反馈",
      "desc": "记录"
     }
    ],
    "arrowText": "箭头=顺序"
   },
   "nodes": [
    {
     "id": "do",
     "type": "produce",
     "x": 250,
     "y": 300,
     "size": 130,
     "icon": "pen",
     "label": "先做",
     "note": "先做出一张图，\n再学原理"
    },
    {
     "id": "talk",
     "type": "produce",
     "x": 850,
     "y": 300,
     "size": 130,
     "icon": "chat",
     "label": "多对话",
     "note": "带着目标，\n想好下一句怎么说"
    },
    {
     "id": "ask",
     "type": "input",
     "x": 850,
     "y": 650,
     "size": 130,
     "icon": "search",
     "label": "问 AI",
     "note": "怎样才算好？\n直接问它"
    },
    {
     "id": "log",
     "type": "feedback",
     "x": 250,
     "y": 650,
     "size": 130,
     "w": 160,
     "icon": "checklist",
     "label": "留下记录",
     "note": "提示词、图、\n你的评价"
    }
   ],
   "edges": [
    {
     "from": "do",
     "to": "talk",
     "bend": -0.06
    },
    {
     "from": "talk",
     "to": "ask",
     "bend": -0.08
    },
    {
     "from": "ask",
     "to": "log",
     "bend": -0.06
    },
    {
     "from": "log",
     "to": "do",
     "bend": -0.08,
     "label": "再做一张",
     "labelColor": "mint",
     "labelDx": -14,
     "labelDy": 22
    }
   ],
   "notes": [
    {
     "text": "先做出来，\n你才知道自己卡在哪里！",
     "x": 550,
     "y": 480,
     "size": 26,
     "anchor": "middle",
     "highlight": "yellow"
    },
    {
     "text": "把 AI 当成你的老师",
     "x": 1000,
     "y": 480,
     "size": 20,
     "rotate": -4,
     "anchor": "middle"
    }
   ],
   "blocks": [
    {
     "kind": "list",
     "title": "每做一张图，存三样",
     "x": 1110,
     "y": 482,
     "w": 460,
     "rowH": 46,
     "size": 22,
     "items": [
      "提示词",
      "生成的图",
      "你对这张图的评价"
     ]
    },
    {
     "kind": "box",
     "title": "作品和能力",
     "icon": "star",
     "x": 1110,
     "y": 732,
     "w": 460,
     "h": 140,
     "titleColor": "mint",
     "text": "只存漂亮的图片，积累的是作品；\n三样都存，积累的才是能力。",
     "size": 19,
     "textY": 100,
     "titleSize": 30
    }
   ],
   "doodles": [
    {
     "type": "bulb",
     "x": 550,
     "y": 215,
     "s": 0.7
    },
    {
     "type": "sparkle",
     "x": 110,
     "y": 200,
     "s": 0.7
    }
   ]
  }
 },
 {
  "name": "竖版 3:4（小红书）",
  "desc": "上标题、中主图、下总结区，适合小红书等竖版平台。",
  "file": "04_竖版_3比4.json",
  "spec": {
   "canvas": {
    "width": 1200,
    "height": 1600,
    "seed": 3
   },
   "title": {
    "lines": [
     "一篇图文笔记，",
     "从灵感到复盘要连接哪些节点？"
    ],
    "x": 52,
    "y": 88,
    "size": 78,
    "highlight": [
     0
    ],
    "maxWidth": 900
   },
   "subtitle": {
    "text": "CONTENT WORKFLOW NETWORK",
    "x": 560,
    "y": 272,
    "size": 34
   },
   "legend": {
    "x": 870,
    "y": 318,
    "w": 300,
    "h": 360,
    "items": [
     {
      "type": "input",
      "text": "蓝=输入",
      "desc": "提供灵感\n和信息"
     },
     {
      "type": "produce",
      "text": "橙=生产",
      "desc": "内容创作\n与产出"
     },
     {
      "type": "feedback",
      "text": "绿=反馈",
      "desc": "复盘总结\n与可复用"
     }
    ],
    "rowH": 72,
    "arrowText": "箭头=依赖方向",
    "arrowDesc": "表示先后依赖关系"
   },
   "nodes": [
    {
     "id": "lg",
     "type": "input",
     "x": 262,
     "y": 395,
     "size": 160,
     "icon": "bulb",
     "label": "灵感",
     "note": "一个想法\n一丝触动"
    },
    {
     "id": "ly",
     "type": "input",
     "x": 545,
     "y": 395,
     "size": 160,
     "icon": "doc",
     "label": "来源",
     "note": "书籍 / 经验 / 热点\n用户问题 / 日常观察"
    },
    {
     "id": "xt",
     "type": "produce",
     "x": 300,
     "y": 660,
     "size": 150,
     "icon": "target",
     "label": "选题",
     "note": "从灵感和信息中\n找到值得写的主题",
     "notePos": "below"
    },
    {
     "id": "wz",
     "type": "produce",
     "x": 520,
     "y": 680,
     "size": 150,
     "icon": "pen",
     "label": "文章",
     "note": "整理思路\n写成图文"
    },
    {
     "id": "ts",
     "type": "produce",
     "x": 760,
     "y": 760,
     "size": 150,
     "w": 190,
     "icon": "image",
     "label": "出图提示词",
     "note": "把想法转化为\n可生成的提示词"
    },
    {
     "id": "tp",
     "type": "produce",
     "x": 1000,
     "y": 790,
     "size": 150,
     "icon": "image",
     "label": "图片",
     "note": "生成或准备\n配图素材"
    },
    {
     "id": "fb",
     "type": "produce",
     "x": 750,
     "y": 1000,
     "size": 150,
     "icon": "plane",
     "label": "发布",
     "note": "让内容被更多人看到",
     "notePos": "left"
    },
    {
     "id": "fp",
     "type": "feedback",
     "x": 750,
     "y": 1185,
     "size": 150,
     "icon": "chart",
     "label": "复盘",
     "note": "看效果、找问题\n总结经验"
    },
    {
     "id": "mb",
     "type": "feedback",
     "x": 1045,
     "y": 1185,
     "size": 150,
     "icon": "layers",
     "label": "内部模板",
     "note": "沉淀方法\n形成可复用的模板"
    }
   ],
   "edges": [
    {
     "from": "lg",
     "to": "xt",
     "bend": 0.05
    },
    {
     "from": "ly",
     "to": "xt",
     "bend": 0.12
    },
    {
     "from": "ly",
     "to": "wz",
     "bend": -0.12
    },
    {
     "from": "xt",
     "to": "wz",
     "bend": 0
    },
    {
     "from": "wz",
     "to": "ts",
     "bend": 0.12
    },
    {
     "from": "ts",
     "to": "tp",
     "bend": 0
    },
    {
     "from": "wz",
     "to": "fb",
     "bend": 0.2
    },
    {
     "from": "tp",
     "to": "fb",
     "bend": -0.2
    },
    {
     "from": "fb",
     "to": "fp",
     "bend": 0
    },
    {
     "from": "fp",
     "to": "mb",
     "bend": 0
    },
    {
     "from": "fp",
     "to": "xt",
     "ctrl": [
      420,
      1040
     ],
     "label": "复盘返回选题\n让下一篇更好！",
     "labelAt": 0.3,
     "labelColor": "mint",
     "labelDy": -14
    }
   ],
   "notes": [
    {
     "text": "从一个灵感开始，\n让好内容不断循环\n生长！",
     "x": 12,
     "y": 555,
     "size": 22,
     "rotate": -8
    },
    {
     "text": "好想法\n也能变成\n有价值的内容！",
     "x": 965,
     "y": 62,
     "size": 22,
     "rotate": -4
    },
    {
     "text": "发布不是终点，\n而是下一次创作\n的起点！",
     "x": 960,
     "y": 1010,
     "size": 24,
     "rotate": -6
    }
   ],
   "blocks": [
    {
     "kind": "sticky",
     "x": 1015,
     "y": 150,
     "w": 150,
     "h": 120,
     "text": "记录\n→创作\n→成长",
     "rotate": 6
    },
    {
     "kind": "list",
     "title": "关键关系",
     "x": 26,
     "y": 1108,
     "w": 560,
     "h": 250,
     "items": [
      "来源同时支持选题与文章",
      "文章和图片共同进入发布",
      "复盘返回选题"
     ]
    },
    {
     "kind": "loop",
     "title": "关键回路",
     "x": 26,
     "y": 1380,
     "w": 710,
     "h": 150,
     "flow": "选题 → 文章 → 出图提示词 → 图片 → 发布 → 复盘",
     "desc": "形成从灵感到复盘的完整闭环，让内容持续迭代、不断变好。"
    },
    {
     "kind": "sign",
     "title": "边界说明",
     "x": 800,
     "y": 1352,
     "w": 320,
     "h": 205,
     "text": "通用教学示例\n不是平台官方唯一流程。"
    }
   ],
   "doodles": [
    {
     "type": "bulb",
     "x": 70,
     "y": 300,
     "s": 0.8
    },
    {
     "type": "sparkle",
     "x": 920,
     "y": 300,
     "s": 0.8
    },
    {
     "type": "sparkle",
     "x": 1150,
     "y": 1000,
     "s": 0.8
    }
   ]
  }
 }
];
