module.exports = {
  dsn: process.env.SENTRY_DSN || '',
  release: process.env.APP_RELEASE || 'dev',
  environment: process.env.APP_ENVIRONMENT || 'localhost'
};
