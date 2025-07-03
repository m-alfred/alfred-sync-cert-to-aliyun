# Quick Reference Guide

## Installation & Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd alfred-sync-cert-to-aliyun
npm install
```

## Environment Configuration

### Method 1: Environment Variables
```bash
export ALIBABA_CLOUD_ACCESS_KEY_ID="your_access_key"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your_secret"
export SSL_PUB_PATH="/path/to/certificate.pem"
export SSL_PRI_PATH="/path/to/private-key.pem"
```

### Method 2: .env File
Create `.env` file:
```env
ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key
ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_secret
SSL_PUB_PATH=/path/to/certificate.pem
SSL_PRI_PATH=/path/to/private-key.pem
```

## Running the Application

### Development
```bash
npm start
```

### Production with PM2
```bash
npm run start:pm2
```

### One-time Manual Sync
```javascript
const { Client } = require('./lib/client');
Client.main([]);
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start file watcher and auto-sync |
| `npm run lint` | Run ESLint code analysis |
| `npm run start:pm2` | Start with PM2 process manager |
| `npm run deploy:first` | Initial PM2 deployment setup |
| `npm run deploy:production` | Deploy to production |

## File Structure

```
alfred-sync-cert-to-aliyun/
├── lib/
│   ├── index.js      # Main entry point & file watcher
│   ├── client.js     # Aliyun CDN client
│   ├── config.js     # Configuration management
│   └── util.js       # Utility functions
├── test-certs/       # Default certificate directory
├── package.json      # Project configuration
└── ecosystem.config.js # PM2 configuration
```

## Quick API Reference

### Client.createClient()
Creates Aliyun CDN client
```javascript
const client = Client.createClient(); // Requires env vars
```

### Client.main(args)
Syncs certificates to CDN
```javascript
await Client.main([]); // Returns Promise<void>
```

### debounce(func, time)
Debounces function calls
```javascript
const debouncedFn = debounce(myFunction, 1000);
```

## Configuration Quick Reference

### Required Environment Variables
- `ALIBABA_CLOUD_ACCESS_KEY_ID` - Aliyun access key
- `ALIBABA_CLOUD_ACCESS_KEY_SECRET` - Aliyun secret key

### Optional Environment Variables
- `SSL_PUB_PATH` - Certificate file path (default: `../test-certs/example.com.cert.pem`)
- `SSL_PRI_PATH` - Private key path (default: `../test-certs/example.com.key.pem`)
- `DOTENV_PATH` - Custom .env file path (default: `.env`)

### Hardcoded Configuration
- **CDN Domain**: `alicdn.miaokefu.com`
- **Certificate Name**: `acme`
- **Debounce Delay**: 1000ms

## Troubleshooting

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `ALIBABA_CLOUD_ACCESS_KEY_ID is required` | Missing credentials | Set environment variables |
| `ENOENT: no such file or directory` | Invalid certificate path | Check file paths and permissions |
| `InvalidDomainName.Malformed` | Domain not in CDN | Verify domain configuration |
| `Watcher error` | File permission issues | Check file/directory permissions |

### Quick Diagnostics

```bash
# Check environment variables
echo $ALIBABA_CLOUD_ACCESS_KEY_ID
echo $SSL_PUB_PATH

# Verify certificate files exist
ls -la /path/to/certificate.pem
ls -la /path/to/private-key.pem

# Test file permissions
cat /path/to/certificate.pem
cat /path/to/private-key.pem

# Check process status (PM2)
pm2 status
pm2 logs
```

### Log Analysis

```bash
# View application logs
npm start 2>&1 | tee app.log

# Monitor file changes
tail -f app.log | grep "File.*has been"

# Check sync operations
tail -f app.log | grep "syncCert\|设置成功\|error"
```

## Security Checklist

- [ ] Environment variables set securely
- [ ] Certificate files have proper permissions (600)
- [ ] .env files excluded from version control
- [ ] Aliyun access keys have minimal required permissions
- [ ] Certificate directory is secured

