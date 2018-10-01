const updateLocationServices = require('./location-services');

module.exports = (req, res) => {
  const body = req.body;
  const survivorName = req.params.name;

  updateLocationServices(body, survivorName, response =>
    res.status(response.statusCode).send(response.message));
};
