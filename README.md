# lucang-skills

两个帮你做中文图文配图的 AI skill。装进 Claude Code、Codex 这类支持 skill 的 AI 工具，直接用一句话说需求就能用。

| Skill | 一句话 |
|---|---|
| [article-to-images](skills/article-to-images/README.md) | 把文章变成生图提示词：做一张或一整套风格统一的图，也能拆解别人的图 |
| [sketchnote-diagram](skills/sketchnote-diagram/SKILL.md) | 用代码画手绘笔记风的流程图、图解，图里的中文一个字都不会错 |

两个怎么选：想要好看、有画面感的图，用 **article-to-images** 写提示词，再交给生图模型；字多、要讲清楚步骤和关系、一个字都不能错，用 **sketchnote-diagram** 直接画。

## 安装

**用 skills 命令行**（需要 Node.js），装的时候选你要的 skill：

```bash
npx skills add pengmn23/lucang-skills
```

**手动装**：下载这个仓库，把 `skills/` 里想用的文件夹放进 AI 工具的 skill 目录：

| 工具 | 只给一个项目用 | 所有项目都能用 |
|---|---|---|
| Claude Code | `<项目>/.claude/skills/` | `~/.claude/skills/` |
| Codex | `<项目>/.agents/skills/` | `~/.codex/skills/` |

```bash
git clone https://github.com/pengmn23/lucang-skills.git
cp -R lucang-skills/skills/article-to-images ~/.claude/skills/
cp -R lucang-skills/skills/sketchnote-diagram ~/.claude/skills/
```

---

## article-to-images：把文章变成生图提示词

给它一篇文章、一份提纲或一句想法，它帮你写好能直接拿去生图的提示词。

- **一张或一套**：一张小红书卡、一页 PPT 配图，或者 10 张风格统一的系列图都行。
- **先问再写**：先让你选风格（三选一）和每张放多少字，选好才动笔，不瞎猜。
- **整套风格稳定**：做一套时先出第 1 张，后面每张都拿它当参考图。
- **拆图**：给它一张图，它分析版式和画法，把图里的字逐字识别出来，反推出提示词。
- **存模板**：做过、拆过的图可以存成模板，下次说「用模板 U001」就能沿用。

只有文字文件，不需要装 Python，也不需要命令行。任何能读文件的 AI 都能用。

这样说就行：

> 用 article-to-images，把这篇文章做成 6 张小红书图，3:4。正文：……

> 拆解这张图，文字逐字识别出来。

详细说明：[article-to-images 使用说明](skills/article-to-images/README.md)

---

## sketchnote-diagram：手绘笔记风配图

![示例：竖版流程图](skills/sketchnote-diagram/assets/示例/示例_竖版流程图.png)

奶油色纸底、黑色马克笔线条。蓝色圆形是输入，橙色方块是生产，绿色六边形是反馈，再配上荧光笔高亮、手写批注和小涂鸦。

- **字不会错**：图是代码画的，每个字都来自你写的内容。生图模型写中文常出错字，这里不会。
- **好改**：改一个字、挪一个位置，几秒钟重新出图。也可以在浏览器里直接拖动、双击改字。
- **自带检查**：哪里重叠了、哪里超出画面，会直接告诉你。
- **5 个模板**：流程闭环、上下两组对比、四步循环、空白横版、竖版 3:4。

![示例：横版速查图](skills/sketchnote-diagram/assets/示例/示例_六个字段速查.png)

**需要**：Mac 电脑（要用系统自带的手写字体）、Google Chrome、Python 3。

这样说就行：

> 用 sketchnote-diagram，把下面这几步画成一张流程图：……

也可以自己用：双击 `scripts/打开配图工具.command`，在浏览器里从模板开始画。命令行用法见 [SKILL.md](skills/sketchnote-diagram/SKILL.md)。

## 许可

[MIT](LICENSE)：可以随便用、改、分享，商用也可以，保留许可声明就行。
