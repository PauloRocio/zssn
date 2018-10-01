const newrelic = require('newrelic');
const appName = require('./package.json').name;
const application = require('./lib/application');
const db = require('./lib/commons/db');
const logger = require('winston');

const shutdown = () => {
  logger.info('Server receive signal to shutdown.');
  application.close(() => {
    logger.error('Gracefully shutdown done');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown)
  .on('SIGINT', shutdown)
  .on('SIGHUP', shutdown)
  .on('uncaughtException', (err) => {
    logger.error(`uncaughtException caught the error: ${JSON.stringify(err)}`);
    newrelic.noticeError(err);
    throw err;
  });

process.title = appName;

db.connect('', (err) => {
  if (err) {
    logger.error(`Problem connect DB. Error: ${err}`);
    process.exit(1);
  }
  application.start((error) => {
    if (error) {
      logger.error('[APP] initialization failed', err);
      newrelic.noticeError(err);
    } else {
      logger.info('[APP] initialized SUCCESSFULLY');
    }
  });
});
