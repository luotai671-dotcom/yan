const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const logosDir = path.join(root, 'assets', 'logos');

// 24 Airports with strict 1-24 ranking matching recommend.html, budget.html and compare.html
const airports = [
  {
    rank: 1,
    id: 'card-shandianshu',
    name: '闪电鼠',
    badge: '第一名 · 综合旗舰',
    type: '顶级 IEPL 双入口专线',
    logo: 'assets/logos/shandianshu.jpg',
    url: 'https://chenpin.shandianshuaff.com/#/?code=m28TvPVX',
    discountPrice: '15.40',
    originalPrice: '22',
    code: 'sd88',
    speed: '约 520 Mbps',
    unlock: '主流平台全解锁',
    unlockStatus: 'status-yes',
    advantage: '办公与 4K',
    reason: '双入口设计比单入口更容易在局部故障时切换路线，参考速度和折后价格也较均衡，因此放在综合推荐首位。',
    advantages: ['双入口提供一定线路冗余', '适合会议、远程办公和 4K 视频', '价格适合用作长期主力方案'],
    tags: ['综合第一', '双入口冗余'],
    featured: true,
    hasDiscount: true,
    rankTag: '首选',
    budgetFeatures: [
      'IEPL 双入口，适合作为日常主线路',
      '晚高峰参考约 520 Mbps',
      '更适合办公、4K 视频和稳定优先用户'
    ],
    compareAdv: '双入口与综合速度',
    compareSuitable: '办公、高清视频、主力线路',
    compareNotice: '先测试本地运营商入口'
  },
  {
    rank: 2,
    id: 'card-dalaoyun',
    name: '大佬云',
    badge: '第二名 · 高速性价比',
    type: '高速 IEPL 多线专线',
    logo: 'assets/logos/dalaoyun.png',
    url: 'https://chenpin01.dalaoyunaff.com/#/?code=GQ6CL6Km',
    discountPrice: '16.10',
    originalPrice: '23',
    code: 'dly88',
    speed: '约 500 Mbps',
    unlock: 'Netflix / AI 解锁',
    unlockStatus: 'status-yes',
    advantage: '高速多设备',
    reason: '多线 IEPL 更适合同时连接手机、电脑和平板，在高速下载、AI 工具和家庭共享之间保持了较好的平衡。',
    advantages: ['多设备同时使用更从容', '晚高峰参考速度保持较高水平', '适合家庭共享与高频下载'],
    tags: ['速度突出', '多设备友好'],
    hasDiscount: true,
    rankTag: '高速多设备',
    budgetFeatures: [
      '多线 IEPL，兼顾速度与设备并发',
      '晚高峰参考约 500 Mbps',
      '更适合家庭共享、AI 工具与多终端'
    ],
    compareAdv: '多线与设备并发',
    compareSuitable: '家庭、多设备、AI 工具',
    compareNotice: '核对同时在线和流量规则'
  },
  {
    rank: 3,
    id: 'card-liulianyun',
    name: '榴莲云',
    badge: '第三名 · 流媒体均衡',
    type: '优质 IPLC / IEPL 专线',
    logo: 'assets/logos/liulianyun.png',
    url: 'https://chenpingan.liulianyunaff.com/#/?code=7pdjs9zt',
    discountPrice: '16.80',
    originalPrice: '24',
    code: 'll88',
    speed: '约 480 Mbps',
    unlock: '常用地区解锁',
    unlockStatus: 'status-yes',
    advantage: '流媒体体验',
    reason: 'IPLC 与 IEPL 组合更强调地区覆盖和视频体验，速度不是榜单最高，但对于追剧和日常浏览更容易获得均衡体验。',
    advantages: ['常用流媒体地区选择较丰富', '视频播放和普通浏览较均衡', '适合以娱乐内容为主的用户'],
    tags: ['流媒体推荐', '线路均衡'],
    hasDiscount: true,
    rankTag: '流媒体均衡',
    budgetFeatures: [
      'IPLC / IEPL 组合，地区选择较均衡',
      '晚高峰参考约 480 Mbps',
      '更偏向流媒体、高清视频与日常浏览'
    ],
    compareAdv: '地区和流媒体均衡',
    compareSuitable: '追剧、视频、日常浏览',
    compareNotice: '按目标片库实测解锁'
  },
  {
    rank: 4,
    id: 'card-huanqiuti',
    name: '环球梯',
    badge: '第四名 · 入门友好',
    type: 'BGP 接入 + IEPL 专线',
    logo: 'assets/logos/huanqiuti.jpg',
    url: 'https://chenpingan01.huanqiutiaff.com/#/?code=FGCcYdFo',
    discountPrice: '15.40',
    originalPrice: '22',
    code: 'HQ66',
    speed: '约 440 Mbps',
    unlock: '多数地区可用',
    unlockStatus: 'status-partial',
    advantage: '价格亲民',
    reason: '折后价格处于较低区间，BGP 接入配合 IEPL 能满足基础专线需求，适合作为新手第一次月付测试的选择。',
    advantages: ['月付门槛相对较低', '网页浏览和轻办公够用', '适合先短期试用再决定续费'],
    tags: ['入门推荐', '价格友好'],
    hasDiscount: true,
    rankTag: '入门优选',
    budgetFeatures: [
      'BGP 接入搭配 IEPL，入门更容易',
      '晚高峰参考约 440 Mbps',
      '适合首次尝试、轻办公和普通网页使用'
    ],
    compareAdv: '较低门槛与 BGP 接入',
    compareSuitable: '新手、轻办公、短期试用',
    compareNotice: '观察晚高峰入口表现'
  },
  {
    rank: 5,
    id: 'card-shenxing',
    name: '神行加速',
    badge: '第五名 · 移动优化',
    type: 'IEPL 智能路由专线',
    logo: 'assets/logos/shenxing.png',
    url: 'https://chenpingan01.shenxingaff.com/#/?code=RZ48f9wP',
    discountPrice: '16.10',
    originalPrice: '23',
    code: 'sx0077',
    speed: '约 460 Mbps',
    unlock: '主流平台解锁',
    unlockStatus: 'status-yes',
    advantage: '移动端切换',
    reason: '智能路由更贴合手机和平板的使用方式，在家庭 Wi-Fi、公司网络和移动数据之间切换时更注重连接便利性。',
    advantages: ['手机和平板使用场景友好', '适合经常更换网络环境', '速度与移动便利性较平衡'],
    tags: ['智能路由', '移动端友好'],
    hasDiscount: true,
    rankTag: '移动端友好',
    budgetFeatures: [
      'IEPL 智能选路，移动网络切换更方便',
      '晚高峰参考约 460 Mbps',
      '更适合手机、平板和经常切换 Wi-Fi 的用户'
    ],
    compareAdv: '移动端与智能选路',
    compareSuitable: '手机、平板、网络切换',
    compareNotice: '分别测试 Wi-Fi 与蜂窝网络'
  },
  {
    rank: 6,
    id: 'card-yunjiexian',
    name: '云界线',
    badge: '第六名 · 轻量备用',
    type: 'IEPL 优选高速专线',
    logo: 'assets/logos/yunjiexian.png',
    url: 'https://chenpinga.yunjiexianaff.com/#/?code=rTCMGvQT',
    discountPrice: '15.40',
    originalPrice: '22',
    code: 'yjx888',
    speed: '约 420 Mbps',
    unlock: '基础平台解锁',
    unlockStatus: 'status-partial',
    advantage: '轻量与备用',
    reason: '价格控制在较低水平，性能足以覆盖轻量浏览与基础视频，更适合已有主力线路、希望增加备用连接的用户。',
    advantages: ['备用线路成本较容易控制', '适合低频浏览与临时使用', '可降低单一服务中断的影响'],
    tags: ['备用线路', '轻量使用'],
    hasDiscount: true,
    rankTag: '轻量备用',
    budgetFeatures: [
      'IEPL 基础方案，月付门槛相对友好',
      '晚高峰参考约 420 Mbps',
      '更适合轻量需求或作为第二条备用线路'
    ],
    compareAdv: '轻量和备用成本',
    compareSuitable: '低频使用、第二条线路',
    compareNotice: '不建议只看低价长期预付'
  },
  {
    rank: 7,
    id: 'card-jilianyun',
    name: '极连云',
    badge: '第七名 · 高速专线',
    type: '全 IEPL 专线 + 三网优化',
    logo: 'assets/logos/jilianyun.jpg',
    url: 'https://haozevpn.jlyvipaff.com/#/?code=6h2TMD5b',
    discountPrice: '15.40',
    originalPrice: '22',
    code: 'jly888',
    speed: '约 485 Mbps',
    unlock: 'Netflix / ChatGPT 全解',
    unlockStatus: 'status-yes',
    advantage: '高速稳定',
    reason: '全 IEPL 极速专线，支持三网自动优化，解锁常用海外流媒体与 AI 工具，晚高峰稳定低延迟。',
    advantages: ['三网自适应与专线传输', '解锁 Netflix、ChatGPT 及 4K 播放', '不限制在线连接设备数'],
    tags: ['IEPL专线', '三网优化'],
    hasDiscount: true,
    rankTag: '高速专线',
    budgetFeatures: [
      '全 IEPL 专线，三网自适应负载',
      '晚高峰参考约 485 Mbps',
      '适合追求极致连通与低延迟用户'
    ],
    compareAdv: '三网优化与高可用',
    compareSuitable: '极速追剧、AI 工具、办公',
    compareNotice: '建议优先测试本地优化节点'
  },
  {
    rank: 8,
    id: 'card-guangnianti',
    name: '光年梯',
    badge: '第八名 · 多端低延',
    type: 'BGP 多线 + IEPL 专线',
    logo: 'assets/logos/guangnianti.jpg',
    url: 'https://gnt001.gntvipaff.cc/#/?code=rN3ybxa7',
    discountPrice: '16.10',
    originalPrice: '23',
    code: 'gnt888',
    speed: '约 475 Mbps',
    unlock: 'Disney+ / OpenAI 解锁',
    unlockStatus: 'status-yes',
    advantage: '低延迟多端',
    reason: '采用优质 BGP 中转与 IEPL 专线传输，兼顾多端设备并发，晚高峰丢包率极低。',
    advantages: ['BGP 多线中转架构', '晚高峰低抖动低丢包', '完美解锁迪士尼与 AI 场景'],
    tags: ['BGP多线', '低延迟'],
    hasDiscount: true,
    rankTag: '多端低延',
    budgetFeatures: [
      'BGP 多线中转搭配 IEPL 专线',
      '晚高峰参考约 475 Mbps',
      '适合多设备共享与低抖动需求'
    ],
    compareAdv: 'BGP 多线与低丢包',
    compareSuitable: '多端并发、游戏加速、影音',
    compareNotice: '注意不同客户端的策略组匹配'
  },
  {
    rank: 9,
    id: 'card-bianyuanjiedian',
    name: '边缘节点',
    badge: '第九名 · 边缘分布式',
    type: '边缘计算 Edge 优化专线',
    logo: 'assets/logos/bianyuanjiedian.jpg',
    url: 'https://wep.edgenovaaff.com/#/?code=papME7sh',
    discountPrice: '14.70',
    originalPrice: '21',
    code: 'edge888',
    speed: '约 460 Mbps',
    unlock: '智能多区域解锁',
    unlockStatus: 'status-partial',
    advantage: '智能就近接入',
    reason: '依托边缘节点分布式架构，路由灵活且就近响应，价格亲民，适合作为日常多地区连通备选。',
    advantages: ['分布式边缘计算就近路由', '月付门槛低，性价比突出', '多地区节点快速接入'],
    tags: ['边缘计算', '智能路由'],
    hasDiscount: true,
    rankTag: '边缘分布式',
    budgetFeatures: [
      '边缘分布式架构，智能就近路由',
      '晚高峰参考约 460 Mbps',
      '更适合低成本接入与多节点备选'
    ],
    compareAdv: '边缘计算与智能路由',
    compareSuitable: '多地区接入、性价比备用',
    compareNotice: '观察不同边缘节点的测试表现'
  },
  {
    rank: 10,
    id: 'card-sujie',
    name: '速界',
    badge: '第十名 · 极速大带宽',
    type: '全 IPLC 极速专线',
    logo: 'assets/logos/sujie.jpg',
    url: 'https://pygllc.speedworldaff.cc/#/?code=ll8LjYBJ',
    discountPrice: '16.80',
    originalPrice: '24',
    code: 'sj888',
    speed: '约 490 Mbps',
    unlock: '8K 视频 / AI 快速响应',
    unlockStatus: 'status-yes',
    advantage: '极速大带宽',
    reason: '专为大带宽需求定制的全 IPLC 专线，抗封锁强，低丢包，非常适合 4K/8K 大码率观影。',
    advantages: ['全 IPLC 专线低延迟', '大带宽保障 8K 视频秒开', '支持全平台通用分流规则'],
    tags: ['IPLC专线', '极速大带宽'],
    hasDiscount: true,
    rankTag: '极速大带宽',
    budgetFeatures: [
      '全 IPLC 专线大带宽保障',
      '晚高峰参考约 490 Mbps',
      '更适合 4K/8K 观影与大文件下载'
    ],
    compareAdv: 'IPLC 大带宽与低延迟',
    compareSuitable: '8K 超清观影、大文件下载',
    compareNotice: '核对高倍率节点的流量扣除'
  },
  {
    rank: 11,
    id: 'card-kexinyun',
    name: '可信云',
    badge: '第十一名 · 稳定抗封',
    type: '企业级 IPLC/IEPL 专线',
    logo: 'assets/logos/kexinyun.jpg',
    url: 'https://everett7623.kosingaff.com//#/?code=Jl6dWU0G',
    discountPrice: '15.40',
    originalPrice: '22',
    code: 'kosing888',
    speed: '约 470 Mbps',
    unlock: '全平台流媒体解锁',
    unlockStatus: 'status-yes',
    advantage: '稳定抗封锁',
    reason: '由海外资深团队运维，采用企业级中转专线，抗封锁能力突出，保障重要业务与日常流畅。',
    advantages: ['海外团队专业技术运维', '企业级中转抗封锁力强', '解锁流媒体与办公服务'],
    tags: ['企业级专线', '抗封锁'],
    hasDiscount: true,
    rankTag: '稳定抗封',
    budgetFeatures: [
      '企业级中转，高抗封锁传输',
      '晚高峰参考约 470 Mbps',
      '适合跨国连通与稳定性要求高的用户'
    ],
    compareAdv: '企业中转与高连通',
    compareSuitable: '商务办公、敏感期连通',
    compareNotice: '建议固定常用办公节点'
  },
  {
    rank: 12,
    id: 'card-kuaili',
    name: '快狸',
    badge: '第十二名 · 移动多端',
    type: 'IEPL 智能选路专线',
    logo: 'assets/logos/kuaili.jpg',
    url: 'https://fanxiaobin.kuailiaff.com/#/?code=sOX6N4Tp',
    discountPrice: '16.10',
    originalPrice: '23',
    code: 'kuaili888',
    speed: '约 465 Mbps',
    unlock: '主流平台全覆盖',
    unlockStatus: 'status-yes',
    advantage: '移动端与多设备',
    reason: '针对移动网络智能优化，支持多设备同时并发，网页加载与视频首开速度表现优异。',
    advantages: ['移动端网络优化体验佳', '支持多设备同时在线使用', '节点响应迅速不卡顿'],
    tags: ['智能选路', '多设备'],
    hasDiscount: true,
    rankTag: '移动多端',
    budgetFeatures: [
      '针对移动网络智能优化的 IEPL 专线',
      '晚高峰参考约 465 Mbps',
      '适合手机、平板与多终端切换使用'
    ],
    compareAdv: '移动优化与快捷连通',
    compareSuitable: '移动端用户、多设备并发',
    compareNotice: '注意定期更新订阅配置'
  },
  {
    rank: 13,
    id: 'card-shunyun',
    name: '瞬云',
    badge: '第十三名 · 不限设备',
    type: '高速内网专线 · 无设备限制',
    logo: 'assets/logos/shunyun.jpg',
    url: 'https://ddd.jichang.best/#/register?code=weN73kGq',
    discountPrice: '14.70',
    originalPrice: '21',
    code: 'shunyun888',
    speed: '约 455 Mbps',
    unlock: 'ChatGPT / YouTube 解锁',
    unlockStatus: 'status-yes',
    advantage: '不限设备数',
    reason: '不限制并发在线设备数量，节点响应敏捷，适合多设备家庭与团队共享使用。',
    advantages: ['零上线设备数限制', '高速内网传输延迟低', '流媒体与 AI 解锁表现良好'],
    tags: ['内网专线', '不限设备'],
    hasDiscount: true,
    rankTag: '不限设备',
    budgetFeatures: [
      '高速内网专线，完全零设备限制',
      '晚高峰参考约 455 Mbps',
      '更适合家庭成员共享与多终端连接'
    ],
    compareAdv: '零设备上限与低延迟',
    compareSuitable: '家庭多端、团队共享',
    compareNotice: '保持个人订阅 Token 隐蔽'
  },
  {
    rank: 14,
    id: 'card-yuntu',
    name: '云图',
    badge: '第十四名 · 原生 IP 解锁',
    type: '原生 IP + IPLC 专线',
    logo: 'assets/logos/yuntu.jpg',
    url: 'https://super.ytjcok.org/#/register?code=BKvuyYJI',
    discountPrice: '16.80',
    originalPrice: '24',
    code: 'yuntu888',
    speed: '约 480 Mbps',
    unlock: '全原生 IP 解锁',
    unlockStatus: 'status-yes',
    advantage: '原生 IP 全解锁',
    reason: '配备大量海外原生 IP 资源，IPLC 专线加持，专为 TikTok 运营、海外游戏与 AI 登录设计。',
    advantages: ['全原生 IP 资源解锁利器', 'IPLC 专线保障极低丢包', '完美适配 TikTok 与游戏'],
    tags: ['原生IP', 'IPLC专线'],
    hasDiscount: true,
    rankTag: '原生 IP 解锁',
    budgetFeatures: [
      '全原生 IP + IPLC 低延迟专线',
      '晚高峰参考约 480 Mbps',
      '适合 TikTok 电商、全流媒体解锁'
    ],
    compareAdv: '原生 IP 与纯净度',
    compareSuitable: 'TikTok 运营、海外游戏',
    compareNotice: '固化账号出网 IP 地区'
  },
  {
    rank: 15,
    id: 'card-kunpeng',
    name: '鲲鹏加速',
    badge: '第十五名 · 办公与低延',
    type: '多线 BGP 优化专线',
    logo: 'assets/logos/kunpeng.jpg',
    url: 'https://kunpengjiasu.com/#/register?code=oBWoiCcv',
    discountPrice: '15.40',
    originalPrice: '22',
    code: 'kunpeng888',
    speed: '约 460 Mbps',
    unlock: '跨境办公与流媒体',
    unlockStatus: 'status-yes',
    advantage: '办公与低延迟',
    reason: '多线 BGP 入口就近接入，低抖动、低丢包，为视频会议、远程桌面及跨境办公提供可靠保障。',
    advantages: ['BGP 多线入口就近接入', '极低抖动适合远程会议', '稳定性出色适合长期办公'],
    tags: ['BGP优化', '跨境办公'],
    hasDiscount: true,
    rankTag: '办公与低延',
    budgetFeatures: [
      '多线 BGP 入口优化，超低抖动',
      '晚高峰参考约 460 Mbps',
      '更适合跨境远程办公与视频会议'
    ],
    compareAdv: '低抖动与稳定会议',
    compareSuitable: '远程工作者、商务交流',
    compareNotice: '避免频繁跨洲节点切换'
  },
  {
    rank: 16,
    id: 'card-ermaoyun',
    name: '二猫云',
    badge: '第十六名 · 高品质专线',
    type: '企业级 IEPL/IPLC 专线',
    logo: 'assets/logos/ermaoyun.jpg',
    url: 'https://server.ermaotztz3.homes/#/?code=Vf45aB7S',
    discountPrice: '17.50',
    originalPrice: '25',
    code: 'ermao888',
    speed: '约 490 Mbps',
    unlock: 'AI / 流媒体全解锁',
    unlockStatus: 'status-yes',
    advantage: '专用 Client 与解锁',
    reason: '全线 IEPL 专线搭配自适应 BGP 接入，在晚高峰保持高稳定性，不限在线设备数量。',
    advantages: ['全线企业级专线与 BGP 负载', '专有客户端适配，解锁 AI 与流媒体', '不限制同时连接的设备数量'],
    tags: ['三网自适应', '不限设备'],
    hasDiscount: false,
    rankTag: '高品质专线',
    budgetFeatures: [
      '企业级 IEPL/IPLC 专线，三网自适应',
      '晚高峰参考约 490 Mbps',
      '不限制连接设备，专用 Client 体验极佳'
    ],
    compareAdv: '专用客户端与不限设备',
    compareSuitable: '高品质用户、多端共享',
    compareNotice: '确认官方客户端适配情况'
  },
  {
    rank: 17,
    id: 'card-guangsuyun',
    name: '光速云',
    badge: '第十七名 · 60+原生IP',
    type: '原生 IPLC 专线 · 60+ 节点',
    logo: 'assets/logos/guangsuyun.jpg',
    url: 'https://sjds8ds.guangsut.sbs/#/?code=RrfZcKT5',
    discountPrice: '16.80',
    originalPrice: '24',
    code: 'free70',
    speed: '约 475 Mbps',
    unlock: '8K / 全平台原生解锁',
    unlockStatus: 'status-yes',
    advantage: '多节点与低延迟',
    reason: '拥有超过 60 个独立 IP 节点，IPLC 内网专线保障晚高峰低丢包，非常适合 4K/8K 视频与全平台解锁。',
    advantages: ['60+ 独立原生 IP 节点 coverage', 'IPLC 专线保证晚高峰低延迟', '完美解锁 Netflix, TikTok 及 AI'],
    tags: ['60+节点', '原生解锁'],
    hasDiscount: false,
    rankTag: '60+原生IP',
    budgetFeatures: [
      '60+ 独立原生 IP 节点 coverage',
      '晚高峰参考约 475 Mbps',
      '完美解锁 Netflix, TikTok 及 8K 视频'
    ],
    compareAdv: '60+ 原生 IP 节点',
    compareSuitable: '流媒体全解锁、低延迟',
    compareNotice: '选择匹配运营商的主接入点'
  },
  {
    rank: 18,
    id: 'card-paofuyun',
    name: '泡芙云',
    badge: '第十八名 · 老牌内网',
    type: '老牌 IEPL 内网专线',
    logo: 'assets/logos/paofuyun.jpg',
    url: 'https://www.paofu.cloud/auth/register?code=qC0O',
    discountPrice: '15.40',
    originalPrice: '22',
    code: 'paofu88',
    speed: '约 430 Mbps',
    unlock: '主流平台解锁',
    unlockStatus: 'status-yes',
    advantage: '老牌稳定',
    reason: '运行时间长，采用 Shadowsocks/Trojan 协议与 IEPL 内网专线，涵盖常用流媒体与通用分流节点。',
    advantages: ['资深团队运维，成熟生态', '涵盖主流流媒体与 AI 分流', '套餐档位选择丰富'],
    tags: ['老牌服务', 'IEPL内网'],
    hasDiscount: false,
    rankTag: '老牌内网',
    budgetFeatures: [
      '资深运维，IEPL 内网专线稳定连接',
      '晚高峰参考约 430 Mbps',
      '覆盖主流流媒体与常用 AI 路由'
    ],
    compareAdv: '老牌 IEPL 内网成熟架构',
    compareSuitable: '传统客户端用户',
    compareNotice: '注意观察工单处理效率'
  },
  {
    rank: 19,
    id: 'card-longmaoyun',
    name: '龙猫云',
    badge: '第十九名 · 冷门与多端',
    type: '全 IPLC 专线 · 丰富落地',
    logo: 'assets/logos/longmaoyun.jpg',
    url: 'https://inv06.lmaff01.cc/register?aff=PIB8x7dJ',
    discountPrice: '14.70',
    originalPrice: '21',
    code: 'totoro88',
    speed: '约 450 Mbps',
    unlock: 'ChatGPT / Netflix 解锁',
    unlockStatus: 'status-yes',
    advantage: '不限设备数',
    reason: '全线 IPLC 专线，不限制设备连接数量，冷门与常用地区覆盖面广，流媒体解锁表现亮眼。',
    advantages: ['全线 IPLC 专线低延迟', '无在线设备数上限限制', '解锁流媒体与 ChatGPT 稳健'],
    tags: ['IPLC专线', '无设备限制'],
    hasDiscount: false,
    rankTag: '冷门与多端',
    budgetFeatures: [
      '全线 IPLC 专线，不限制设备连接数',
      '晚高峰参考约 450 Mbps',
      '丰富冷门落地节点支持'
    ],
    compareAdv: '全 IPLC 与冷门落地',
    compareSuitable: '解除设备限制需求',
    compareNotice: '新订阅链接需定时同步刷新'
  },
  {
    rank: 20,
    id: 'card-qingyunti',
    name: '青云梯',
    badge: '第二十名 · 企业级专线',
    type: 'IPLC 企业级内网专线',
    logo: 'assets/logos/qingyunti.jpg',
    url: 'https://inv02.qytaff.cc/register?aff=WkyKiasW',
    discountPrice: '17.50',
    originalPrice: '25',
    code: 'qyt888',
    speed: '约 465 Mbps',
    unlock: '全流媒体 / AI 优化',
    unlockStatus: 'status-yes',
    advantage: '极低抖动与多端',
    reason: '前身老牌服务升级全 IPLC 专线，晚高峰时段延迟极低，不限制多设备并发连接。',
    advantages: ['企业级 IPLC 传输线路', '不限并发连接设备数', '流畅支持 4K 与大文件下载'],
    tags: ['企业级专线', '低抖动'],
    hasDiscount: false,
    rankTag: '企业级专线',
    budgetFeatures: [
      '前身老牌升级 IPLC 企业内网专线',
      '晚高峰参考约 465 Mbps',
      '适合大码率视频观影与大流量下载'
    ],
    compareAdv: '企业级 IPLC 极低抖动',
    compareSuitable: '高码率 4K 追剧与大文件',
    compareNotice: '优先月付体验晚高峰'
  },
  {
    rank: 21,
    id: 'card-dageyun',
    name: '大哥云',
    badge: '第二十一名 · 老牌 Trojan',
    type: 'IPLC 专线 + Trojan 协议',
    logo: 'assets/logos/dageyun.jpg',
    url: 'https://a03.dgy02.com/#/register?code=vjFaxWEI',
    discountPrice: '16.10',
    originalPrice: '23',
    code: 'dage88',
    speed: '约 445 Mbps',
    unlock: 'Disney+ / OpenAI 解锁',
    unlockStatus: 'status-yes',
    advantage: '海外运维与灵活',
    reason: '多年老牌机场，由海外团队运营，采用 Trojan 协议配合专线中转，节点响应快，提供试用支持。',
    advantages: ['海外团队技术运维', 'Trojan 协议抗封锁能力优', '支持定制客户端与通用订阅'],
    tags: ['老牌运营', 'Trojan协议'],
    hasDiscount: false,
    rankTag: '老牌 Trojan',
    budgetFeatures: [
      '海外团队技术支持，Trojan 协议',
      '晚高峰参考约 445 Mbps',
      '新用户免费试用与多档位灵活选'
    ],
    compareAdv: 'Trojan 协议与海外团队',
    compareSuitable: '需要免费试用与好服务',
    compareNotice: '注意保存最新防失联域名'
  },
  {
    rank: 22,
    id: 'card-wangjikuaiche',
    name: '网际快车',
    badge: '第二十二名 · 游戏与按量',
    type: '游戏专线 + 不限时按量包',
    logo: 'assets/logos/wangjikuaiche.jpg',
    url: 'https://johhhu.xn--66tw07h.com',
    discountPrice: '14.00',
    originalPrice: '20',
    code: 'express88',
    speed: '约 435 Mbps',
    unlock: '基础平台 + 游戏节点',
    unlockStatus: 'status-partial',
    advantage: '不限时按量包',
    reason: '特色提供不限时按量计费与游戏专属节点，适合低频使用或作为长效备用线路。',
    advantages: ['包含不限时流量计费套餐', '游戏加速与回国家宽节点', '适合备用与低频轻量用户'],
    tags: ['按量计费', '游戏节点'],
    hasDiscount: false,
    rankTag: '游戏与按量',
    budgetFeatures: [
      '提供游戏节点与不限时按量流量包',
      '晚高峰参考约 435 Mbps',
      '适合低频轻量用户与第二长效备用'
    ],
    compareAdv: '不限时流量与游戏节点',
    compareSuitable: '低频按量使用、游戏备用',
    compareNotice: '按量包需注意单次扣费率'
  },
  {
    rank: 23,
    id: 'card-flybit',
    name: 'Flybit',
    badge: '第二十三名 · 极速秒开',
    type: '高性价比 IEPL 专线',
    logo: 'assets/logos/flybit.jpg',
    url: 'https://www.fastfastfast.buzz/#/register?code=tuAiVVbP',
    discountPrice: '14.00',
    originalPrice: '20',
    code: 'flybit88',
    speed: '约 455 Mbps',
    unlock: '4K秒开 / 全平台解锁',
    unlockStatus: 'status-yes',
    advantage: '极致性价比',
    reason: '性价比非常突出，全 IEPL 专线保障 4K 视频秒开，且不限制在线设备数。',
    advantages: ['折后月费门槛较低', 'IEPL 专线带来极速响应', '不限在线设备数量'],
    tags: ['极速秒开', '高性价比'],
    hasDiscount: false,
    rankTag: '极速秒开',
    budgetFeatures: [
      'IEPL 专线响应迅速，性价比出色',
      '晚高峰参考约 455 Mbps',
      '不限制在线设备数'
    ],
    compareAdv: 'IEPL 秒开与极低单价',
    compareSuitable: '追求极致性价比与速度',
    compareNotice: '核实当前常用落地稳定性'
  },
  {
    rank: 24,
    id: 'card-xingdaomeng',
    name: '星岛梦',
    badge: '第二十四名 · 低延迟高可靠',
    type: '全 IEPL 专线 · Trojan/Vless',
    logo: 'assets/logos/xingdaomeng.jpg',
    url: 'https://rweqr.xdmttt4.click/#/?code=lSVhHFnY',
    discountPrice: '17.50',
    originalPrice: '25',
    code: 'xdm888',
    speed: '约 460 Mbps',
    unlock: '极速全解 / 低抖动',
    unlockStatus: 'status-yes',
    advantage: '跨境办公与低延',
    reason: '全 IEPL 专线配合最新 Trojan/Vless 协议，抗封锁强且延迟极低，贴合高要求办公与视频需求。',
    advantages: ['全 IEPL 专线与新协议支持', '极低抖动，适合跨境办公', '不限制多设备并发使用'],
    tags: ['低延迟', '办公优选'],
    hasDiscount: false,
    rankTag: '低延迟高可靠',
    budgetFeatures: [
      '全 IEPL 专线，Trojan/Vless 协议',
      '晚高峰参考约 460 Mbps',
      '极低抖动与丢包，非常适合视频会议'
    ],
    compareAdv: '全 IEPL 与新协议抗封锁',
    compareSuitable: '跨境商务办公、视频会议',
    compareNotice: '检查本地网络节点路由'
  }
];

