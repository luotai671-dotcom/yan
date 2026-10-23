const fs = require('fs');
const path = require('path');

const root = __dirname;
const sourcePath = path.join(root, 'index.html');
const partialDir = path.join(root, 'sections');
fs.mkdirSync(partialDir, {recursive:true});

const original = fs.readFileSync(sourcePath, 'utf8');
const ids = ['recommend','budget','compare','coupons','warning','blog','resources','faq','about'];

function extractSection(html, id) {
  const re = new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?<\\/section>`);
  const match = html.match(re);
  if (!match) throw new Error(`Section not found: ${id}`);
  return match[0];
}

for (const id of ids) {
  const partial = path.join(partialDir, `${id}.html`);
  if (!fs.existsSync(partial)) fs.writeFileSync(partial, extractSection(original, id), 'utf8');
}
const newsletterPath = path.join(partialDir, 'newsletter.html');
if (!fs.existsSync(newsletterPath)) {
  const match = original.match(/<section class="newsletter-section"[\s\S]*?<\/section>/);
  if (match) fs.writeFileSync(newsletterPath, match[0], 'utf8');
}
const heroPath = path.join(partialDir, 'hero.html');
if (!fs.existsSync(heroPath)) {
  const match = original.match(/<section class="hero"[\s\S]*?<\/section>/);
  if (!match) throw new Error('Hero not found');
  fs.writeFileSync(heroPath, match[0], 'utf8');
}

const pages = {
  recommend:{file:'recommend.html',title:'2026年专线机场推荐精选排行榜：24家IEPL/IPLC机场节点速度测试、稳定评测与选购指南',description:'2026年机场推荐精选排行榜，涵盖24家优质IEPL/IPLC专线机场评测，说明推荐理由、线路优势、晚高峰速度、适合人群与购买注意事项。'},
  budget:{file:'budget.html',title:'2026便宜性价比机场推荐排行榜：10元以内月付平民机场对比、公网直连中转选购与避坑指南',description:'2026年性价比机场选择指南，横向比较10元以内月付价格、中转线路质量、晚高峰速度、流媒体解锁和适用场景。'},
  compare:{file:'compare.html',title:'2026专线机场横向对比大评测：24家机场线路类型、晚高峰速度、流媒体解锁与折后价格对比',description:'24家专线机场线路类型、晚高峰参考速度、流媒体解锁能力、月付原价、7折优惠码与折后价格全景横向数据对比。'},
  coupons:{file:'coupons.html',title:'2026最新机场优惠码与折扣券大汇总：专属7折优惠券领取、套餐续费规则与购买省钱攻略',description:'2026年最新机场优惠码与折后价格汇总，提供7折专属折扣券，购买前核对适用套餐、重置周期和续费规则。'},
  warning:{file:'warning.html',title:'2026机场跑路风险预警与避坑指南：失联历史案例分析、风险评估模型与维权止损方法',description:'机场跑路风险预警信号分析、公开历史失联案例汇总、风险评分模型与用户遭异常时的止损维权方法。'},
  blog:{file:'blog.html',title:'机场眼官方技术博客文章大全：专线机场选购、Clash/Sing-box客户端教程与网络安全指南',description:'机场眼官方技术博客，提供机场选购指南、Clash/Sing-box客户端教程、网络协议原理、隐私安全与故障排查文章。'},
  resources:{file:'resources.html',title:'代理客户端与网络工具资源下载大全：Clash Verge、Sing-box、订阅转换站与测速工具',description:'全平台代理客户端下载与必备网络工具资源中心，提供Clash Verge、Sing-box、Stash、Shadowrocket、订阅转换站与节点测速工具入口。'},
  faq:{file:'faq.html',title:'2026机场新手常见问题解答 FAQ：IEPL专线区别、倍率扣费、节点连接排障与账号安全全解',description:'机场用户常见问题解答（FAQ），涵盖IEPL专线区别、套餐流量倍率扣费、客户端节点连不上排障、流媒体解锁与账号安全事项。'},
  about:{file:'about.html',title:'关于机场眼：独立专线机场评测体系、客观数据测试标准、评测原则与 Telegram 官方联系方式',description:'了解机场眼团队、独立机场评测方法、数据测试标准权重、客观公正内容原则与官方Telegram联系方式。'}
};

const linkMap = {
  recommend:'recommend.html', budget:'budget.html', compare:'compare.html', coupons:'coupons.html',
  faq:'faq.html', warning:'warning.html', blog:'blog.html', resources:'resources.html', about:'about.html',
  'resources-clients':'resources.html#resources-clients', 'resources-tools':'resources.html#resources-tools',
  'resources-speed':'resources.html#resources-speed', 'resources-rules':'resources.html#resources-rules'
};

function rewriteLinks(html) {
  return html.replace(/href="#([a-z0-9-]+)"/gi, (full, id) => linkMap[id] ? `href="${linkMap[id]}"` : full);
}

function header(active='') {
  const item = (id,label,extra='') => `<a href="${pages[id].file}" class="${active===id?'active ':''}${extra}">${label}</a>`;
  return `<div class="status-strip" role="status"><span class="status-dot" aria-hidden="true"></span><span>机场推荐与风险信息持续更新</span><span class="status-time">更新至 2026.10.23 · 已发布 55 篇指南</span></div>
  <header class="site-header" id="top"><a class="brand" href="index.html" aria-label="机场眼首页"><span class="brand-mark" aria-hidden="true">机</span><span>机场眼</span></a>
  <nav class="main-nav" id="main-nav" aria-label="主导航">${item('recommend','机场推荐')}${item('budget','性价比机场')}${item('compare','机场对比')}${item('coupons','机场优惠码')}${item('faq','机场 FAQ')}${item('warning','<span class="pulse-dot"></span>跑路预警','nav-warning')}${item('blog','博客')}
  <div class="nav-dropdown"><button class="dropdown-trigger" type="button" aria-expanded="false">资源 <i data-lucide="chevron-down" class="dropdown-arrow"></i></button><div class="dropdown-menu"><a href="resources.html#resources-clients"><i data-lucide="download"></i> 客户端下载</a><a href="resources.html#resources-tools"><i data-lucide="wrench"></i> 订阅转换工具</a><a href="resources.html#resources-speed"><i data-lucide="activity"></i> 节点测速工具</a></div></div>
  ${item('about','关于')}<a href="https://t.me/shandianshuvpn" target="_blank" rel="noopener noreferrer" class="telegram-link" aria-label="通过 Telegram 联系"><i data-lucide="send"></i><span>Telegram</span></a></nav>
  <div class="header-actions"><button class="icon-button search-trigger" type="button" aria-label="搜索"><i data-lucide="search"></i></button><button class="menu-button" type="button" aria-controls="main-nav" aria-expanded="false"><i data-lucide="menu"></i><span>菜单</span></button></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-brand"><span class="brand-mark">机</span><strong>机场眼</strong><p>清楚地看见每一段连接。</p></div><div><strong>选购</strong><a href="recommend.html">机场推荐</a><a href="reviews/index.html">独立测评</a><a href="budget.html">性价比机场</a><a href="compare.html">机场对比</a><a href="coupons.html">优惠码</a></div><div><strong>工具与指南</strong><a href="warning.html">跑路预警</a><a href="resources.html">资源中心</a><a href="faq.html">机场 FAQ</a></div><div><strong>内容</strong><a href="blog.html">博客文章</a><a href="about.html">关于我们</a></div></footer>`;
}

