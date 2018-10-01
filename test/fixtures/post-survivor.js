const Chance = require('chance');

const chance = new Chance();

module.exports = (data = {}) => ({
  name: data.name || chance.name(),
  age: data.age || chance.age(),
  gender: data.gender || chance.gender(),
  location: {
    latitude: data.latitude || chance.latitude(),
    longitude: data.longitude || chance.longitude()
  }
});
