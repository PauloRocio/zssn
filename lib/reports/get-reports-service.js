const survivorsModels = require('../survivors/survivors-models');
const logger = require('winston');
const config = require('../commons/config');
const formatResponse = require('../commons/format-response');

const initalItems = config.get('INITIAL_ITEMS');

function createOjectTotalItems() {
  const totalItems = {};
  Object.keys(initalItems).forEach((currentItem) => {
    totalItems[currentItem] = 0;
  });
  return totalItems;
}

function sumLostPoint(items) {
  return Object.keys(items).reduce((acc, item) =>
    acc + (items[item].quantity * initalItems[item].value), 0);
}

function calcTotalItems(items, totalItems) {
  Object.keys(items).forEach((item) => {
    totalItems[item] += items[item].quantity;
  });
  return totalItems;
}

function calcAverageItems(totalItemsSurvivors, numberOfSurvivors) {
  const itemsPerSurvivor = {};
  Object.keys(totalItemsSurvivors).forEach((item) => {
    itemsPerSurvivor[item] = totalItemsSurvivors[item] / numberOfSurvivors;
  });
  return itemsPerSurvivor;
}

function getReports(survivors, totalItems) {
  const numberOfSurvivors = survivors.length;
  let survivorsNotInfected = 0;
  let survivorsInfected = 0;
  let lostPoints = 0;
  let averageItems = 0;
  let totalItemsSurvivors = 0;
  const response = {};

  survivors.forEach((survivor) => {
    if (survivor.isInfected) {
      survivorsInfected += 1;
      lostPoints += sumLostPoint(survivor.items);
    } else {
      survivorsNotInfected += 1;
      totalItemsSurvivors = calcTotalItems(survivor.items, totalItems);
    }
  });
  averageItems = calcAverageItems(totalItemsSurvivors, numberOfSurvivors);
  response.averageItemsPerSurvivors = averageItems;
  response.lostPoints = lostPoints;
  response.survivorsInfected = survivorsInfected;
  response.survivorsNotInfected = survivorsNotInfected;
  return response;
}
module.exports = (callback) => {
  const totalItems = createOjectTotalItems();
  let message;

  survivorsModels.find({}, {}, (err, survivors) => {
    if (err) {
      message = `Problem on find data on DB. Error: ${err}`;
      logger.error(message);
      return callback(formatResponse(200, message));
    }
    if (survivors.length === 0) {
      message = 'Not found survivors';
      logger.error(message);
      return callback(formatResponse(404, message));
    }
    const response = getReports(survivors, totalItems);
    message = response;
    logger.error('Report created with success');
    return callback(formatResponse(200, message));
  });
};