function overlays() {
  return `<div class="search-panel" id="search-panel" hidden><div class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title"><div class="search-top"><h2 id="search-title">搜索机场眼</h2><button class="icon-button search-close" type="button" aria-label="关闭搜索"><i data-lucide="x"></i></button></div><label class="search-field"><i data-lucide="search"></i><input id="site-search" type="search" placeholder="搜索机场、协议或使用问题"></label><div class="search-results" id="search-results"><p>热门搜索</p><button data-query="晚高峰">晚高峰</button><button data-query="WireGuard">WireGuard</button><button data-query="流媒体">流媒体</button></div></div></div>
  <div class="modal" id="article-modal" hidden><div class="modal-backdrop" data-close-modal></div><article class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="icon-button modal-close" type="button" data-close-modal aria-label="关闭"><i data-lucide="x"></i></button><p class="eyebrow dark" id="modal-kicker">详细评测</p><h2 id="modal-title">评测详情</h2><div id="modal-content"></div></article></div>`;
}

function shell({title,description,active,content,home=false}) {
  const pageTitle = home ? title : `${title}｜机场眼`;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="description" content="${description}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="https://jichangyan.com/${home?'':pages[active].file}"><title>${pageTitle}</title><link rel="icon" href="favicon.ico"><link rel="stylesheet" href="styles.css"></head><body><a class="skip-link" href="#main">跳到主要内容</a>${header(active)}<main id="main" class="${home?'':'standalone-main'}">${content}</main>${footer()}${overlays()}<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script><script src="articles.js"></script><script src="app.js"></script></body></html>`;
}

