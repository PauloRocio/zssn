const Chance = require('chance');

const chance = new Chance();

module.exports = (data = {}) => ({
  latitude: data.latitude || chance.latitude(),
  longitude: data.longitude || chance.longitude()
});