// Helper functions for rendering HTML blocks

function renderJumpOptions() {
  return airports.map(a => `<option value="${a.id}">${a.rank}. ${a.name} (TOP ${a.rank} · ${a.rankTag})</option>`).join('\n              ');
}

function renderPills() {
  return airports.map(a => {
    const cls = a.rank <= 3 ? 'nav-pill pill-top3' : (a.rank <= 6 ? 'nav-pill' : 'nav-pill pill-highlight');
    return `<a href="#${a.id}" class="${cls}"><span class="pill-num">${a.rank}</span>${a.name}</a>`;
  }).join('\n          ');
}

function renderStandaloneHeroCard(a) {
  return `<div class="standalone-hero-card" id="${a.id}">
        <div class="hero-card-banner">
          <span class="hero-badge">👑 2026年度编辑首推 · 综合第一旗舰</span>
          <span class="hero-tag">IEPL双入口冗余专线 · 4K/办公极速推荐</span>
        </div>
        <div class="hero-card-content">
          <div class="hero-card-left">
            <div class="provider-brand">
              <img class="hero-provider-logo" src="${a.logo}" alt="${a.name} Logo">
              <div>
                <h3 class="hero-provider-name">${a.name}</h3>
                <p class="hero-provider-type">${a.type} · 全平台流畅解锁</p>
              </div>
            </div>
            <div class="hero-reason-text">
              <strong>编辑首推理由：</strong>${a.reason}
            </div>
            <ul class="hero-adv-list">
              <li><i data-lucide="shield-check"></i> <strong>双入口冗余</strong>：广深/沪日双入口自动选路，线路在线率更高</li>
              <li><i data-lucide="zap"></i> <strong>极速 4K / 办公</strong>：晚高峰实测 ${a.speed}，高清视频首开秒加载</li>
              <li><i data-lucide="sparkles"></i> <strong>全平台解锁</strong>：稳定解锁 Netflix、ChatGPT、Disney+ 等海外服务</li>
            </ul>
          </div>
          <div class="hero-card-right">
            <div class="hero-price-box">
              <span class="price-label">限定 7 折优惠价</span>
              <div class="hero-price-display">
                <strong class="price-val">¥${a.discountPrice}</strong> <small>/ 月</small>
                <span class="orig-price">原价 ¥${a.originalPrice}.00</span>
              </div>
            </div>
            <div class="hero-coupon-box">
              <span class="coupon-label">专属优惠码（一键复制）：</span>
              <button type="button" class="copy-btn copy-badge hero-copy-badge" data-code="${a.code}" title="点击一键复制优惠码">
                <strong class="code-val">${a.code}</strong> <span class="copy-icon-tag"><i data-lucide="copy"></i> 复制</span>
              </button>
            </div>
            <a class="button button-primary hero-action-btn" href="${a.url}" target="_blank" rel="sponsored noopener noreferrer">
              <i data-lucide="external-link"></i> 访问${a.name}官网
            </a>
          </div>
        </div>
      </div>`;
}