## File Watching Events

| Event | Trigger | Action |
|-------|---------|--------|
| `add` | File created | Sync certificates |
| `change` | File modified | Sync certificates |
| `unlink` | File deleted | Log only (no sync) |
| `error` | File system error | Log error |
| `ready` | Watcher initialized | Log ready status |

## Performance Tips

- Certificate sync is debounced (1000ms delay)
- Multiple rapid file changes trigger only one sync
- File reading operations are concurrent (Promise.all)
- Watcher runs persistently for real-time monitoring

## Production Deployment

### PM2 Configuration
```bash
# Start with production environment
pm2 startOrRestart ecosystem.config.js --env production

# Monitor application
pm2 monit

# View logs
pm2 logs alfred-sync-cert-to-aliyun

# Auto-restart on changes
pm2 restart alfred-sync-cert-to-aliyun --watch
```

### Health Checks
```bash
# Check if process is running
pm2 show alfred-sync-cert-to-aliyun

# Verify file watching
touch /path/to/certificate.pem # Should trigger sync

# Test manual sync
node -e "require('./lib/client').Client.main([])"
```

## Integration Examples

### ACME with Let's Encrypt
```bash
# After ACME certificate renewal
certbot renew --deploy-hook "touch /path/to/certificate.pem"
```

### Cron Job Integration
```bash
# Add to crontab for periodic sync
0 2 * * * /usr/bin/node /path/to/alfred-sync-cert-to-aliyun/lib/index.js
```

### Docker Integration
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### Monitoring Integration
```bash
# Prometheus metrics endpoint (custom implementation)
curl http://localhost:3000/metrics

# Health check endpoint
curl http://localhost:3000/health
```

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Start development server
npm start

# Test with mock certificates
export SSL_PUB_PATH="./test-certs/test.cert.pem"
export SSL_PRI_PATH="./test-certs/test.key.pem"
```

### Testing
```bash
# Create test certificates
mkdir -p test-certs
openssl req -x509 -newkey rsa:4096 -keyout test-certs/test.key.pem -out test-certs/test.cert.pem -days 365 -nodes

# Set test environment
export ALIBABA_CLOUD_ACCESS_KEY_ID="test_key"
export ALIBABA_CLOUD_ACCESS_KEY_SECRET="test_secret"
export SSL_PUB_PATH="./test-certs/test.cert.pem"
export SSL_PRI_PATH="./test-certs/test.key.pem"

# Run application
npm start
```

### Debugging
```bash
# Enable debug logging
DEBUG=* npm start

# Node.js debug mode
node --inspect lib/index.js

# Verbose logging
NODE_ENV=development npm start
```

## API Rate Limits

- Aliyun CDN API has rate limiting
- Debouncing prevents excessive API calls
- Monitor API response times and errors
- Implement exponential backoff for failures

## Certificate Format Requirements

### Public Certificate (PEM)
```
-----BEGIN CERTIFICATE-----
[Base64 encoded certificate]
-----END CERTIFICATE-----
```

### Private Key (PEM)
```
-----BEGIN PRIVATE KEY-----
[Base64 encoded private key]
-----END PRIVATE KEY-----
```

### Validation
```bash
# Verify certificate format
openssl x509 -in certificate.pem -text -noout

# Verify private key format
openssl rsa -in private-key.pem -check

# Check certificate-key pair match
openssl x509 -noout -modulus -in certificate.pem | openssl md5
openssl rsa -noout -modulus -in private-key.pem | openssl md5
```

---

## Support & Resources

- [Aliyun CDN Documentation](https://help.aliyun.com/product/27099.html)
- [Node.js Documentation](https://nodejs.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Chokidar File Watcher](https://github.com/paulmillr/chokidar)

## Version Information

- **Node.js**: ^10.12.0 || >=12.0.0
- **Dependencies**: See package.json
- **License**: ISC