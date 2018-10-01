const Chance = require('chance');

const chance = new Chance();

module.exports = (data = {}) => ({
  firstSurvivor: {
    name: data.firstName || chance.name(),
    itemsChange: [
      {
        nameItem: data.firstItem || 'water',
        quantity: data.firstQuantity || 1
      }
    ]
  },
  secondSurvivor: {
    name: data.secondName || chance.name(),
    itemsChange: [
      {
        nameItem: data.secondItem || 'medication',
        quantity: data.secondQuantity || 2
      }
    ]
  }
});