function renderSingleRecommendCard(a) {
  const featuredCls = a.featured ? ' featured' : '';
  const btnCls = a.featured ? 'button button-primary' : 'button button-outline';
  const priceLabel = a.hasDiscount ? '7 折后月费' : '月付原价';
  const priceDisplay = a.hasDiscount 
    ? `<strong class="price-val">¥${a.discountPrice}</strong> <small>/ 月</small>`
    : `<strong class="price-val">¥${a.originalPrice}.00</strong> <small>/ 月</small>`;
  
  return `<article class="recommend-card${featuredCls}" id="${a.id}">
        <div class="card-badge">${a.badge}</div>
        <div class="card-header"><img class="provider-logo" src="${a.logo}" alt="${a.name} Logo"><div><h3>${a.name}</h3><p class="subtitle">${a.type}</p></div></div>
        <div class="card-metrics">
          <div class="metric-item metric-price"><span class="metric-label">${priceLabel}</span><div class="metric-price-value">${priceDisplay}</div></div>
          <div class="metric-item metric-speed"><span class="metric-label">晚高峰参考速度</span><strong class="speed-val">${a.speed}</strong></div>
          <div class="metric-item"><span class="metric-label">专属优惠码</span><button type="button" class="copy-btn copy-badge" data-code="${a.code}" title="点击一键复制优惠码"><strong class="code-val">${a.code}</strong> <span class="copy-icon-tag"><i data-lucide="copy"></i> 复制</span></button></div>
          <div class="metric-item"><span class="metric-label">核心优势</span><strong class="advantage-val">${a.advantage}</strong></div>
        </div>
        <div class="card-reason"><strong>推荐理由</strong><p>${a.reason}</p></div>
        <ul class="card-advantages">${a.advantages.map(adv => `<li>${adv}</li>`).join('')}</ul>
        <div class="card-footer">${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}<a class="${btnCls}" href="${a.url}" target="_blank" rel="sponsored noopener noreferrer">查看${a.name}套餐</a></div>
      </article>`;
}

