(function () {
  var STORAGE_KEY = 'wr_neocloud_tracker_v1';
  var DEFAULTS = {
    rentSource: 'manual', electricity: 0.058, pue: 1.12, facility: 207,
    interest: 0.105, target: 0.15,
    skus: {
      H100: { name: 'H100 SXM', rent: 2.40, capex: 39000, power: 1.40, opex: 0.25, utilization: 0.70, years: 4, residual: 0.30, debt: 1.00 },
      H200: { name: 'H200 SXM', rent: 3.50, capex: 45000, power: 1.50, opex: 0.254, utilization: 0.70, years: 4, residual: 0.30, debt: 1.00 },
      B200: { name: 'B200 SXM', rent: 7.50, capex: 55000, power: 1.70, opex: 0.253, utilization: 0.70, years: 4, residual: 0.30, debt: 1.00 },
      B300: { name: 'B300 SXM', rent: 7.80, capex: 65000, power: 1.85, opex: 0.278, utilization: 0.70, years: 4, residual: 0.30, debt: 1.00 },
      GB200: { name: 'GB200 NVL72 等效单卡', nameEn: 'GB200 NVL72 per-GPU equivalent', rent: 10.50, capex: 80000, power: 2.15, opex: 0.328, utilization: 0.70, years: 4, residual: 0.30, debt: 1.00 }
    }
  };
  var QUOTES = [
    { provider:'Lambda', sku:'H100', product:'8× H100 SXM instance', type:'On-demand', published:'$31.92 / 8 GPU-hr', value:3.99, include:true, url:'https://lambda.ai/instances' },
    { provider:'RunPod', sku:'H100', product:'H100 SXM Pod', type:'On-demand', published:'$2.99 / GPU-hr', value:2.99, include:true, url:'https://www.runpod.io/pricing' },
    { provider:'CoreWeave', sku:'H100', product:'8× HGX H100', type:'On-demand', published:'$49.24 / 8 GPU-hr', value:6.155, include:true, url:'https://coreweave.com/pricing' },
    { provider:'RunPod', sku:'H200', product:'H200 Pod', type:'On-demand', published:'$4.39 / GPU-hr', value:4.39, include:true, url:'https://www.runpod.io/pricing' },
    { provider:'CoreWeave', sku:'H200', product:'8× HGX H200', type:'On-demand', published:'$50.44 / 8 GPU-hr', value:6.305, include:true, url:'https://coreweave.com/pricing' },
    { provider:'Lambda', sku:'B200', product:'8× B200 SXM6 instance', type:'On-demand', published:'$53.52 / 8 GPU-hr', value:6.69, include:true, url:'https://lambda.ai/instances' },
    { provider:'RunPod', sku:'B200', product:'B200 Pod', type:'On-demand', published:'$5.89 / GPU-hr', value:5.89, include:true, url:'https://www.runpod.io/pricing' },
    { provider:'Nebius', sku:'B200', product:'B200 NVLink VM', type:'On-demand', published:'$5.50 / GPU-hr', value:5.50, include:true, url:'https://docs.nebius.com/compute/resources/pricing' },
    { provider:'CoreWeave', sku:'B200', product:'8× HGX B200', type:'On-demand', published:'$68.80 / 8 GPU-hr', value:8.60, include:true, url:'https://coreweave.com/pricing' },
    { provider:'CoreWeave', sku:'B200', product:'8× HGX B200', type:'Spot', published:'$34.87 / 8 GPU-hr', value:4.35875, include:false, url:'https://coreweave.com/pricing' },
    { provider:'RunPod', sku:'B300', product:'B300 Pod', type:'On-demand', published:'$7.39 / GPU-hr', value:7.39, include:true, url:'https://www.runpod.io/pricing' },
    { provider:'Nebius', sku:'B300', product:'B300 NVLink VM', type:'On-demand', published:'$6.10 / GPU-hr', value:6.10, include:true, url:'https://docs.nebius.com/compute/resources/pricing' },
    { provider:'Nebius', sku:'B300', product:'B300 NVLink VM', type:'Preemptible', published:'$3.40 / GPU-hr', value:3.40, include:false, url:'https://docs.nebius.com/compute/resources/pricing' }
  ];
  var SCENARIOS = {
    bear: { rent:0.80, util:-0.10, years:-1, zh:'租金下调 20%，利用率下降 10 个百分点，折旧年限缩短 1 年。', en:'Rent -20%, utilization -10ppt and depreciation life shortened by one year.' },
    base: { rent:1.00, util:0, years:0, zh:'采用手动经营租金、70% 基础利用率与 4 年经济折旧。', en:'Manual operating rent, 70% base utilization and four-year economic depreciation.' },
    bull: { rent:1.15, util:0.25, years:2, zh:'租金上调 15%，利用率提高至最高 95%，折旧年限延长 2 年。', en:'Rent +15%, utilization capped at 95% and depreciation life extended by two years.' }
  };
  var state = loadState(), scenario = 'base', focus = 'B200', charts = {};

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function loadState() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !saved.skus) return clone(DEFAULTS);
      var merged = clone(DEFAULTS), k;
      Object.keys(merged).forEach(function (key) { if (key !== 'skus' && saved[key] != null) merged[key] = saved[key]; });
      for (k in merged.skus) if (saved.skus[k]) Object.assign(merged.skus[k], saved.skus[k]);
      return merged;
    } catch (e) { return clone(DEFAULTS); }
  }
  function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function lang() { return window.WRLang && WRLang.get() === 'en' ? 'en' : 'zh'; }
  function tr(zh, en) { return lang() === 'en' ? en : zh; }
  function skuName(s) { return lang() === 'en' && s.nameEn ? s.nameEn : s.name; }
  function money(v) { return isFinite(v) ? '$' + v.toFixed(2) : '—'; }
  function pct(v) { return isFinite(v) ? (v * 100).toFixed(1) + '%' : '—'; }
  function avgQuote(sku) { var a = QUOTES.filter(function (q) { return q.sku === sku && q.include; }); return a.length ? a.reduce(function (s,q){return s+q.value;},0)/a.length : NaN; }
  function rentFor(key, s) {
    var base = state.rentSource === 'public' && isFinite(avgQuote(key)) ? avgQuote(key) : s.rent;
    return base * SCENARIOS[scenario].rent;
  }
  function calc(key, override) {
    var s = state.skus[key], sc = SCENARIOS[scenario], o = override || {};
    var utilization = o.utilization != null ? o.utilization : Math.max(0.35, Math.min(0.95, s.utilization + sc.util));
    var years = o.years != null ? o.years : Math.max(2, s.years + sc.years);
    var rent = o.rent != null ? o.rent : rentFor(key, s), billed = 8760 * utilization;
    var electricity = s.power * state.pue * state.electricity / utilization;
    var facility = state.facility * s.power * 12 / billed;
    var cash = electricity + facility + s.opex;
    var depreciation = s.capex * (1 - s.residual) / years / billed;
    var interest = s.capex * s.debt * state.interest / billed;
    var ebitCost = cash + depreciation, fullCost = ebitCost + interest;
    var hurdle = fullCost + state.target * s.capex / billed;
    return { key:key, name:s.name, rent:rent, publicRent:avgQuote(key), utilization:utilization, years:years, electricity:electricity, facility:facility, opex:s.opex, cash:cash, depreciation:depreciation, interest:interest, ebitCost:ebitCost, fullCost:fullCost, hurdle:hurdle,
      cashMargin:(rent-cash)/rent, ebitMargin:(rent-ebitCost)/rent, fullMargin:(rent-fullCost)/rent,
      cashRoic:(rent-cash)*billed/s.capex, payback:(rent>cash?s.capex/((rent-cash)*billed):Infinity) };
  }
  function allCalcs() { return Object.keys(state.skus).map(function (k) { return calc(k); }); }
  function marginClass(v) { return v < 0 ? 'negative' : 'positive'; }
  function status(c) {
    if (c.fullMargin < 0) return { cls:'loss', zh:'融资后亏损', en:'After-financing loss' };
    if (c.fullMargin < 0.25) return { cls:'thin', zh:'回报偏薄', en:'Thin return' };
    return { cls:'strong', zh:'回报充足', en:'Healthy return' };
  }
  function renderControls() {
    document.querySelectorAll('[data-scenario]').forEach(function (b) { b.classList.toggle('active', b.dataset.scenario === scenario); });
    var sc = SCENARIOS[scenario], label = scenario.charAt(0).toUpperCase() + scenario.slice(1);
    document.getElementById('scenario-summary').innerHTML = '<b>' + label + '</b>' + (lang()==='en'?sc.en:sc.zh);
    var picker = document.getElementById('focus-sku');
    picker.innerHTML = Object.keys(state.skus).map(function (k) { return '<option value="'+k+'"'+(focus===k?' selected':'')+'>'+skuName(state.skus[k])+'</option>'; }).join('');
  }
  function renderKpis() {
    var c = calc(focus), source = state.rentSource === 'public' && isFinite(c.publicRent) ? tr('公开按需均价','Public on-demand average') : tr('手动经营假设','Manual operating assumption');
    document.getElementById('kpi-rent').textContent = money(c.rent);
    document.getElementById('kpi-rent-note').textContent = source + ' · ' + pct(c.utilization) + ' ' + tr('利用率','utilization');
    var cash = document.getElementById('kpi-cash-margin'), full = document.getElementById('kpi-full-margin');
    cash.textContent = pct(c.cashMargin); cash.className = marginClass(c.cashMargin);
    full.textContent = pct(c.fullMargin); full.className = marginClass(c.fullMargin);
    document.getElementById('kpi-hurdle').textContent = money(c.hurdle);
    document.getElementById('kpi-hurdle-note').textContent = tr('目标资本回报 ','Target capital return ') + pct(state.target);
  }
  function renderUnitTable() {
    document.getElementById('unit-economics-body').innerHTML = allCalcs().map(function (c) {
      var st = status(c);
      return '<tr data-focus="'+c.key+'"><td><b>'+skuName(state.skus[c.key])+'</b><small>'+pct(c.utilization)+' · '+c.years+tr(' 年折旧','y depreciation')+'</small></td><td class="metric">'+money(c.rent)+'</td><td class="metric">'+money(c.publicRent)+'</td><td class="metric">'+money(c.cash)+'</td><td class="'+(c.cashMargin<0?'down':'up')+'">'+pct(c.cashMargin)+'</td><td class="'+(c.ebitMargin<0?'down':'up')+'">'+pct(c.ebitMargin)+'</td><td class="'+(c.fullMargin<0?'down':'up')+'">'+pct(c.fullMargin)+'</td><td class="metric">'+money(c.hurdle)+'</td><td class="'+(c.cashRoic<0?'down':'up')+'">'+pct(c.cashRoic)+'</td><td class="metric">'+(isFinite(c.payback)?c.payback.toFixed(1)+tr(' 年','y'):'—')+'</td><td><span class="status-pill '+st.cls+'">'+(lang()==='en'?st.en:st.zh)+'</span></td></tr>';
    }).join('');
  }
  function renderQuotes() {
    document.getElementById('market-quotes-body').innerHTML = QUOTES.map(function (q) {
      var type = q.type === 'On-demand' ? tr('按需','On-demand') : q.type === 'Spot' ? 'Spot' : tr('可抢占','Preemptible');
      return '<tr><td><b>'+q.provider+'</b></td><td>'+q.sku+'</td><td>'+q.product+'</td><td>'+type+'</td><td>'+q.published+'</td><td><b>'+money(q.value)+'</b></td><td class="'+(q.include?'benchmark-check':'benchmark-no')+'">'+(q.include?tr('是','Yes'):tr('否','No'))+'</td><td><a href="'+q.url+'" target="_blank" rel="noreferrer">'+tr('官方价格页','Official pricing')+' ↗</a></td></tr>';
    }).join('');
  }
  function renderAssumptions() {
    document.querySelector('#rent-source option[value="manual"]').textContent = tr('手动经营假设','Manual operating assumption');
    document.querySelector('#rent-source option[value="public"]').textContent = tr('公开按需均价','Public on-demand average');
    document.getElementById('rent-source').value = state.rentSource;
    document.getElementById('global-electricity').value = state.electricity;
    document.getElementById('global-pue').value = state.pue;
    document.getElementById('global-facility').value = state.facility;
    document.getElementById('global-interest').value = (state.interest*100).toFixed(1);
    document.getElementById('global-target').value = (state.target*100).toFixed(1);
    document.getElementById('assumptions-body').innerHTML = Object.keys(state.skus).map(function (k) { var s=state.skus[k]; return '<tr><td><b>'+skuName(s)+'</b></td>'+input(k,'rent',s.rent,0.1)+input(k,'capex',s.capex,500)+input(k,'power',s.power,0.05)+input(k,'opex',s.opex,0.01)+input(k,'utilization',s.utilization*100,1,'percent')+input(k,'years',s.years,1)+input(k,'residual',s.residual*100,1,'percent')+input(k,'debt',s.debt*100,1,'percent')+'</tr>'; }).join('');
  }
  function input(k, field, value, step, unit) { return '<td><input data-sku="'+k+'" data-field="'+field+'" data-unit="'+(unit||'raw')+'" type="number" value="'+value+'" step="'+step+'"></td>'; }
  function chartText() { return { rent:tr('选定租金','Selected rent'), cash:tr('现金成本','Cash cost'), ebit:tr('EBIT 成本','EBIT cost'), full:tr('融资后全成本','After-financing cost'), power:tr('电力','Electricity'), facility:tr('设施','Facility'), opex:tr('运维','Operations'), dep:tr('折旧','Depreciation'), interest:tr('利息','Interest'), margin:tr('融资后利润率','After-financing margin') }; }
  function initChart(id) { if (!charts[id]) charts[id] = echarts.init(document.getElementById(id)); return charts[id]; }
  function renderCharts() {
    var data=allCalcs(), names=data.map(function(c){return c.key;}), t=chartText();
    initChart('rent-cost-chart').setOption({tooltip:{trigger:'axis'},legend:{bottom:0},grid:{left:48,right:18,top:28,bottom:54},xAxis:{type:'category',data:names},yAxis:{type:'value',name:'$/GPU-hr'},series:[{name:t.rent,type:'bar',data:data.map(function(c){return +c.rent.toFixed(2);}),itemStyle:{color:'#356df3'}},{name:t.cash,type:'line',data:data.map(function(c){return +c.cash.toFixed(2);}),itemStyle:{color:'#269864'}},{name:t.ebit,type:'line',data:data.map(function(c){return +c.ebitCost.toFixed(2);}),itemStyle:{color:'#b98527'}},{name:t.full,type:'line',data:data.map(function(c){return +c.fullCost.toFixed(2);}),itemStyle:{color:'#d64a43'}}]});
    initChart('cost-stack-chart').setOption({tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},legend:{bottom:0},grid:{left:48,right:18,top:28,bottom:54},xAxis:{type:'category',data:names},yAxis:{type:'value',name:'$/GPU-hr'},series:[['electricity',t.power,'#7aa2ff'],['facility',t.facility,'#356df3'],['opex',t.opex,'#8c97aa'],['depreciation',t.dep,'#d3a442'],['interest',t.interest,'#d64a43']].map(function(x){return{name:x[1],type:'bar',stack:'cost',data:data.map(function(c){return +c[x[0]].toFixed(2);}),itemStyle:{color:x[2]}};})});
    var rates=[]; for(var r=1;r<=12;r+=0.5) rates.push(r);
    initChart('margin-curve-chart').setOption({tooltip:{trigger:'axis',valueFormatter:function(v){return v.toFixed(1)+'%';}},legend:{bottom:0},grid:{left:55,right:72,top:24,bottom:54},xAxis:{type:'category',name:'$/GPU-hr',data:rates.map(function(x){return x.toFixed(1);})},yAxis:{type:'value',name:'%',axisLabel:{formatter:'{value}%'}},series:Object.keys(state.skus).map(function(k,i){return{name:k,type:'line',showSymbol:false,data:rates.map(function(r){return +(calc(k,{rent:r}).fullMargin*100).toFixed(1);}),lineStyle:{width:k===focus?3:1.4,opacity:k===focus?1:.55},z:k===focus?5:1,markLine:k===focus?{symbol:'none',label:{position:'insideEndTop',formatter:tr('盈亏平衡','Break-even')},data:[{yAxis:0}]}:undefined};})});
  }
  function renderSensitivity() {
    var c=calc(focus), rents=[0.7,0.85,1,1.15,1.3,1.45].map(function(m){return c.rent*m;}), utils=[0.50,0.60,0.70,0.80,0.90];
    var html='<div class="sensitivity-cell head"></div>'+rents.map(function(r){return '<div class="sensitivity-cell head">'+money(r)+'</div>';}).join('');
    utils.forEach(function(u){html+='<div class="sensitivity-cell head">'+pct(u)+'</div>'; rents.forEach(function(r){var m=calc(focus,{rent:r,utilization:u}).fullMargin, cls=m<0?'loss':m<.2?'thin':m<.45?'good':'great', current=Math.abs(r-c.rent)<.01&&Math.abs(u-c.utilization)<.01?' current':'';html+='<div class="sensitivity-cell '+cls+current+'">'+pct(m)+'</div>';});});
    document.getElementById('sensitivity-grid').innerHTML=html; document.getElementById('sensitivity-label').textContent=skuName(state.skus[focus]);
  }
  function renderNarrative() {
    var h=calc('H100'), b=calc('B200');
    document.getElementById('margin-insight').textContent = tr('在当前情景下，H100 融资后全成本为 '+money(h.fullCost)+'，B200 为 '+money(b.fullCost)+'。租金跌破全成本代表严格亏损，跌破门槛租金则代表无法达到 '+pct(state.target)+' 的目标资本回报。','Under the current scenario, H100 after-financing cost is '+money(h.fullCost)+' and B200 is '+money(b.fullCost)+'. Falling below full cost means a strict loss; falling below hurdle rent means missing the '+pct(state.target)+' target capital return.');
    document.getElementById('research-conclusion').innerHTML = tr('NeoCloud 的即时利润主要集中在新一代 GPU 的稀缺溢价。当前模型下，H100 在低价公开市场已接近融资后盈亏线，而 B200 仍保有明显价差；但 B200 的高利润率依赖较高租金与持续利用率，不能把公开按需标价直接等同于企业长约利润。','NeoCloud economics remain concentrated in scarcity premiums for new GPU generations. In this model, H100 is near the after-financing break-even line in lower-priced public markets, while B200 retains a meaningful spread. B200 returns still depend on rental rates and sustained utilization; public on-demand list prices should not be treated as enterprise contract economics.');
  }
  function render() { renderControls(); renderKpis(); renderUnitTable(); renderQuotes(); renderAssumptions(); renderCharts(); renderSensitivity(); renderNarrative(); }
  function updateGlobal(id, key, scale) { document.getElementById(id).addEventListener('change',function(){state[key]=Number(this.value)*(scale||1);saveState();render();}); }
  function exportCsv() {
    var rows=[[tr('GPU','GPU'),tr('选定租金','Selected rent'),tr('现金成本','Cash cost'),tr('EBIT 成本','EBIT cost'),tr('融资后全成本','After-financing cost'),tr('融资后利润率','After-financing margin'),tr('门槛租金','Hurdle rent')]];
    allCalcs().forEach(function(c){rows.push([c.name,c.rent,c.cash,c.ebitCost,c.fullCost,c.fullMargin,c.hurdle]);});
    var blob=new Blob(['\ufeff'+rows.map(function(r){return r.join(',');}).join('\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='neocloud_unit_economics_'+scenario+'.csv';a.click();URL.revokeObjectURL(a.href);
  }
  function bind() {
    document.querySelector('.scenario-switch').addEventListener('click',function(e){var b=e.target.closest('[data-scenario]');if(!b)return;scenario=b.dataset.scenario;render();});
    document.getElementById('focus-sku').addEventListener('change',function(){focus=this.value;render();});
    document.getElementById('rent-source').addEventListener('change',function(){state.rentSource=this.value;saveState();render();});
    updateGlobal('global-electricity','electricity'); updateGlobal('global-pue','pue'); updateGlobal('global-facility','facility'); updateGlobal('global-interest','interest',.01); updateGlobal('global-target','target',.01);
    document.getElementById('assumptions-body').addEventListener('change',function(e){var x=e.target;if(!x.dataset.sku)return;var v=Number(x.value);if(x.dataset.unit==='percent')v/=100;state.skus[x.dataset.sku][x.dataset.field]=v;saveState();render();});
    document.getElementById('unit-economics-body').addEventListener('click',function(e){var row=e.target.closest('[data-focus]');if(row){focus=row.dataset.focus;render();}});
    document.getElementById('reset-assumptions').addEventListener('click',function(){state=clone(DEFAULTS);saveState();render();});
    document.getElementById('export-csv').addEventListener('click',exportCsv);
    window.addEventListener('resize',function(){Object.keys(charts).forEach(function(k){charts[k].resize();});});
  }
  bind();
  if(window.WRLang&&WRLang.onChange)WRLang.onChange(render);else render();
})();
