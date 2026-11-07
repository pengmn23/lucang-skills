#!/bin/bash
# 双击这个文件：用 Google Chrome 打开手绘笔记风配图工具（保存回原文件需要 Chrome）
cd "$(dirname "$0")"
if [ -d "/Applications/Google Chrome.app" ]; then
  open -a "Google Chrome" "sketchnote.html"
else
  echo "没有找到 Google Chrome，用默认浏览器打开（保存时会下载到「下载」文件夹）"
  open "sketchnote.html"
fi
