module.exports = {
  apps: [
    {
      name: 'MangaDex Notifier',
      script: 'dist/app.js',
      instances: 1,
      cron_restart: '0 0 * * *',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};