function renderRecommendCards() {
  const standaloneHero = renderStandaloneHeroCard(airports[0]);
  const otherCards = airports.slice(1).map(a => renderSingleRecommendCard(a)).join('\n\n        ');

  return `${standaloneHero}

      <div class="section-subheading">
        <h3>优质机场列表（第 2 - 24 名）</h3>
        <p>按综合性能与性价比依次排列，提供丰富对比选择</p>
      </div>

      <div class="recommend-grid">
        ${otherCards}
      </div>`;
}

function renderBudgetCards() {
  return airports.map(a => {
    const featuredCls = a.rank === 1 ? ' featured-budget' : '';
    const ribbonText = a.rank === 1 ? '性价比第 1 名' : `TOP ${a.rank} · ${a.rankTag}`;
    const ribbonEl = a.rank === 1 ? `<div class="budget-ribbon">${ribbonText}</div>` : `<div class="budget-rank">${ribbonText}</div>`;
    const priceDisplay = a.hasDiscount ? `¥${a.discountPrice} <small>/ 月</small>` : `¥${a.originalPrice} <small>/ 月</small>`;
    const specDisplay = a.hasDiscount 
      ? `<s>原价 ¥${a.originalPrice}</s> · 优惠码 <button type="button" class="copy-btn copy-badge" data-code="${a.code}" title="点击一键复制优惠码"><strong class="code-val">${a.code}</strong> <span class="copy-icon-tag"><i data-lucide="copy"></i> 复制</span></button> · 7 折`
      : `月付标准原价套餐 · 优惠码 <button type="button" class="copy-btn copy-badge" data-code="${a.code}" title="点击一键复制优惠码"><strong class="code-val">${a.code}</strong> <span class="copy-icon-tag"><i data-lucide="copy"></i> 复制</span></button>`;
    const btnCls = a.rank === 1 ? 'button button-primary' : 'button button-outline';
    const btnText = a.hasDiscount ? '查看 7 折套餐' : '查看套餐';

    const bFeatures = a.budgetFeatures || [
      `${a.type}`,
      `晚高峰参考${a.speed}`,
      `${a.advantage}`
    ];

    return `<div class="budget-card${featuredCls}">
          ${ribbonEl}<span class="price-tag">${priceDisplay}</span><div class="budget-provider"><img src="${a.logo}" alt="${a.name} Logo"><h3>${a.name}</h3></div><p class="budget-spec">${specDisplay}</p>
          <ul class="budget-features"><li><i data-lucide="zap"></i> ${bFeatures[0]}</li><li><i data-lucide="gauge"></i> ${bFeatures[1]}</li><li><i data-lucide="briefcase"></i> ${bFeatures[2]}</li></ul>
          <a class="${btnCls}" href="${a.url}" target="_blank" rel="sponsored noopener noreferrer">${btnText}</a>
        </div>`;
  }).join('\n        ');
}

