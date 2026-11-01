/**
 * IndexNow 自动批量推送脚本 - 机场眼 (jichangyan.com)
 *
 * 功能特性：
 * 1. 自动发现根目录下 IndexNow API Key 文件（支持 8-128 位 Hex/Alphanumeric，如 21d12b3e3100412c877871878d766846.txt）
 * 2. 自动从 CNAME 文件读取站点 Host 域名（默认 jichangyan.com）
 * 3. 强制优先保障核心 URL 队列（解决 Bing 站长平台报错: 未通过 IndexNow 提交的 /compare 与 /warning）
 * 4. 智能收集全站 URL：解析 sitemap.xml，并深度扫描根目录、articles/、reviews/ 等所有静态 HTML 文件兜底去重
 * 5. 支持命令行传参指定单个或多个特定 URL 增量推送（例如: node indexnow.js https://jichangyan.com/compare）
 * 6. 支持全网关轮换推送 (api.indexnow.org, www.bing.com, yandex.com, search.seznam.cz)
 * 7. 内置 HTTP CONNECT 代理隧道与自动直连降级支持
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const tls = require('tls');
const { URL } = require('url');

const rootDir = __dirname;

// 官方 IndexNow 网关列表（协议规定：向任一网关成功推送，所有成员搜索引擎均会自动同步）
const GATEWAYS = [
  { name: 'Microsoft Bing 专用网关', url: 'https://www.bing.com/indexnow' },
  { name: 'IndexNow 官方总网关', url: 'https://api.indexnow.org/indexnow' },
  { name: 'Yandex 专用网关', url: 'https://yandex.com/indexnow' },
  { name: 'Seznam 专用网关', url: 'https://search.seznam.cz/indexnow' }
];

// 核心 URL 队列（解决 Bing 站长平台关于重要页面缺失提交的报错）
const CORE_URLS = [
  'https://jichangyan.com/',
  'https://jichangyan.com/compare',
  'https://jichangyan.com/warning'
];

/**
 * 1. 获取站点主机名 (Host)
 */
function getHost() {
  const cnamePath = path.join(rootDir, 'CNAME');
  if (fs.existsSync(cnamePath)) {
    const cname = fs.readFileSync(cnamePath, 'utf8').trim();
    if (cname) return cname;
  }
  return 'jichangyan.com';
}

/**
 * 2. 自动检索或生成 IndexNow 密钥
 */
function getKeyInfo(host) {
  // 支持环境变量优先覆盖
  if (process.env.INDEXNOW_KEY) {
    const key = process.env.INDEXNOW_KEY.trim();
    const keyFile = `${key}.txt`;
    const keyPath = path.join(rootDir, keyFile);
    if (!fs.existsSync(keyPath)) {
      fs.writeFileSync(keyPath, key, 'utf8');
    }
    return {
      key,
      keyFile,
      keyLocation: `https://${host}/${keyFile}`
    };
  }

  // 扫描根目录下的密钥文件（8-128 位的数字、字母或连字符）
  const files = fs.readdirSync(rootDir);
  const keyFile = files.find(f => /^[0-9a-fA-F-]{8,128}\.txt$/i.test(f));

  if (keyFile) {
    const key = fs.readFileSync(path.join(rootDir, keyFile), 'utf8').trim();
    return {
      key,
      keyFile,
      keyLocation: `https://${host}/${keyFile}`
    };
  }

  // 若均未找到，创建默认的 32 位 Hex 密钥文件
  const defaultKey = '21d12b3e3100412c877871878d766846';
  const defaultKeyFile = `${defaultKey}.txt`;
  fs.writeFileSync(path.join(rootDir, defaultKeyFile), defaultKey, 'utf8');
  console.log(`[提示] 未找到现有密钥，已自动创建默认验证文件: ${defaultKeyFile}`);

  return {
    key: defaultKey,
    keyFile: defaultKeyFile,
    keyLocation: `https://${host}/${defaultKeyFile}`
  };
}

/**
 * 3. 收集待提交的所有 URL（融合核心 URL、sitemap.xml 与本地 HTML 静态扫描）
 */
