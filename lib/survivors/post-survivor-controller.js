const insertSurvivorService = require('./post-survivor-services');
const logger = require('winston');

module.exports = (req, res) => {
  const body = req.body;

  insertSurvivorService(body, (err) => {
    if (err) {
      logger.error(`Problem on insert survivor on DB. Error: ${err}`);
      return res.status(500).end();
    }
    logger.info('Inserted survivor with success!');
    return res.status(200).send('Inserted survivor with success!');
  });
};
