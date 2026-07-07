#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
md2page.py — 把研究整理的 Markdown（带 frontmatter）转成自包含的深色主题 HTML 页面，
用于「研究工作台」静态门户。数据全部内联，无外部依赖（响应式、移动端友好）。

用法：
    python3 tools/md2page.py <输入.md> <输出.html> [--kind wechat|report]

--kind 只影响顶部标签配色/文案，不影响正文渲染。
"""
import sys, re, html, os


# ---------- frontmatter ----------
def parse_frontmatter(text):
    meta = {}
    body = text
    if text.startswith('---'):
        end = text.find('\n---', 3)
        if end != -1:
            fm = text[3:end].strip('\n')
            body = text[end + 4:]
            for line in fm.split('\n'):
                if ':' in line:
                    k, v = line.split(':', 1)
                    meta[k.strip()] = v.strip()
    return meta, body


# ---------- inline ----------
def inline(s):
    # 先转义
    s = html.escape(s)
    # 链接 [text](url)  —— 在转义后 () 仍原样
    s = re.sub(
        r'\[([^\]]+)\]\((https?:[^)]+)\)',
        lambda m: f'<a href="{m.group(2)}" target="_blank" rel="noopener">{m.group(1)}</a>',
        s,
    )
    # 加粗
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    # 行内 code
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    return s


# 给方向 / 情绪词上色
DIR_MAP = [
    (r'偏多|看多|做多|中性偏多|震荡偏多|近强远弱|人民币偏升', 'up'),
    (r'偏空|看空|做空|震荡偏空', 'down'),
    (r'震荡|中性|分化|工具|磨底|区间', 'flat'),
]


def color_cell(txt):
    plain = re.sub(r'<[^>]+>', '', txt)
    for pat, cls in DIR_MAP:
        if re.search(pat, plain):
            return f'<span class="dir {cls}">{txt}</span>'
    return txt


HOT_MAP = {'高': 'hot-3', '中高': 'hot-2', '偏高': 'hot-2', '中': 'hot-1',
           '中低': 'hot-0', '低': 'hot-0'}


def render(md_body, meta, kind):
    lines = md_body.split('\n')
    out = []
    i = 0
    n = len(lines)
    while i < n:
        line = lines[i]
        # 表格
        if '|' in line and i + 1 < n and re.match(r'^\s*\|?[\s:|-]+\|', lines[i + 1]):
            header = [c.strip() for c in line.strip().strip('|').split('|')]
            i += 2
            rows = []
            while i < n and '|' in lines[i] and lines[i].strip():
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')])
                i += 1
            # 找 方向 / 突出度 列索引
            dir_idx = next((j for j, h in enumerate(header) if '方向' in h), -1)
            hot_idx = next((j for j, h in enumerate(header) if '突出度' in h), -1)
            th = ''.join(f'<th>{inline(h)}</th>' for h in header)
            trs = []
            for r in rows:
                tds = []
                for j, c in enumerate(r):
                    cell = inline(c)
                    if j == dir_idx:
                        cell = color_cell(cell)
                    elif j == hot_idx and c in HOT_MAP:
                        cell = f'<span class="hot {HOT_MAP[c]}">{inline(c)}</span>'
                    tds.append(f'<td>{cell}</td>')
                trs.append('<tr>' + ''.join(tds) + '</tr>')
            out.append('<div class="tablewrap"><table><thead><tr>' + th +
                       '</tr></thead><tbody>' + ''.join(trs) + '</tbody></table></div>')
            continue
        # 标题
        m = re.match(r'^(#{1,4})\s+(.*)', line)
        if m:
            lvl = len(m.group(1))
            out.append(f'<h{lvl}>{inline(m.group(2))}</h{lvl}>')
            i += 1
            continue
        # 引用
        if line.startswith('>'):
            buf = []
            while i < n and lines[i].startswith('>'):
                buf.append(inline(lines[i].lstrip('>').strip()))
                i += 1
            out.append('<blockquote>' + '<br>'.join(buf) + '</blockquote>')
            continue
        # 列表
        if re.match(r'^\s*[-*]\s+', line):
            items = []
            while i < n and re.match(r'^\s*[-*]\s+', lines[i]):
                items.append('<li>' + inline(re.sub(r'^\s*[-*]\s+', '', lines[i])) + '</li>')
                i += 1
            out.append('<ul>' + ''.join(items) + '</ul>')
            continue
        # 分隔线
        if re.match(r'^---+\s*$', line):
            out.append('<hr>')
            i += 1
            continue
        # 空行
        if not line.strip():
            i += 1
            continue
        # 普通段落
        buf = [line]
        i += 1
        while i < n and lines[i].strip() and not re.match(
                r'^(#{1,4}\s|>|\s*[-*]\s|---+\s*$)', lines[i]) and '|' not in lines[i]:
            buf.append(lines[i])
            i += 1
        out.append('<p>' + inline(' '.join(buf)) + '</p>')
    return '\n'.join(out)


KIND_META = {
    'wechat': ('观点面 · VIEW', '#7c56e6'),
    'report': ('研报 · REPORT', '#0f9d58'),
}


def build(md_path, out_path, kind):
    with open(md_path, encoding='utf-8') as f:
        text = f.read()
    meta, body = parse_frontmatter(text)
    title = meta.get('标题') or meta.get('品种') or '研究页'
    conclusion = meta.get('一句话结论') or meta.get('本周观点') or ''
    date = meta.get('日期') or meta.get('发布日期') or meta.get('整理时间') or ''
    src = meta.get('来源') or meta.get('机构') or meta.get('来源类型') or ''
    tag_txt, tag_col = KIND_META.get(kind, ('研究 · NOTE', '#f5b544'))
    content = render(body, meta, kind)

    banner = ''
    if conclusion:
        banner = f'<div class="conclusion"><div class="cl-label">一句话结论</div><div class="cl-body">{inline(conclusion)}</div></div>'

    metabits = ' · '.join([b for b in [src, ('数据快照 ' + date) if date else ''] if b])

    page = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<style>
{CSS.replace('__TAGCOL__', tag_col)}
</style>
</head>
<body>
<div class="wrap">
  <a class="back" href="../">← 返回研究工作台</a>
  <div class="tag">{html.escape(tag_txt)}</div>
  <h1 class="pagetitle">{inline(title)}</h1>
  <div class="metaline">{inline(metabits)}</div>
  {banner}
  <article class="content">
  {content}
  </article>
  <footer class="foot">
    本页数据为对应时点快照（{html.escape(date)}）。仅供内部研究参考，不构成投资建议。<br>
    <a class="back" href="../">← 返回研究工作台</a>
  </footer>
</div>
</body>
</html>'''
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(page)
    print('written:', out_path, f'({len(page)} bytes)')


CSS = r'''
:root{
  --bg:#f4f6fb; --panel:#ffffff; --soft:#eef1f8; --line:rgba(20,29,55,.10); --line2:rgba(20,29,55,.06);
  --text:#141c31; --sub:#5a6478; --faint:#98a1b5; --tag:__TAGCOL__;
  --up:#0f9d58; --down:#dc3d3d; --flat:#c07d0a; --link:#2a6bef;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:radial-gradient(900px 460px at 12% -10%, rgba(42,107,239,.06), transparent 60%) fixed, var(--bg);
  color:var(--text);
  font-family:"Inter",-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
  line-height:1.7; padding:26px 20px 70px; -webkit-text-size-adjust:100%;}
.wrap{max-width:960px;margin:0 auto;}
.back{display:inline-flex;align-items:center;gap:6px;color:var(--sub);text-decoration:none;font-size:13px;font-weight:600;
  background:var(--panel);border:1px solid var(--line);border-radius:9px;padding:7px 13px;transition:all .15s;
  box-shadow:0 1px 2px rgba(20,29,55,.04);}
.back:hover{color:var(--tag);border-color:var(--tag);transform:translateX(-2px);}
.tag{display:inline-block;margin:18px 0 12px;font-size:11px;font-weight:800;letter-spacing:.6px;
  padding:4px 12px;border-radius:20px;background:color-mix(in srgb,var(--tag) 12%,white);
  color:var(--tag);border:1px solid color-mix(in srgb,var(--tag) 30%,white);}
.pagetitle{font-size:26px;font-weight:800;line-height:1.35;letter-spacing:.3px;}
.metaline{color:var(--sub);font-size:13px;margin-top:8px;}
.conclusion{margin:22px 0 6px;padding:18px 20px;border-radius:14px;background:var(--panel);
  border:1px solid var(--line);border-left:4px solid var(--tag);box-shadow:0 4px 18px rgba(20,29,55,.06);}
.cl-label{font-size:11px;font-weight:800;letter-spacing:2px;color:var(--tag);margin-bottom:7px;}
.cl-body{font-size:15px;line-height:1.75;color:var(--text);}
.cl-body strong{color:var(--text);font-weight:750;}
.content{margin-top:26px;}
.content h1{font-size:22px;margin:30px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--line);}
.content h2{font-size:19px;margin:30px 0 12px;padding-left:12px;border-left:4px solid var(--tag);}
.content h3{font-size:16px;margin:22px 0 10px;color:#2b3654;}
.content h4{font-size:14px;margin:18px 0 8px;color:var(--sub);}
.content p{margin:12px 0;color:#2b3450;font-size:14.5px;}
.content ul{margin:12px 0 12px 4px;padding-left:20px;}
.content li{margin:8px 0;color:#2b3450;font-size:14.5px;}
.content strong{color:var(--text);font-weight:700;}
.content a{color:var(--link);text-decoration:none;border-bottom:1px solid rgba(42,107,239,.35);
  word-break:break-word;}
.content a:hover{border-bottom-color:var(--link);}
.content code{background:var(--soft);padding:1px 6px;border-radius:5px;
  font-size:.9em;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;}
.content hr{border:none;border-top:1px solid var(--line);margin:26px 0;}
blockquote{margin:16px 0;padding:12px 16px;border-radius:10px;
  background:var(--soft);border-left:3px solid var(--faint);
  color:var(--sub);font-size:13.5px;line-height:1.7;}
.tablewrap{overflow-x:auto;margin:16px 0;border-radius:12px;border:1px solid var(--line);
  -webkit-overflow-scrolling:touch;background:var(--panel);}
table{border-collapse:collapse;width:100%;min-width:560px;font-size:13.5px;}
thead th{background:var(--soft);color:#2b3654;font-weight:700;text-align:left;
  padding:11px 13px;border-bottom:1px solid var(--line);white-space:nowrap;position:sticky;top:0;}
tbody td{padding:10px 13px;border-bottom:1px solid var(--line2);
  color:#2b3450;vertical-align:top;}
tbody tr:nth-child(even){background:rgba(20,29,55,.015);}
tbody tr:hover{background:rgba(42,107,239,.05);}
.dir{font-weight:700;white-space:nowrap;}
.dir.up{color:var(--up);} .dir.down{color:var(--down);} .dir.flat{color:var(--flat);}
.hot{font-weight:700;padding:1px 8px;border-radius:6px;font-size:12px;white-space:nowrap;}
.hot-3{background:rgba(220,61,61,.12);color:#c0271f;}
.hot-2{background:rgba(192,125,10,.14);color:#9a6208;}
.hot-1{background:var(--soft);color:var(--sub);}
.hot-0{background:rgba(20,29,55,.04);color:var(--faint);}
.foot{margin-top:40px;padding-top:18px;border-top:1px solid var(--line);
  color:var(--faint);font-size:12.5px;line-height:1.9;}
.foot .back{margin-top:10px;}
@media(max-width:600px){
  body{padding:20px 14px 60px;}
  .pagetitle{font-size:21px;}
  .content h1{font-size:19px;} .content h2{font-size:17px;}
}
'''

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    kind = 'note'
    if '--kind' in sys.argv:
        kind = sys.argv[sys.argv.index('--kind') + 1]
    build(args[0], args[1], kind)
