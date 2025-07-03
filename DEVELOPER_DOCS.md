# Developer Documentation - JSDoc Style

## Overview

This document provides detailed JSDoc-style documentation for developers working with the Alfred Sync Cert to Aliyun codebase. Each function and class includes detailed parameter information, return types, and usage examples.

## Module: lib/client.js

### Class: Client

Handles all Aliyun CDN SSL certificate operations.

```javascript
/**
 * Client class for Aliyun CDN SSL certificate management
 * @class Client
 */
class Client {
  /**
   * Creates and configures an Aliyun CDN client instance
   * @static
   * @method createClient
   * @returns {Cdn20180510} Configured Aliyun CDN client instance
   * @throws {Error} Throws error if environment variables are missing
   * 
   * @description
   * Initializes the Aliyun CDN client with authentication credentials from environment variables.
   * The client is configured to use the cdn.aliyuncs.com endpoint.
   * 
   * @requires {string} process.env.ALIBABA_CLOUD_ACCESS_KEY_ID - Aliyun access key ID
   * @requires {string} process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET - Aliyun access key secret
   * 
   * @example
   * // Ensure environment variables are set
   * process.env.ALIBABA_CLOUD_ACCESS_KEY_ID = 'your_access_key';
   * process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET = 'your_secret';
   * 
   * const client = Client.createClient();
   * console.log('Client created successfully');
   * 
   * @see {@link https://help.aliyun.com/document_detail/378664.html} - Aliyun authentication methods
   */
  static createClient() { ... }

  /**
   * Main method to synchronize SSL certificates to Aliyun CDN
   * @static
   * @async
   * @method main
   * @param {Array} args - Command line arguments (currently unused)
   * @returns {Promise<void>} Promise that resolves when sync is complete
   * @throws {Error} Throws error if file reading or API call fails
   * 
   * @description
   * Reads SSL certificate files, creates a certificate upload request, and updates
   * the CDN domain configuration. Includes comprehensive error handling with
   * Aliyun-specific diagnostic information.
   * 
   * @workflow
   * 1. Read SSL public and private key files asynchronously
   * 2. Create SetCdnDomainSSLCertificateRequest object
   * 3. Submit certificate to Aliyun CDN
   * 4. Handle success/error responses
   * 
   * @example
   * // Basic usage
   * try {
   *   await Client.main([]);
   *   console.log('Certificate sync completed');
   * } catch (error) {
   *   console.error('Sync failed:', error.message);
   *   if (error.data?.Recommend) {
   *     console.log('Diagnostic URL:', error.data.Recommend);
   *   }
   * }
   * 
   * @example
   * // With custom error handling
   * async function syncWithRetry(maxRetries = 3) {
   *   for (let i = 0; i < maxRetries; i++) {
   *     try {
   *       await Client.main([]);
   *       return true;
   *     } catch (error) {
   *       console.warn(`Attempt ${i + 1} failed:`, error.message);
   *       if (i === maxRetries - 1) throw error;
   *       await new Promise(resolve => setTimeout(resolve, 5000));
   *     }
   *   }
   * }
   */
  static async main(args) { ... }
}
```

### Certificate Request Configuration

```javascript
/**
 * SSL Certificate Request Configuration
 * @typedef {Object} CertificateConfig
 * @property {string} domainName - CDN domain name (currently: 'alicdn.miaokefu.com')
 * @property {string} CertName - Certificate identifier (currently: 'acme')
 * @property {string} CertType - Certificate type (currently: 'upload')
 * @property {string} SSLPub - Public certificate content (PEM format)
 * @property {string} SSLPri - Private key content (PEM format)
 * @property {string} SSLProtocol - SSL protocol status ('on' | 'off')
 */
```

## Module: lib/config.js

### Configuration Exports

