# Alfred Sync Cert to Aliyun - API Documentation

## Overview

Alfred Sync Cert to Aliyun is a Node.js application that automatically monitors SSL certificate files and synchronizes them to Aliyun CDN. The application uses file watching to detect changes in certificate files and automatically updates the CDN configuration.

## Table of Contents

- [Architecture](#architecture)
- [Public APIs](#public-apis)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [File Watching](#file-watching)

## Architecture

The application consists of four main modules:

- **index.js**: Main entry point with file watching and orchestration
- **client.js**: Aliyun CDN client for certificate operations
- **config.js**: Configuration management for SSL certificate paths
- **util.js**: Utility functions for debouncing and other helpers

## Public APIs

### Client Class (`lib/client.js`)

The Client class handles all interactions with Aliyun CDN services.

#### `Client.createClient()`

Creates and configures an Aliyun CDN client instance.

**Returns**: `Cdn20180510` - Configured Aliyun CDN client

**Environment Variables Required**:
- `ALIBABA_CLOUD_ACCESS_KEY_ID`: Aliyun access key ID
- `ALIBABA_CLOUD_ACCESS_KEY_SECRET`: Aliyun access key secret

**Example**:
```javascript
const { Client } = require('./lib/client');
const client = Client.createClient();
```

**Throws**: Exception if environment variables are not set or invalid

---

#### `Client.main(args)`

Main method that reads SSL certificates and updates Aliyun CDN configuration.

**Parameters**:
- `args` (Array): Command line arguments (currently unused)

**Returns**: `Promise<void>`

**Functionality**:
1. Reads SSL public and private key files
2. Creates SSL certificate request for Aliyun CDN
3. Updates CDN domain with new certificate
4. Handles errors and provides diagnostic information

**Example**:
```javascript
const { Client } = require('./lib/client');
await Client.main([]);
```

**Certificate Configuration**:
- **Domain Name**: `alicdn.miaokefu.com` (hardcoded)
- **Certificate Name**: `acme`
- **Certificate Type**: `upload`
- **SSL Protocol**: `on`

**Error Handling**:
- Logs error messages and diagnostic recommendations
- Provides Aliyun-specific error details

---

### Configuration Module (`lib/config.js`)

Manages SSL certificate file paths and configuration.

#### `SSLPubPath`

**Type**: `string`  
**Description**: Path to the SSL public certificate file  
**Default**: `../test-certs/example.com.cert.pem`  
**Environment Override**: `SSL_PUB_PATH`

#### `SSLPriPath`

**Type**: `string`  
**Description**: Path to the SSL private key file  
**Default**: `../test-certs/example.com.key.pem`  
**Environment Override**: `SSL_PRI_PATH`

**Example**:
```javascript
const { SSLPubPath, SSLPriPath } = require('./lib/config');
console.log('Public cert path:', SSLPubPath);
console.log('Private key path:', SSLPriPath);
```

---

### Utility Functions (`lib/util.js`)

#### `debounce(func, time)`

Creates a debounced version of the provided function.

**Parameters**:
- `func` (Function): The function to debounce
- `time` (number): Delay in milliseconds

**Returns**: `Function` - Debounced function

**Description**: Delays function execution until after `time` milliseconds have elapsed since the last invocation. Useful for preventing multiple rapid function calls.

**Example**:
```javascript
const { debounce } = require('./lib/util');

const logMessage = () => console.log('Hello World');
const debouncedLog = debounce(logMessage, 1000);

// Will only execute once after 1 second, despite multiple calls
debouncedLog();
debouncedLog();
debouncedLog();
```

---

### Main Application (`lib/index.js`)

#### `syncCert()`

**Type**: `Function`  
**Description**: Synchronizes SSL certificates to Aliyun CDN  
**Parameters**: None  
**Returns**: `void`

Initiates the certificate synchronization process by calling `Client.main()`.

#### File Watching

The application automatically watches SSL certificate files for changes using the `chokidar` library.

**Watched Files**:
- SSL public certificate file (from `SSLPubPath`)
- SSL private key file (from `SSLPriPath`)

**Watched Events**:
- `add`: File added - triggers certificate sync
- `change`: File modified - triggers certificate sync
- `unlink`: File deleted - logs message only (no sync)
- `error`: File watching error - logs error
- `ready`: Initial scan complete - logs ready message

**Debouncing**: Certificate sync is debounced with a 1000ms delay to prevent multiple rapid synchronizations.

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `ALIBABA_CLOUD_ACCESS_KEY_ID` | Yes | Aliyun access key ID | None |
| `ALIBABA_CLOUD_ACCESS_KEY_SECRET` | Yes | Aliyun access key secret | None |
| `SSL_PUB_PATH` | No | Path to SSL public certificate | `../test-certs/example.com.cert.pem` |
| `SSL_PRI_PATH` | No | Path to SSL private key | `../test-certs/example.com.key.pem` |
| `DOTENV_PATH` | No | Path to .env file | `.env` |

## Configuration

### SSL Certificate Files

The application expects PEM-formatted SSL certificate files:

**Public Certificate File** (`SSL_PUB_PATH`):
```
-----BEGIN CERTIFICATE-----
[Certificate content]
-----END CERTIFICATE-----
```

**Private Key File** (`SSL_PRI_PATH`):
```
-----BEGIN PRIVATE KEY-----
[Private key content]
-----END PRIVATE KEY-----
```

### CDN Domain Configuration

Currently hardcoded in `client.js`:
- **Domain**: `alicdn.miaokefu.com`
- **Certificate Name**: `acme`
- **SSL Protocol**: Enabled (`on`)

## Usage Examples

### Basic Usage

```bash
# Set environment variables and start
ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key \
ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_secret \
SSL_PUB_PATH=/path/to/cert.pem \
SSL_PRI_PATH=/path/to/key.pem \
npm start
```

### Using .env File

Create a `.env` file:
```env
ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key
ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_secret
SSL_PUB_PATH=/path/to/cert.pem
SSL_PRI_PATH=/path/to/key.pem
```

Then start the application:
```bash
npm start
```

### PM2 Deployment

```bash
# First time setup
npm run deploy:first

# Subsequent deployments
npm run deploy:production
```

### Programmatic Usage

```javascript
const { Client } = require('./lib/client');
const { SSLPubPath, SSLPriPath } = require('./lib/config');

// Manual certificate sync
async function syncCertificates() {
  try {
    await Client.main([]);
    console.log('Certificate sync completed successfully');
  } catch (error) {
    console.error('Certificate sync failed:', error.message);
  }
}

syncCertificates();
```

## Error Handling

### Common Errors

1. **Missing Environment Variables**:
   ```
   Error: ALIBABA_CLOUD_ACCESS_KEY_ID is required
   ```
   **Solution**: Set the required environment variables

2. **Certificate File Not Found**:
   ```
   Error: ENOENT: no such file or directory
   ```
   **Solution**: Verify SSL certificate file paths

3. **Aliyun API Errors**:
   ```
   Error: InvalidDomainName.Malformed
   ```
   **Solution**: Check domain name configuration and Aliyun credentials

### Error Response Format

Aliyun API errors include:
- `error.message`: Error description
- `error.data.Recommend`: Diagnostic URL for troubleshooting

## File Watching

### Behavior

- **Persistent Monitoring**: Continuously watches for file changes
- **Debounced Sync**: Prevents multiple rapid synchronizations
- **Automatic Startup Sync**: Syncs certificates when application starts
- **Graceful Shutdown**: Can be stopped by closing the watcher

### Events Logged

```
File /path/to/cert.pem has been added
File /path/to/cert.pem has been changed
File /path/to/cert.pem has been removed
Watcher error: [error details]
Initial scan complete. Ready for changes
```

## Security Considerations

1. **Credential Management**: Use environment variables or .env files for sensitive data
2. **File Permissions**: Ensure certificate files have appropriate read permissions
3. **Access Keys**: Use IAM roles with minimal required permissions for Aliyun CDN
4. **Certificate Storage**: Store certificate files in secure directories

## Dependencies

- `@alicloud/cdn20180510`: Aliyun CDN SDK
- `@alicloud/openapi-client`: Aliyun OpenAPI client
- `@alicloud/tea-util`: Aliyun utility functions
- `chokidar`: File watching
- `dotenv`: Environment variable management
- `fs-extra`: Enhanced file system operations

## Version Compatibility

- **Node.js**: ^10.12.0 || >=12.0.0
- **Aliyun SDK**: Latest stable versions
- **Certificate Format**: PEM only

---

For additional support and troubleshooting, refer to the [Aliyun CDN documentation](https://help.aliyun.com/product/27099.html) and ensure your certificates are properly formatted and accessible.