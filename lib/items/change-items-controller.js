const changeItemsService = require('./change-items-service');

module.exports = (req, res) => {
  const body = req.body;

  changeItemsService(body, result => res.status(result.statusCode).send(result.message));
};
