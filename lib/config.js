const path = require('path');

const {
  SSL_PUB_PATH,
  SSL_PRI_PATH,
} = process.env;

const SSLPubPath = SSL_PUB_PATH || path.resolve(__dirname, '../test-certs/example.com.cert.pem');
const SSLPriPath = SSL_PRI_PATH || path.resolve(__dirname, '../test-certs/example.com.key.pem');

exports.SSLPubPath = SSLPubPath;
exports.SSLPriPath = SSLPriPath;