function collectUrls(host) {
  const urlSet = new Set();
  const baseUrl = `https://${host}`;

  // 3.1 优先装载核心关键 URL 队列（针对性解决 Bing 报错缺少的 /compare 与 /warning）
  const coreUrls = [
    `${baseUrl}/`,
    `${baseUrl}/compare`,
    `${baseUrl}/warning`,
    `${baseUrl}/recommend`,
    `${baseUrl}/budget`,
    `${baseUrl}/coupons`,
    `${baseUrl}/faq`,
    `${baseUrl}/blog`,
    `${baseUrl}/resources`,
    `${baseUrl}/about`
  ];
  for (const u of coreUrls) {
    urlSet.add(u);
  }

  // 3.2 从 sitemap.xml 提取
  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
    for (const m of matches) {
      const u = m[1].trim();
      if (u) urlSet.add(u);
    }
  }

  // 3.3 深度扫描本地 HTML 文件兜底
  function scanDir(dir, prefix = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (['.git', 'node_modules', 'scratch', 'sections', 'assets', '.github', 'scripts'].includes(entry.name)) continue;
        scanDir(path.join(dir, entry.name), prefix ? `${prefix}/${entry.name}` : entry.name);
      } else if (entry.name.endsWith('.html')) {
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (rel === 'index.html') {
          urlSet.add(`${baseUrl}/`);
        } else {
          urlSet.add(`${baseUrl}/${rel.split('\\').join('/')}`);
          // 支持 clean URL（不带 .html 后缀）
          if (prefix === '' && entry.name !== 'article.html') {
            urlSet.add(`${baseUrl}/${entry.name.replace(/\.html$/, '')}`);
          }
        }
      }
    }
  }

  try {
    scanDir(rootDir);
  } catch (err) {
    console.warn(`[扫描警告] 遍历本地 HTML 文件失败: ${err.message}`);
  }

  // 保证至少有首页
  if (urlSet.size === 0) {
    urlSet.add(`${baseUrl}/`);
  }

  // 过滤出属于当前 host 的合法完整 URL
  const allValid = Array.from(urlSet).filter(u => {
    try {
      const parsed = new URL(u);
      return parsed.hostname === host || parsed.hostname.endsWith(`.${host}`);
    } catch {
      return false;
    }
  }).sort();

  // 保证核心页面按顺序排在队列最前部
  const priorityList = [
    `${baseUrl}/`,
    `${baseUrl}/compare`,
    `${baseUrl}/warning`
  ];

  const finalUrls = [];
  for (const u of priorityList) {
    if (allValid.includes(u)) {
      finalUrls.push(u);
    }
  }
  for (const u of allValid) {
    if (!finalUrls.includes(u)) {
      finalUrls.push(u);
    }
  }

  return finalUrls;
}

/**
 * 4. 发送 HTTP POST 请求到指定 IndexNow 网关（支持代理隧道与直连双模式）
 */
function postIndexNow(payload, endpoint) {
  return new Promise((resolve, reject) => {
    const targetUrl = new URL(endpoint);
    const postData = JSON.stringify(payload);

    const proxy = process.env.https_proxy || process.env.HTTPS_PROXY ||
                  process.env.http_proxy || process.env.HTTP_PROXY ||
                  process.env.all_proxy || process.env.ALL_PROXY;

    function sendDirect() {
      const options = {
        hostname: targetUrl.hostname,
        port: targetUrl.port || 443,
        path: targetUrl.pathname + targetUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'IndexNow-Pusher/1.0 (jichangyan.com)'
        },
        timeout: 15000
      };

      const req = https.request(options, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({
            endpoint,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            body: body.trim()
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('请求超时 (15s)'));
      });

      req.write(postData);
      req.end();
    }

    if (proxy && targetUrl.protocol === 'https:') {
      try {
        const proxyUrl = new URL(proxy);
        const connectReq = http.request({
          host: proxyUrl.hostname,
          port: proxyUrl.port,
          method: 'CONNECT',
          path: `${targetUrl.hostname}:443`,
          timeout: 10000
        });

        connectReq.on('connect', (res, socket) => {
          if (res.statusCode !== 200) {
            connectReq.destroy();
            return sendDirect();
          }

          const tlsSocket = tls.connect({
            host: targetUrl.hostname,
            socket: socket,
            servername: targetUrl.hostname,
            timeout: 10000
          }, () => {
            const req = https.request({
              hostname: targetUrl.hostname,
              path: targetUrl.pathname + targetUrl.search,
              method: 'POST',
              createConnection: () => tlsSocket,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData),
                'Host': targetUrl.hostname,
                'User-Agent': 'IndexNow-Pusher/1.0 (jichangyan.com)'
              },
              timeout: 15000
            }, res => {
              let body = '';
              res.on('data', chunk => body += chunk);
              res.on('end', () => {
                resolve({
                  endpoint,
                  statusCode: res.statusCode,
                  statusMessage: res.statusMessage,
                  body: body.trim()
                });
              });
            });

            req.on('error', () => sendDirect());
            req.on('timeout', () => {
              req.destroy();
              sendDirect();
            });

            req.write(postData);
            req.end();
          });

          tlsSocket.on('error', () => sendDirect());
        });

        connectReq.on('error', () => sendDirect());
        connectReq.on('timeout', () => {
          connectReq.destroy();
          sendDirect();
        });

        connectReq.end();
      } catch {
        sendDirect();
      }
    } else {
      sendDirect();
    }
  });
}

