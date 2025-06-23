## alfred-sync-cert-to-aliyun
将acme工具生成的ssl证书同步到阿里云cdn，以便开启https

### 使用
1. 修改lib/config中的私有和公有密钥路径或者启动命令时通过SSL_PUB_PATH、SSL_PRI_PATH参数传入
2. 修改以下命令的aliyun id和secret
  ```
  ALIBABA_CLOUD_ACCESS_KEY_ID=<ALIBABA_CLOUD_ACCESS_KEY_ID> ALIBABA_CLOUD_ACCESS_KEY_SECRET=<ALIBABA_CLOUD_ACCESS_KEY_SECRET>   SSL_PUB_PATH=<SSL_PUB_PATH> SSL_PRI_PATH=<SSL_PRI_PATH> npm run start
  ```

### pm2发布
#### dotenv注入环境变量
修改.env.prodution文件，dotenv会获取该文件的环境变量
```
npm run deploy:production
```
#### 命令后注入环境变量 （不生效已废弃）
~~环境变量跟在--env后面~~
```
npm run deploy:production --env ALIBABA_CLOUD_ACCESS_KEY_ID=xxx ALIBABA_CLOUD_ACCESS_KEY_SECRET=xxx SSL_PUB_PATH=xxx SSL_PRI_PATH=xxx
```

#### pm2使用
apps 下的 env、env_production
env：所有环境下都会生效的环境变量。
env_production：只有在用 --env production 启动时才会生效的环境变量。

用 pm2 start ecosystem.config.js --env production 启动时，env 和 env_production 都会注入。
用 pm2 start ecosystem.config.js --env test 启动时，env 和 env_test 都会注入。

apps 下的 env/xxx：影响 pm2 启动应用时的环境变量（即 node 进程的环境变量）。
deploy 下的 env：影响 pm2 deploy 部署流程中执行的 shell 命令（如 post-deploy）的环境变量。