if (window.lucide) window.lucide.createIcons();

// Modal element references
const modal = document.querySelector('#article-modal');
const modalTitle = document.querySelector('#modal-title');
const modalKicker = document.querySelector('#modal-kicker');
const modalContent = document.querySelector('#modal-content');

// Extended Articles Dictionary
const articles = {
  signals: ['判断机场稳不稳的 6 个信号', '新手必读', '<p>不要只看节点数量。更值得观察的是晚高峰速度波动、跨地区线路冗余、公开状态页、故障公告质量、退款规则以及客服响应时间。</p><h3>快速检查</h3><ul><li>查看至少 30 天的可用率，而不是一次测速。</li><li>确认套餐倍率与流量计算方式。</li><li>优先选择能公开说明故障原因的服务。</li></ul>'],
  protocols: ['SS、Trojan、WireGuard 有什么区别？', '协议入门', '<p>协议决定连接方式，但并不单独决定速度。SS 生态成熟、客户端丰富；Trojan 常见于伪装场景；WireGuard 设计简洁、性能优秀。</p>'],
  privacy: ['“不记录日志”究竟如何验证？', '隐私安全', '<p>真正可信的隐私承诺需要能被外部验证：清楚的日志范围、数据保留周期、司法管辖地、第三方审计和历史事件响应都比一句口号更重要。</p>'],
  troubleshoot: ['速度突然变慢，先检查这 5 件事', '故障排查', '<p>先排除本地 Wi-Fi、运营商拥塞、单节点负载、客户端版本与 DNS 问题。切换节点前后应使用同一测速方法。</p>'],
  glossary: ['中转、专线、倍率和落地节点是什么？', '术语词典', '<p>中转负责优化入口到出口的路径；专线通常强调更可控的传输质量；倍率决定流量扣除比例；落地节点是最终访问互联网的出口。</p>'],
  clash_guide: ['Clash Verge Rev & Sing-box 进阶分流指南', '2026 最新教程', '<p>合理的规则分流能够大幅度减少不必要的流量消耗，同时提高网页访问速度。通过引入规则集 (Rule-Set) 或订阅转换 Provider，可以实现：</p><ul><li>学术/开发资源 (GitHub, HuggingFace) 走极速专线节点；</li><li>Netflix / Disney+ 自动分流至原生解锁落地节点；</li><li>国内主流 App (微信, 淘宝, 哔哩哔哩) 自动直连不过机场。</li></ul>'],
  iplc_explained: ['IPLC/IEPL 物理专线架构深度拆解', '原理科普', '<p>企业级 IEPL 专线在跨境通信中具有无法替代的优势：数据通过陆缆或海缆的专有频段传输，不过公网边缘路由器，因此不存在公网丢包与封锁问题。即使在特殊时期或晚高峰，延迟抖动依然小于 5ms。</p>'],
  speed_report: ['2026 晚高峰 32 家机场实测数据大公开', '深度测评', '<p>本次测试共收集了 1,842 组晚高峰 (20:00 - 22:00) 测速点样本。综合表现前三名的机场在三大运营商线路下均保持了 300Mbps 以上的下行带宽，丢包率均控制在 0.5% 以下。</p>'],
  subconverter_tool: ['Subconverter 在线订阅转换安全说明', '工具指引', '<p>订阅转换工具主要用于将机场的原始订阅转换为 Clash、Sing-box、Quantumult X 或 Shadowrocket 格式。使用公共转换服务时，请注意隐私安全，优先选择支持本地部署的开源客户端或自建转换端。</p>']
};

const blogGrid = document.querySelector('#blog-grid');
const blogPagination = document.querySelector('#blog-pagination');
const blogFilterSearch = document.querySelector('#blog-filter-search');
const blogSearchClear = document.querySelector('#blog-search-clear');
const blogFilterCount = document.querySelector('#blog-filter-count');
const categoryPills = document.querySelectorAll('.category-pill');

