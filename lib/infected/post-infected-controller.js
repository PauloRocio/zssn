const relateInfectedServices = require('./post-infected-services');

module.exports = (req, res) => {
  const body = req.body;

  relateInfectedServices(body, response => res.status(response.statusCode).send(response.message));
};
