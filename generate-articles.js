const fs = require('fs');
const path = require('path');

const articles = [
  {slug:'airport-guide-2026',category:'选购指南',title:'2026 机场推荐怎么选：从专线、晚高峰到售后的一套完整判断方法',description:'2026 年度网络选型避坑与稳定专线节点挑选全景决策指南。深度剖析普通公网中转与 IPLC、IEPL 物理专线的核心架构与晚高峰性能差异，彻底揭秘超低价年付套路背后的资金链断裂与失联风险。建立严谨的小额月付试水机制与双订阅备用容灾方案，为跨国远程协同、外贸电商与学术检索提供可靠参考保障。',keyword:'2026机场推荐',audience:'第一次购买机场、准备更换服务或不想再被宣传参数误导的用户',focus:'选择机场不能只看节点数量和峰值测速，而要把线路结构、晚高峰表现、流量规则、客户端兼容与售后机制放在同一张表里比较',signals:['是否明确标注 IEPL、IPLC 或 BGP 中转结构','晚高峰是否仍能保持稳定延迟与可用速度','套餐倍率、重置周期和设备限制是否透明','故障公告、工单与退款规则是否容易找到'],steps:['先确定预算、设备数量和主要用途','优先月付测试，不直接购买多年套餐','在 20:00—23:00 测试常用地区节点','验证流媒体、AI 工具和办公网站是否可用'],mistakes:['只相信首页峰值速度','只比较月费而忽略倍率','为了折扣直接年付','把节点多等同于线路好']},
  {slug:'iplc-iepl-explained',category:'线路科普',title:'IPLC、IEPL 与普通中转有什么区别？机场专线选择指南',keyword:'IPLC IEPL 区别',audience:'想弄清专线价值、晚高峰稳定性与价格差异的用户',focus:'IPLC、IEPL、BGP 中转和公网直连代表不同的传输组织方式，真正重要的是入口质量、跨境段拥塞控制与出口资源是否匹配',signals:['入口是否覆盖自己的运营商与所在地区','跨境段是否为稳定专线或高质量中转','出口是否有足够带宽和地区冗余','故障时是否能快速切换备用线路'],steps:['先用月付套餐验证线路','分别测试电信、联通或移动入口','记录工作日与周末晚高峰差异','结合延迟、抖动、丢包和速度综合判断'],mistakes:['把所有 IEPL 都理解成同一品质','忽略本地到入口机房的质量','只测一次就下结论','认为专线一定能解决所有应用问题']},
  {slug:'peak-hour-speed-test',category:'测速方法',title:'机场晚高峰怎么测速才准确？速度、延迟、抖动与丢包实测教程',keyword:'机场晚高峰测速',audience:'遇到晚上变慢、视频缓冲或远程办公卡顿的用户',focus:'有效测速必须固定设备、网络、节点与时间窗口，同时记录下载速度、延迟、抖动和丢包，单次测速截图不能代表长期体验',signals:['同一节点连续测试结果是否稳定','晚高峰与白天的速度差距是否过大','延迟抖动是否影响会议和游戏','丢包是否导致网页加载或视频缓冲'],steps:['关闭后台下载并使用有线或稳定 Wi-Fi','固定测速服务器和节点连续测试三次','在白天与 20:00—23:00 分别记录','结合实际视频、AI 与办公场景复测'],mistakes:['只看峰值下载速度','混用不同测速服务器','忽略本地 Wi-Fi 瓶颈','把单节点故障当成全站故障']},
  {slug:'coupon-guide',category:'优惠攻略',title:'机场优惠码怎么用？7 折券、月付价格与续费规则完整说明',keyword:'机场优惠码',audience:'希望降低月付成本、又担心优惠券不适用或续费涨价的用户',focus:'优惠码要核对适用套餐、使用次数、结算周期和续费价格，展示的折后价通常应由原价乘以折扣比例核算',signals:['优惠券是否适用于月付套餐','首购与续费是否同价','折扣是否限制指定套餐','结算页是否真实显示优惠金额'],steps:['复制优惠码后进入官方结算页','选择月付套餐并输入代码','确认应付金额再付款','保存订单与优惠规则截图'],mistakes:['未确认价格就付款','把七折误解为减七成以外的规则','在非官方页面输入账号信息','只因低价购买长期套餐']},
  {slug:'airport-risk-warning',category:'风险防范',title:'机场跑路前有哪些信号？域名、节点、客服与年付风险检查表',keyword:'机场跑路预警',audience:'准备续费、购买年付或发现服务异常的用户',focus:'跑路风险往往不是突然出现，而是域名、节点可用率、客服响应、促销力度和社群管理同时发生异常',signals:['突然推出极低折扣的多年套餐','节点长时间离线且没有公告','客服和工单持续无人回复','域名频繁更换或付款主体异常'],steps:['暂停续费并导出当前配置备份','保留订单、支付和沟通记录','准备一个按月付费的备用服务','关注官方公告而不是未经证实的传言'],mistakes:['故障当天就认定跑路','异常期间继续大额充值','把所有资产放在单一服务','从陌生渠道购买所谓内部套餐']},
  {slug:'clash-verge-rev-guide',category:'客户端教程',title:'Clash Verge Rev 新手教程：订阅导入、规则分流与常见故障',description:'Clash Verge Rev 现代化跨平台客户端深度使用与性能调优指南。全面涵盖 Windows 与 macOS 系统下的内核平滑切换、TUN 虚拟网卡模式全局接管、订阅规则自动更新及扩展脚本配置。深度排障系统代理端口冲突、DNS污染泄漏与局域网穿透异常，释放高性能分流代理潜力，保障远程协同与大流量传输稳定。',keyword:'Clash Verge Rev 教程',audience:'Windows、macOS 与 Linux 桌面用户',focus:'Clash Verge Rev 的核心是正确导入订阅、选择可用配置、启用系统代理，并通过规则模式让国内外流量走合适路径',signals:['订阅是否能正常更新','系统代理是否成功启用','规则模式是否命中预期策略组','DNS 与浏览器是否存在缓存冲突'],steps:['从可信来源安装客户端','导入订阅并更新配置','选择规则模式和合适节点','逐项排查系统代理、DNS 与防火墙'],mistakes:['同时开启多个代理客户端','长期不更新内核与规则','随意使用陌生订阅转换站','出现问题就反复重装']},
  {slug:'sing-box-guide',category:'客户端教程',title:'Sing-box 配置指南：订阅、路由、DNS 与多平台使用思路',description:'新一代通用网络核心 sing-box 客户端配置与规则分流实战手册。从零详解多协议入站出站配置、独立内核参数调优、TUN 虚拟网卡模式全局流量接管与 DNS 防污染防泄漏策略。提供多平台客户端导入转换技巧与循环解析排错方案，助你轻松掌握跨平台轻量高效工具的部署、性能调优与高级网络路由分流调度。',keyword:'Sing-box 配置',audience:'希望获得更灵活路由能力的桌面与移动端用户',focus:'Sing-box 配置的关键不是堆叠规则，而是让入站、出站、DNS 和路由逻辑保持一致，并减少重复或互相冲突的条件',signals:['配置文件版本与客户端是否匹配','DNS 查询是否按预期分流','默认出站与规则顺序是否清晰','日志中是否存在循环或解析错误'],steps:['先使用最小可用配置验证连接','再增加 DNS 和分流规则','按域名、IP 与应用逐步测试','每次修改后保留可回退版本'],mistakes:['一次加入大量规则','复制过时配置不检查版本','忽略日志中的第一条错误','把 DNS 问题误判为节点故障']},
  {slug:'shadowrocket-beginner',category:'客户端教程',title:'Shadowrocket 小火箭新手指南：订阅导入、分流与安全设置',description:'iOS 平台小火箭 Shadowrocket 从零起步保姆级新手上手配置教程。详尽演示正版客户端下载获取、节点订阅链接批量导入、多协议分流规则设置与晚高峰延迟测速方法。深入排查常见导入失败、连接断流、证书异常及局部网页打不开等高频故障，手把手助苹果手机与平板用户快速实现跨国网络的高效稳定访问。',keyword:'Shadowrocket 使用教程',audience:'iPhone 与 iPad 用户',focus:'Shadowrocket 的常用流程包括导入可信订阅、选择规则配置、按需开启连接，并检查 DNS、分流和按需连接是否符合使用场景',signals:['订阅来源是否可信','节点延迟是否只是测试值而非真实速度','规则文件是否持续维护','按需连接是否造成耗电或误代理'],steps:['导入订阅后先更新节点列表','选择规则模式而非全局模式','用常用网站验证分流','定期清理失效节点和旧配置'],mistakes:['从不明渠道安装或共享账号','把低延迟等同于高带宽','长期开启全局代理','忽略系统时间和证书问题']},
  {slug:'hysteria2-vless-reality',category:'协议科普',title:'Hysteria2、VLESS Reality 与 Trojan 怎么选？协议差异与适用场景',keyword:'Hysteria2 VLESS Reality',audience:'面对多个协议名称、不知道如何选择节点的用户',focus:'协议决定连接和传输方式，但最终体验仍由服务器带宽、线路质量、拥塞控制和客户端实现共同决定',signals:['所在网络对 UDP 的支持情况','客户端是否完整支持对应协议','移动网络切换时连接是否稳定','服务端是否有足够带宽与合理配置'],steps:['同一线路下对比不同协议','分别测试 Wi-Fi 与移动网络','记录连接成功率和实际应用体验','保留兼容性更好的备用协议'],mistakes:['把新协议自动等同于更快','忽略 UDP 受限环境','只看握手成功不看持续稳定性','使用来源不明的客户端核心']},
  {slug:'ai-unlock-guide',category:'AI 解锁',title:'ChatGPT、Claude 无法使用怎么办？机场 AI 解锁与 IP 质量排查',keyword:'机场 AI 解锁',audience:'需要稳定访问 AI 工具进行学习、开发与办公的用户',focus:'AI 服务可用性通常同时受到出口地区、IP 信誉、账号状态、DNS、浏览器缓存和支付地区影响，换节点并不一定能解决全部问题',signals:['同一节点是否能稳定登录而非偶尔打开','IP 地区与账号地区是否明显冲突','浏览器是否残留旧地区缓存','出口 IP 是否被多人高频滥用'],steps:['先确认官方服务状态和账号状态','清理站点缓存并重新登录','选择稳定且地区一致的节点','必要时更换干净出口而非频繁切换'],mistakes:['一分钟内频繁切换多个国家','共享敏感账号和验证码','把账号风控完全归因于节点','使用来历不明的浏览器扩展']},
  {slug:'streaming-unlock',category:'流媒体',title:'Netflix、Disney+、YouTube 机场解锁怎么看？地区、画质与稳定性指南',keyword:'机场流媒体解锁',audience:'追剧、观看 4K 视频和使用海外流媒体平台的用户',focus:'流媒体解锁不仅是能打开首页，还要验证片库地区、播放画质、持续带宽、DNS 一致性和高峰期稳定性',signals:['能否显示目标地区独占内容','播放十分钟后是否降画质','电视端与手机端是否表现一致','晚高峰是否频繁缓冲或报代理错误'],steps:['选择目标地区原生或稳定出口','清理应用缓存后重新登录','分别测试首页、搜索和实际播放','在常用设备上进行晚高峰复测'],mistakes:['只看解锁检测网页','忽略账号订阅地区限制','把 4K 缓冲完全归因于机场','频繁跨区触发平台风控']},
  {slug:'ip-quality-guide',category:'IP 科普',title:'原生 IP、住宅 IP、机房 IP 与 IP 纯净度到底有什么区别？',keyword:'原生IP 住宅IP 纯净度',audience:'关注流媒体、AI 服务、支付网站和账号风控的用户',focus:'原生、住宅和机房描述的是不同维度，真正影响使用的是地区归属、网络类型、历史信誉、共享程度与目标平台策略',signals:['多个数据库显示的地区是否一致','ASN 与网络类型是否符合需求','同一出口是否被大量用户共享','是否频繁出现验证码或风控提示'],steps:['使用多个查询来源交叉验证','在目标平台进行实际登录测试','固定常用地区避免频繁跳转','发现异常时优先更换出口而非账号'],mistakes:['相信单一检测网站','认为住宅 IP 一定安全','购买所谓永久独享 IP','公开分享带有账号信息的检测截图']},
  {slug:'dns-webrtc-leak',category:'隐私安全',title:'DNS 与 WebRTC 泄漏怎么检查？机场用户隐私排查清单',keyword:'DNS泄漏 WebRTC泄漏',audience:'关心真实 IP、DNS 请求和浏览器隐私的用户',focus:'代理连接成功并不代表所有流量都经过预期路径，DNS、WebRTC、IPv6 与应用直连都可能暴露本地网络信息',signals:['DNS 服务器是否来自本地运营商','浏览器是否显示本地公网 IP','IPv6 是否绕过代理','特定应用是否忽略系统代理设置'],steps:['连接节点后分别检查 IP 与 DNS','检查浏览器 WebRTC 暴露情况','确认客户端的 IPv6 与 DNS 策略','修改后重启浏览器并再次验证'],mistakes:['只看网页显示的出口 IP','安装不可信的隐私检测扩展','忽略应用自己的代理设置','把局域网地址误认为公网泄漏']},
  {slug:'isp-route-guide',category:'线路选择',title:'电信、联通、移动怎么选机场线路？三大运营商入口选择思路',keyword:'电信联通移动机场线路',audience:'不同运营商下速度差异明显、准备选择入口线路的用户',focus:'同一家机场在不同运营商、城市和接入方式下可能表现不同，入口机房距离、互联质量与晚高峰拥塞都会影响体验',signals:['是否提供对应运营商优化入口','本地到入口的延迟是否稳定','跨网连接是否容易出现抖动','移动网络与家庭宽带表现是否一致'],steps:['先确认自己的主用运营商','选择标注相应优化的入口','在常用城市和时间段实测','同时准备一个不同入口作为备用'],mistakes:['照搬他人的测速结论','忽略城市和宽带套餐差异','只选择延迟最低的节点','使用 Wi-Fi 问题判断运营商线路']},
  {slug:'traffic-multiplier',category:'套餐知识',title:'机场流量倍率怎么算？0.5 倍、1 倍、2 倍节点扣费示例',keyword:'机场流量倍率',audience:'担心流量消耗过快、看不懂套餐倍率的用户',focus:'倍率决定实际扣除流量，使用量乘以倍率才是套餐消耗；低倍率不必然更慢，高倍率也不必然代表更高品质',signals:['节点名称是否清楚标注倍率','上传流量是否计入总量','流量在何时重置','不同套餐是否使用相同倍率规则'],steps:['记录使用前后的套餐余额','下载固定大小文件进行验证','为视频和下载优先选择合适倍率','设置客户端流量提醒'],mistakes:['把 0.5 倍理解为半速','忽略上传流量','误以为购买日期就是重置日','长期使用高倍率节点下载大文件']},
  {slug:'monthly-vs-yearly',category:'购买建议',title:'机场月付、季付还是年付？价格、跑路风险与续费策略',keyword:'机场月付年付选择',audience:'纠结套餐周期、希望省钱又控制风险的用户',focus:'长期套餐的折扣来自预付风险，服务历史越短、信息越不透明，越应该优先月付；稳定观察后再考虑季付或年付',signals:['运营时间与历史故障记录','是否有透明退款规则','长期套餐折扣是否异常夸张','月付价格是否仍在可接受范围'],steps:['先购买一个月验证核心需求','至少观察一个完整晚高峰周期','确认客服与故障响应后再延长','保留备用服务避免单点依赖'],mistakes:['第一次购买就三年付','把低价当成唯一标准','忽略套餐不可退款条款','因沉没成本继续追加充值']},
  {slug:'multi-device-guide',category:'使用场景',title:'多设备家庭怎么选机场？设备限制、路由器与同时在线说明',keyword:'多设备机场推荐',audience:'手机、电脑、平板、电视和家庭成员需要同时使用的用户',focus:'多设备场景应关注同时在线限制、订阅安全、路由器性能、流量总量和不同设备客户端兼容，而不是只看节点数',signals:['套餐允许的同时在线数量','是否支持常用客户端与路由器','家庭视频播放的流量需求','账号共享是否违反服务条款'],steps:['统计真实设备数和高峰同时在线数','为电视和电脑选择稳定节点','避免在公开设备保存订阅链接','定期检查异常登录与流量'],mistakes:['把订阅链接发到群聊','低性能路由器承担高带宽转发','忽略电视端 DNS 缓存','所有设备长期使用同一节点']},
  {slug:'gaming-latency-guide',category:'游戏加速',title:'机场能代替游戏加速器吗？延迟、抖动、丢包与线路选择',keyword:'机场游戏加速',audience:'希望改善海外游戏连接、下载和语音体验的玩家',focus:'机场与专用游戏加速器的优化目标不同，游戏更敏感于路由、抖动和丢包，而不是单纯下载速度',signals:['游戏服务器地区与节点是否一致','UDP 转发是否稳定','延迟是否持续而非偶尔很低','语音和匹配是否出现丢包'],steps:['选择靠近游戏服务器的专线节点','在训练场或非排位场景测试','同时记录平均延迟和抖动','必要时使用专用游戏加速器对比'],mistakes:['用下载测速判断游戏体验','跨越多个地区中转','在排位中频繁切换节点','忽略本地 Wi-Fi 干扰']},
  {slug:'remote-work-guide',category:'办公场景',title:'远程办公与跨境电商怎么选机场？稳定连接与账号安全指南',keyword:'远程办公机场',audience:'使用海外会议、邮箱、店铺后台、代码仓库和云服务的用户',focus:'办公场景最看重稳定、固定地区、低丢包和账号安全，频繁更换国家或多人共用出口可能增加登录验证与风控',signals:['常用办公地区是否有稳定出口','视频会议时延迟和抖动是否可控','出口 IP 是否频繁变化','服务是否提供及时故障公告'],steps:['为工作账号固定常用地区','准备备用节点和备用网络','重要操作启用双重验证','避免在公共设备保存订阅和密码'],mistakes:['工作中随意跨区切换','把订阅分享给不相关人员','只准备一个连接方案','在异常出口上进行支付操作']},
  {slug:'troubleshooting-guide',category:'故障排查',title:'机场突然连不上怎么办？从订阅、DNS、客户端到节点的排查顺序',keyword:'机场连不上怎么办',audience:'遇到订阅更新失败、节点超时、网页打不开或速度突然下降的用户',focus:'高效排障应从影响范围最小的环节开始：本地网络、系统时间、订阅、客户端、DNS、单节点、全站服务和账号状态',signals:['其他网站是否能正常直连','多个节点是否同时失败','订阅能否更新且未过期','更换设备后问题是否仍存在'],steps:['确认本地网络和系统时间正常','检查套餐流量、到期时间与订阅','重启客户端并切换一个节点','查看公告后再决定是否联系工单'],mistakes:['一出问题就删除全部配置','同时修改多个设置','使用陌生转换网站修复订阅','没有记录错误信息就提交工单']}
];

