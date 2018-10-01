const Chance = require('chance');

const chance = new Chance();

module.exports = (data = {}) => ({
  survivorName: data.name || chance.name(),
  relateInfected: data.infectedName || chance.name()
});
