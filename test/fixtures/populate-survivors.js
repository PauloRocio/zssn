const survivorsModels = require('../../lib/survivors/survivors-models');

module.exports = (data, callback) => {
  survivorsModels.insertOne(data, callback);
};
