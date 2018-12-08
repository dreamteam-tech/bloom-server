const Raven = require('raven');
const sentry = require('./src/config/sentry');

if (sentry.dsn) {
  Raven.config(sentry.dsn, {
    release: sentry.release,
    environment: sentry.environment
  }).install();
}