function renderCompareRows() {
  return airports.map(a => {
    const firstTag = a.rank === 1 ? ' <span class="tag tag-best">首选</span>' : '';
    const btnCls = a.rank === 1 ? 'button button-primary' : 'button button-outline';

    return `<tr><td><strong>${a.rank}</strong></td><td><div class="table-provider"><img src="${a.logo}" alt="${a.name} Logo"><div><a href="${a.url}" target="_blank" rel="sponsored noopener noreferrer"><strong>${a.name}</strong></a>${firstTag}</div></div></td><td>${a.type}</td><td><span class="speed-high">${a.speed}</span></td><td><span class="${a.unlockStatus}">${a.unlock}</span></td><td>¥${a.originalPrice} / 月</td><td><strong>${a.code}</strong></td><td><strong class="speed-high">¥${a.discountPrice} / 月</strong></td><td><span class="risk-low">优秀</span></td><td>${a.advantage}</td><td><a class="${btnCls}" href="${a.url}" target="_blank" rel="sponsored noopener noreferrer">访问官网</a></td></tr>`;
  }).join('\n            ');
}

function renderCompactCompareRows() {
  return airports.map(a => {
    const orig = parseFloat(a.originalPrice);
    const disc = parseFloat(a.discountPrice);
    const saved = (orig - disc).toFixed(2);
    const spdNum = parseInt(a.speed.replace(/[^0-9]/g, ''));
    const costPer100M = ((disc / spdNum) * 100).toFixed(2);
    const cAdv = a.compareAdv || a.type;
    const cSuitable = a.compareSuitable || a.advantage;
    const cNotice = a.compareNotice || '注意观察晚高峰稳定情况与规则';

    return `<tr><td><div class="table-provider small"><img src="${a.logo}" alt="${a.name} Logo"><strong>${a.name}</strong></div></td><td>约 ¥${saved}</td><td>约 ¥${costPer100M}</td><td>${cAdv}</td><td>${cSuitable}</td><td>${cNotice}</td></tr>`;
  }).join('\n              ');
}

