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
    var chart = echarts.init(el, null, { renderer: 'canvas' });
    chart.setOption(option);
    charts[id] = chart;
  }

  function renderPpi() {
    var option = baseOption();
    option.xAxis = { type: 'category', boundaryGap: false, data: data.ppi.map(function (r) { return r.date; }), axisLabel: { formatter: monthLabel, fontSize: 9 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = { type: 'value', name: '2024起点=100', nameTextStyle: { fontSize: 9 }, scale: true, axisLabel: { fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } };
    option.series = [
      { name: '存储设备 PPI', type: 'line', smooth: .2, symbol: 'none', lineStyle: { width: 2.5 }, areaStyle: { opacity: .06 }, data: normalize(data.ppi, 'storage') },
      { name: '半导体器件 PPI', type: 'line', smooth: .2, symbol: 'none', lineStyle: { width: 2.2 }, data: normalize(data.ppi, 'semiconductor') },
      { name: '电子计算机 PPI', type: 'line', smooth: .2, symbol: 'none', lineStyle: { width: 2 }, data: normalize(data.ppi, 'computer') }
    ];
    initChart('ppi-chart', option);
  }

  function renderActivity() {
    var option = baseOption();
    option.xAxis = { type: 'category', boundaryGap: false, data: data.activity.map(function (r) { return r.date; }), axisLabel: { formatter: monthLabel, fontSize: 9 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = [
      { type: 'value', name: '产出指数', scale: true, axisLabel: { fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } },
      { type: 'value', name: '利用率 %', scale: true, axisLabel: { fontSize: 9 }, splitLine: { show: false } }
    ];
    option.series = [
      { name: '工业产出', type: 'line', symbol: 'none', smooth: .18, lineStyle: { width: 2.5 }, areaStyle: { opacity: .07 }, data: data.activity.map(function (r) { return r.production; }) },
      { name: '产能利用率', type: 'line', yAxisIndex: 1, symbol: 'none', smooth: .18, lineStyle: { width: 2.2, type: 'dashed' }, data: data.activity.map(function (r) { return r.capacity; }) }
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
      return '<b>' + row.gpu + '</b><br>跨来源中位数：$' + row.median.toFixed(2) + '/卡·小时<br>25%–75%：$' + row.p25.toFixed(2) + '–$' + row.p75.toFixed(2) + '<br>来源数：' + row.sources;
    };
    option.xAxis = { type: 'category', data: rows.map(function (r) { return r.gpu; }), axisLabel: { fontSize: 10, fontWeight: 700 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = { type: 'value', name: 'USD / GPU·hour', axisLabel: { formatter: '${value}', fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } };
    option.series = [
      { name: '跨来源中位数', type: 'bar', barWidth: 28, data: rows.map(function (r) { return r.median; }), itemStyle: { borderRadius: [5, 5, 0, 0], color: colors.blue }, label: { show: true, position: 'top', formatter: function (p) { return '$' + p.value.toFixed(2); }, fontSize: 9, color: colors.ink } },
      { name: '25%–75% 区间', type: 'custom', silent: true, renderItem: function (params, api) {
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
      return '<b>' + row.model + '</b> · ' + row.date + '<br>输入：$' + row.input + ' / 1M Token<br>输出：$' + row.output + ' / 1M Token';
    };
    option.xAxis = { type: 'category', boundaryGap: false, data: labels, axisLabel: { interval: 0, fontSize: 9, lineHeight: 13 }, axisLine: { lineStyle: { color: '#dfe4ec' } } };
    option.yAxis = { type: 'value', name: 'USD / 1M Token', axisLabel: { formatter: '${value}', fontSize: 9 }, splitLine: { lineStyle: { color: colors.grid } } };
    option.series = [
      { name: '输入价格', type: 'line', symbolSize: 7, step: 'end', lineStyle: { width: 2.4 }, areaStyle: { opacity: .06 }, data: rows.map(function (r) { return r.input; }) },
      { name: '输出价格', type: 'line', symbolSize: 7, step: 'end', lineStyle: { width: 2.4 }, data: rows.map(function (r) { return r.output; }) }
    ];
    initChart('model-price-chart', option);
  }

  function number(value) {
    return new Intl.NumberFormat('en-US').format(value);
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
    renderRanking('overall');
    document.querySelectorAll('[data-ranking]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-ranking]').forEach(function (item) { item.classList.toggle('active', item === button); });
        renderRanking(button.dataset.ranking);
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
    renderPpi();
    renderActivity();
    renderGpu();
    renderModelPrice();
    initRanking();
    initModal();
    window.addEventListener('resize', function () { Object.keys(charts).forEach(function (key) { charts[key].resize(); }); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
