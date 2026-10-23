/**
 * IndexNow 自动推送脚本 - 机场眼 (jichangyan.com)
 *
 * 功能说明：
 * 1. 自动检测根目录下 32 位 Hex 格式的验证密钥文件（如 21d12b3e3100412c877871878d766846.txt）
 * 2. 自动读取 CNAME 获取站点域名（默认 jichangyan.com）
 * 3. 自动解析 sitemap.xml 提取所有待索引的 URL（或支持命令行传参指定单条/多条 URL）
 * 4. 向 https://api.indexnow.org/indexnow 发送标准 POST 请求
 * 5. 校验返回状态码（200 / 202 均代表接收成功）
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const rootDir = __dirname;

// 1. 获取站点主机名 (Host)
function getHost() {
  const cnamePath = path.join(rootDir, 'CNAME');
  if (fs.existsSync(cnamePath)) {
    const cname = fs.readFileSync(cnamePath, 'utf8').trim();
    if (cname) return cname;
  }
  return 'jichangyan.com';
}

// 2. 获取 IndexNow 32位密钥及验证文件位置
function getKeyInfo() {
  const files = fs.readdirSync(rootDir);
  const keyFile = files.find(f => /^[0-9a-f]{32}\.txt$/i.test(f));
  if (!keyFile) {
    throw new Error('未在项目根目录找到 32 位十六进制的 IndexNow 密钥文件 (*.txt)');
  }
  const key = fs.readFileSync(path.join(rootDir, keyFile), 'utf8').trim();
  if (!/^[0-9a-f]{32}$/i.test(key)) {
    throw new Error(`密钥文件 ${keyFile} 中的内容不是合法的 32 位十六进制字符串: ${key}`);
  }
  return {
    key,
    keyFile,
    keyLocation: `https://${getHost()}/${keyFile}`
  };
}

// 3. 从 sitemap.xml 读取所有 URL 列表
function getUrlsFromSitemap(host) {
  const sitemapPath = path.join(rootDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.warn('[警告] 未找到 sitemap.xml，将仅提交站点首页');
    return [`https://${host}/`];
  }
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [];
  const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const rawUrl = match[1].trim();
    if (rawUrl) {
      urls.push(rawUrl);
    }
  }
  // 去重并过滤出本站域名相关的 URL
  const uniqueUrls = Array.from(new Set(urls)).filter(u => {
    try {
      const parsed = new URL(u);
      return parsed.hostname === host || parsed.hostname.endsWith('.' + host);
    } catch (e) {
      return false;
    }
  });

  return uniqueUrls.length > 0 ? uniqueUrls : [`https://${host}/`];
}

// 4. 发送 HTTP POST 请求到 IndexNow API（支持代理与直连）
function postIndexNow(payload, endpoint = 'https://api.indexnow.org/indexnow') {
  return new Promise((resolve, reject) => {
    const targetUrl = new URL(endpoint);
    const postData = JSON.stringify(payload, null, 2);

    const proxy = process.env.https_proxy || process.env.HTTPS_PROXY ||
                  process.env.http_proxy || process.env.HTTP_PROXY ||
                  process.env.all_proxy || process.env.ALL_PROXY;

    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'IndexNow-Pusher/1.0 (jichangyan.com)'
      },
      timeout: 15000
    };

    if (proxy) {
      try {
        const proxyUrl = new URL(proxy);
        options.hostname = proxyUrl.hostname;
        options.port = proxyUrl.port;
        options.path = targetUrl.href;
        options.headers.Host = targetUrl.hostname;

        const client = proxyUrl.protocol === 'https:' ? https : http;
        const req = client.request(options, handleResponse);
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('请求超时')); });
        req.write(postData);
        req.end();
        return;
      } catch (err) {
        console.warn('[提示] 代理配置解析失败，切换为直连方式:', err.message);
      }
    }

    options.hostname = targetUrl.hostname;
    options.port = targetUrl.port || 443;
    options.path = targetUrl.pathname + targetUrl.search;

    const req = https.request(options, handleResponse);
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('请求超时')); });
    req.write(postData);
    req.end();

    function handleResponse(res) {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          statusMessage: res.statusMessage,
          headers: res.headers,
          body: body.trim()
        });
      });
    }
  });
}

// 5. 主流程执行
async function main() {
  console.log('====================================================');
  console.log('       🚀 机场眼 IndexNow 协议自动推送程序');
  console.log('====================================================\n');

  try {
    const host = getHost();
    const { key, keyFile, keyLocation } = getKeyInfo();

    console.log(`[配置信息] 站点域名 (Host): ${host}`);
    console.log(`[配置信息] 验证密钥 (Key):  ${key}`);
    console.log(`[配置信息] 密钥文件:        ${keyFile}`);
    console.log(`[配置信息] 密钥地址:        ${keyLocation}\n`);

    // 检查命令行是否显式指定了提交 URL
    const cliUrls = process.argv.slice(2).filter(arg => arg.startsWith('http'));
    let urlList;

    if (cliUrls.length > 0) {
      console.log(`[提交模式] 指定单条/部分 URL 提交 (共 ${cliUrls.length} 个)`);
      urlList = cliUrls;
    } else {
      urlList = getUrlsFromSitemap(host);
      console.log(`[提交模式] 全站 Sitemap 提交 (共解析到 ${urlList.length} 个有效 URL)`);
    }

    const payload = {
      host: host,
      key: key,
      keyLocation: keyLocation,
      urlList: urlList
    };

    console.log(`\n正在向 IndexNow 官方网关 (api.indexnow.org) 发送提交请求...`);
    const startTime = Date.now();
    const response = await postIndexNow(payload);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n----------------- 接口响应报告 -----------------`);
    console.log(`HTTP 状态码: ${response.statusCode} ${response.statusMessage} (耗时 ${duration}s)`);

    if (response.statusCode === 200) {
      console.log(`✅ [成功 200 OK] 提交的所有 URL 已被 IndexNow 即时接收并成功处理！`);
    } else if (response.statusCode === 202) {
      console.log(`✅ [成功 202 Accepted] IndexNow 已接收请求，密钥与 URL 已进入处理与验证队列！`);
    } else {
      console.error(`❌ [异常 ${response.statusCode}] 响应内容: ${response.body || '无详细错误信息'}`);
      console.error(`详细检查点：
        1. 确保线上站点 https://${host}/${keyFile} 能被公网访问
        2. 确保提交的 urlList 均属于 ${host}
        3. 如遇 429 请稍后重试`);
      process.exitCode = 1;
      return;
    }

    if (response.body) {
      console.log(`返回报文: ${response.body}`);
    }
    console.log('------------------------------------------------');
    console.log('\n🎉 IndexNow 协议推送完成！Bing / Yandex / Naver 等搜索引擎已接入索引队列。');

  } catch (error) {
    console.error('\n❌ [执行失败]', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = { getHost, getKeyInfo, getUrlsFromSitemap, postIndexNow };
