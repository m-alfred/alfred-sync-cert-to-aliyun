const fs = require('fs-extra');
// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const Cdn20180510 = require('@alicloud/cdn20180510');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const { SSLPubPath, SSLPriPath } = require('./config');

const {
  ALIBABA_CLOUD_ACCESS_KEY_ID,
  ALIBABA_CLOUD_ACCESS_KEY_SECRET,
} = process.env;
console.log('process.env.ALIBABA_CLOUD_ACCESS_KEY_ID:', process.env.ALIBABA_CLOUD_ACCESS_KEY_ID);

class Client {
  /**
   * 使用AK&SK初始化账号Client
   * @return Client
   * @throws Exception
   */
  static createClient() {
    // 工程代码泄露可能会导致 AccessKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考。
    // 建议使用更安全的 STS 方式，更多鉴权访问方式请参见：https://help.aliyun.com/document_detail/378664.html。
    const config = new OpenApi.Config({
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
      accessKeyId: ALIBABA_CLOUD_ACCESS_KEY_ID,
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
      accessKeySecret: ALIBABA_CLOUD_ACCESS_KEY_SECRET,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/Cdn
    config.endpoint = 'cdn.aliyuncs.com';
    return new Cdn20180510.default(config);
  }

  static async main(args) {
    const client = Client.createClient();
    const [SSLPub, SSLPri] = await Promise.all([
      fs.readFile(SSLPubPath, { encoding: 'utf8' }), // buffer转string
      fs.readFile(SSLPriPath, { encoding: 'utf8' }),
    ]);

    const setCdnDomainSSLCertificateRequest = new Cdn20180510.SetCdnDomainSSLCertificateRequest({
      // 必须是cdn的域名
      domainName: 'alicdn.miaokefu.com',
      CertName: 'acme',
      CertType: 'upload',
      SSLPub,
      SSLPri,
      SSLProtocol: 'on', // on ｜ off
    });

    const runtime = new Util.RuntimeOptions({});
    try {
      // 复制代码运行请自行打印 API 的返回值
      await client.setCdnDomainSSLCertificateWithOptions(setCdnDomainSSLCertificateRequest, runtime);
      console.log('设置成功');
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data.Recommend);
      Util.default.assertAsString(error.message);
    }
  }
}

exports.Client = Client;