```javascript
/**
 * SSL certificate file path configuration
 * @module config
 * @description Manages SSL certificate file paths with environment variable overrides
 */

/**
 * Path to SSL public certificate file
 * @constant {string} SSLPubPath
 * @default '../test-certs/example.com.cert.pem'
 * @env {string} SSL_PUB_PATH - Environment variable override
 * 
 * @description
 * Specifies the file system path to the SSL public certificate file.
 * Can be overridden using the SSL_PUB_PATH environment variable.
 * 
 * @example
 * // Using default path
 * const { SSLPubPath } = require('./config');
 * console.log(SSLPubPath); // '../test-certs/example.com.cert.pem'
 * 
 * @example
 * // Using environment variable
 * process.env.SSL_PUB_PATH = '/custom/path/to/cert.pem';
 * const { SSLPubPath } = require('./config');
 * console.log(SSLPubPath); // '/custom/path/to/cert.pem'
 */
exports.SSLPubPath = SSLPubPath;

/**
 * Path to SSL private key file
 * @constant {string} SSLPriPath
 * @default '../test-certs/example.com.key.pem'
 * @env {string} SSL_PRI_PATH - Environment variable override
 * 
 * @description
 * Specifies the file system path to the SSL private key file.
 * Can be overridden using the SSL_PRI_PATH environment variable.
 * 
 * @example
 * // Using default path
 * const { SSLPriPath } = require('./config');
 * console.log(SSLPriPath); // '../test-certs/example.com.key.pem'
 * 
 * @example
 * // Using environment variable
 * process.env.SSL_PRI_PATH = '/custom/path/to/key.pem';
 * const { SSLPriPath } = require('./config');
 * console.log(SSLPriPath); // '/custom/path/to/key.pem'
 */
exports.SSLPriPath = SSLPriPath;
```

## Module: lib/util.js

### Utility Functions

```javascript
/**
 * Utility functions for the application
 * @module util
 */

/**
 * Creates a debounced version of the provided function
 * @function debounce
 * @param {Function} func - The function to debounce
 * @param {number} time - Delay in milliseconds before function execution
 * @returns {Function} Debounced function that delays execution
 * 
 * @description
 * Creates a debounced function that delays invoking `func` until after `time`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 * Useful for preventing excessive function calls during rapid events.
 * 
 * @algorithm
 * 1. Clear any existing timer when function is called
 * 2. Set new timer to execute function after specified delay
 * 3. If called again before timer expires, clear and reset timer
 * 
 * @example
 * // Basic debouncing
 * const logMessage = (message) => console.log(message);
 * const debouncedLog = debounce(logMessage, 1000);
 * 
 * debouncedLog('First call');   // Will execute after 1 second
 * debouncedLog('Second call');  // Cancels first, will execute after 1 second
 * debouncedLog('Third call');   // Cancels second, will execute after 1 second
 * 
 * @example
 * // File watching with debounce
 * const fs = require('fs');
 * const saveFile = (content) => fs.writeFileSync('output.txt', content);
 * const debouncedSave = debounce(saveFile, 500);
 * 
 * // Rapid calls will only result in one save operation
 * debouncedSave('Content 1');
 * debouncedSave('Content 2');
 * debouncedSave('Content 3'); // Only this will execute
 * 
 * @example
 * // With context preservation
 * class EventHandler {
 *   constructor() {
 *     this.count = 0;
 *     this.handleEvent = debounce(this.handleEvent.bind(this), 300);
 *   }
 *   
 *   handleEvent() {
 *     console.log(`Event handled: ${++this.count}`);
 *   }
 * }
 */
exports.debounce = function(func, time) { ... };
```

## Module: lib/index.js

### Main Application Functions

```javascript
/**
 * Main application entry point with file watching and certificate synchronization
 * @module index
 */

/**
 * Synchronizes SSL certificates to Aliyun CDN
 * @function syncCert
 * @returns {void}
 * 
 * @description
 * Initiates the SSL certificate synchronization process by calling Client.main().
 * This function serves as a wrapper to maintain clean separation of concerns.
 * 
 * @workflow
 * 1. Logs sync initiation
 * 2. Calls Client.main() with command line arguments
 * 3. Error handling is managed by Client.main()
 * 
 * @example
 * // Direct call
 * syncCert();
 * 
 * @see {@link Client.main} for detailed sync implementation
 */
function syncCert() { ... }

/**
 * Debounced version of syncCert function
 * @constant {Function} debounceSyncCert
 * @description Prevents multiple rapid certificate synchronizations
 * @delay 1000ms
 * 
 * @example
 * // Multiple rapid calls will be debounced
 * debounceSyncCert(); // Will execute
 * debounceSyncCert(); // Will be cancelled
 * debounceSyncCert(); // Will execute after 1 second delay
 */
const debounceSyncCert = debounce(syncCert, 1000);
```

