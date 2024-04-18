module.exports = {
  apps: [
    {
      name: 'mangadex-notifier',
      script: 'dist/app.js',
      cron_restart: '*/15 * * * *',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