if (blogGrid && Array.isArray(window.ARTICLE_INDEX)) {
  const PAGE_SIZE = 6;
  let currentPage = 1;
  let currentCategory = 'all';
  let currentSearchQuery = '';
  let activeArticles = [...window.ARTICLE_INDEX];

  // 分类映射规则（支持大类聚合）
  const categoryMap = {
    '选购指南': ['选购指南', '机场测评', '购买建议', '优惠攻略', '风险防范', '套餐知识'],
    '客户端教程': ['客户端教程', '组网教程', '高级进阶'],
    '线路科普': ['线路科普', '协议科普', '线路选择', 'IP 科普', '网络原理'],
    '故障排查': ['故障排查', '网络优化', 'DNS 科普'],
    '流媒体': ['流媒体', '游戏加速'],
    'AI 安全': ['AI 安全', 'AI 解锁', '前沿安全'],
    '隐私安全': ['隐私安全', '账号安全', '订阅安全', '远程办公', '办公场景'],
    '电商出海': ['电商出海', '终端配置', '使用场景', '移动网络', '方案对比']
  };

  function filterArticles() {
    activeArticles = window.ARTICLE_INDEX.filter(article => {
      // 1. 分类匹配
      let matchCategory = false;
      if (currentCategory === 'all') {
        matchCategory = true;
      } else if (categoryMap[currentCategory]) {
        matchCategory = categoryMap[currentCategory].includes(article.category);
      } else {
        matchCategory = article.category === currentCategory;
      }

      // 2. 搜索词匹配
      let matchQuery = true;
      if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        const inTitle = (article.title || '').toLowerCase().includes(q);
        const inKeyword = (article.keyword || '').toLowerCase().includes(q);
        const inFocus = (article.focus || '').toLowerCase().includes(q);
        const inCategory = (article.category || '').toLowerCase().includes(q);
        const inEntities = Array.isArray(article.entities) && article.entities.some(e => e.toLowerCase().includes(q));
        matchQuery = inTitle || inKeyword || inFocus || inCategory || inEntities;
      }

      return matchCategory && matchQuery;
    });

    currentPage = 1;
    renderArticles(1, false);
    updateFilterCount();
  }

  function updateFilterCount() {
    if (blogFilterCount) {
      if (currentSearchQuery || currentCategory !== 'all') {
        blogFilterCount.innerHTML = `<span>找到 <strong>${activeArticles.length}</strong> 篇匹配文章（共 ${window.ARTICLE_INDEX.length} 篇）</span>`;
      } else {
        blogFilterCount.innerHTML = `<span>已显示 <strong>${window.ARTICLE_INDEX.length}</strong> 篇技术文章</span>`;
      }
    }
  }

  function renderArticles(page, scroll = false) {
    currentPage = page;
    const totalCount = activeArticles.length;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    if (totalCount === 0) {
      blogGrid.innerHTML = `
        <div class="blog-empty-state">
          <i data-lucide="file-question" style="width:48px;height:48px;color:#94a3b8;margin-bottom:12px;"></i>
          <h3>未找到与当前筛选条件匹配的文章</h3>
          <p>尝试缩短或更换搜索关键词，或者切换回全部分类</p>
          <button type="button" class="button button-outline" id="blog-reset-filters" style="margin-top:12px;">
            <i data-lucide="rotate-ccw"></i> 重置筛选条件
          </button>
        </div>
      `;
      if (blogPagination) blogPagination.innerHTML = '';
      if (window.lucide) window.lucide.createIcons();
      const resetBtn = document.querySelector('#blog-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
      }
      return;
    }

    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE, totalCount);
    const pageArticles = activeArticles.slice(startIndex, endIndex);

    blogGrid.innerHTML = pageArticles.map(article => `
      <article class="blog-card">
        <a href="articles/${article.slug}.html" class="blog-thumb" style="background-image:url('${article.cover}')" role="img" aria-label="${article.title}封面"></a>
        <div class="blog-content">
          <span class="blog-tag">${article.category}</span>
          <h3><a href="articles/${article.slug}.html">${article.title}</a></h3>
          <p>${article.focus}</p>
          <div class="blog-meta">
            <span>${article.date}</span> · <span>${article.read}</span>
            <a href="articles/${article.slug}.html" class="text-link">阅读文章 <i data-lucide="arrow-right"></i></a>
          </div>
        </div>
      </article>
    `).join('');

    renderPaginationControls(totalPages, totalCount);
    if (window.lucide) window.lucide.createIcons();

    if (scroll) {
      const blogSection = document.querySelector('#blog');
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function renderPaginationControls(totalPages, totalCount) {
    if (!blogPagination) return;
    if (totalPages <= 1) {
      blogPagination.innerHTML = '';
      return;
    }

    let buttonsHtml = '';

    // Prev button
    buttonsHtml += `<button class="page-btn page-nav" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" aria-label="上一页">
      <i data-lucide="chevron-left"></i> 上一页
    </button>`;

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
      buttonsHtml += `<button class="page-btn page-num ${i === currentPage ? 'active' : ''}" data-page="${i}" aria-label="第 ${i} 页">
        ${i}
      </button>`;
    }

    // Next button
    buttonsHtml += `<button class="page-btn page-nav" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" aria-label="下一页">
      下一页 <i data-lucide="chevron-right"></i>
    </button>`;

    const startItem = (currentPage - 1) * PAGE_SIZE + 1;
    const endItem = Math.min(currentPage * PAGE_SIZE, totalCount);

    blogPagination.innerHTML = `
      <div class="pagination-controls">${buttonsHtml}</div>
      <div class="pagination-info">显示第 ${startItem} - ${endItem} 篇 · 筛选出 ${totalCount} 篇文章 (第 ${currentPage} / ${totalPages} 页)</div>
    `;

    blogPagination.querySelectorAll('.page-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPage = parseInt(btn.dataset.page, 10);
        if (targetPage && targetPage !== currentPage) {
          renderArticles(targetPage, true);
        }
      });
    });
  }

  function resetFilters() {
    currentCategory = 'all';
    currentSearchQuery = '';
    if (blogFilterSearch) blogFilterSearch.value = '';
    if (blogSearchClear) blogSearchClear.hidden = true;
    categoryPills.forEach(p => {
      const isAll = p.dataset.category === 'all';
      p.classList.toggle('active', isAll);
      p.setAttribute('aria-selected', String(isAll));
    });
    filterArticles();
  }

  // 分类按钮点击事件
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      currentCategory = pill.dataset.category || 'all';
      filterArticles();
    });
  });

  // 搜索框输入事件（防抖）
  if (blogFilterSearch) {
    let debounceTimer = null;
    blogFilterSearch.addEventListener('input', e => {
      const val = e.target.value.trim();
      currentSearchQuery = val;
      if (blogSearchClear) {
        blogSearchClear.hidden = !val;
      }
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterArticles();
      }, 150);
    });

    if (blogSearchClear) {
      blogSearchClear.addEventListener('click', () => {
        blogFilterSearch.value = '';
        currentSearchQuery = '';
        blogSearchClear.hidden = true;
        filterArticles();
        blogFilterSearch.focus();
      });
    }
  }

  // 初始化首次渲染
  renderArticles(1, false);
}