for (const [id,meta] of Object.entries(pages)) {
  let content = fs.readFileSync(path.join(partialDir, `${id}.html`), 'utf8');
  if (id === 'about' && fs.existsSync(newsletterPath)) content += `\n${fs.readFileSync(newsletterPath,'utf8')}`;
  content = rewriteLinks(content);
  fs.writeFileSync(path.join(root, meta.file), shell({title:meta.title,description:meta.description,active:id,content}), 'utf8');
}

let hero = rewriteLinks(fs.readFileSync(heroPath, 'utf8'));
hero = hero.replace('5 例</strong><span>公开来源风险记录', '10 例</strong><span>公开来源风险记录');
const scenariosPath = path.join(partialDir, 'scenarios.html');
const scenarios = fs.existsSync(scenariosPath) ? rewriteLinks(fs.readFileSync(scenariosPath, 'utf8')) : '';
const portal = `<section class="section home-portals" aria-labelledby="portal-title"><div class="section-heading"><div><p class="eyebrow dark">独立栏目 · 快速进入</p><h2 id="portal-title">选择你现在需要的内容</h2></div><p>首页只保留内容导航，每个栏目都拥有独立页面，阅读和分享更清晰。</p></div><div class="portal-grid">
  <a href="recommend.html"><i data-lucide="award"></i><strong>机场推荐</strong><span>查看推荐理由、优点和适合人群</span></a>
  <a href="#scenarios"><i data-lucide="target"></i><strong>场景化选型</strong><span>按出海、AI、4K、软路由精准选型</span></a>
  <a href="reviews/index.html"><i data-lucide="file-text"></i><strong>独立测评专区</strong><span>24家机场简介、套餐、营业时间与线路</span></a>
  <a href="budget.html"><i data-lucide="wallet-cards"></i><strong>性价比机场</strong><span>按价格、线路与实际用途选择</span></a>
  <a href="compare.html"><i data-lucide="table-2"></i><strong>机场对比</strong><span>六家方案的完整数据横向对比</span></a>
  <a href="coupons.html"><i data-lucide="ticket-percent"></i><strong>优惠码</strong><span>查看折扣、折后价格与使用规则</span></a>
  <a href="warning.html"><i data-lucide="triangle-alert"></i><strong>跑路预警</strong><span>风险信号、历史案例和止损方法</span></a>
  <a href="blog.html"><i data-lucide="newspaper"></i><strong>博客文章</strong><span>50 篇选购、教程与安全文章</span></a>
  <a href="resources.html"><i data-lucide="wrench"></i><strong>资源中心</strong><span>客户端、规则、测速与检测工具</span></a>
  <a href="faq.html"><i data-lucide="circle-help"></i><strong>机场 FAQ</strong><span>快速解决新手常见问题</span></a>
  <a href="about.html"><i data-lucide="info"></i><strong>关于机场眼</strong><span>了解评测方法和内容原则</span></a>
</div></section>`;
fs.writeFileSync(sourcePath, shell({title:'机场眼 - 2026高速机场推荐与平价机场测评导航',description:'机场眼专注2026稳定高速机场推荐与平安机场客观评测，提供优质IEPL专线节点分享、10元平民性价比机场排行榜与大额优惠码。结合晚高峰真实测速、4K流媒体解锁、跑路风险预警与Clash/Sing-box客户端教程，助你精准避坑，挑选最省心可靠的高速网络连接。',active:'',content:`${hero}\n${scenarios}\n${portal}`,home:true}), 'utf8');

console.log(`Generated homepage and ${Object.keys(pages).length} standalone pages.`);

