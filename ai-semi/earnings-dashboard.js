(function(){
  function isEnglish(){return window.WRLang&&window.WRLang.get&&window.WRLang.get()==='en';}
  function tr(zh,en){return isEnglish()?en:zh;}
  var rows=[
    {segment:'hardware',sub:'gpu',label:'GPU',company:'NVIDIA',calendarPeriod:'2026Q2',period:'Q1 FY27',revenue:['$81.62B','$78.91B',3.4],eps:['$1.87','$1.75',6.9],detail:'数据中心 $75.2B（同比 +92%）。',status:'beat',statusText:'收入与 EPS 双超预期',actual:'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx',consensus:'https://apnews.com/article/955c699a0c91c423edc81b7903b80f85',guidance:{target:'Q2 FY27',company:'收入 $91B ±2%',consensus:'N/D',gap:null,status:'na',statusText:'未取得可比一致预期'}},
    {segment:'hardware',sub:'cpu',label:'CPU / GPU',company:'AMD',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['$11.54B','$11.30B',2.1],eps:['$1.66','$1.61',3.1],detail:'数据中心 $6.72B（同比 +107%）；公司未拆分 EPYC CPU 与 Instinct GPU 收入。',status:'beat',statusText:'收入与 EPS 双超预期',actual:'https://ir.amd.com/news-events/press-releases/detail/1295/amd-reports-second-quarter-2026-financial-results',consensus:'https://www.marketbeat.com/instant-alerts/advanced-micro-devices-amd-to-post-earnings-on-tuesday-2026-07-28/',guidance:{target:'Q3 2026',company:'收入中值 $13.0B',consensus:'$12.52B',gap:3.8,status:'beat',statusText:'收入指引高于预期'}},
    {segment:'hardware',sub:'asic',label:'定制芯片 / 网络',company:'Broadcom',calendarPeriod:'2026Q2',period:'Q2 FY26',revenue:['$22.19B','$22.27B',-0.4],eps:['$2.44','$2.40',1.7],detail:'AI 半导体收入 $10.8B（同比 +143%）。',status:'mixed',statusText:'收入略低，EPS 超预期',actual:'https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial',consensus:'https://www.marketscreener.com/news/broadcom-s-second-quarter-revenue-misses-estimates-as-competition-bites-ce7f5ddcd98df32c',guidance:{target:'Q3 FY26',company:'收入约 $29.4B',consensus:'N/D',gap:null,status:'na',statusText:'未取得可比一致预期'}},
    {segment:'hardware',sub:'optical',label:'光互连',company:'Lumentum',calendarPeriod:'2026Q1',period:'Q3 FY26',revenue:['$808.4M','N/D',null],eps:['N/D','N/D',null],detail:'当季披露验证 800G / 1.6T 光互连需求，但缺少可比一致预期。',status:'na',statusText:'当季缺少可比预期',actual:'https://investor.lumentum.com/quarterly-results/default.aspx',actualConsensus:null,consensus:'https://uk.finance.yahoo.com/news/lumentum-forecasts-quarterly-revenue-above-211121969.html',guidance:{target:'Q4 FY26',company:'收入中值 $985M',consensus:'$908.3M',gap:8.4,status:'beat',statusText:'收入指引高于预期'}},
    {segment:'hardware',sub:'optical',label:'光互连',company:'Coherent',calendarPeriod:'2026Q2',period:'Q4 FY26',revenue:['$2.05B','N/D',null],eps:['$1.74','N/D',null],detail:'non-GAAP 毛利率 40.2%；公司将增长主要归因于 AI 数据中心光互连需求。',status:'na',statusText:'已核验官方实际值，缺少可比预期',actual:'https://www.coherent.com/news/press-releases/fourth-quarter-and-fiscal-year-2026-results',actualConsensus:null,consensus:null},
    {segment:'hardware',sub:'memory',label:'存储 / HBM',company:'Micron',calendarPeriod:'2026Q2',period:'Q3 FY26',revenue:['$41.46B','$35.91B',15.5],eps:['$25.11','$21.39',17.4],detail:'DRAM 收入 $31.3B；调整后毛利率 84.9%。',status:'beat',statusText:'收入与 EPS 大幅超预期',actual:'https://investors.micron.com/news-releases/news-release-details/micron-technology-inc-reports-record-results-third-quarter',consensus:'https://www.marketbeat.com/stocks/NASDAQ/MU/earnings/',guidance:{target:'Q4 FY26',company:'收入中值 $50B',consensus:'N/D',gap:null,status:'na',statusText:'未取得可比一致预期'}},
    {segment:'hardware',sub:'memory',label:'存储 / HBM',company:'Samsung Electronics',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['KRW 171.5T','N/D',null],eps:['KRW 10,849','N/D',null],detail:'DS 部门收入 KRW 127.5T、营业利润 KRW 89.2T；Memory 创季度纪录，并开始 HBM4 出货。',status:'na',statusText:'已核验官方实际值，缺少可比预期',actual:'https://news.samsungsemiconductor.com/global/samsung-electronics-announces-second-quarter-2026-results/',actualConsensus:null,consensus:null},
    {segment:'hardware',sub:'memory',label:'存储 / HBM',company:'SK hynix',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['KRW 79.3187T','N/D',null],eps:['N/D','N/D',null],detail:'营业利润 KRW 60.5426T；公司披露 HBM4 已开始量产出货，当季数据为初步口径。',status:'na',statusText:'已核验官方初步值，缺少可比预期',actual:'https://news.skhynix.com/en/q2-2026-business-results/',actualConsensus:null,consensus:null},
    {segment:'hardware',sub:'memory',label:'NAND / 企业级 SSD',company:'Sandisk',calendarPeriod:'2026Q2',period:'Q4 FY26',revenue:['$8.965B','N/D',null],eps:['$39.25','N/D',null],detail:'non-GAAP EPS $39.25；公司披露数据中心业务连续第三个季度环比增长。',status:'na',statusText:'已核验官方实际值，缺少可比预期',actual:'https://investor.sandisk.com/news-releases/news-release-details/sandisk-reports-fiscal-fourth-quarter-2026-financial-results',actualConsensus:null,consensus:null,guidance:{target:'Q1 FY27',company:'收入 $10.30B–$10.80B；non-GAAP EPS $44–$46',consensus:'N/D',gap:null,status:'na',statusText:'官方指引，未取得可比一致预期'}},
    {segment:'hardware',sub:'cooling',label:'液冷 / 数据中心基础设施',company:'Vertiv',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['$3.27B','$3.38B',-3.1],eps:['$1.52','$1.42',7.0],detail:'调整后营业利润率 22.6%。',status:'mixed',statusText:'收入低于预期，EPS 超预期',actual:'https://investors.vertiv.com/news/news-details/2026/Vertiv-Reports-Strong-Second-Quarter-2026-with-Diluted-EPS-Growth-of-53-Adjusted-Diluted-EPS-Growth-of-60-Raises-Full-Year-2026-Guidance-Across-All-Key-Metrics/default.aspx',consensus:'https://www.investing.com/news/earnings/vertiv-holdings-co-earnings-beat-by-010-revenue-fell-short-of-estimates-4819190',guidance:{target:'Q3 2026',company:'收入中值 $3.75B',consensus:'$3.71B',gap:1.1,status:'beat',statusText:'收入指引高于预期'}},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Microsoft',calendarPeriod:'2026Q2',period:'Q4 FY26',revenue:['$90.00B','$87.62B',2.7],eps:['$4.81','$4.24',13.4],detail:'Microsoft Cloud $59.3B（同比 +27%）；Azure 同比 +43%。',status:'beat',statusText:'收入与 EPS 双超预期',actual:'https://www.microsoft.com/en-us/Investor/',consensus:'https://apnews.com/article/f7dff4fb9d51a2bdec56a13e5da1053d'},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Alphabet',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['$119.80B','$117.06B',2.3],eps:['N/C','$2.88',null],detail:'Google Cloud $24.77B，较预期 $22.46B 高约 10.3%；GAAP EPS 与调整后预期不可直接比较。',status:'beat',statusText:'收入与云业务超预期',actual:'https://abc.xyz/investor/',consensus:'https://apnews.com/article/f914606d842d4c6848019083d667fc3a'},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Amazon',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['$200.60B','$196.40B',2.1],eps:['N/D','N/D',null],detail:'AWS 收入约 $42.2B，较市场预期 $40.63B 高约 3.9%；AWS 同比 +37%。',status:'beat',statusText:'集团收入与 AWS 超预期',actual:'https://www.aboutamazon.com/news/company-news/amazon-earnings-q2-2026-report',consensus:'https://www.axios.com/2026/07/30/amazon-earnings-revenue-ai'},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Meta',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['$60.80B','$60.22B',1.0],eps:['$6.18','$7.19',-14.0],detail:'收入同比 +28%，法律费用与裁员成本压低利润；Family of Apps 日活约 36 亿。',status:'mixed',statusText:'收入符合预期，EPS 低于预期',actual:'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx',consensus:'https://apnews.com/article/bcbc62dde6d2cac724e3b3385fcabeab'},
    {segment:'model',sub:'model',label:'模型商业化',company:'Microsoft Copilot',calendarPeriod:'2026Q2',period:'Q4 FY26',revenue:['未单独披露','—',null],eps:['—','—',null],detail:'M365 Copilot 付费席位超过 3,000 万；收入并入 Microsoft Cloud / Productivity。',status:'na',statusText:'不可计算模型收入',actual:'https://apnews.com/article/f7dff4fb9d51a2bdec56a13e5da1053d',consensus:null},
    {segment:'model',sub:'model',label:'模型商业化',company:'Google Gemini',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['未单独披露','—',null],eps:['—','—',null],detail:'Gemini 用户接近 10 亿；收入混合在广告、云和订阅中。',status:'na',statusText:'不可计算模型收入',actual:'https://apnews.com/article/f914606d842d4c6848019083d667fc3a',consensus:null},
    {segment:'model',sub:'model',label:'模型商业化',company:'Meta AI / Llama',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['未单独披露','—',null],eps:['—','—',null],detail:'AI 对广告推荐和互动有贡献，但未披露 Llama 或 Meta AI 独立收入与成本。',status:'na',statusText:'不可计算模型收入',actual:'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx',consensus:null},
    {segment:'application',sub:'application',label:'企业 AI 应用',company:'Palantir',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['$1.94B','$1.81B',6.9],eps:['$0.41','$0.35',17.1],detail:'收入同比 +93%；美国商业收入同比 +149%。',status:'beat',statusText:'收入与 EPS 双超预期',actual:'https://investors.palantir.com/',consensus:'https://www.kiplinger.com/investing/stocks/s-and-p-500-joins-dow-in-record-high-territory-stock-market-today',guidance:{target:'FY 2026',company:'上调全年收入增长预期',consensus:'N/D',gap:null,status:'na',statusText:'缺少可比数值'}},
    {segment:'application',sub:'application',label:'企业 AI 工作流',company:'ServiceNow',calendarPeriod:'2026Q2',period:'Q2 2026',revenue:['$3.99B','$3.92B',1.8],eps:['$0.90','$0.86',4.7],detail:'订阅收入 $3.877B（同比 +24.5%）；未来 12 个月 cRPO $13.2B（同比 +21%）。',status:'beat',statusText:'收入与 EPS 双超预期',actual:'https://investor.servicenow.com/news/news-details/2026/ServiceNow-Reports-Second-Quarter-2026-Financial-Results/default.aspx',consensus:'https://en.sedaily.com/international/2026/07/23/servicenow-beats-q2-revenue-eps-estimates'},
    {segment:'application',sub:'application',label:'创意与生产力 AI',company:'Adobe',calendarPeriod:'2026Q2',period:'Q2 FY26',revenue:['$6.62B','$6.46B',2.5],eps:['$5.96','$5.83',2.2],detail:'创意与营销订阅收入 $4.54B。',status:'beat',statusText:'收入与 EPS 双超预期',actual:'https://www.adobe.com/cc-shared/assets/investor-relations/pdfs/11606202/a5543arefgt.pdf',consensus:'https://www.zacks.com/stock/news/2936122/adobe-adbe-q2-earnings-how-key-metrics-compare-to-wall-street-estimates',guidance:{target:'FY 2026',company:'收入 $26.5B–$26.6B',consensus:'N/D',gap:null,status:'na',statusText:'未取得可比一致预期'}}
  ];

  var segmentNames={hardware:'硬件',cloud:'云厂商',model:'模型',application:'下游应用'};
  var layerNames={upstream:'上游基础设施',midstream:'中游云与模型',downstream:'下游应用'};
  var statusNames={beat:'超预期',mixed:'结果分化',miss:'低于预期',na:'不可计算'};
  var activeLayer='all',activeSegment='all',activeSub='all',activePeriod='all',searchTerm='';

  function layerFor(row){
    if(row.segment==='hardware')return 'upstream';
    if(row.segment==='application')return 'downstream';
    return 'midstream';
  }

  function formatSurprise(value){
    if(value===null||value===undefined)return '<span class="not-comparable">N/C</span>';
    var cls=value>1?'positive':value<-1?'negative':'neutral';
    return '<span class="surprise '+cls+'">'+(value>0?'+':'')+value.toFixed(1)+'%</span>';
  }
  function metricCell(metric){return '<div class="actual-forecast"><b>'+metric[0]+'</b><span>预期 '+metric[1]+'</span></div>';}
  function sourceLink(row){
    var actual='<a class="source-mini" href="'+row.actual+'" target="_blank" rel="noopener">实际值来源</a>';
    var consensusUrl=row.actualConsensus===null?null:row.consensus;
    var consensus=consensusUrl?'<a class="source-mini" href="'+consensusUrl+'" target="_blank" rel="noopener">预期来源</a>':'<span class="source-mini disabled">无可比预期</span>';
    return actual+consensus;
  }
  function periodCell(row){
    return '<div class="period-cell"><b>'+row.calendarPeriod.replace('Q',' Q')+'</b><span>'+row.period+'</span></div>';
  }
  function matchesFilters(row){
    if(activeLayer!=='all'&&layerFor(row)!==activeLayer)return false;
    if(activeSegment!=='all'&&row.segment!==activeSegment)return false;
    if(activeSub!=='all'&&row.sub!==activeSub)return false;
    if(activePeriod!=='all'&&row.calendarPeriod!==activePeriod)return false;
    if(searchTerm){
      var haystack=[row.company,row.label,layerNames[layerFor(row)],segmentNames[row.segment],row.period,row.calendarPeriod,row.detail].join(' ').toLowerCase();
      if(haystack.indexOf(searchTerm)===-1)return false;
    }
    return true;
  }
  function renderRows(){
    var host=document.getElementById('earnings-detail-rows');if(!host)return;
    var filtered=rows.filter(matchesFilters);
    host.innerHTML=filtered.map(function(row){
      return '<tr><td><span class="chain-label">'+layerNames[layerFor(row)]+' · '+segmentNames[row.segment]+' · '+row.label+'</span><a class="company-link" href="'+row.actual+'" target="_blank" rel="noopener">'+row.company+'</a><div class="row-sources">'+sourceLink(row)+'</div></td><td>'+periodCell(row)+'</td><td>'+metricCell(row.revenue)+'</td><td>'+formatSurprise(row.revenue[2])+'</td><td>'+metricCell(row.eps)+'</td><td>'+formatSurprise(row.eps[2])+'</td><td class="detail-cell">'+row.detail+'</td><td><span class="verdict '+row.status+'">'+statusNames[row.status]+'</span><small class="verdict-note">'+row.statusText+'</small></td></tr>';
    }).join('')||'<tr><td colspan="8" class="empty-state">该筛选条件下没有可比公司。</td></tr>';
  }
  function guidanceSources(row){
    var actual='<a class="source-mini" href="'+row.actual+'" target="_blank" rel="noopener">公司指引</a>';
    var consensus=row.consensus&&row.guidance.consensus!=='N/D'?'<a class="source-mini" href="'+row.consensus+'" target="_blank" rel="noopener">预期来源</a>':'<span class="source-mini disabled">无可比预期</span>';
    return actual+consensus;
  }
  function renderGuidanceRows(){
    var host=document.getElementById('guidance-detail-rows');if(!host)return;
    var filtered=rows.filter(function(row){return row.guidance&&matchesFilters(row);});
    host.innerHTML=filtered.map(function(row){
      var guidance=row.guidance;
      return '<tr><td><span class="chain-label">'+layerNames[layerFor(row)]+' · '+segmentNames[row.segment]+' · '+row.label+'</span><a class="company-link" href="'+row.actual+'" target="_blank" rel="noopener">'+row.company+'</a></td><td>'+periodCell(row)+'</td><td><b class="guidance-target">'+guidance.target+'</b></td><td><b>'+guidance.company+'</b></td><td>'+guidance.consensus+'</td><td>'+formatSurprise(guidance.gap)+'</td><td><span class="verdict '+guidance.status+'">'+statusNames[guidance.status]+'</span><small class="verdict-note">'+guidance.statusText+'</small></td><td><div class="row-sources guidance-sources">'+guidanceSources(row)+'</div></td></tr>';
    }).join('')||'<tr><td colspan="8" class="empty-state">该筛选条件下没有单独披露的未来指引。</td></tr>';
  }
  function renderAll(){renderRows();renderGuidanceRows();}

  document.querySelectorAll('[data-earnings-filter]').forEach(function(bar){
    bar.addEventListener('click',function(event){
      var button=event.target.closest('[data-value]');if(!button)return;
      bar.querySelectorAll('[data-value]').forEach(function(item){item.classList.toggle('active',item===button);});
      if(bar.dataset.earningsFilter==='calendarPeriod'){
        activePeriod=button.dataset.value;
      }else if(bar.dataset.earningsFilter==='layer'){
        activeLayer=button.dataset.value;
        activeSegment='all';
        activeSub='all';
        document.querySelectorAll('[data-earnings-filter="segment"] [data-value], [data-earnings-filter="subsegment"] [data-value]').forEach(function(item){item.classList.toggle('active',item.dataset.value==='all');});
      }else if(bar.dataset.earningsFilter==='segment'){
        activeSegment=button.dataset.value;
        activeLayer=activeSegment==='hardware'?'upstream':activeSegment==='application'?'downstream':activeSegment==='all'?'all':'midstream';
        document.querySelectorAll('[data-earnings-filter="layer"] [data-value]').forEach(function(item){item.classList.toggle('active',item.dataset.value===activeLayer);});
        if(activeSegment!=='all'&&activeSegment!=='hardware'){
          activeSub='all';
          document.querySelectorAll('[data-earnings-filter="subsegment"] [data-value]').forEach(function(item){item.classList.toggle('active',item.dataset.value==='all');});
        }
      }else{
        activeSub=button.dataset.value;
        if(activeSub!=='all'){
          activeSegment='hardware';
          activeLayer='upstream';
          document.querySelectorAll('[data-earnings-filter="segment"] [data-value]').forEach(function(item){item.classList.toggle('active',item.dataset.value==='hardware');});
          document.querySelectorAll('[data-earnings-filter="layer"] [data-value]').forEach(function(item){item.classList.toggle('active',item.dataset.value==='upstream');});
        }
      }
      renderAll();
    });
  });

  var search=document.getElementById('earnings-search');
  if(search)search.addEventListener('input',function(){searchTerm=search.value.trim().toLowerCase();renderAll();});

  function surpriseOption(){
    var chartRows=rows.filter(function(row){return typeof row.revenue[2]==='number';}).sort(function(a,b){return a.revenue[2]-b.revenue[2];});
    return {
    animationDuration:700,
    grid:{left:96,right:40,top:24,bottom:34},
    tooltip:{trigger:'axis',axisPointer:{type:'shadow'},backgroundColor:'#17304f',borderWidth:0,textStyle:{color:'#fff',fontSize:12},formatter:function(params){var p=params[0],row=chartRows[p.dataIndex];return '<b>'+row.company+'</b><br>'+tr('实际收入','Actual revenue')+' '+row.revenue[0]+'<br>'+tr('一致预期','Consensus')+' '+row.revenue[1]+'<br>'+tr('预期差','Surprise')+' '+(row.revenue[2]>0?'+':'')+row.revenue[2].toFixed(1)+'%';}},
    xAxis:{type:'value',name:tr('收入预期差 (%)','Revenue surprise (%)'),nameLocation:'middle',nameGap:25,axisLabel:{formatter:'{value}%',color:'#7b8490'},splitLine:{lineStyle:{color:'#eceff4'}},axisLine:{lineStyle:{color:'#cfd5df'}}},
    yAxis:{type:'category',data:chartRows.map(function(row){return row.company;}),axisLabel:{color:'#273548',fontWeight:600},axisTick:{show:false},axisLine:{show:false}},
    series:[{type:'bar',data:chartRows.map(function(row){return {value:row.revenue[2],itemStyle:{color:row.revenue[2]>1?'#d64a43':row.revenue[2]<-1?'#269864':'#b98527',borderRadius:row.revenue[2]>=0?[0,4,4,0]:[4,0,0,4]}};}),barMaxWidth:18,label:{show:true,position:function(p){return p.value>=0?'right':'left';},formatter:function(p){return (p.value>0?'+':'')+p.value.toFixed(1)+'%';},color:'#596579',fontSize:10}}]
  };}

  var chartHost=document.getElementById('earnings-surprise-chart'),chart;
  function renderChart(){if(!chartHost||!window.echarts)return;if(!chart)chart=echarts.init(chartHost);chart.setOption(surpriseOption(),true);if(modalChart)modalChart.setOption(surpriseOption(),true);var modalTitle=document.getElementById('earnings-modal-title');if(modalTitle&&modal&&!modal.hidden)modalTitle.textContent=tr('最新季度收入预期差','Latest Quarterly Revenue Surprise');}
  if(chartHost&&window.echarts){window.addEventListener('resize',function(){chart.resize();});}
  var modal=document.getElementById('earnings-chart-modal'),modalChart;
  document.querySelectorAll('[data-expand-chart]').forEach(function(button){button.addEventListener('click',function(){if(!modal||!window.echarts)return;modal.hidden=false;document.body.classList.add('modal-open');document.getElementById('earnings-modal-title').textContent=tr('最新季度收入预期差','Latest Quarterly Revenue Surprise');modalChart=echarts.init(document.getElementById('earnings-modal-chart'));modalChart.setOption(surpriseOption());});});
  function closeModal(){if(!modal)return;if(modalChart){modalChart.dispose();modalChart=null;}modal.hidden=true;document.body.classList.remove('modal-open');}
  document.querySelectorAll('#earnings-chart-modal [data-close-modal]').forEach(function(item){item.addEventListener('click',closeModal);});
  document.addEventListener('keydown',function(event){if(event.key==='Escape'&&modal&&!modal.hidden)closeModal();});
  renderAll();
  if(window.WRLang&&window.WRLang.onChange)window.WRLang.onChange(renderChart);else renderChart();
})();
