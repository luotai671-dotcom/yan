/**
 * scripts/submit-indexnow.js
 * IndexNow 自动化批量推送脚本
 * 重点解决 Bing 站长平台报错: 补全 /compare 与 /warning 核心页面并提交
 */

const path = require('path');
const indexnow = require(path.join(__dirname, '..', 'indexnow.js'));

// 确保包含以下核心 URL：
const urlList = [
  'https://jichangyan.com/',
  'https://jichangyan.com/compare',
  'https://jichangyan.com/warning'
  // ... 其他已有页面将由 collectUrls 自动汇聚追加
];

async function run() {
  await indexnow.main();
}

if (require.main === module) {
  run();
}

module.exports = {
  urlList,
  run,
  ...indexnow
};
