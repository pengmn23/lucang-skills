/* 手绘笔记风配图工具 · 编辑器
 * sketchnote.html 在浏览器里打开时用它；命令行出图（render.py）不会用到这里的功能。
 * 依赖 sketchnote.html 里的：render 相关函数、show、ICONS、DOODLE、el、NS、seedFor、TYPE。
 */
"use strict";
(function () {
  const $ = id => document.getElementById(id);
  const S = { spec: null, sel: null, history: [], future: [], handle: null, fileName: null, dirty: false, edgeMode: false, edgeFrom: null, svg: null, warns: [], drag: null, raf: null };
  const DRAFT_KEY = "sketchnote:draft";
  const clone = o => JSON.parse(JSON.stringify(o));
  const W = () => (S.spec.canvas && S.spec.canvas.width) || 1600;
  const H = () => (S.spec.canvas && S.spec.canvas.height) || 900;
  const snap = v => Math.round(v / 5) * 5;
  const TEMPLATES = window.SKETCH_TEMPLATES || [];

  function toast(msg) { const t = $("toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200); }
  function downloadBlob(name, blob) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
  function baseName() {
    if (S.fileName) return S.fileName.replace(/\.json$/i, "");
    const t = S.spec.title && S.spec.title.lines && S.spec.title.lines[0];
    return (t || "配图").replace(/[\\/:*?"<>|，。？！]/g, "").slice(0, 20) || "配图";
  }

  /* ---------- 元素路径：nodes.3、nodes.3.note、edges.1.label、blocks.0、title …… ---------- */
  function parsePath(p) { if (!p) return null; const a = p.split("."); return { coll: a[0], i: a.length > 1 && /^\d+$/.test(a[1]) ? +a[1] : null, sub: a[2] || null }; }
  function objOf(path, create) {
    const q = parsePath(path); if (!q) return null;
    if (q.i != null) return (S.spec[q.coll] || [])[q.i];
    if (create && (S.spec[q.coll] == null || S.spec[q.coll] === false)) S.spec[q.coll] = {};
    return S.spec[q.coll];
  }
  function nameOf(path) {
    const q = parsePath(path), o = objOf(path) || {};
    const first = s => String(s == null ? "" : s).split("\n")[0];
    switch (q.coll) {
      case "nodes": return q.sub === "note" ? `「${o.label || o.id}」的说明` : `节点「${o.label || o.id}」`;
      case "edges": return q.sub === "label" ? `连线标签「${first(o.label)}」` : `连线 ${o.from} → ${o.to}`;
      case "notes": return `批注「${first(o.text)}」`;
      case "blocks": return `版块「${first(o.title || o.text || o.kind)}」（${o.kind}）`;
      case "doodles": return `小涂鸦「${o.type}」`;
      case "legend": return "节点图例";
      case "title": return "标题";
      case "subtitle": return "英文副标题";
      case "signature": return "署名";
      default: return path;
    }
  }
  /* 拖动时改哪两个字段 */
  function moveKeys(path) {
    const q = parsePath(path);
    if (q.sub === "note") return ["noteDx", "noteDy"];
    if (q.sub === "label") return ["labelDx", "labelDy"];
    if (q.coll === "edges") return null;
    return ["x", "y"];
  }
  function defaults(path) {
    switch (parsePath(path).coll) {
      case "title": return [60, 95];
      case "subtitle": return [W() / 2, 260];
      case "signature": return [50, H() - 48];
      default: return [0, 0];
    }
  }

  /* ---------- 画图 ---------- */
  function draw(o) {
    o = o || {};
    const r = show(S.spec, { skipCheck: !!o.fast });
    S.svg = r.svg;
    if (!o.fast) { S.warns = r.warns; renderWarns(); saveDraft(); }
    drawSel(); status();
    if (!o.keepSrc) syncSrc();
  }
  function drawSel() {
    if (!S.svg || !S.sel) return;
    const g = S.svg.querySelector(`[data-path="${S.sel}"]`); if (!g) return;
    const b = g.getBBox();
    el("rect", { x: b.x - 7, y: b.y - 7, width: b.width + 14, height: b.height + 14, rx: 8, fill: "rgba(47,128,237,.06)", stroke: "#2F80ED", "stroke-width": 2.5, "stroke-dasharray": "8 6", class: "ui-only", "pointer-events": "none" }, S.svg);
    if (S.edgeFrom) {
      const n = (S.spec.nodes || []).find(x => x.id === S.edgeFrom);
      if (n) el("circle", { cx: n.x, cy: n.y, r: (n.size || 150) * 0.62, fill: "none", stroke: "#2F80ED", "stroke-width": 3, class: "ui-only", "pointer-events": "none" }, S.svg);
    }
  }
  function syncSrc() { const src = $("src"); if (document.activeElement !== src) src.value = JSON.stringify(S.spec, null, 2); }
  function status() {
    const n = (S.spec.nodes || []).length, e = (S.spec.edges || []).length;
    let t = `${S.fileName || "未命名"}${S.dirty ? " ● 未保存" : ""} ｜ ${W()}×${H()} ｜ 节点 ${n} · 连线 ${e} ｜ 提醒 ${S.warns.length}`;
    if (S.edgeMode) t += ` ｜ 连线中：${S.edgeFrom ? "再点终点节点" : "先点起点节点"}（Esc 取消）`;
    $("status").textContent = t;
    document.title = (S.dirty ? "● " : "") + (S.fileName || "未命名") + " - 手绘笔记风配图";
    const v = `${W()}x${H()}`, sel = $("ratio");
    if (![...sel.options].some(op => op.value === v)) { const op = document.createElement("option"); op.value = v; op.textContent = `${W()}×${H()}（自定义）`; sel.appendChild(op); }
    sel.value = v;
    $("bEdge").classList.toggle("on", S.edgeMode);
  }
  function renderWarns() {
    const ul = $("warnList"); ul.innerHTML = "";
    $("warnCount").textContent = S.warns.length ? `（${S.warns.length}）` : "";
    if (!S.warns.length) { const li = document.createElement("li"); li.className = "ok"; li.style.listStyle = "none"; li.style.marginLeft = "-18px"; li.textContent = "没有重叠，也没有超出画布 ✓"; ul.appendChild(li); return; }
    S.warns.forEach(w => { const li = document.createElement("li"); li.textContent = w.msg; li.title = "点一下：选中这个元素"; li.onclick = () => { const p = (w.paths || []).find(Boolean); if (p) select(p); }; ul.appendChild(li); });
  }

  /* ---------- 历史和修改 ---------- */
  function markDirty() { S.dirty = true; }
  function commit(before) { S.history.push(before); if (S.history.length > 200) S.history.shift(); S.future = []; markDirty(); }
  function undo() { if (!S.history.length) return toast("没有可以撤销的了"); S.future.push(JSON.stringify(S.spec)); S.spec = JSON.parse(S.history.pop()); markDirty(); select(null, true); draw(); }
  function redo() { if (!S.future.length) return toast("没有可以重做的了"); S.history.push(JSON.stringify(S.spec)); S.spec = JSON.parse(S.future.pop()); markDirty(); select(null, true); draw(); }

  /* ---------- 选中 ---------- */
  function select(path, quiet) {
    S.sel = path || null;
    const o = path ? objOf(path) : null;
    $("selName").textContent = path ? nameOf(path) + "　（双击图上的它可以直接改文字）" : "点图上的元素选中它；拖动可以移动（自动对齐到 5 像素，按住 Shift 自由移动）。";
    $("selJson").value = o ? JSON.stringify(o, null, 2) : "";
    $("selErr").textContent = "";
    if (!quiet) draw();  /* 整份 JSON 也跟着刷新（光标在 JSON 框里时不刷新，见 syncSrc） */
  }

  /* ---------- 拖动 ---------- */
  function svgPt(e) { const pt = S.svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(S.svg.getScreenCTM().inverse()); }
  function inside(b, x, y) { return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h; }
  function startDrag(e, path) {
    const keys = moveKeys(path); if (!keys) return;
    const o = objOf(path, true); if (!o) return;
    const d = { path, keys, start: clone(o), p0: svgPt(e), moved: false, before: JSON.stringify(S.spec), carry: [] };
    /* 拖动没有正文的分组框时，框里的节点、批注、涂鸦跟着走 */
    const q = parsePath(path);
    if (q.coll === "blocks" && o.kind === "box" && !o.text) {
      ["nodes", "notes", "doodles"].forEach(c => (S.spec[c] || []).forEach((x, i) => { if (inside(o, x.x, x.y)) d.carry.push({ c, i, x: x.x, y: x.y, arrow: x.arrow ? x.arrow.slice() : null }); }));
    }
    S.drag = d;
  }
  function moveDrag(e) {
    const d = S.drag; if (!d) return;
    const p = svgPt(e), rawDx = p.x - d.p0.x, rawDy = p.y - d.p0.y;
    if (!d.moved && Math.hypot(rawDx, rawDy) < 3) return;
    d.moved = true;
    const o = objOf(d.path, true), [kx, ky] = d.keys, def = kx === "x" ? defaults(d.path) : [0, 0];
    const sx = d.start[kx] == null ? def[0] : d.start[kx], sy = d.start[ky] == null ? def[1] : d.start[ky];
    let nx = sx + rawDx, ny = sy + rawDy;
    if (!e.shiftKey) { nx = snap(nx); ny = snap(ny); }
    o[kx] = Math.round(nx); o[ky] = Math.round(ny);
    const dx = o[kx] - sx, dy = o[ky] - sy;
    if (d.start.arrow) o.arrow = [d.start.arrow[0] + dx, d.start.arrow[1] + dy, d.start.arrow[2] || 0];
    d.carry.forEach(c => { const x = S.spec[c.c][c.i]; x.x = c.x + dx; x.y = c.y + dy; if (c.arrow) x.arrow = [c.arrow[0] + dx, c.arrow[1] + dy, c.arrow[2] || 0]; });
    if (!S.raf) S.raf = requestAnimationFrame(() => { S.raf = null; draw({ fast: true, keepSrc: true }); });
  }
  function endDrag() {
    const d = S.drag; if (!d) return; S.drag = null;
    if (S.raf) { cancelAnimationFrame(S.raf); S.raf = null; }
    if (d.moved) { commit(d.before); select(S.sel, true); draw(); }
  }

  /* ---------- 增、删、复制、移动 ---------- */
  function uniqueId(prefix) { const ids = new Set((S.spec.nodes || []).map(n => n.id)); let k = 1; while (ids.has(prefix + k)) k++; return prefix + k; }
  function center() { return [snap(W() * 0.36), snap(H() * 0.52)]; }
  function push(coll, obj) { S.spec[coll] = S.spec[coll] || []; S.spec[coll].push(obj); return coll + "." + (S.spec[coll].length - 1); }
  function addEl(kind, extra) {
    const before = JSON.stringify(S.spec), [cx, cy] = center();
    let path;
    if (TYPE[kind]) path = push("nodes", { id: uniqueId(kind === "input" ? "in" : kind === "produce" ? "do" : "fb"), type: kind, x: cx, y: cy, size: 130, icon: { input: "bulb", produce: "pen", feedback: "check" }[kind], label: "新节点", note: "一句说明" });
    else if (kind === "note") path = push("notes", { text: "手写批注", x: cx, y: cy, size: 22, rotate: -4 });
    else if (kind === "sticky") path = push("blocks", { kind: "sticky", x: cx - 110, y: cy - 70, w: 220, h: 140, text: "便利贴", size: 22, rotate: 4 });
    else if (kind === "list") path = push("blocks", { kind: "list", title: "关键关系", x: cx - 230, y: cy - 110, w: 460, rowH: 48, size: 22, items: ["第一条", "第二条", "第三条"] });
    else if (kind === "doodle") path = push("doodles", { type: extra, x: cx, y: cy, s: 0.8 });
    if (!path) return;
    commit(before); select(path);
    toast("已添加到画面中间，拖到想要的位置");
  }
  function delSel() {
    if (!S.sel) return toast("先选中一个元素");
    const before = JSON.stringify(S.spec), q = parsePath(S.sel), arr = S.spec[q.coll];
    if (q.coll === "nodes" && q.sub === "note") delete arr[q.i].note;
    else if (q.coll === "nodes") { const id = arr[q.i].id; arr.splice(q.i, 1); S.spec.edges = (S.spec.edges || []).filter(e => e.from !== id && e.to !== id); }
    else if (q.coll === "edges" && q.sub === "label") delete arr[q.i].label;
    else if (q.i != null) arr.splice(q.i, 1);
    else if (q.coll === "signature") S.spec.signature = false;
    else delete S.spec[q.coll];
    commit(before); select(null);
  }
  function dupSel() {
    const q = parsePath(S.sel);
    if (!q || q.i == null || q.coll === "edges") return toast("节点、批注、版块、涂鸦可以复制");
    const before = JSON.stringify(S.spec), c = clone(S.spec[q.coll][q.i]);
    c.x = (c.x || 0) + 30; c.y = (c.y || 0) + 30;
    if (q.coll === "nodes") c.id = uniqueId(c.id.replace(/\d+$/, ""));
    commit(before); select(push(q.coll, c));
  }
  function nudge(dx, dy) {
    const keys = S.sel && moveKeys(S.sel); if (!keys) return;
    const before = JSON.stringify(S.spec), o = objOf(S.sel, true), def = keys[0] === "x" ? defaults(S.sel) : [0, 0];
    o[keys[0]] = (o[keys[0]] == null ? def[0] : o[keys[0]]) + dx; o[keys[1]] = (o[keys[1]] == null ? def[1] : o[keys[1]]) + dy;
    if (o.arrow) o.arrow = [o.arrow[0] + dx, o.arrow[1] + dy, o.arrow[2] || 0];
    commit(before); select(S.sel, true); draw();
  }
  /* 双击改文字：用 / 分行 */
  function editText(path) {
    const q = parsePath(path), o = objOf(path, true); if (!o) return;
    const ask = (label, v) => { const r = prompt(label + "（用 / 分行）", String(v == null ? "" : v).replace(/\n/g, " / ")); return r == null ? null : r.split(/\s*\/\s*/).join("\n"); };
    const before = JSON.stringify(S.spec); let r;
    if (q.coll === "nodes" && q.sub === "note") { r = ask("说明", o.note); if (r != null) o.note = r; }
    else if (q.coll === "nodes") { r = ask("节点名称", o.label); if (r != null) o.label = r; }
    else if (q.coll === "edges") { r = ask("连线标签（留空表示不要标签）", o.label); if (r != null) { if (r) o.label = r; else delete o.label; } }
    else if (q.coll === "notes") { r = ask("批注", o.text); if (r != null) o.text = r; }
    else if (q.coll === "title") { r = ask("标题", (o.lines || []).join("\n")); if (r != null) o.lines = r.split("\n"); }
    else if (q.coll === "subtitle") { r = ask("英文副标题", o.text); if (r != null) o.text = r.replace(/\n/g, " "); }
    else if (q.coll === "signature") { r = ask("署名", o.text || ""); if (r != null) o.text = r; }
    else if (q.coll === "blocks" && o.kind === "list") { r = ask("清单的每一条", (o.items || []).join("\n")); if (r != null) o.items = r.split("\n").filter(Boolean); }
    else if (q.coll === "blocks" && o.kind === "loop") { r = ask("流程", o.flow); if (r != null) o.flow = r.replace(/\n/g, " → "); }
    else if (q.coll === "blocks") { r = ask("文字", o.text); if (r != null) o.text = r; }
    else return toast("这个元素没有可以直接改的文字，在右边的字段里改");
    if (r != null) { commit(before); select(path); }
  }

  /* ---------- 连线模式 ---------- */
  function toggleEdgeMode(on) { S.edgeMode = on == null ? !S.edgeMode : on; S.edgeFrom = null; draw({ keepSrc: true, fast: true }); if (S.edgeMode) toast("先点起点节点，再点终点节点"); }
  function edgeClick(path) {
    const q = parsePath(path);
    if (!q || q.coll !== "nodes" || q.sub) return toast("连线要点在节点上");
    const id = S.spec.nodes[q.i].id;
    if (!S.edgeFrom) { S.edgeFrom = id; draw({ keepSrc: true, fast: true }); return; }
    if (S.edgeFrom === id) return toast("起点和终点不能是同一个节点");
    const before = JSON.stringify(S.spec);
    const p = push("edges", { from: S.edgeFrom, to: id, bend: 0.1 });
    commit(before); S.edgeMode = false; S.edgeFrom = null; select(p);
    toast("连好了。双击连线可以加标签");
  }

  /* ---------- 文件 ---------- */
  const JSON_TYPES = [{ description: "配图 JSON", accept: { "application/json": [".json"] } }];
  function load(spec, name, handle, msg) {
    S.spec = spec; S.handle = handle || null; S.fileName = name || null;
    S.history = []; S.future = []; S.dirty = false; S.edgeMode = false; S.edgeFrom = null;
    select(null, true); draw(); if (msg) toast(msg);
  }
  function loadText(txt, name, handle) {
    let spec; try { spec = JSON.parse(txt); } catch (e) { return toast("不是有效的 JSON：" + e.message); }
    if (S.dirty && !confirm("当前的图还没保存，确定要打开新的吗？")) return;
    load(spec, name, handle, "已打开 " + name + (handle ? "（⌘S 会直接存回这个文件）" : ""));
  }
  async function openFile() {
    if (window.showOpenFilePicker) {
      try { const [h] = await showOpenFilePicker({ types: JSON_TYPES }); const f = await h.getFile(); loadText(await f.text(), f.name, h); }
      catch (e) { if (e.name !== "AbortError") toast("打开失败：" + e.message); }
    } else $("fileInput").click();
  }
  async function writeTo(h, txt) { const w = await h.createWritable(); await w.write(txt); await w.close(); }
  async function save(as) {
    const txt = JSON.stringify(S.spec, null, 2) + "\n";
    try {
      if (!as && S.handle && S.handle.createWritable) { await writeTo(S.handle, txt); S.dirty = false; clearDraft(); status(); return toast("已保存到 " + S.fileName); }
      if (window.showSaveFilePicker) {
        const h = await showSaveFilePicker({ suggestedName: S.fileName || baseName() + ".json", types: JSON_TYPES });
        await writeTo(h, txt); S.handle = h; S.fileName = h.name; S.dirty = false; clearDraft(); status();
        return toast("已保存到 " + h.name);
      }
    } catch (e) { if (e.name === "AbortError") return; toast("保存失败：" + e.message); return; }
    downloadBlob(S.fileName || baseName() + ".json", new Blob([txt], { type: "application/json" }));
    S.dirty = false; clearDraft(); status(); toast("这个浏览器不能直接保存，已下载到「下载」文件夹");
  }
  function cleanSvgText() {
    const c = S.svg.cloneNode(true);
    c.querySelectorAll(".ui-only, .hit").forEach(n => n.remove());
    c.querySelectorAll("[data-path]").forEach(n => n.removeAttribute("data-path"));
    return new XMLSerializer().serializeToString(c);
  }
  function exportPng() {
    if (!S.svg) return;
    const img = new Image(), w = W(), h = H();
    img.onload = () => { const c = document.createElement("canvas"); c.width = w * 2; c.height = h * 2; const x = c.getContext("2d"); x.scale(2, 2); x.drawImage(img, 0, 0); c.toBlob(b => { downloadBlob(baseName() + ".png", b); toast(`已导出 ${w * 2}×${h * 2} 到「下载」文件夹`); }); };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(cleanSvgText());
  }
  function exportSvg() { if (S.svg) downloadBlob(baseName() + ".svg", new Blob([cleanSvgText()], { type: "image/svg+xml" })); }

  /* ---------- 草稿：只存在这台电脑的浏览器里，防止误关页面 ---------- */
  function saveDraft() { if (!S.dirty) return; try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ spec: S.spec, fileName: S.fileName, t: Date.now() })); } catch (e) { /* 浏览器不允许就算了 */ } }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { } }
  function readDraft() { try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); return d && d.spec ? d : null; } catch (e) { return null; } }

  /* ---------- 速查面板 ---------- */
  const DOODLE_NAMES = { bulb: "灯泡", sparkle: "闪光", star: "星星", exclaim: "感叹号", pin: "图钉", grass: "小草", megaphone: "喇叭", link: "链条", warn: "警示", arrow: "小箭头", heart: "爱心" };
  function buildGalleries() {
    const ig = $("icons");
    Object.keys(ICONS).forEach(name => {
      const d = document.createElement("div"); d.title = name;
      d.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26"><path d="${ICONS[name]}" fill="none" stroke="#2B2B2B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><br>${name}`;
      d.onclick = () => {
        const q = parsePath(S.sel);
        if (!q || q.coll !== "nodes") return toast("先选中一个节点，再点图标");
        const before = JSON.stringify(S.spec); S.spec.nodes[q.i].icon = name; commit(before); select(S.sel);
      };
      ig.appendChild(d);
    });
    const dg = $("doodles");
    Object.keys(DOODLE).forEach(type => {
      const d = document.createElement("div"); d.title = type;
      const svg = el("svg", { viewBox: "-50 -50 100 100", width: 34, height: 34 }); seedFor("gallery." + type);
      DOODLE[type](svg, 0, 0, 0.9, { angle: 0 });
      d.appendChild(svg); d.appendChild(document.createElement("br")); d.appendChild(document.createTextNode(DOODLE_NAMES[type] || type));
      d.onclick = () => addEl("doodle", type);
      dg.appendChild(d);
    });
    const tpl = $("tpl");
    TEMPLATES.forEach((t, i) => { const op = document.createElement("option"); op.value = String(i); op.textContent = t.name; tpl.appendChild(op); });
  }

  /* ---------- 事件 ---------- */
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
  function jsonErrText(e, txt) {
    const m = String(e.message).match(/position (\d+)/), lc = String(e.message).match(/line (\d+) column (\d+)/);
    if (lc) return `第 ${lc[1]} 行第 ${lc[2]} 个字附近有错：${e.message}`;
    if (m) { const line = txt.slice(0, +m[1]).split("\n").length; return `第 ${line} 行附近有错：${e.message}`; }
    return "JSON 格式错误：" + e.message;
  }
  function bind() {
    const stage = $("stage");
    stage.addEventListener("pointerdown", e => {
      if (!S.svg || e.button !== 0) return;
      const t = e.target.closest("[data-path]"), path = t && t.getAttribute("data-path");
      if (S.edgeMode) { if (path) edgeClick(path.replace(/\.note$/, "")); return; }
      if (!path) { if (S.sel) select(null); return; }
      if (path !== S.sel) select(path);
      startDrag(e, path);
      stage.setPointerCapture(e.pointerId); e.preventDefault();
    });
    stage.addEventListener("pointermove", moveDrag);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("dblclick", e => { const t = e.target.closest("[data-path]"); if (t) editText(t.getAttribute("data-path")); });

    $("src").addEventListener("input", debounce(() => {
      const txt = $("src").value;
      try { const spec = JSON.parse(txt); $("jsonErr").textContent = ""; if (JSON.stringify(spec) === JSON.stringify(S.spec)) return; commit(JSON.stringify(S.spec)); S.spec = spec; draw({ keepSrc: true }); if (S.sel && !objOf(S.sel)) select(null, true); }
      catch (e) { $("jsonErr").textContent = jsonErrText(e, txt); }
    }, 500));
    $("selJson").addEventListener("input", debounce(() => {
      if (!S.sel) return;
      const txt = $("selJson").value;
      try {
        const o = JSON.parse(txt), q = parsePath(S.sel); $("selErr").textContent = "";
        commit(JSON.stringify(S.spec));
        if (q.i != null) S.spec[q.coll][q.i] = o; else S.spec[q.coll] = o;
        draw();
      } catch (e) { $("selErr").textContent = jsonErrText(e, txt); }
    }, 400));

    $("tpl").onchange = () => {
      const i = $("tpl").value; $("tpl").value = ""; if (i === "") return;
      if (S.dirty && !confirm("当前的图还没保存，确定要新建吗？")) return;
      load(clone(TEMPLATES[+i].spec), null, null, "已从模板「" + TEMPLATES[+i].name + "」新建，记得另存到 specs 文件夹");
      S.dirty = true; status();
    };
    $("bOpen").onclick = openFile;
    $("bSave").onclick = () => save(false);
    $("bSaveAs").onclick = () => save(true);
    $("bUndo").onclick = undo; $("bRedo").onclick = redo;
    document.querySelectorAll("[data-add]").forEach(b => b.onclick = () => addEl(b.dataset.add));
    $("bEdge").onclick = () => toggleEdgeMode();
    $("bDel").onclick = delSel; $("bDup").onclick = dupSel;
    $("bPng").onclick = exportPng; $("bSvg").onclick = exportSvg;
    $("bCopy").onclick = async () => { try { await navigator.clipboard.writeText(JSON.stringify(S.spec, null, 2)); toast("整份 JSON 已复制"); } catch (e) { $("src").select(); document.execCommand("copy"); toast("整份 JSON 已复制"); } };
    const setFold = fold => { $("main").classList.toggle("fold", fold); $("bJson").textContent = fold ? "显示 JSON" : "收起 JSON"; $("bJson").classList.toggle("on", !fold); try { localStorage.setItem("sketchnote:showJson", fold ? "0" : "1"); } catch (e) { } };
    let showJson = false; try { showJson = localStorage.getItem("sketchnote:showJson") === "1"; } catch (e) { }
    setFold(!showJson);
    $("bJson").onclick = () => setFold(!$("main").classList.contains("fold"));
    $("ratio").onchange = () => {
      const [w, h] = $("ratio").value.split("x").map(Number), before = JSON.stringify(S.spec);
      S.spec.canvas = Object.assign({}, S.spec.canvas, { width: w, height: h }); commit(before); draw();
      toast("画布已改成 " + w + "×" + h + "，元素位置不会自动换算，看一下右边的提醒");
    };

    const fi = document.createElement("input"); fi.type = "file"; fi.accept = ".json,application/json"; fi.id = "fileInput"; fi.hidden = true; document.body.appendChild(fi);
    fi.onchange = async () => { const f = fi.files[0]; if (f) loadText(await f.text(), f.name, null); fi.value = ""; };
    window.addEventListener("dragover", e => e.preventDefault());
    window.addEventListener("drop", async e => {
      e.preventDefault();
      const item = e.dataTransfer.items && e.dataTransfer.items[0];
      let handle = null;
      if (item && item.getAsFileSystemHandle) { try { handle = await item.getAsFileSystemHandle(); } catch (err) { handle = null; } }
      const f = handle && handle.kind === "file" ? await handle.getFile() : e.dataTransfer.files[0];
      if (f) loadText(await f.text(), f.name, handle && handle.kind === "file" ? handle : null);
    });
    window.addEventListener("beforeunload", e => { if (S.dirty) { e.preventDefault(); e.returnValue = ""; } });

    document.addEventListener("keydown", e => {
      const mod = e.metaKey || e.ctrlKey, inField = /^(TEXTAREA|INPUT|SELECT)$/.test(document.activeElement.tagName);
      if (mod && e.key.toLowerCase() === "s") { e.preventDefault(); save(e.shiftKey); return; }
      if (inField) return;
      if (mod && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
      if (mod && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); return; }
      if (mod && e.key.toLowerCase() === "d") { e.preventDefault(); dupSel(); return; }
      if (e.key === "Escape") { if (S.edgeMode) toggleEdgeMode(false); else select(null); return; }
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); delSel(); return; }
      const step = e.shiftKey ? 10 : 1, dir = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if (dir && S.sel) { e.preventDefault(); nudge(dir[0], dir[1]); }
    });
  }

  window.Editor = {
    start(injected, fileName) {
      buildGalleries(); bind();
      if (injected) return load(injected, fileName || "未命名.json", null, fileName ? `已载入 ${fileName}。⌘S 会让你选择存到哪里` : null);
      const d = readDraft();
      if (d) { load(d.spec, d.fileName, null, "已恢复上次没保存的草稿" + (d.fileName ? "（" + d.fileName + "）" : "")); S.dirty = true; status(); return; }
      load(clone(TEMPLATES.length ? TEMPLATES[0].spec : FALLBACK), null, null, "从模板新建，或者打开 specs 里的 JSON");
    }
  };
})();
