(function(){
  function isEnglish(){return window.WRLang&&window.WRLang.get&&window.WRLang.get()==='en';}
  function tr(zh,en){return isEnglish()?en:zh;}
  var rows=[
    {segment:'hardware',sub:'gpu',label:'GPU',company:'NVIDIA',period:'Q1 FY27',revenue:['$81.62B','$78.91B',3.4],eps:['$1.87','$1.75',6.9],detail:'数据中心 $75.2B（同比 +92%）；Q2 收入指引 $91B ±2%。',status:'beat',statusText:'收入与EPS双超预期',actual:'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-First-Quarter-Fiscal-2027/default.aspx',consensus:'https://apnews.com/article/955c699a0c91c423edc81b7903b80f85'},
    {segment:'hardware',sub:'cpu',label:'CPU / GPU',company:'AMD',period:'Q2 2026',revenue:['$11.54B','$11.30B',2.1],eps:['$1.66','$1.61',3.1],detail:'数据中心 $6.72B（同比 +107%）；公司未拆分 EPYC CPU 与 Instinct GPU 收入；Q3 收入指引中值 $13.0B，高于预期 $12.52B 约 3.8%。',status:'beat',statusText:'收入、EPS与指引均超预期',actual:'https://ir.amd.com/news-events/press-releases/detail/1295/amd-reports-second-quarter-2026-financial-results',consensus:'https://www.marketbeat.com/instant-alerts/advanced-micro-devices-amd-to-post-earnings-on-tuesday-2026-07-28/'},
    {segment:'hardware',sub:'asic',label:'定制芯片 / 网络',company:'Broadcom',period:'Q2 FY26',revenue:['$22.19B','$22.27B',-0.4],eps:['$2.44','$2.40',1.7],detail:'AI 半导体收入 $10.8B（同比 +143%）；Q3 收入指引约 $29.4B。',status:'mixed',statusText:'收入略低，EPS超预期',actual:'https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial',consensus:'https://www.marketscreener.com/news/broadcom-s-second-quarter-revenue-misses-estimates-as-competition-bites-ce7f5ddcd98df32c'},
    {segment:'hardware',sub:'optical',label:'光互连',company:'Lumentum',period:'Q3 FY26',revenue:['$808.4M','N/D',null],eps:['N/D','N/D',null],detail:'Q4 收入指引中值 $985M，高于分析师预期 $908.3M 约 8.4%；验证 800G / 1.6T 光互连需求。',status:'beat',statusText:'下一季指引超预期',actual:'https://investor.lumentum.com/quarterly-results/default.aspx',consensus:'https://uk.finance.yahoo.com/news/lumentum-forecasts-quarterly-revenue-above-211121969.html'},
    {segment:'hardware',sub:'memory',label:'存储 / HBM',company:'Micron',period:'Q3 FY26',revenue:['$41.46B','$35.91B',15.5],eps:['$25.11','$21.39',17.4],detail:'DRAM 收入 $31.3B；调整后毛利率 84.9%；Q4 收入指引中值 $50B。',status:'beat',statusText:'收入与EPS大幅超预期',actual:'https://investors.micron.com/news-releases/news-release-details/micron-technology-inc-reports-record-results-third-quarter',consensus:'https://www.marketbeat.com/stocks/NASDAQ/MU/earnings/'},
    {segment:'hardware',sub:'cooling',label:'液冷 / 数据中心基础设施',company:'Vertiv',period:'Q2 2026',revenue:['$3.27B','$3.38B',-3.1],eps:['$1.52','$1.42',7.0],detail:'调整后营业利润率 22.6%；Q3 收入指引中值 $3.75B，高于预期 $3.71B 约 1.1%。',status:'mixed',statusText:'收入低于预期，EPS与指引较强',actual:'https://investors.vertiv.com/news/news-details/2026/Vertiv-Reports-Strong-Second-Quarter-2026-with-Diluted-EPS-Growth-of-53-Adjusted-Diluted-EPS-Growth-of-60-Raises-Full-Year-2026-Guidance-Across-All-Key-Metrics/default.aspx',consensus:'https://www.investing.com/news/earnings/vertiv-holdings-co-earnings-beat-by-010-revenue-fell-short-of-estimates-4819190'},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Microsoft',period:'Q4 FY26',revenue:['$90.00B','$87.62B',2.7],eps:['$4.81','$4.24',13.4],detail:'Microsoft Cloud $59.3B（同比 +27%）；Azure 同比 +43%；M365 Copilot 付费席位超过 3,000 万。',status:'beat',statusText:'收入与EPS双超预期',actual:'https://www.microsoft.com/en-us/Investor/',consensus:'https://apnews.com/article/f7dff4fb9d51a2bdec56a13e5da1053d'},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Alphabet',period:'Q2 2026',revenue:['$119.80B','$117.06B',2.3],eps:['N/C','$2.88',null],detail:'Google Cloud $24.77B，较预期 $22.46B 高约 10.3%；GAAP EPS 含大额投资收益，与调整后预期不可直接比较。',status:'beat',statusText:'收入与云业务超预期',actual:'https://abc.xyz/investor/',consensus:'https://apnews.com/article/f914606d842d4c6848019083d667fc3a'},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Amazon',period:'Q2 2026',revenue:['$200.60B','$196.40B',2.1],eps:['N/D','N/D',null],detail:'AWS 收入约 $42.2B，较市场预期 $40.63B 高约 3.9%；AWS 同比 +37%。',status:'beat',statusText:'集团收入与AWS超预期',actual:'https://www.aboutamazon.com/news/company-news/amazon-earnings-q2-2026-report',consensus:'https://www.axios.com/2026/07/30/amazon-earnings-revenue-ai'},
    {segment:'cloud',sub:'cloud',label:'云厂商',company:'Meta',period:'Q2 2026',revenue:['$60.80B','$60.22B',1.0],eps:['$6.18','$7.19',-14.0],detail:'收入同比 +28%，但法律费用与裁员成本压低利润；Family of Apps 日活约 36 亿。',status:'mixed',statusText:'收入超预期，EPS低于预期',actual:'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx',consensus:'https://apnews.com/article/bcbc62dde6d2cac724e3b3385fcabeab'},
    {segment:'model',sub:'model',label:'模型商业化',company:'Microsoft Copilot',period:'Q4 FY26',revenue:['未单独披露','—',null],eps:['—','—',null],detail:'M365 Copilot 付费席位超过 3,000 万；收入并入 Microsoft Cloud / Productivity，无法计算模型单独预期差。',status:'na',statusText:'不可计算模型收入',actual:'https://apnews.com/article/f7dff4fb9d51a2bdec56a13e5da1053d',consensus:null},
    {segment:'model',sub:'model',label:'模型商业化',company:'Google Gemini',period:'Q2 2026',revenue:['未单独披露','—',null],eps:['—','—',null],detail:'Gemini 用户接近 10 亿；收入混合在广告、云和订阅中，没有独立模型收入或利润率。',status:'na',statusText:'不可计算模型收入',actual:'https://apnews.com/article/f914606d842d4c6848019083d667fc3a',consensus:null},
    {segment:'model',sub:'model',label:'模型商业化',company:'Meta AI / Llama',period:'Q2 2026',revenue:['未单独披露','—',null],eps:['—','—',null],detail:'AI 对广告推荐和用户互动有贡献，但公司未披露 Llama 或 Meta AI 独立收入、成本与一致预期。',status:'na',statusText:'不可计算模型收入',actual:'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Second-Quarter-2026-Results/default.aspx',consensus:null},
    {segment:'application',sub:'application',label:'企业AI应用',company:'Palantir',period:'Q2 2026',revenue:['$1.94B','$1.81B',6.9],eps:['$0.41','$0.35',17.1],detail:'收入同比 +93%；美国商业收入同比 +149%；上调全年收入增长预期。',status:'beat',statusText:'收入与EPS双超预期',actual:'https://investors.palantir.com/',consensus:'https://www.kiplinger.com/investing/stocks/s-and-p-500-joins-dow-in-record-high-territory-stock-market-today'},
    {segment:'application',sub:'application',label:'企业AI工作流',company:'ServiceNow',period:'Q2 2026',revenue:['$3.99B','$3.92B',1.8],eps:['$0.90','$0.86',4.7],detail:'订阅收入 $3.877B（同比 +24.5%）；未来 12 个月合同收入 cRPO $13.2B（同比 +21%）。',status:'beat',statusText:'收入与EPS双超预期',actual:'https://investor.servicenow.com/news/news-details/2026/ServiceNow-Reports-Second-Quarter-2026-Financial-Results/default.aspx',consensus:'https://en.sedaily.com/international/2026/07/23/servicenow-beats-q2-revenue-eps-estimates'},
    {segment:'application',sub:'application',label:'创意与生产力AI',company:'Adobe',period:'Q2 FY26',revenue:['$6.62B','$6.46B',2.5],eps:['$5.96','$5.83',2.2],detail:'创意与营销订阅收入 $4.54B；上调 FY26 收入目标至 $26.5B–$26.6B。',status:'beat',statusText:'收入与EPS双超预期',actual:'https://www.adobe.com/cc-shared/assets/investor-relations/pdfs/11606202/a5543arefgt.pdf',consensus:'https://www.zacks.com/stock/news/2936122/adobe-adbe-q2-earnings-how-key-metrics-compare-to-wall-street-estimates'}
  ];

  var segmentNames={hardware:'硬件',cloud:'云厂商',model:'模型',application:'下游应用'};
  var statusNames={beat:'超预期',mixed:'结果分化',miss:'低于预期',na:'不可计算'};
  var activeSegment='all',activeSub='all';

  function formatSurprise(value){
    if(value===null||value===undefined)return '<span class="not-comparable">N/C</span>';
    var cls=value>1?'positive':value<-1?'negative':'neutral';
    return '<span class="surprise '+cls+'">'+(value>0?'+':'')+value.toFixed(1)+'%</span>';
  }
  function metricCell(metric){return '<div class="actual-forecast"><b>'+metric[0]+'</b><span>预期 '+metric[1]+'</span></div>';}
  function sourceLink(row){
    var actual='<a class="source-mini" href="'+row.actual+'" target="_blank" rel="noopener">实际值来源</a>';
    var consensus=row.consensus?'<a class="source-mini" href="'+row.consensus+'" target="_blank" rel="noopener">预期来源</a>':'<span class="source-mini disabled">无可比预期</span>';
    return actual+consensus;
  }
  function renderRows(){
    var host=document.getElementById('earnings-detail-rows');if(!host)return;
    var filtered=rows.filter(function(row){
      if(activeSegment!=='all'&&row.segment!==activeSegment)return false;
      if(activeSub!=='all'&&row.sub!==activeSub)return false;
      return true;
    });
    host.innerHTML=filtered.map(function(row){
      return '<tr><td><span class="chain-label">'+segmentNames[row.segment]+' · '+row.label+'</span><a class="company-link" href="'+row.actual+'" target="_blank" rel="noopener">'+row.company+'</a><div class="row-sources">'+sourceLink(row)+'</div></td><td>'+row.period+'</td><td>'+metricCell(row.revenue)+'</td><td>'+formatSurprise(row.revenue[2])+'</td><td>'+metricCell(row.eps)+'</td><td>'+formatSurprise(row.eps[2])+'</td><td class="detail-cell">'+row.detail+'</td><td><span class="verdict '+row.status+'">'+statusNames[row.status]+'</span><small class="verdict-note">'+row.statusText+'</small></td></tr>';
    }).join('')||'<tr><td colspan="8" class="empty-state">该筛选条件下没有可比公司。</td></tr>';
  }

  document.querySelectorAll('[data-earnings-filter]').forEach(function(bar){
    bar.addEventListener('click',function(event){
      var button=event.target.closest('[data-value]');if(!button)return;
      bar.querySelectorAll('[data-value]').forEach(function(item){item.classList.toggle('active',item===button);});
      if(bar.dataset.earningsFilter==='segment'){
        activeSegment=button.dataset.value;
        if(activeSegment!=='all'&&activeSegment!=='hardware'){
          activeSub='all';
          document.querySelectorAll('[data-earnings-filter="subsegment"] [data-value]').forEach(function(item){item.classList.toggle('active',item.dataset.value==='all');});
        }
      }else{
        activeSub=button.dataset.value;
        if(activeSub!=='all'){
          activeSegment='hardware';
          document.querySelectorAll('[data-earnings-filter="segment"] [data-value]').forEach(function(item){item.classList.toggle('active',item.dataset.value==='hardware');});
        }
      }
      renderRows();
    });
  });

  var chartRows=rows.filter(function(row){return typeof row.revenue[2]==='number';}).sort(function(a,b){return a.revenue[2]-b.revenue[2];});
  function surpriseOption(){return {
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
  renderRows();
  if(window.WRLang&&window.WRLang.onChange)window.WRLang.onChange(renderChart);else renderChart();
})();
