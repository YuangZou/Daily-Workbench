(function(){
  var host=document.getElementById('ai-research-nav');
  if(host){
    var page=document.body.dataset.page||'hardware';
    var links=[
      ['hardware','./','硬件与模型','Hardware & Models'],
      ['earnings','earnings.html','产业链业绩','Earnings Chain'],
      ['korea','korea.html','韩国交易热度','Korea Crowding'],
      ['frontier','frontier.html','前沿技术','Frontier Tech'],
      ['podcast','podcast.html','播客观点','Podcast Views']
    ];
    host.innerHTML=links.map(function(x){return '<a href="'+x[1]+'"'+(page===x[0]?' class="active" aria-current="page"':'')+' data-en="'+x[3]+'">'+x[2]+'</a>';}).join('');
  }
  document.querySelectorAll('[data-spark]').forEach(function(el){
    var a=el.dataset.spark.split(',').map(Number),w=118,h=36,min=Math.min.apply(null,a),max=Math.max.apply(null,a),r=max-min||1;
    var pts=a.map(function(v,i){return (i*w/(a.length-1)).toFixed(1)+','+(h-3-(v-min)/r*(h-6)).toFixed(1);}).join(' ');
    var color=a[a.length-1]>=a[0]?'#d64a43':'#269864';
    el.innerHTML='<svg class="spark" viewBox="0 0 '+w+' '+h+'" role="img"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="2"/><circle cx="'+w+'" cy="'+(h-3-(a[a.length-1]-min)/r*(h-6)).toFixed(1)+'" r="2.5" fill="'+color+'"/></svg>';
  });
  document.querySelectorAll('[data-trend]').forEach(function(el){
    var raw=el.dataset.trend.split('|'),w=560,h=178,p={l:28,r:12,t:12,b:24};
    var colors=['#356df3','#d64a43','#269864','#b98527','#75849a'];
    var series=raw.map(function(item){
      var parts=item.split(':');
      return {name:parts[0],values:parts[1].split(',').map(Number)};
    });
    var all=[];series.forEach(function(s){all=all.concat(s.values);});
    var min=Math.min.apply(null,all),max=Math.max.apply(null,all),range=max-min||1;
    min-=range*.08;max+=range*.08;range=max-min;
    var n=Math.max.apply(null,series.map(function(s){return s.values.length;}));
    function x(i){return p.l+i*(w-p.l-p.r)/(n-1||1);}
    function y(v){return p.t+(max-v)/range*(h-p.t-p.b);}
    var grid=[0,.5,1].map(function(q){var yy=p.t+q*(h-p.t-p.b);return '<line x1="'+p.l+'" y1="'+yy+'" x2="'+(w-p.r)+'" y2="'+yy+'" stroke="#eceff4"/><text x="'+(p.l-5)+'" y="'+(yy+3)+'" text-anchor="end" fill="#9aa3ae" font-size="8">'+(max-q*range).toFixed(max<10?1:0)+'</text>';}).join('');
    var paths=series.map(function(s,idx){
      var pts=s.values.map(function(v,i){return x(i).toFixed(1)+','+y(v).toFixed(1);}).join(' ');
      var last=s.values[s.values.length-1];
      return '<polyline points="'+pts+'" fill="none" stroke="'+colors[idx%colors.length]+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+x(s.values.length-1)+'" cy="'+y(last)+'" r="2.8" fill="'+colors[idx%colors.length]+'"/>';
    }).join('');
    el.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" role="img" aria-label="趋势图">'+grid+'<line x1="'+p.l+'" y1="'+(h-p.b)+'" x2="'+(w-p.r)+'" y2="'+(h-p.b)+'" stroke="#dfe3e9"/>'+paths+'<text x="'+p.l+'" y="'+(h-6)+'" fill="#9aa3ae" font-size="8">起点</text><text x="'+(w-p.r)+'" y="'+(h-6)+'" text-anchor="end" fill="#9aa3ae" font-size="8">最新</text></svg>';
    var legend=el.parentNode.querySelector('.chart-legend');
    if(legend){legend.innerHTML=series.map(function(s,idx){return '<span class="legend-item"><i class="legend-dot" style="background:'+colors[idx%colors.length]+'"></i>'+s.name+'</span>';}).join('');}
  });
  document.querySelectorAll('[data-filter-target]').forEach(function(bar){
    var target=document.getElementById(bar.dataset.filterTarget);
    if(!target)return;
    bar.addEventListener('click',function(event){
      var button=event.target.closest('[data-filter]');
      if(!button)return;
      bar.querySelectorAll('[data-filter]').forEach(function(item){item.classList.toggle('active',item===button);});
      target.querySelectorAll('[data-topic]').forEach(function(item){item.classList.toggle('filtered-out',button.dataset.filter!=='all'&&item.dataset.topic!==button.dataset.filter);});
    });
  });
})();
