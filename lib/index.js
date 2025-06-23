console.log('process.env.DOTENV_PATH:', process.env.DOTENV_PATH);
// dotenv会兜底.env
const result = require('dotenv').config({ path: process.env.DOTENV_PATH });

console.log('process.env:', process.env);

console.log('result:', result);

const chokidar = require('chokidar');
const { debounce } = require('./util');

const { Client } = require('./client');
const { SSLPubPath, SSLPriPath } = require('./config');

function syncCert() {
  console.log('syncCert');
  Client.main(process.argv.slice(2));
}

// 避免多个文件修改触发多次同步
const debounceSyncCert = debounce(syncCert, 1000);

const filesToWatch = [SSLPubPath, SSLPriPath];

console.log('ALIBABA_CLOUD_ACCESS_KEY_ID: ', process.env.ALIBABA_CLOUD_ACCESS_KEY_ID);
console.log('ALIBABA_CLOUD_ACCESS_KEY_SECRET: ', process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET);
console.log('SSLPubPath:', SSLPubPath);
console.log('SSLPriPath:', SSLPriPath);

// 创建一个 watcher 实例
const watcher = chokidar.watch(filesToWatch, {
  // 可以在这里添加一些配置选项
  persistent: true, // 持续监测，即使ready后
});

// 监听各种事件
watcher
  .on('add', (path) => { console.log(`File ${path} has been added`); debounceSyncCert(); })
  .on('change', (path) => { console.log(`File ${path} has been changed`); debounceSyncCert(); })
  // 删除就不同步了
  .on('unlink', (path) => console.log(`File ${path} has been removed`))
  .on('error', (error) => console.error(`Watcher error: ${error}`))
  .on('ready', () => console.log('Initial scan complete. Ready for changes'));

// 如果需要，稍后可以停止监听
// watcher.close();

// 如果应用在文件变更后启用，需要启动应用时同步一次
debounceSyncCert();