function openModal(title, kicker, content) {
  modalTitle.textContent = title;
  modalKicker.textContent = kicker;
  modalContent.innerHTML = content;
  modal.hidden = false;
  document.body.classList.add('is-locked');
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}

document.querySelectorAll('.details-button').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.provider || '机场测评详情';
    openModal(name, '机场详细评测', `<p>这是【${name}】的详细评测与数据报告。</p><h3>综合结论</h3><p>线路可用率与晚高峰稳定性通过了机场眼的 90 天观察标准。建议在购买前确认退款条款与所需地区节点的实际解锁情况。</p>`);
  });
});

const methodDetailsTrigger = document.querySelector('.method-details-trigger');
if (methodDetailsTrigger) {
  methodDetailsTrigger.addEventListener('click', () => {
    openModal(
      '机场眼评测权重算法',
      '公开标准 · 四项综合评分',
      `<p>综合排名采用统一测试环境和滚动观察周期，主要由以下四项指标构成：</p>
      <h3>40% · 晚高峰速度与稳定性</h3><p>重点观察每日 20:00—23:00 的下载速度、延迟、抖动与丢包表现。</p>
      <h3>25% · 连续可用率</h3><p>统计 90 天内节点可连接时间、故障频率与恢复速度。</p>
      <h3>20% · 流媒体与 AI 解锁</h3><p>测试常用流媒体平台及 ChatGPT、Claude 等服务的可用情况。</p>
      <h3>15% · 售后与退款机制</h3><p>综合考察工单响应、故障公告、退款规则和服务条款透明度。</p>
      <p><strong>说明：</strong>排名会随滚动测试结果更新，单次测速不代表长期表现。</p>`
    );
  });
}