### File Watching Configuration

```javascript
/**
 * File watching configuration using chokidar
 * @namespace FileWatcher
 */

/**
 * List of files to monitor for changes
 * @constant {Array<string>} filesToWatch
 * @description Array containing paths to SSL certificate files
 * 
 * @example
 * console.log(filesToWatch);
 * // ['/path/to/cert.pem', '/path/to/key.pem']
 */
const filesToWatch = [SSLPubPath, SSLPriPath];

/**
 * Chokidar watcher instance configuration
 * @constant {FSWatcher} watcher
 * @description Configured file system watcher for SSL certificate files
 * 
 * @config
 * - persistent: true - Keeps the process running for continuous monitoring
 * 
 * @events
 * - 'add': File added - triggers debounced certificate sync
 * - 'change': File modified - triggers debounced certificate sync  
 * - 'unlink': File deleted - logs removal (no sync triggered)
 * - 'error': Watcher error - logs error details
 * - 'ready': Initial scan complete - logs ready status
 * 
 * @example
 * // Watcher will automatically handle these scenarios:
 * 
 * // 1. New certificate file created
 * // → Triggers: 'add' event → debounceSyncCert()
 * 
 * // 2. Certificate file updated (ACME renewal)
 * // → Triggers: 'change' event → debounceSyncCert()
 * 
 * // 3. Certificate file temporarily removed
 * // → Triggers: 'unlink' event → logs only (no sync)
 * 
 * // 4. File system error
 * // → Triggers: 'error' event → logs error details
 */
const watcher = chokidar.watch(filesToWatch, { persistent: true });
```

## Environment Variables Reference

```javascript
/**
 * Environment Variables Documentation
 * @namespace EnvironmentVariables
 */

/**
 * Aliyun access credentials and configuration
 * @typedef {Object} AliyunCredentials
 * @property {string} ALIBABA_CLOUD_ACCESS_KEY_ID - Required. Aliyun access key ID
 * @property {string} ALIBABA_CLOUD_ACCESS_KEY_SECRET - Required. Aliyun access key secret
 * 
 * @example
 * // Set via environment
 * export ALIBABA_CLOUD_ACCESS_KEY_ID="your_access_key"
 * export ALIBABA_CLOUD_ACCESS_KEY_SECRET="your_secret"
 * 
 * @example
 * // Set via .env file
 * ALIBABA_CLOUD_ACCESS_KEY_ID=your_access_key
 * ALIBABA_CLOUD_ACCESS_KEY_SECRET=your_secret
 */

/**
 * SSL certificate file paths
 * @typedef {Object} CertificatePaths  
 * @property {string} [SSL_PUB_PATH] - Optional. Path to SSL public certificate
 * @property {string} [SSL_PRI_PATH] - Optional. Path to SSL private key
 * 
 * @default SSL_PUB_PATH="../test-certs/example.com.cert.pem"
 * @default SSL_PRI_PATH="../test-certs/example.com.key.pem"
 * 
 * @example
 * // Custom certificate paths
 * export SSL_PUB_PATH="/etc/ssl/certs/my-domain.cert.pem"
 * export SSL_PRI_PATH="/etc/ssl/private/my-domain.key.pem"
 */

/**
 * Dotenv configuration
 * @typedef {Object} DotenvConfig
 * @property {string} [DOTENV_PATH] - Optional. Custom path to .env file
 * 
 * @default DOTENV_PATH=".env"
 * 
 * @example
 * // Custom .env file location
 * export DOTENV_PATH="/app/config/.env.production"
 */
```

## Error Handling Reference

