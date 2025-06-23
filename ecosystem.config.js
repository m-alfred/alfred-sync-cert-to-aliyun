// pm2 配置文件
// https://pm2.io/doc/en/runtime/reference/ecosystem-file/
// pm2 日志切割
// https://www.npmjs.com/package/pm2-logrotate
const path = require('path');
const { name } = require('./package.json');

console.log('process.version:', process.version);
module.exports = {
  // an array that contains the configuration for each process
  apps: [
    {
      // Process name in the process list
      name,
      // Path of the script to launch, required field
      script: './lib/index.js',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      // Arguments to pass to the script
      instances: 1,
      // fix NODE_APP_INSTANCE value of '0' did not match any instance config file names
      instance_var: 'INSTANCE_ID',
      exec_mode: 'fork',
      // Enable or disable auto restart after process failure
      autorestart: true,
      // Enable or disable the watch mode
      watch: false,
      // List of paths to ignore (regex)
      ignore_watch: [],
      // eslint-disable-next-line max-len
      // Restart the app if an amount of memory is exceeded (format: /0-9?/ K for KB, ‘M’ for MB, ‘G’ for GB, default to B)
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        DOTENV_PATH: path.join(__dirname, './.env'),
      },
      // /^env_\S*$/
      // eslint-disable-next-line no-tabs
      // Specify environment variables to be injected when using –env
      env_production: {
        NODE_ENV: 'production',
        DOTENV_PATH: path.join(__dirname, './.env.production'),
      },
      /** ----------logs ---------- */
      // Disable all logs storage
      disable_logs: false,
      // Define a specific log output type, possible value: json
      log_type: 'json',
      // Format for log timestamps in moment.js format (eg YYYY-MM-DD HH:mm Z)
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // if set to true, avoid to suffix logs file with the process id
      combine_logs: true,
    },
  ],
  // an object that contains the configuration for the deployments
  deploy: {
    production: {
      // SSH user
      user: 'root',
      // SSH host
      host: '175.27.158.127',
      // can be either a single string or an array of strings
      ssh_options: 'StrictHostKeyChecking=no',
      // git
      ref: 'origin/master',
      repo: `ssh://git@172.17.0.2:10022/Sky/${name}.git`,
      // SSH key path, default to $HOME/.ssh
      // TODO
      // key: '/Users/alfred/.ssh/id_rsa.pub',
      path: `/root/projects/${name}`,
      // SSH options with no command-line flag, see 'man ssh'
      // Pre-setup command or path to a script on your host machine
      // eslint-disable-next-line max-len
      'pre-setup': `echo 'This is a pre-setup command' && pwd && rm -rf /root/projects/${name} && pm2 install pm2-logrotate && pm2 set pm2-logrotate:max_size 3M`,
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      'post-setup': 'ls -la',
      // pre-deploy action
      'pre-deploy-local': [
        // 里面必须使用单引号
        "echo 'This is a local executed command'",
        // eslint-disable-next-line max-len
        `scp ${path.join(__dirname, './.env.production')} root@175.27.158.127:/root/projects/${name}/source/.env.production`,
        'ls -la',
      ].join(' && '),
      'post-deploy': [
        'nvm use',
        'echo $ALIBABA_CLOUD_ACCESS_KEY_ID',
        'npm run start:pm2',
      ].join(' && '),
    },
  },
};
