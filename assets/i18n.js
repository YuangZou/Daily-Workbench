/*
 * 研究工作台 · 轻量中英切换
 * 用法：
 *   1) 页面引入本脚本（放 </body> 前）：<script src="assets/i18n.js"></script>
 *   2) 需要翻译的元素加 data-en="English text"（原中文留作默认，无 JS 时显示中文）；
 *      占位符用 data-ph-en="..."。
 *   3) 顶部导航（.nav-brand b / .nav-links a / .nav-status）自动翻译，无需改标记。
 *   4) 顶部放切换按钮：
 *        <button class="lang-btn" data-lang="zh" onclick="WRLang.set('zh')">中</button>
 *        <button class="lang-btn" data-lang="en" onclick="WRLang.set('en')">EN</button>
 * 语言选择存 localStorage(wr_lang)，全站共享。
 */
(function () {
  var KEY = 'wr_lang';

  // 导航板块名（按 href 目录名映射英文）
  var NAV = {
    macro: 'Macro',
    fundamentals: 'Industrial Fundamentals',
    capital: 'Capital / Flow',
    sentiment: 'Sentiment',
    knowledge: 'Knowledge Base'
  };

  // —— 品种名 + 交易术语 zh→en 字典 ——
  // JS 动态渲染（品种名来自中文数据源、图例/表头/徽章等）用 t(zh) 查这里；缺映射兜底返回原中文。
  var TERMS = {
    // 贵金属
    '黄金': 'Gold', '白银': 'Silver',
    // 有色 / 基本金属
    '铜': 'Copper', '铝': 'Aluminum', '氧化铝': 'Alumina', '锌': 'Zinc', '铅': 'Lead',
    '镍': 'Nickel', '锡': 'Tin', '不锈钢': 'Stainless Steel', '工业硅': 'Industrial Silicon',
    '多晶硅': 'Polysilicon', '碳酸锂': 'Lithium Carbonate', '硅': 'Silicon',
    // 黑色
    '螺纹钢': 'Rebar', '螺纹': 'Rebar', '热卷': 'Hot-Rolled Coil', '热轧卷板': 'Hot-Rolled Coil',
    '铁矿石': 'Iron Ore', '铁矿': 'Iron Ore', '焦炭': 'Coke', '焦煤': 'Coking Coal',
    '硅铁': 'Ferrosilicon', '锰硅': 'Silicomanganese', '双焦': 'Coke & Coking Coal',
    '动力煤': 'Thermal Coal',
    // 能源化工
    '原油': 'Crude Oil', '燃料油': 'Fuel Oil', '低硫燃料油': 'Low-Sulfur Fuel Oil', '沥青': 'Bitumen',
    'LPG': 'LPG', '液化石油气': 'LPG', '丙烯': 'Propylene', '石脑油': 'Naphtha', '乙烯': 'Ethylene',
    'PX': 'PX', '对二甲苯': 'Paraxylene', 'PTA': 'PTA', 'MEG': 'MEG', '乙二醇': 'Ethylene Glycol',
    '短纤': 'Staple Fiber', '瓶片': 'Bottle Chip', '尿素': 'Urea', '甲醇': 'Methanol',
    '塑料': 'LLDPE', 'LLDPE': 'LLDPE', '聚乙烯': 'Polyethylene', '聚丙烯': 'Polypropylene', 'PP': 'PP',
    '聚氯乙烯': 'PVC', 'PVC': 'PVC', '烧碱': 'Caustic Soda', '玻璃': 'Glass', '纯碱': 'Soda Ash',
    '橡胶': 'Rubber', '天然橡胶': 'Natural Rubber', '合成橡胶': 'Synthetic Rubber', '丁二烯橡胶': 'BR Rubber',
    '纸浆': 'Pulp', '集运指数(欧线)': 'Container Freight (Europe)', '集运欧线': 'Container Freight (Europe)',
    '欧线': 'Europe Route', '瓶片PR': 'Bottle Chip',
    // 农产品
    '豆粕': 'Soybean Meal', '豆油': 'Soybean Oil', '棕榈油': 'Palm Oil', '菜粕': 'Rapeseed Meal',
    '菜油': 'Rapeseed Oil', '菜籽油': 'Rapeseed Oil', '玉米': 'Corn', '玉米淀粉': 'Corn Starch',
    '白糖': 'Sugar', '棉花': 'Cotton', '棉纱': 'Cotton Yarn', '生猪': 'Live Hogs', '鸡蛋': 'Eggs',
    '苹果': 'Apple', '红枣': 'Jujube', '花生': 'Peanut', '豆一': 'Soybean No.1', '豆二': 'Soybean No.2',
    '大豆': 'Soybean',
    // 金融
    '股指': 'Stock Index', '沪深300': 'CSI 300', '中证500': 'CSI 500', '中证1000': 'CSI 1000',
    '上证50': 'SSE 50', '国债': 'Treasury Bond', '十年国债': '10Y Treasury', '两年国债': '2Y Treasury',
    '五年国债': '5Y Treasury', '三十年国债': '30Y Treasury',
    // 交易 / 资金术语
    '平仓盈亏': 'Realized P&L', '平仓净盈利': 'Net Realized Profit', '平仓手数': 'Closed Lots',
    '成交': 'Volume', '成交量': 'Volume', '持仓': 'Open Interest', '持仓量': 'Open Interest',
    '席位': 'Seat', '主力席位': 'Major Seat', '净流向': 'Net Flow', '资金净流向': 'Net Capital Flow',
    '资金潮汐': 'Capital Tide', '加仓': 'Add Position', '减仓': 'Cut Position',
    '加多': 'Add Long', '减多': 'Cut Long', '加空': 'Add Short', '减空': 'Cut Short',
    '多头': 'Long', '空头': 'Short', '净多': 'Net Long', '净空': 'Net Short', '多空': 'Long-Short',
    '风险度': 'Risk Level', '综合得分': 'Composite Score', '得分': 'Score', '评分': 'Score',
    '情绪偏向': 'Sentiment Bias', '情绪': 'Sentiment', '偏多': 'Bullish', '偏空': 'Bearish',
    '中性': 'Neutral', '震荡': 'Range-bound', '分化': 'Divergence', '看多': 'Bullish', '看空': 'Bearish',
    '最活跃品种': 'Most Active', '手数最多': 'Most Lots', '最赚品种': 'Most Profitable',
    '收益率': 'Return', '涨跌幅': 'Change %', '涨幅': 'Gain', '跌幅': 'Loss',
    '基本面': 'Fundamentals', '技术面': 'Technicals', '资金面': 'Capital / Flows', '消息面': 'News',
    '库存': 'Inventory', '基差': 'Basis', '利润': 'Profit', '开仓': 'Open Position', '手': 'lots',
    '万手': '0k lots', '亿元': '00M CNY', '万元': '0k CNY',
    // 方向 / 状态
    '上行': 'Up', '下行': 'Down', '走平': 'Flat', '持平': 'Flat', '强势': 'Strong', '弱势': 'Weak',
    '主导': 'Dominant', '共振': 'Resonance', '背离': 'Divergence',
    // 追加：板块、贵金属、次要品种、AI/半导体小金属（子代理反馈汇总）
    '铂': 'Platinum', '钯': 'Palladium', '铂钯': 'Platinum & Palladium', '钴': 'Cobalt',
    '油脂': 'Oils & Fats', '原木': 'Logs', '双胶纸': 'Woodfree Paper', '纯苯': 'Benzene',
    '苯乙烯': 'Styrene', '新能源': 'New Energy', '汇率': 'FX', '生柴': 'Biodiesel',
    '钢材': 'Steel', '铁合金': 'Ferroalloys', '煤焦': 'Coal & Coke', '氯碱': 'Chlor-Alkali',
    '硅产业': 'Silicon Industry', '国债期货': 'Treasury Bond Futures', '非美宏观': 'Non-US Macro',
    '贵金属': 'Precious Metals', '稀土': 'Rare Earth',
    // 板块
    '有色': 'Non-ferrous', '黑色': 'Ferrous', '能源化工': 'Energy & Chemicals',
    '农产品': 'Agriculture', '宏观金融': 'Macro & Financials', '航运': 'Shipping',
    // AI / 半导体小金属
    '锗': 'Germanium', '镓': 'Gallium', '铟': 'Indium', '锑': 'Antimony', '钽': 'Tantalum',
    '钨': 'Tungsten', '钼': 'Molybdenum', '铋': 'Bismuth', '硒': 'Selenium', '碲': 'Tellurium',
    '铼': 'Rhenium', '铌': 'Niobium', '镁': 'Magnesium', '钛': 'Titanium', '铬': 'Chromium',
    '钒': 'Vanadium', '锂': 'Lithium', '钪': 'Scandium'
  };

  // 动态渲染回调：页面用 WRLang.onChange(fn) 注册，语言切换/apply 时统一回调，实现已渲染内容重译
  var callbacks = [];
  var missing = {}; // 记录缺失映射的词，方便自测时补齐

  function getLang() { return localStorage.getItem(KEY) === 'en' ? 'en' : 'zh'; }

  // 术语翻译：仅在英文模式下查字典；缺映射兜底返回原中文并记录
  function t(zh) {
    if (getLang() !== 'en') return zh;
    if (zh == null) return zh;
    var key = String(zh).trim();
    if (Object.prototype.hasOwnProperty.call(TERMS, key)) return TERMS[key];
    if (key && !/^[\x00-\x7F]*$/.test(key)) { // 含中文却没映射 → 记一笔
      if (!missing[key]) { missing[key] = 1; if (window.console) console.warn('[i18n] 缺映射:', key); }
    }
    return zh;
  }

  function apply(l) {
    document.documentElement.lang = (l === 'en' ? 'en' : 'zh-CN');

    // —— 通用 data-en 元素 ——
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.dataset.zh === undefined) el.dataset.zh = el.innerHTML;
      el.innerHTML = (l === 'en') ? el.dataset.en : el.dataset.zh;
    });
    // —— 占位符 ——
    document.querySelectorAll('[data-ph-en]').forEach(function (el) {
      if (el.dataset.phZh === undefined) el.dataset.phZh = el.getAttribute('placeholder') || '';
      el.setAttribute('placeholder', (l === 'en') ? el.dataset.phEn : el.dataset.phZh);
    });

    // —— 导航品牌名 ——
    var brand = document.querySelector('.nav-brand b');
    if (brand) {
      if (brand.dataset.zh === undefined) brand.dataset.zh = brand.textContent;
      brand.textContent = (l === 'en') ? 'Research Workbench' : brand.dataset.zh;
    }

    // —— 导航板块链接 ——
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      if (a.dataset.zh === undefined) a.dataset.zh = a.textContent;
      var seg = (a.getAttribute('href') || '').replace(/\.\.\//g, '').replace(/^\.\//, '').replace(/\//g, '');
      a.textContent = (l === 'en' && NAV[seg]) ? NAV[seg] : a.dataset.zh;
    });

    // —— 导航状态（数据截至 …）——
    var status = document.querySelector('.nav-status');
    if (status) {
      var node = status.lastChild; // 末尾文本节点 "数据截至 2026-07-06"
      if (node && node.nodeType === 3) {
        if (status.dataset.zhText === undefined) status.dataset.zhText = node.nodeValue;
        node.nodeValue = (l === 'en')
          ? status.dataset.zhText.replace('数据截至', 'Data as of').replace('更新', 'Updated')
          : status.dataset.zhText;
      }
    }

    // —— 切换按钮高亮 ——
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === l);
    });

    // —— 动态内容回调（图表/表格/JSON 渲染后的重译）——
    for (var i = 0; i < callbacks.length; i++) {
      try { callbacks[i](l); } catch (e) { if (window.console) console.warn('[i18n] onChange 回调出错', e); }
    }
  }

  window.WRLang = {
    get: getLang,
    lang: getLang,
    t: t,
    set: function (l) { localStorage.setItem(KEY, (l === 'en' ? 'en' : 'zh')); apply(getLang()); },
    // 注册动态重译回调；注册时立即执行一次，之后每次切换语言都会调用
    onChange: function (fn) { if (typeof fn === 'function') { callbacks.push(fn); try { fn(getLang()); } catch (e) {} } },
    // 动态往 DOM 插入了新的 [data-en] 元素后，手动重跑一次翻译
    apply: function () { apply(getLang()); },
    terms: TERMS,
    missing: missing
  };

  apply(getLang());
  document.addEventListener('DOMContentLoaded', function () { apply(getLang()); });
})();