```javascript
/**
 * Error handling patterns and types
 * @namespace ErrorHandling
 */

/**
 * Common error types and handling strategies
 * @typedef {Object} ErrorTypes
 */

/**
 * File system errors
 * @typedef {Error} FileSystemError
 * @property {string} code - Error code (e.g., 'ENOENT', 'EACCES')
 * @property {string} path - File path that caused the error
 * 
 * @example
 * // Handle certificate file not found
 * try {
 *   await Client.main([]);
 * } catch (error) {
 *   if (error.code === 'ENOENT') {
 *     console.error('Certificate file not found:', error.path);
 *     console.log('Please check SSL_PUB_PATH and SSL_PRI_PATH configuration');
 *   }
 * }
 */

/**
 * Aliyun API errors
 * @typedef {Error} AliyunAPIError
 * @property {string} message - Error message
 * @property {Object} data - Additional error data
 * @property {string} data.Recommend - Diagnostic URL for troubleshooting
 * 
 * @example
 * // Handle Aliyun API errors
 * try {
 *   await Client.main([]);
 * } catch (error) {
 *   console.error('Aliyun API Error:', error.message);
 *   if (error.data?.Recommend) {
 *     console.log('Troubleshooting guide:', error.data.Recommend);
 *   }
 * }
 */

/**
 * Environment variable errors
 * @typedef {Error} EnvironmentError
 * @description Errors related to missing or invalid environment variables
 * 
 * @example
 * // Validate environment before starting
 * function validateEnvironment() {
 *   const required = ['ALIBABA_CLOUD_ACCESS_KEY_ID', 'ALIBABA_CLOUD_ACCESS_KEY_SECRET'];
 *   const missing = required.filter(key => !process.env[key]);
 *   
 *   if (missing.length > 0) {
 *     throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
 *   }
 * }
 */
```

## Testing Utilities

```javascript
/**
 * Testing and development utilities
 * @namespace Testing
 */

/**
 * Mock certificate content for testing
 * @constant {Object} MockCertificates
 * @property {string} publicCert - Sample public certificate content
 * @property {string} privateKey - Sample private key content
 * 
 * @example
 * const MockCertificates = {
 *   publicCert: `-----BEGIN CERTIFICATE-----
 * MIIDXTCCAkWgAwIBAgIJAL...sample...content...
 * -----END CERTIFICATE-----`,
 *   
 *   privateKey: `-----BEGIN PRIVATE KEY-----
 * MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...sample...
 * -----END PRIVATE KEY-----`
 * };
 * 
 * // Create test certificate files
 * const fs = require('fs-extra');
 * await fs.writeFile('/tmp/test.cert.pem', MockCertificates.publicCert);
 * await fs.writeFile('/tmp/test.key.pem', MockCertificates.privateKey);
 */

/**
 * Test environment setup
 * @function setupTestEnvironment
 * @returns {Object} Test configuration object
 * 
 * @example
 * function setupTestEnvironment() {
 *   return {
 *     env: {
 *       ALIBABA_CLOUD_ACCESS_KEY_ID: 'test_access_key',
 *       ALIBABA_CLOUD_ACCESS_KEY_SECRET: 'test_secret',
 *       SSL_PUB_PATH: '/tmp/test.cert.pem',
 *       SSL_PRI_PATH: '/tmp/test.key.pem'
 *     },
 *     cleanup: () => {
 *       // Clean up test files
 *       fs.removeSync('/tmp/test.cert.pem');
 *       fs.removeSync('/tmp/test.key.pem');
 *     }
 *   };
 * }
 */
```

---

## Development Guidelines

### Code Style

- Use ES6+ features where appropriate
- Implement proper error handling for all async operations
- Log meaningful messages for debugging and monitoring
- Use environment variables for all configuration
- Follow Node.js best practices for file operations

### Security

- Never commit credentials to version control
- Use environment variables or secure secret management
- Validate file paths to prevent directory traversal
- Implement proper error handling to avoid information leakage
- Use minimal required permissions for Aliyun access keys

### Performance

- Use Promise.all() for concurrent file operations
- Implement debouncing for file watching events
- Consider implementing retry logic for API calls
- Monitor memory usage for long-running processes

### Monitoring

- Log all certificate sync operations
- Monitor file system events and errors
- Track API response times and error rates
- Implement health checks for production deployment