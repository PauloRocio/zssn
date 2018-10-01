const validation = require('../validation');
const logger = require('winston');

module.exports = (req, res, next) => {
  const body = req.body;
  const urlName = req.path.split('/')[1];
  const validationResult = validation.validate(body, urlName);

  if (!validationResult.valid) {
    const validationError = validation.formatErrorMessage(validationResult);
    logger.error(`Bad Request on post survivor. Body:${JSON.stringify(body)}.
    ErrorMessage: ${validationError}`);
    return res.status(400).send(validationError.toString());
  }
  return next();
};
