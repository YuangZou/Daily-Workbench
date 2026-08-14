(function () {
  'use strict';

  var data = window.AI_HARDWARE_DATA;
  if (!data) return;

  var colors = {
    blue: '#356df3',
    red: '#d64a43',
    green: '#269864',
    amber: '#b98527',
    ink: '#17304f',
    muted: '#7b8490',
    grid: '#edf0f4'
  };
  var charts = {};
  var activeRanking = 'overall';

  function isEnglish() {
    return window.WRLang && window.WRLang.get && window.WRLang.get() === 'en';
  }

  function tr(zh, en) {
    return isEnglish() ? en : zh;
  }

  function baseOption() {
    return {
      animationDuration: 450,
      color: [colors.blue, colors.red, colors.green, colors.amber],
      textStyle: { fontFamily: 'Inter, PingFang SC, sans-serif', color: colors.muted },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(20,39,64,.96)',
        borderWidth: 0,
        textStyle: { color: '#fff', fontSize: 11 },
        axisPointer: { type: 'line', lineStyle: { color: '#91a8d8', type: 'dashed' } }
      },
      legend: { top: 3, right: 4, itemWidth: 18, itemHeight: 3, textStyle: { fontSize: 10, color: colors.muted } },
      grid: { left: 48, right: 34, top: 42, bottom: 56 },
      dataZoom: [
        { type: 'inside', xAxisIndex: 0, filterMode: 'none' },
        { type: 'slider', xAxisIndex: 0, height: 16, bottom: 10, borderColor: '#e2e6ed', fillerColor: 'rgba(53,109,243,.10)', handleSize: '75%', moveHandleSize: 0 }
      ]
    };
  }

  function monthLabel(value) {
    return value.slice(2, 7).replace('-', '/');
  }

  function normalize(rows, key) {
    var first = rows.find(function (row) { return row[key] != null; });
    var base = first ? first[key] : 1;
    return rows.map(function (row) { return row[key] == null ? null : +(row[key] / base * 100).toFixed(2); });
  }

  function initChart(id, option) {
    var el = document.getElementById(id);
    if (!el || !window.echarts) return;
    var chart = charts[id];
    if (!chart) chart = echarts.init(el, null, { renderer: 'canvas' });
    chart.setOption(option, true);
    charts[id] = chart;
  }

  function renderPpi() {
    var option = baseOption();
    option.xAxis = { type: 'category', boundaryGap: false, data: data.ppi.map(function (r) { return r.date; }), axisLabel: { formatter: monthLabel, fontSize: 9 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = { type: 'value', name: tr('2024起点=100', '2024 baseline = 100'), nameTextStyle: { fontSize: 9 }, scale: true, axisLabel: { fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } };
    option.series = [
      { name: tr('存储设备 PPI', 'Storage-device PPI'), type: 'line', smooth: .2, symbol: 'none', lineStyle: { width: 2.5 }, areaStyle: { opacity: .06 }, data: normalize(data.ppi, 'storage') },
      { name: tr('半导体器件 PPI', 'Semiconductor-device PPI'), type: 'line', smooth: .2, symbol: 'none', lineStyle: { width: 2.2 }, data: normalize(data.ppi, 'semiconductor') },
      { name: tr('电子计算机 PPI', 'Electronic-computer PPI'), type: 'line', smooth: .2, symbol: 'none', lineStyle: { width: 2 }, data: normalize(data.ppi, 'computer') }
    ];
    initChart('ppi-chart', option);
  }

  function renderActivity() {
    var option = baseOption();
    option.xAxis = { type: 'category', boundaryGap: false, data: data.activity.map(function (r) { return r.date; }), axisLabel: { formatter: monthLabel, fontSize: 9 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = [
      { type: 'value', name: tr('产出指数', 'Output Index'), scale: true, axisLabel: { fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } },
      { type: 'value', name: tr('利用率 %', 'Utilization %'), scale: true, axisLabel: { fontSize: 9 }, splitLine: { show: false } }
    ];
    option.series = [
      { name: tr('工业产出', 'Industrial Output'), type: 'line', symbol: 'none', smooth: .18, lineStyle: { width: 2.5 }, areaStyle: { opacity: .07 }, data: data.activity.map(function (r) { return r.production; }) },
      { name: tr('产能利用率', 'Capacity Utilization'), type: 'line', yAxisIndex: 1, symbol: 'none', smooth: .18, lineStyle: { width: 2.2, type: 'dashed' }, data: data.activity.map(function (r) { return r.capacity; }) }
    ];
    initChart('activity-chart', option);
  }

  function renderGpu() {
    var rows = data.gpu.rows;
    var option = baseOption();
    option.grid = { left: 48, right: 24, top: 42, bottom: 38 };
    option.dataZoom = [];
    option.tooltip.formatter = function (items) {
      var row = rows[items[0].dataIndex];
      return '<b>' + row.gpu + '</b><br>' + tr('跨来源中位数', 'Cross-source median') + '：$' + row.median.toFixed(2) + tr('/卡·小时', ' / GPU-hour') + '<br>25%–75%：$' + row.p25.toFixed(2) + '–$' + row.p75.toFixed(2) + '<br>' + tr('来源数', 'Sources') + '：' + row.sources;
    };
    option.xAxis = { type: 'category', data: rows.map(function (r) { return r.gpu; }), axisLabel: { fontSize: 10, fontWeight: 700 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = { type: 'value', name: 'USD / GPU·hour', axisLabel: { formatter: '${value}', fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } };
    option.series = [
      { name: tr('跨来源中位数', 'Cross-source median'), type: 'bar', barWidth: 28, data: rows.map(function (r) { return r.median; }), itemStyle: { borderRadius: [5, 5, 0, 0], color: colors.blue }, label: { show: true, position: 'top', formatter: function (p) { return '$' + p.value.toFixed(2); }, fontSize: 9, color: colors.ink } },
      { name: tr('25%–75% 区间', '25th–75th percentile'), type: 'custom', silent: true, renderItem: function (params, api) {
          var low = api.coord([api.value(0), api.value(1)]);
          var high = api.coord([api.value(0), api.value(2)]);
          var half = 7;
          return { type: 'group', children: [
            { type: 'line', shape: { x1: low[0], y1: low[1], x2: high[0], y2: high[1] }, style: { stroke: colors.ink, lineWidth: 1.5 } },
            { type: 'line', shape: { x1: low[0] - half, y1: low[1], x2: low[0] + half, y2: low[1] }, style: { stroke: colors.ink, lineWidth: 1.5 } },
            { type: 'line', shape: { x1: high[0] - half, y1: high[1], x2: high[0] + half, y2: high[1] }, style: { stroke: colors.ink, lineWidth: 1.5 } }
          ] };
        }, data: rows.map(function (r, index) { return [index, r.p25, r.p75]; }) }
    ];
    initChart('gpu-chart', option);
  }

  function renderModelPrice() {
    var rows = data.modelPriceMilestones;
    var labels = rows.map(function (r) { return r.date.slice(0, 7) + '\n' + r.model; });
    var option = baseOption();
    option.grid = { left: 48, right: 24, top: 42, bottom: 62 };
    option.dataZoom = [];
    option.tooltip.formatter = function (items) {
      var row = rows[items[0].dataIndex];
      return '<b>' + row.model + '</b> · ' + row.date + '<br>' + tr('输入', 'Input') + '：$' + row.input + ' / 1M Token<br>' + tr('输出', 'Output') + '：$' + row.output + ' / 1M Token';
    };
    option.xAxis = { type: 'category', boundaryGap: false, data: labels, axisLabel: { interval: 0, fontSize: 9, lineHeight: 13 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = { type: 'value', name: 'USD / 1M Token', axisLabel: { formatter: '${value}', fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } };
    option.series = [
      { name: tr('输入价格', 'Input Price'), type: 'line', symbolSize: 7, step: 'end', lineStyle: { width: 2.4 }, areaStyle: { opacity: .06 }, data: rows.map(function (r) { return r.input; }) },
      { name: tr('输出价格', 'Output Price'), type: 'line', symbolSize: 7, step: 'end', lineStyle: { width: 2.4 }, data: rows.map(function (r) { return r.output; }) }
    ];
    initChart('model-price-chart', option);
  }

  function number(value) {
    return new Intl.NumberFormat('en-US').format(value);
  }

  function latestSeriesValues(rows, key) {
    var valid = rows.filter(function (row) { return row[key] != null; });
    var latest = valid[valid.length - 1];
    return {
      latest: latest,
      prior: valid[valid.length - 2],
      yearAgo: valid.find(function (row) {
        return row.date === String(Number(latest.date.slice(0, 4)) - 1) + latest.date.slice(4);
      })
    };
  }

  function formatValue(value, decimals) {
    if (value == null) return '—';
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function formatChange(current, comparison, mode) {
    if (current == null || comparison == null) return '—';
    var value = mode === 'ppt' ? current - comparison : (current / comparison - 1) * 100;
    var suffix = mode === 'ppt' ? 'ppt' : '%';
    var sign = value > 0 ? '+' : '';
    var className = value > 0 ? 'change-up' : value < 0 ? 'change-down' : 'change-flat';
    return '<span class="' + className + '">' + sign + value.toFixed(1) + suffix + '</span>';
  }

  function renderVerifiedSnapshot() {
    var target = document.getElementById('verified-snapshot-body');
    if (!target) return;
    var official = [
      { name: tr('存储设备 PPI', 'Storage-device PPI'), rows: data.ppi, key: 'storage', code: 'PCU3341123341121', source: 'BLS / FRED', decimals: 3, unit: tr('2004-12=100 · 月度 · 未季调', 'Dec 2004=100 · monthly · NSA') },
      { name: tr('半导体器件 PPI', 'Semiconductor-device PPI'), rows: data.ppi, key: 'semiconductor', code: 'PCU334413334413', source: 'BLS / FRED', decimals: 3, unit: tr('1998-12=100 · 月度 · 未季调', 'Dec 1998=100 · monthly · NSA') },
      { name: tr('电子计算机 PPI', 'Electronic-computer PPI'), rows: data.ppi, key: 'computer', code: 'PCU334111334111', source: 'BLS / FRED', decimals: 3, unit: tr('2023-02=100 · 月度 · 未季调', 'Feb 2023=100 · monthly · NSA') },
      { name: tr('半导体工业产出', 'Semiconductor industrial output'), rows: data.activity, key: 'production', code: 'IPG3344S', source: tr('美联储 G.17 / FRED', 'Federal Reserve G.17 / FRED'), decimals: 1, unit: tr('2017=100 · 月度 · 季调', '2017=100 · monthly · SA') },
      { name: tr('半导体产能利用率', 'Semiconductor capacity utilization'), rows: data.activity, key: 'capacity', code: 'CAPUTLG3344S', source: tr('美联储 G.17 / FRED', 'Federal Reserve G.17 / FRED'), decimals: 1, mode: 'ppt', unit: tr('% · 月度 · 季调', '% · monthly · SA') }
    ].map(function (item) {
      var values = latestSeriesValues(item.rows, item.key);
      return '<tr><td><b>' + item.name + '</b></td>' +
        '<td><a class="snapshot-source-link" href="https://fred.stlouisfed.org/series/' + item.code + '" target="_blank" rel="noreferrer">' + item.code + ' ↗</a><small>' + item.source + '</small></td>' +
        '<td>' + values.latest.date.slice(0, 7) + '</td>' +
        '<td><b>' + formatValue(values.latest[item.key], item.decimals) + '</b></td>' +
        '<td>' + formatValue(values.prior[item.key], item.decimals) + '</td>' +
        '<td>' + formatChange(values.latest[item.key], values.prior[item.key], item.mode) + '</td>' +
        '<td>' + formatChange(values.latest[item.key], values.yearAgo && values.yearAgo[item.key], item.mode) + '</td>' +
        '<td>' + item.unit + '</td></tr>';
    });
    var gpu = data.gpu.rows.map(function (row) {
      return '<tr><td><b>' + row.gpu + ' ' + tr('按需 GPU 报价', 'on-demand GPU quote') + '</b></td>' +
        '<td><a class="snapshot-source-link" href="https://github.com/thatkavish/OpenComputePrices" target="_blank" rel="noreferrer">OpenComputePrices ↗</a><small>' + row.sources + ' ' + tr('个报价来源', 'quote sources') + '</small></td>' +
        '<td>' + data.gpu.latestDate + '</td><td><b>$' + formatValue(row.median, 2) + '</b></td><td>—</td><td>—</td><td>—</td>' +
        '<td>USD / GPU-hour<small>P25–P75: $' + formatValue(row.p25, 2) + '–$' + formatValue(row.p75, 2) + '</small></td></tr>';
    });
    target.innerHTML = official.concat(gpu).join('');
  }

  function renderLeaderKpi() {
    var row = data.arena && data.arena.overall && data.arena.overall[0];
    var name = document.getElementById('arena-leader-name');
    var meta = document.getElementById('arena-leader-meta');
    if (!row || !name || !meta) return;
    name.textContent = row.model;
    var organization = row.organization.charAt(0).toUpperCase() + row.organization.slice(1);
    meta.textContent = organization + ' · Arena ' + row.rating.toFixed(1) + ' · ' + number(row.votes) + ' ' + tr('票', 'votes');
  }

  function renderRanking(kind) {
    var target = document.getElementById('model-ranking-body');
    if (!target) return;
    target.innerHTML = data.arena[kind].map(function (row) {
      return '<tr><td><span class="rank-number">' + row.rank + '</span></td>' +
        '<td><span class="model-name">' + row.model + '</span></td>' +
        '<td><span class="org-name">' + row.organization + '</span></td>' +
        '<td><span class="rating">' + row.rating.toFixed(1) + '</span></td>' +
        '<td>' + row.lower.toFixed(1) + ' – ' + row.upper.toFixed(1) + '</td>' +
        '<td><span class="vote-count">' + number(row.votes) + '</span></td>' +
        '<td><span class="license-pill">' + row.license + '</span></td></tr>';
    }).join('');
  }

  function initRanking() {
    renderRanking(activeRanking);
    document.querySelectorAll('[data-ranking]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-ranking]').forEach(function (item) { item.classList.toggle('active', item === button); });
        activeRanking = button.dataset.ranking;
        renderRanking(activeRanking);
      });
    });
  }

  function initModal() {
    var modal = document.getElementById('chart-modal');
    var canvas = document.getElementById('chart-modal-canvas');
    var title = document.getElementById('chart-modal-title');
    var modalChart;
    if (!modal || !canvas) return;

    function close() {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (modalChart) { modalChart.dispose(); modalChart = null; }
    }

    document.querySelectorAll('[data-expand-chart]').forEach(function (button) {
      button.addEventListener('click', function () {
        var source = charts[button.dataset.expandChart];
        if (!source) return;
        title.textContent = button.closest('.chart-card').querySelector('h3').textContent;
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modalChart = echarts.init(canvas, null, { renderer: 'canvas' });
        modalChart.setOption(source.getOption(), true);
      });
    });
    modal.querySelectorAll('[data-close-modal]').forEach(function (item) { item.addEventListener('click', close); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !modal.hidden) close(); });
  }

  function init() {
    if (!window.echarts) {
      document.querySelectorAll('.interactive-chart').forEach(function (el) { el.innerHTML = '<p class="empty">图表组件加载失败，请刷新页面。</p>'; });
      return;
    }
    initRanking();
    initModal();
    function renderForLanguage() {
      renderPpi();
      renderActivity();
      renderGpu();
      renderModelPrice();
      renderVerifiedSnapshot();
      renderLeaderKpi();
      renderRanking(activeRanking);
    }
    if (window.WRLang && window.WRLang.onChange) window.WRLang.onChange(renderForLanguage);
    else renderForLanguage();
    window.addEventListener('resize', function () { Object.keys(charts).forEach(function (key) { charts[key].resize(); }); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
