const express = require('express');
const bodyParser = require('body-parser');
const pkg = require('../package.json');
const morgan = require('morgan');
const routes = require('./routes');
const logger = require('winston');
const config = require('./commons/config');

const app = express();
let serverProcess;

morgan.token('body', req => JSON.stringify(req.body));

const server = (() => {
  const start = (callback) => {
    app.locals.title = pkg.name;
    app.use(bodyParser.json());
    app.use(morgan(':method :url :body - :status'));

    routes(app);

    serverProcess = app.listen(config.get('PORT'), () => {
      logger.info(`Listening on port ${config.get('PORT')}`);
    });
    return callback(null, app);
  };

  const close = (callback) => {
    if (serverProcess) {
      serverProcess.close(callback);
    }
  };

  return {
    start,
    close
  };
})();

module.exports = server;