articles.push(...JSON.parse(fs.readFileSync(path.join(__dirname, 'new-articles.json'), 'utf8')));

const outDir = path.join(__dirname, 'articles');
const coverDir = path.join(__dirname, 'assets', 'covers');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(coverDir, { recursive: true });
for (const file of fs.readdirSync(outDir)) {
  if (file.endsWith('.html')) fs.rmSync(path.join(outDir, file));
}
for (const file of fs.readdirSync(coverDir)) {
  if (file.endsWith('.svg')) fs.rmSync(path.join(coverDir, file));
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function list(items) { return `<ul>${items.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ul>`; }

function dateFor(index) {
  const d = new Date(Date.UTC(2026, 8, 30));
  d.setUTCDate(d.getUTCDate() - index);
  return d.toISOString().slice(0, 10);
}

function makeCover(a, index) {
  const palettes = [['#111827','#ef5b2a','#f6efe4'],['#092635','#1b8a8f','#e9f3ef'],['#2b174d','#8b5cf6','#f4efff'],['#18240f','#73a942','#f1f5e9'],['#301313','#d95d39','#fff1e8']];
  const [dark, accent, pale] = palettes[index % palettes.length];
  const title = escapeHtml(a.title.length > 24 ? `${a.title.slice(0, 24)}…` : a.title);
  const category = escapeHtml(a.category);
  const keyword = escapeHtml(a.keyword);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${pale}"/><stop offset="1" stop-color="#fff"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="18" stdDeviation="20" flood-opacity=".14"/></filter></defs><rect width="1200" height="675" fill="url(#g)"/><circle cx="1040" cy="90" r="210" fill="${accent}" opacity=".14"/><circle cx="1100" cy="600" r="280" fill="${dark}" opacity=".08"/><g filter="url(#s)"><rect x="70" y="65" width="1060" height="545" rx="36" fill="#fff" opacity=".88"/></g><rect x="112" y="112" width="10" height="72" rx="5" fill="${accent}"/><text x="148" y="145" font-family="Microsoft YaHei,Arial,sans-serif" font-size="28" font-weight="700" fill="${accent}">${category}</text><text x="112" y="270" font-family="Microsoft YaHei,Arial,sans-serif" font-size="54" font-weight="800" fill="${dark}">${title}</text><text x="112" y="352" font-family="Microsoft YaHei,Arial,sans-serif" font-size="30" fill="#4b5563">${keyword} · 实用指南</text><path d="M112 430H720" stroke="${accent}" stroke-width="5" stroke-linecap="round"/><g transform="translate(800 382)"><circle cx="120" cy="80" r="105" fill="${accent}" opacity=".16"/><path d="M55 96c52-92 114-92 168 0M72 126h132M120 18v198" fill="none" stroke="${accent}" stroke-width="16" stroke-linecap="round"/></g><text x="112" y="545" font-family="Microsoft YaHei,Arial,sans-serif" font-size="24" fill="#6b7280">机场眼 · 深度测试与选购指南</text></svg>`;
  fs.writeFileSync(path.join(coverDir, `${a.slug}.svg`), svg, 'utf8');
}

function buildBody(a) {
  const unique = a.insight ? `
    <h2>为什么这个话题现在值得关注</h2>
    <p>${escapeHtml(a.insight)}</p>
    <aside class="answer-box"><strong>快速答案：</strong>${escapeHtml(a.focus)}。</aside>
    <h2>一个典型使用场景</h2>
    <p>${escapeHtml(a.scenario)}</p>
    <p><strong>关键实体：</strong>${a.entities.map(escapeHtml).join('、')}。理解这些名词的关系，比单独记住某个产品或协议名称更有用。</p>` : '';
  const riskDetail = a.slug === 'airport-risk-warning' ? `
    <h2>机场为什么会跑路或突然停止运营</h2>
    <p>第一类原因是现金流失衡。低价年付和“终身套餐”会提前透支未来收入，但服务器、专线、流量和售后成本需要持续支付；当新增用户放缓或上游涨价，资金链就可能断裂。第二类原因是上游机房清退、入口线路中断、域名或支付渠道失效，经营者没有备用资源时可能直接停摆。第三类原因是安全事件、攻击、核心成员退出或内部纠纷。还有少数经营者会在大额促销后主动失联，因此促销力度必须和运营历史一起看。</p>
    <p>“服务停止”不一定等于主观卷款。被动关停、宣布终止业务并安排退款，与清空社群、关闭节点且拒绝回应有本质区别。预警页面应记录可观察事实，不猜测经营者动机；只有官网、节点、订阅、客服等多个信号长期同时异常，才适合提高风险等级。</p>
    <h2>从哪些信号能看出机场风险正在升高</h2>
    <p>最值得警惕的是多项异常同时出现：运营时间较短却突然主推三年、五年或终身套餐；全部节点与订阅持续失效；官网停止解析；工单、邮件和社群一起失联；收款主体、域名或上游线路频繁变化；原有套餐在没有公告的情况下被缩短、提倍率或取消退款。单一信号只能提示观察，多个高风险信号连续存在才需要立即止损。</p>
    <h3>一个可重复使用的风险评分</h3>
    <ul><li>官网连续多日无法解析：加 3 分。</li><li>全部节点和订阅同时失效：加 3 分。</li><li>客服、工单和社群均无人回应：加 2 分。</li><li>突然推广异常低价的长期套餐：加 2 分。</li><li>频繁更换域名、入口或收款主体：加 1 分。</li><li>持续发布公告且节点逐步恢复：减 2 分。</li></ul>
    <p>0—2 分更像普通故障；3—5 分适合暂停长期续费并观察；6 分以上应准备备用线路、保存订单和支付证据。评分用于风险管理，不等于对经营方作出法律定性。</p>
    <h2>十个公开案例如何分级</h2>
    <ul><li><strong>快帆云、FCCloud、spcloud：</strong>第三方历史数据库记录为官网、节点、订阅或售后同时失联。</li><li><strong>ACA、渡口：</strong>公开社区历史名单或 Issue 标注为跑路、停止运营或基本确认失联。</li><li><strong>龙猫云机场、万达云、赔钱机场：</strong>仅有服务异常或用户反馈，维持观察，不能写成确认跑路。</li><li><strong>efcloud：</strong>社区记录为经营权及套餐变更，应重新评估续费，但不能直接等同跑路。</li><li><strong>白月光机场：</strong>曾因节点不可用被预警，后续恢复，是避免误判短期故障的反例。</li></ul>
    <p>以上状态核验于 2026-09-30，资料来自公开社区聚合与风险数据库，不代表本站掌握运营主体内部情况。若后续恢复，应及时更正并保留历史时间线。</p>
    <h2>发现异常后的止损顺序</h2>
    <ol><li>暂停续费和大额充值，截图保存套餐余额、订单、付款记录与公告。</li><li>切换不同网络和设备排除本地故障，同时检查官网 DNS、订阅拉取和多个地区节点。</li><li>重置在该站复用过的密码；订阅链接疑似泄露时立即更换 Token。</li><li>按照支付渠道规则咨询退款或争议处理，不向陌生“维权群”再次付款。</li><li>启用备用服务，重要工作不要依赖单一机场或单一线路。</li></ol>` : '';
  return `
    <p class="article-lead">搜索“${a.keyword}”时，真正需要解决的不是找到一句绝对答案，而是建立一套可以重复验证的判断方法。本文面向${a.audience}，用尽量清楚的方式拆解关键概念、选择步骤、常见误区和实际检查清单。</p>
    <h2>先给结论：判断重点是什么</h2>
    <p>${a.focus}。任何服务的表现都会受到所在城市、运营商、本地网络、设备、客户端版本和测试时段影响，因此页面参数适合用来初筛，最终决定应建立在自己的实际测试上。</p>
    <p>对普通用户来说，最有效的思路是“先排除明显风险，再验证核心需求”。不要同时追求最低价格、最高速度、无限设备、永久稳定和全部平台解锁。把最重要的两到三个需求排在前面，反而更容易选到适合自己的方案。</p>
    ${unique}
    <h2>${a.keyword}需要关注的四个信号</h2>
    ${list(a.signals)}
    <p>这四项应组合判断。如果某一项非常突出，其他项目却含糊不清，就需要进一步核对。例如速度很高但没有说明测试时间，或者折扣很低却只支持多年预付，都不适合直接作为购买依据。</p>
    <h2>推荐的实际操作步骤</h2>
    <ol>${a.steps.map(x => `<li>${escapeHtml(x)}</li>`).join('')}</ol>
    <p>执行时建议保留简单记录，包括日期、节点地区、使用网络、延迟、速度和实际应用表现。连续几天的数据比一次截图更可靠，也便于在出现故障时判断问题来自本地、客户端、线路还是服务端。</p>
    <h2>如何看待速度、延迟与稳定性</h2>
    <p>速度决定大文件下载和高码率视频的上限；延迟影响网页响应、远程桌面和交互体验；抖动代表延迟是否稳定；丢包则会直接造成卡顿、重传和连接中断。四项指标不能互相替代。一个峰值很高但频繁丢包的节点，实际体验可能不如速度稍低但波动更小的节点。</p>
    <p>建议在自己最常使用的时间测试，尤其是工作日晚上。测试时固定节点、测速服务器和设备，连续运行多次，再用视频播放、网页访问、AI 对话或会议等真实场景复核。这样得到的结论更接近长期使用体验。</p>
    <h2>价格与优惠应该怎么比较</h2>
    <p>月费只是成本的一部分，还要核对流量、倍率、设备数、重置日期、退款条件与优惠后的续费价格。七折价格可以用原价乘以 0.7 计算，但最终应以结算页为准。第一次购买优先选择月付，确认稳定后再考虑更长周期。</p>
    <p>如果一个套餐比同类产品便宜很多，应进一步查看是否限制高速节点、流媒体地区、同时在线设备或售后范围。合理的优惠能降低试用成本，但不应该成为忽略风险和服务质量的理由。</p>
    <h2>最常见的四个误区</h2>
    ${list(a.mistakes)}
    <p>这些误区的共同点，是用单一指标替代完整判断。解决办法并不复杂：减少预付周期、保留测试记录、保护订阅信息，并准备一个不同线路的备用方案。</p>
    ${riskDetail}
    <h2>适合新手的检查清单</h2>
    <ul><li>确认官网、套餐和付款页面属于同一服务主体。</li><li>先买月付或小流量套餐，不因折扣直接长期预付。</li><li>在自己的运营商和常用设备上测试。</li><li>核对订阅、倍率、流量重置和设备限制。</li><li>验证最常用的两个实际场景，而不只是测速。</li><li>保存订单记录，并了解工单与退款入口。</li></ul>
    <h2>常见问题</h2>
    <h3>一次测速能代表长期表现吗？</h3><p>不能。一次测速只反映当时的节点、网络和服务器状态。至少应覆盖白天与晚高峰，并连续观察数天。</p>
    <h3>排名越高就一定越适合我吗？</h3><p>不一定。排名用于缩小范围，最终仍要看你的运营商、地区、设备、预算和主要用途。</p>
    <h3>出现问题时应该先换服务吗？</h3><p>建议先检查本地网络、客户端、订阅状态和单个节点，再查看官方公告。确认是持续性服务问题后，再考虑切换。</p>
    <h2>总结</h2>
    <p>${a.keyword}的核心不是追逐宣传中的最大数字，而是用一致的方法验证长期体验。先明确需求，选择短周期套餐，记录晚高峰表现，核对价格与规则，并保护账号和订阅信息。做到这些，即使市场上的产品和协议持续变化，也能更稳妥地做出选择。</p>`;
}

function page(a, index) {
  const description = a.description || (a.insight ? `${a.title}。围绕${a.keyword}给出原理说明、风险边界、操作步骤、检查信号与常见误区。` : `${a.title}。从线路、速度、稳定性、价格、风险与实际测试步骤出发，提供可执行的机场选择与使用建议。`);
  const body = buildBody(a);
  const faq = [
    {q:'一次测速能代表长期表现吗？',a:'不能。应覆盖不同日期和晚高峰，并结合真实应用体验。'},
    {q:'排名越高就一定越适合我吗？',a:'不一定。排名用于初筛，最终需要结合运营商、设备、预算和用途。'},
    {q:'第一次购买应该选多长周期？',a:'建议优先月付或短周期，验证稳定性后再考虑长期套餐。'}
  ];
  const published = dateFor(index);
  const canonical = `https://jichangyan.com/articles/${a.slug}.html`;
  const image = `https://jichangyan.com/assets/covers/${a.slug}.svg`;
  const schema = { '@context':'https://schema.org','@type':'Article',headline:a.title,description,image:[image],datePublished:published,dateModified:'2026-09-30',author:{'@type':'Organization',name:'机场眼'},publisher:{'@type':'Organization',name:'机场眼'},inLanguage:'zh-CN',mainEntityOfPage:canonical,about:(a.entities||[a.keyword]).map(name=>({'@type':'Thing',name})) };
  const faqSchema = {'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(x=>({'@type':'Question',name:x.q,acceptedAnswer:{'@type':'Answer',text:x.a}}))};
  const pageTitle = a.title.length < 24 ? `${a.title}｜${a.category}选购与排障指南｜机场眼` : `${a.title}｜机场眼深度评测与选购指南`;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(pageTitle)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}"><meta name="twitter:card" content="summary_large_image"><title>${escapeHtml(pageTitle)}</title><link rel="stylesheet" href="../styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head><body class="article-page"><header class="article-header"><a class="brand" href="../index.html"><span class="brand-mark">机</span><span>机场眼</span></a><a class="button button-outline" href="../blog.html">返回文章列表</a></header><main class="article-shell"><article class="article-detail"><img class="article-cover" src="../assets/covers/${a.slug}.svg" alt="${escapeHtml(a.title)}封面" width="1200" height="675"><p class="eyebrow dark">${escapeHtml(a.category)} · ${published}</p><h1>${escapeHtml(a.title)}</h1><p class="article-summary">${escapeHtml(description)}</p>${body}<div class="article-cta"><h2>继续查看机场排名与优惠</h2><p>对比六家专线机场的线路、参考速度、月付价格和优惠信息。</p><a class="button button-primary" href="../compare.html">查看机场对比</a></div></article></main><footer class="article-footer">机场眼 · 独立评测 · 持续测速 · 无付费排名</footer></body></html>`;
}

articles.forEach((a, i) => { makeCover(a, i); fs.writeFileSync(path.join(outDir, `${a.slug}.html`), page(a, i), 'utf8'); });

const metadata = articles.map((a, i) => ({...a, date:dateFor(i),read:`${8 + (i%5)} 分钟阅读`,cover:`assets/covers/${a.slug}.svg`}));
fs.writeFileSync(path.join(__dirname, 'articles.js'), `window.ARTICLE_INDEX = ${JSON.stringify(metadata)};`, 'utf8');

const sitemapItems = [
  {loc:'https://jichangyan.com/', lastmod:'2026-11-01', priority:'1.0', changefreq:'daily'},
  {loc:'https://jichangyan.com/compare', lastmod:'2026-11-01', priority:'0.9', changefreq:'daily'},
  {loc:'https://jichangyan.com/warning', lastmod:'2026-11-01', priority:'0.9', changefreq:'daily'},
  ...['recommend','budget','compare','coupons','warning','blog','resources','faq','about'].map(slug => ({loc:`https://jichangyan.com/${slug}.html`, lastmod:'2026-11-01', priority:'0.9', changefreq:'weekly'})),
  ...articles.map((a, i) => ({loc:`https://jichangyan.com/articles/${a.slug}.html`, lastmod:dateFor(i), priority:i < 10 ? '0.9' : '0.8', changefreq:i < 10 ? 'weekly' : 'monthly'}))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\r\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\r\n${sitemapItems.map(x => `  <url>\r\n    <loc>${x.loc}</loc>\r\n    <lastmod>${x.lastmod}</lastmod>\r\n    <changefreq>${x.changefreq}</changefreq>\r\n    <priority>${x.priority}</priority>\r\n  </url>`).join('\r\n')}\r\n</urlset>\r\n`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');

const report = articles.map(a => {
  const text = buildBody(a).replace(/<[^>]+>/g, '').replace(/\s+/g, '');
  return `${a.slug}: ${text.length}`;
}).join('\n');
console.log(report);
