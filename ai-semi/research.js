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
    var color=a[a.length-1]>=a[0]?'#c85d43':'#164f3c';
    el.innerHTML='<svg class="spark" viewBox="0 0 '+w+' '+h+'" role="img"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="2"/><circle cx="'+w+'" cy="'+(h-3-(a[a.length-1]-min)/r*(h-6)).toFixed(1)+'" r="2.5" fill="'+color+'"/></svg>';
  });
})();
