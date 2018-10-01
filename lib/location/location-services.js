const survivorsModels = require('../survivors/survivors-models');
const logger = require('winston');
const formatResponse = require('../commons/format-response');

module.exports = (body, survivorName, callback) => {
  const query = { name: survivorName };
  const location = {
    latitude: body.latitude,
    longitude: body.longitude,
    timestamp: new Date()
  };
  const $set = {
    $push: { traceLocation: { location } },
    $set: { location }
  };

  survivorsModels.findOneAndUpdate(query, $set, (err, survivor) => {
    let message = {};
    if (err) {
      message = `Problem on update location of survivor on DB. Error: ${err}`;
      logger.error(message);
      return callback(formatResponse(500, message));
    }
    if (!survivor.value) {
      message = 'Survivor not found';
      logger.error(message);
      return callback(formatResponse(404, message));
    }
    message = 'Location of survivor updated with success!';
    logger.info(message);
    return callback(formatResponse(200, message));
  });
};
