const survivorsModels = require('./survivors-models');
const config = require('../commons/config');

const initialItems = config.get('INITIAL_ITEMS');

module.exports = (body, callback) => {
  const survivor = body;
  survivor.location.timestamp = new Date();
  survivor.items = initialItems;
  survivor.isInfected = false;
  survivor.created = new Date();
  survivor.traceLocation = [body.location];
  survivor.traceRelateInfected = [];
  survivor.countInfected = 0;

  survivorsModels.insertOne(survivor, callback);
};
