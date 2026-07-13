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

  function getLang() { return localStorage.getItem(KEY) === 'en' ? 'en' : 'zh'; }

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
  }

  window.WRLang = {
    get: getLang,
    set: function (l) { localStorage.setItem(KEY, (l === 'en' ? 'en' : 'zh')); apply(getLang()); }
  };

  apply(getLang());
  document.addEventListener('DOMContentLoaded', function () { apply(getLang()); });
})();
