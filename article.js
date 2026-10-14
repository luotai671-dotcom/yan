/**
 * 机场眼 (jichangyan.com) 统一动态路由与兼容详情页加载器
 * 兼容历史路径：/article?post=slug 或 /article.html?post=slug
 * 支持原地渲染、零 301 重定向死循环风险、多层级相对路径自适应解析
 */
(function() {
  'use strict';

  // 1. 判断当前执行环境所在的相对路径层级
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const isSubdir = pathname.endsWith('/article');
  const basePath = isSubdir ? '../' : './';

  // 2. 提取并归一化 URL Query 与 Hash 参数
  function getRequestedSlug() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('post') || params.get('slug') || params.get('id') || params.get('article') || params.get('name') || '';
    if (raw) return raw.trim();

    // 如果 query 没有，尝试从 hash 提取 (如 #airport-guide-2026)
    const hash = window.location.hash.replace(/^#/, '').trim();
    if (hash && hash !== 'top' && hash !== 'main') return hash;
    return '';
  }

  // 归一化对比函数：去除数字前缀 (如 01- 或 1_)，下划线转中划线，转小写
  function normalizeKey(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/^[0-9]+[-_]/, '')
      .replace(/[._]/g, '-')
      .replace(/\.html$/, '')
      .trim();
  }

  // 3. 查找匹配文章
  function findArticle(requestedKey, articles) {
    if (!requestedKey || !Array.isArray(articles)) return null;
    const target = normalizeKey(requestedKey);

    // 精确匹配 slug
    for (const a of articles) {
      if (a.slug.toLowerCase() === requestedKey.toLowerCase()) return a;
    }
    // 归一化匹配 slug
    for (const a of articles) {
      if (normalizeKey(a.slug) === target) return a;
    }
    // 模糊匹配包含或标题匹配
    for (const a of articles) {
      if (a.slug.toLowerCase().includes(target) || (a.title && a.title.toLowerCase().includes(target))) {
        return a;
      }
    }
    return null;
  }

  // 4. 原地渲染详情页面
  async function loadArticleContent(article) {
    const container = document.getElementById('article-content-area');
    if (!container) return;

    // 更新页面标题与 Meta 信息
    document.title = `${article.title}｜机场眼`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', article.focus || article.title);

    const articleUrl = `${basePath}articles/${article.slug}.html`;

    try {
      // 尝试获取实际生成的静态 HTML 正文
      const response = await fetch(articleUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();

      // 解析文章详情节点
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const articleDetail = doc.querySelector('.article-detail');

      if (articleDetail) {
        let contentHtml = articleDetail.innerHTML;
        // 如果在根目录下 (/article.html)，原文章中的 ../assets/ 和 ../styles.css 需要去除 ../
        if (!isSubdir) {
          contentHtml = contentHtml
            .replace(/src="\.\.\//g, 'src="./')
            .replace(/href="\.\.\//g, 'href="./');
        }
        container.innerHTML = `
          <div class="article-shell" style="max-width:880px;margin:0 auto;padding:24px 16px;">
            <article class="article-detail">
              ${contentHtml}
            </article>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } catch (e) {
      console.warn('原地 fetch 获取 HTML 失败（可能是本地 file:// 协议同源策略），启用备用渲染模式：', e);
    }

    // 备用原地渲染（无需网络请求，基于 window.ARTICLE_INDEX 本地数据）
    const coverPath = !isSubdir ? article.cover : `../${article.cover}`;
    container.innerHTML = `
      <div class="article-shell" style="max-width:880px;margin:0 auto;padding:24px 16px;">
        <article class="article-detail">
          <img class="article-cover" src="${coverPath}" alt="${article.title}封面" width="1200" height="675" style="width:100%;height:auto;border-radius:12px;margin-bottom:24px;">
          <p class="eyebrow dark">${article.category} · ${article.date}</p>
          <h1 style="font-size:28px;line-height:1.4;margin:12px 0 16px;">${article.title}</h1>
          <p class="article-summary" style="font-size:16px;line-height:1.7;color:var(--muted);background:var(--card-bg,#fff);padding:16px;border-radius:8px;border:1px solid var(--border,#e5e7eb);">${article.focus}</p>
          
          <h2 style="font-size:20px;margin:28px 0 12px;">核心要点与判断依据</h2>
          <p style="font-size:15px;line-height:1.8;">面向${article.audience}，本文从底层传输机制与实际使用场景为您梳理核心判断指标：</p>
          ${article.signals ? `<ul>${article.signals.map(s => `<li style="line-height:1.8;margin-bottom:6px;">${s}</li>`).join('')}</ul>` : ''}

          <h2 style="font-size:20px;margin:28px 0 12px;">推荐操作步骤</h2>
          ${article.steps ? `<ol>${article.steps.map(s => `<li style="line-height:1.8;margin-bottom:6px;">${s}</li>`).join('')}</ol>` : ''}

          <div class="article-cta" style="margin-top:40px;padding:24px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;text-align:center;">
            <p style="font-size:15px;margin-bottom:16px;color:#334155;">当前处于兼容渲染模式，你也可以直接查看纯静态版本：</p>
            <a class="button button-primary" href="${articleUrl}">
              <i data-lucide="external-link"></i> 打开完整独立静态正文
            </a>
          </div>
        </article>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 5. 渲染“未提供参数”或“文章不存在”时的备用索引列表
  function renderFallbackList(articles, requestedKey) {
    const container = document.getElementById('article-content-area');
    if (!container) return;

    let notice = '';
    if (requestedKey) {
      notice = `
        <div style="background:#fff1f2;border:1px solid #fecdd3;color:#9f1239;padding:16px 20px;border-radius:10px;margin-bottom:28px;">
          <strong>提示：</strong>未找到参数为 <code>${requestedKey}</code> 的文章，已为您列出全站所有收录的技术文章：
        </div>
      `;
    }

    const itemsHtml = articles.map(a => `
      <article class="blog-card" style="display:flex;flex-direction:column;background:var(--card-bg,#fff);border:1px solid var(--border,#e5e7eb);border-radius:12px;overflow:hidden;padding:16px;">
        <span class="blog-tag" style="align-self:flex-start;font-size:12px;background:#f3f4f6;padding:4px 8px;border-radius:4px;margin-bottom:8px;">${a.category}</span>
        <h3 style="font-size:16px;line-height:1.4;margin:4px 0 8px;"><a href="${basePath}articles/${a.slug}.html" style="color:inherit;text-decoration:none;">${a.title}</a></h3>
        <p style="font-size:13.5px;color:var(--muted);flex:1;margin-bottom:12px;line-height:1.6;">${a.focus}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:10px;">
          <span>${a.date}</span>
          <a href="${basePath}articles/${a.slug}.html" style="color:var(--accent,#d95d39);font-weight:600;text-decoration:none;">阅读正文 →</a>
        </div>
      </article>
    `).join('');

    container.innerHTML = `
      <div style="max-width:1100px;margin:0 auto;padding:32px 16px;">
        ${notice}
        <div class="section-heading" style="margin-bottom:28px;">
          <div>
            <p class="eyebrow dark">文章中心 · 全库检索</p>
            <h1 style="font-size:28px;margin:6px 0;">机场眼技术博客与选购指南</h1>
          </div>
          <p>共收录 ${articles.length} 篇原创技术评测与选购技巧，点击任意文章即可直接查阅。</p>
        </div>
        <div class="blog-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px;">
          ${itemsHtml}
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  // 6. 入口主流程
  function init() {
    const articles = window.ARTICLE_INDEX || [];
    const requestedKey = getRequestedSlug();

    if (requestedKey) {
      const matched = findArticle(requestedKey, articles);
      if (matched) {
        loadArticleContent(matched);
      } else {
        renderFallbackList(articles, requestedKey);
      }
    } else {
      renderFallbackList(articles, '');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
