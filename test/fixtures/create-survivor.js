const Chance = require('chance');

const chance = new Chance();

module.exports = (data = {}) => {
  const location = {
    latitude: data.latitude || chance.latitude(),
    longitude: data.longitude || chance.longitude(),
    timestamp: new Date()
  };
  const result = {
    name: data.name || chance.name(),
    age: data.age || chance.age(),
    gender: data.gender || chance.gender(),
    location,
    items: {
      water: {
        quantity: data.waterQuantity || 1,
        value: data.waterValue || 4
      },
      food: {
        quantity: data.foodQuantity || 1,
        value: data.foodValue || 3
      },
      medication: {
        quantity: data.medicationQuantity || 1,
        value: data.medicationValue || 2,
      },
      ammunition: {
        quantity: data.ammunitionQuantity || 1,
        value: data.ammunitionValue || 1
      }
    },
    isInfected: data.isInfected || false,
    created: new Date(),
    traceLocation: [location],
    traceRelateInfected: data.traceRelateInfected || [],
    countInfected: data.countInfected || 0
  };
  return result;
};
