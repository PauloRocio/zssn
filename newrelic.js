const config = require('./lib/commons/config');
const pkg = require('./package.json');

exports.config = {
  app_name: [pkg.name],
  license_key: config.get('NEWRELIC_KEY'),
  browser_monitoring: {
    enable: true
  },
  capture_params: true,
  error_collector: {
    enabled: true
  },
  transaction_tracer: {
    enabled: true
  },
  transaction_events: {
    enabled: true
  }
};