document.querySelectorAll('[data-article]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const key = link.dataset.article;
    const article = articles[key];
    if (article) {
      openModal(article[0], article[1], article[2]);
    }
  });
});

document.querySelectorAll('[data-close-modal]').forEach(element => element.addEventListener('click', closeModal));
function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('is-locked');
}

// Copy Coupon Code Logic
document.addEventListener('click', event => {
  const button = event.target.closest('.copy-btn');
  if (!button) return;
  const code = button.dataset.code;
  if (!code) return;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => showCopied(button)).catch(() => fallbackCopy(code, button));
  } else {
    fallbackCopy(code, button);
  }
});

function showCopied(button) {
  const original = button.innerHTML;
  button.innerHTML = '已复制!';
  button.classList.add('copied-active');
  setTimeout(() => {
    button.innerHTML = original;
    button.classList.remove('copied-active');
  }, 2000);
}

function fallbackCopy(text, button) {
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  showCopied(button);
}

// Search Panel Logic
const searchPanel = document.querySelector('#search-panel');
const searchInput = document.querySelector('#site-search');
const searchTrigger = document.querySelector('.search-trigger');
const searchClose = document.querySelector('.search-close');

if (searchTrigger && searchPanel) {
  searchTrigger.addEventListener('click', () => {
    searchPanel.hidden = false;
    document.body.classList.add('is-locked');
    setTimeout(() => searchInput?.focus(), 20);
  });

  if (searchClose) searchClose.addEventListener('click', closeSearch);
  searchPanel.addEventListener('click', event => { if (event.target === searchPanel) closeSearch(); });
}

function closeSearch() {
  if (searchPanel) {
    searchPanel.hidden = true;
    document.body.classList.remove('is-locked');
  }
}

if (searchInput) {
  document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
    searchInput.value = button.dataset.query;
    searchInput.dispatchEvent(new Event('input'));
  }));

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    const items = [
      ['闪电鼠、大佬云、榴莲云机场推荐排名', 'recommend.html'],
      ['性价比机场推荐榜', 'budget.html'],
      ['机场 7 折优惠码汇总', 'coupons.html'],
      ['跑路预警及退款风险提醒', 'warning.html'],
      ['IEPL 专线与中转的区别', 'faq.html'],
      ['Clash Verge & Sing-box 分流教程', 'blog.html'],
      ['客户端下载中心', 'resources.html']
    ].concat((window.ARTICLE_INDEX || []).map(article => [article.title, `articles/${article.slug}.html`]))
      .filter(([title]) => title.toLowerCase().includes(query));

    const resultsContainer = document.querySelector('#search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = query
        ? (items.length ? items.map(([title, href]) => `<a class="text-link" href="${href}">${title}</a>`).join('') : '<p>没有找到匹配内容</p>')
        : '<p>输入关键词开始搜索，例如“专线”、“优惠码”、“跑路”</p>';
      resultsContainer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeSearch));
    }
  });
}

// Mobile Nav Menu Toggle
const menuButton = document.querySelector('.menu-button');
const mainNav = document.querySelector('#main-nav');
if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    const open = mainNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

// Newsletter Form Submit
const newsletterForm = document.querySelector('#newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', event => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    if (status) status.textContent = '订阅成功。下一期月度测评与安全摘要会发送到你的邮箱。';
    event.currentTarget.reset();
  });
}

// Keyboard ESC Close
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (modal && !modal.hidden) closeModal();
  if (searchPanel && !searchPanel.hidden) closeSearch();
});

// Quick Jump Selector for Airport Recommendation
const jumpSelect = document.querySelector('#airport-jump-select');
if (jumpSelect) {
  jumpSelect.addEventListener('change', event => {
    const targetId = event.target.value;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-card');
        setTimeout(() => el.classList.remove('highlight-card'), 2000);
      }
    }
  });
}

// Quick Nav Pill Links
document.querySelectorAll('.quick-nav-pills a').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      event.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-card');
        setTimeout(() => el.classList.remove('highlight-card'), 2000);
      }
    }
  });
});