/**
 * 5. 主执行流程
 */
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║       🚀 机场眼 IndexNow 协议自动化批量推送工具          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  try {
    const host = getHost();
    const { key, keyFile, keyLocation } = getKeyInfo(host);

    console.log(`[配置] 站点域名 (Host): ${host}`);
    console.log(`[配置] 验证密钥 (Key):  ${key}`);
    console.log(`[配置] 密钥文件位置:    ${keyFile}`);
    console.log(`[配置] 公开访问地址:    ${keyLocation}\n`);

    // 检查命令行参数中是否传入了特定的 URL
    const cliUrls = process.argv.slice(2).filter(arg => /^https?:\/\//i.test(arg));
    let urlList;

    if (cliUrls.length > 0) {
      urlList = cliUrls;
      console.log(`[模式] 命令行指定单条/部分 URL 推送 (共 ${urlList.length} 条)`);
    } else {
      urlList = collectUrls(host);
      console.log(`[模式] 全站智能扫描汇总推送 (共合并解析出 ${urlList.length} 条有效 URL)`);
    }

    // 打印样本 URL
    console.log('[示例] 前 3 条待推送核心 URL:');
    urlList.slice(0, 3).forEach((u, i) => console.log(`   ${i + 1}. ${u}`));
    if (urlList.length > 3) console.log(`   ... 以及其他 ${urlList.length - 3} 条`);
    console.log('');

    // IndexNow 批量 Payload
    const payload = {
      host,
      key,
      keyLocation,
      urlList
    };

    let anySuccess = false;
    const results = [];

    // 依次尝试所有官方网关
    for (const gw of GATEWAYS) {
      process.stdout.write(`正在向 [${gw.name}] 发起推送... `);
      const start = Date.now();
      try {
        const res = await postIndexNow(payload, gw.url);
        const duration = ((Date.now() - start) / 1000).toFixed(2);

        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ 成功 (${res.statusCode} ${res.statusMessage}, 耗时 ${duration}s)`);
          anySuccess = true;
          results.push({ name: gw.name, success: true, code: res.statusCode });
          console.log(`   💡 已由 [${gw.name}] 成功收录，将自动广播分发至所有 IndexNow 成员引擎 (Bing, Yandex, Seznam, Naver)！`);
        } else {
          console.log(`⚠️ 响应 ${res.statusCode} (${res.statusMessage}, 耗时 ${duration}s)`);
          if (res.body) {
            console.log(`   详情: ${res.body}`);
          }
          results.push({ name: gw.name, success: false, code: res.statusCode, body: res.body });
        }
      } catch (err) {
        const duration = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`❌ 异常 (${err.message}, 耗时 ${duration}s)`);
        results.push({ name: gw.name, success: false, error: err.message });
      }
    }

    console.log('\n──────────────────────────────────────────────────────────');
    if (anySuccess) {
      console.log(`🎉 推送成功！本次共向搜索引擎提交了 ${urlList.length} 个最新页面 URL。`);
      console.log('   已成功将 https://jichangyan.com/compare 与 https://jichangyan.com/warning 核心页面推送到索引队列！');
      console.log('   搜索引擎机器人将在数分钟至数小时内更新索引缓存。');
    } else {
      console.warn('⚠️ 注意：所有网关均未返回 200/202 成功状态码。');
      console.warn('   排查建议：');
      console.warn('   1. 检查 Cloudflare WAF/Bot 防护：确保未拦截来自搜索引擎验证密钥的 GET 请求；');
      console.warn(`   2. 浏览器访问验证密钥：在无痕窗口打开 ${keyLocation} 确认能正常显示 32 位文本；`);
      console.warn('   3. 检查 Bing Webmaster 后台：核对配置的 IndexNow API Key 是否与本地一致。');
      process.exitCode = 1;
    }
    console.log('──────────────────────────────────────────────────────────\n');

  } catch (error) {
    console.error('\n❌ [IndexNow 执行异常]', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  CORE_URLS,
  getHost,
  getKeyInfo,
  collectUrls,
  postIndexNow,
  main
};
