const reportsServices = require('./get-reports-service');

module.exports = (req, res) => {
  reportsServices(result => res.status(result.statusCode).send(result.message));
};