// FAQ Filter, Search and Expand/Collapse Controller
const faqFilterSearch = document.querySelector('#faq-filter-search');
const faqSearchClear = document.querySelector('#faq-search-clear');
const faqFilterCount = document.querySelector('#faq-filter-count');
const faqPills = document.querySelectorAll('.faq-pill');
const faqItems = document.querySelectorAll('.faq-item');
const faqExpandAll = document.querySelector('#faq-expand-all');
const faqCollapseAll = document.querySelector('#faq-collapse-all');
const faqEmptyState = document.querySelector('#faq-empty-state');
const faqEmptyKeyword = document.querySelector('#faq-empty-keyword');
const faqResetFilter = document.querySelector('#faq-reset-filter');

if (faqItems.length > 0) {
  let currentFaqCategory = 'all';
  let currentFaqQuery = '';
  const totalFaqCount = faqItems.length;

  function filterFaqItems() {
    let visibleCount = 0;
    const query = currentFaqQuery.trim().toLowerCase();

    faqItems.forEach(item => {
      // 1. Category matching
      const itemCategory = item.dataset.category || '';
      const matchCategory = (currentFaqCategory === 'all') || (itemCategory === currentFaqCategory);

      // 2. Keyword matching in Question title and Answer text
      let matchQuery = true;
      if (query) {
        const questionText = (item.querySelector('.faq-question')?.textContent || '').toLowerCase();
        const answerText = (item.querySelector('.faq-answer')?.textContent || '').toLowerCase();
        matchQuery = questionText.includes(query) || answerText.includes(query);
      }

      if (matchCategory && matchQuery) {
        item.classList.remove('is-hidden');
        visibleCount++;
        // If searching specifically with keywords, auto-open matching details for immediate answer viewing
        if (query) {
          item.open = true;
        }
      } else {
        item.classList.add('is-hidden');
      }
    });

    // Update Counter
    if (faqFilterCount) {
      if (currentFaqCategory !== 'all' || query) {
        faqFilterCount.innerHTML = `<span>找到 <strong>${visibleCount}</strong> 题匹配解答（共 ${totalFaqCount} 题）</span>`;
      } else {
        faqFilterCount.innerHTML = `<span>已显示 <strong>${totalFaqCount}</strong> 题疑难解答</span>`;
      }
    }

    // Empty State Toggle
    if (faqEmptyState) {
      if (visibleCount === 0) {
        faqEmptyState.hidden = false;
        if (faqEmptyKeyword) {
          faqEmptyKeyword.textContent = query || currentFaqCategory;
        }
      } else {
        faqEmptyState.hidden = true;
      }
    }
  }

  // Category Pill Click Event
  faqPills.forEach(pill => {
    pill.addEventListener('click', () => {
      faqPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      currentFaqCategory = pill.dataset.category || 'all';
      filterFaqItems();
    });
  });

  // Search Input Event
  if (faqFilterSearch) {
    faqFilterSearch.addEventListener('input', e => {
      currentFaqQuery = e.target.value;
      if (faqSearchClear) {
        faqSearchClear.hidden = !currentFaqQuery;
      }
      filterFaqItems();
    });

    if (faqSearchClear) {
      faqSearchClear.addEventListener('click', () => {
        faqFilterSearch.value = '';
        currentFaqQuery = '';
        faqSearchClear.hidden = true;
        faqFilterSearch.focus();
        filterFaqItems();
      });
    }
  }

  // Expand All / Collapse All Buttons
  if (faqExpandAll) {
    faqExpandAll.addEventListener('click', () => {
      faqItems.forEach(item => {
        if (!item.classList.contains('is-hidden')) {
          item.open = true;
        }
      });
    });
  }

  if (faqCollapseAll) {
    faqCollapseAll.addEventListener('click', () => {
      faqItems.forEach(item => {
        if (!item.classList.contains('is-hidden')) {
          item.open = false;
        }
      });
    });
  }

  // Reset Filter Button in Empty State
  if (faqResetFilter) {
    faqResetFilter.addEventListener('click', () => {
      currentFaqCategory = 'all';
      currentFaqQuery = '';
      if (faqFilterSearch) {
        faqFilterSearch.value = '';
      }
      if (faqSearchClear) {
        faqSearchClear.hidden = true;
      }
      faqPills.forEach(p => {
        if (p.dataset.category === 'all') {
          p.classList.add('active');
          p.setAttribute('aria-selected', 'true');
        } else {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        }
      });
      filterFaqItems();
    });
  }
}




