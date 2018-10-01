const survivorsModels = require('../survivors/survivors-models');
const logger = require('winston');
const formatReponse = require('../commons/format-response');

function verifyIsSurvivor(survivor) {
  if (survivor.isInfected < 3) {
    return true;
  }
}
module.exports = (body, callback) => {
  let message;
  const query = {
    name: { $in: [body.survivorName, body.relateInfected] }
  };
  survivorsModels.find(query, {}, (err, survivors) => {
    if (err) {
      message = `Problem on insert infected on DB. Error: ${err}`;
      logger.error(message);
      return callback(formatReponse(500, message));
    }
    if (!survivors || survivors.length < 2) {
      message = 'Problem on relate infected';
      logger.error(message);
      return callback(formatReponse(404, message));
    }
    const infected = survivors.find(survivor => survivor.name === body.relateInfected
      && verifyIsSurvivor(survivor));
    if (infected.countInfected >= 3) {
      message = 'Survivor is already flagged as infected';
      logger.error(message);
      return callback(formatReponse(409, message));
    }
    infected.countInfected += 1;
    if (infected.countInfected === 3) {
      infected.isInfected = true;
    }
    infected.traceRelateInfected.push({ name: body.survivorName, date: new Date() });
    survivorsModels.findOneAndUpdate({ _id: infected._id }, infected, (error) => {
      if (error) {
        message = `Problem on insert infected on DB. Error: ${error}`;
        logger.error(message);
        return callback(formatReponse(500, message));
      }
      message = 'Relate infected with success!';
      logger.info(message);
      return callback(formatReponse(200, message));
    });
  });
};