// 1. Update sections/recommend.html
const recommendPath = path.join(root, 'sections', 'recommend.html');
let recommendContent = fs.readFileSync(recommendPath, 'utf8');

recommendContent = recommendContent.replace(
  /<select id="airport-jump-select">[\s\S]*?<\/select>/,
  `<select id="airport-jump-select">
              <option value="">点击快速跳转至对应机场...</option>
              ${renderJumpOptions()}
            </select>`
);

recommendContent = recommendContent.replace(
  /<div class="quick-nav-pills">[\s\S]*?<\/div>/,
  `<div class="quick-nav-pills">
          ${renderPills()}
        </div>`
);

recommendContent = recommendContent.replace(
  /<div class="recommend-grid">[\s\S]*?<\/section>/,
  `${renderRecommendCards()}
    </section>`
);

fs.writeFileSync(recommendPath, recommendContent, 'utf8');
console.log('Updated sections/recommend.html');

// 2. Update sections/budget.html
const budgetPath = path.join(root, 'sections', 'budget.html');
let budgetContent = fs.readFileSync(budgetPath, 'utf8');

budgetContent = budgetContent.replace(
  /<div class="budget-grid">[\s\S]*?<\/div>\s*<\/section>/,
  `<div class="budget-grid">
        ${renderBudgetCards()}
      </div>

      <div class="budget-guide">`
);

