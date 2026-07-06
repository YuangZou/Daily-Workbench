# 研究工作台 · Research Workbench

汇集日常研究成果的统一入口，静态门户（GitHub Pages 托管）。深色专业风、卡片网格、响应式。

## 面板一览

| 路径 | 面板 | 说明 | 快照日期 |
|------|------|------|----------|
| `cycle-map/` | 商品周期分歧地图 | 64 品种「中长方向 × 短周期偏离」四象限（ECharts） | 2026-07-01 |
| `ai-risk/` | AI 基建风险监控 | 4 支柱 22 指标 · 红黄绿灯 · 股价 · 舆情 · 每日研判 | 2026-07-01 |
| `contest/` | 实盘大赛 · 重量组前20追踪 | 前 20 高手近 5 日平仓盈亏 + 手数（ECharts） | 2026-07-03 |
| `insight/` | 高手交易行为洞察 | 品种热点/赚钱效应/打法画像/轮动（PDF：完整版 + 精简版） | 2026-07-03 |
| `wechat/` | 宏观公众号综述 | 每日「判断驱动版」综述，带来源链接 | 2026-06-30 |
| `reports/` | 中信半年报 · 矛盾汇总 | 44 品种「方向｜核心观点｜主要矛盾」+ 催化剂日历 | 2026-06-23 |

- 各页均**自包含**、数据内联；ECharts 走 CDN，脱离本机也能打开。
- 各页数据为**对应时点快照**，页内标注日期。

## 本地预览

```bash
python3 -m http.server 8000   # 然后打开 http://localhost:8000/
```

## 更新方式（静态快照）

面板数据更新后，重跑对应生成脚本 → 把新 HTML 覆盖到对应英文目录 → `git push` 即更新，无需定时任务。

- `wechat/`、`reports/` 由 `tools/md2page.py` 从 Markdown 生成：
  ```bash
  python3 tools/md2page.py <输入.md> reports/index.html --kind report
  python3 tools/md2page.py <输入.md> wechat/index.html  --kind wechat
  ```
- 其余面板由各自成果目录下的生成脚本产出 HTML 后拷入。

## 免责

仅供内部研究参考，**不构成投资建议**。