// In case regex failed because budget-guide follows budget-grid, let's do precise replace
if (!budgetContent.includes(airports[6].name)) {
  budgetContent = budgetContent.replace(
    /<div class="budget-grid">[\s\S]*?<\/div>\s*<div class="budget-guide">/,
    `<div class="budget-grid">
        ${renderBudgetCards()}
      </div>

      <div class="budget-guide">`
  );
}

fs.writeFileSync(budgetPath, budgetContent, 'utf8');
console.log('Updated sections/budget.html');

// 3. Update sections/compare.html
const comparePath = path.join(root, 'sections', 'compare.html');
let compareContent = fs.readFileSync(comparePath, 'utf8');

compareContent = compareContent.replace(
  /<tbody>[\s\S]*?<\/tbody>/,
  `<tbody>
            ${renderCompareRows()}
          </tbody>`
);

// Replace second tbody for compact table
const firstTbodyIndex = compareContent.indexOf('</tbody>');
if (firstTbodyIndex !== -1) {
  const secondTbodyStart = compareContent.indexOf('<tbody>', firstTbodyIndex);
  if (secondTbodyStart !== -1) {
    const secondTbodyEnd = compareContent.indexOf('</tbody>', secondTbodyStart);
    if (secondTbodyEnd !== -1) {
      compareContent = compareContent.substring(0, secondTbodyStart) +
        `<tbody>
              ${renderCompactCompareRows()}
            </tbody>` +
        compareContent.substring(secondTbodyEnd + 8);
    }
  }
}

fs.writeFileSync(comparePath, compareContent, 'utf8');
console.log('Updated sections/compare.html');

console.log('All navigation section files successfully updated to ranking 1-24!');
