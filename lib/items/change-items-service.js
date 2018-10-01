const survivorsModels = require('../survivors/survivors-models');
const logger = require('winston');
const config = require('../commons/config');
const formatResponse = require('../commons/format-response');

const itemsValue = config.get('INITIAL_ITEMS');

function sumPointsChange(survivor) {
  return survivor.itemsChange.reduce((acc, item) =>
    acc + (itemsValue[item.nameItem].value * item.quantity), 0);
}

function changeItems(survivors, body) {
  const updatedSurvivor = [];
  survivors.forEach((item) => {
    if (item.name === body.firstSurvivor.name) {
      body.firstSurvivor.itemsChange.forEach((itemsChange) => {
        item.items[itemsChange.nameItem].quantity -= itemsChange.quantity;
      });
      body.secondSurvivor.itemsChange.forEach((itemsChange) => {
        item.items[itemsChange.nameItem].quantity += itemsChange.quantity;
      });
    } else {
      body.secondSurvivor.itemsChange.forEach((itemsChange) => {
        item.items[itemsChange.nameItem].quantity -= itemsChange.quantity;
      });
      body.firstSurvivor.itemsChange.forEach((itemsChange) => {
        item.items[itemsChange.nameItem].quantity += itemsChange.quantity;
      });
    }
    updatedSurvivor.push(item);
  });
  return updatedSurvivor;
}

function verifyHasBalance(survivors, body) {
  let hasBalance = true;
  const listSurvivors = ['firstSurvivor', 'secondSurvivor'];
  survivors.forEach((survivor, index) => {
    body[listSurvivors[index]].itemsChange.forEach((survivorItems) => {
      if (survivor.items[survivorItems.nameItem].quantity < survivorItems.quantity) {
        hasBalance = false;
      }
    });
  });
  return hasBalance;
}

module.exports = (body, callback) => {
  let message;
  const pointsChangeFirstSurvivor = sumPointsChange(body.firstSurvivor);
  const pointsChangeSecondSurvivor = sumPointsChange(body.secondSurvivor);
  if (pointsChangeFirstSurvivor !== pointsChangeSecondSurvivor) {
    message = 'This exchange was not fair.';
    logger.error(message);
    return callback(formatResponse(400, message));
  }
  const query = {
    name: {
      $in: [body.firstSurvivor.name, body.secondSurvivor.name]
    },
    isInfected: false
  };
  survivorsModels.find(query, {}, (err, data) => {
    if (err) {
      message = `Problem on insert survivor on DB. Error: ${err}`;
      logger.error(message);
      return callback(formatResponse(500, message));
    }
    if (data.length !== 2) {
      message = 'Impossible to exchange items';
      logger.error(message);
      return callback(formatResponse(400, message));
    }
    const survivorsHasBalance = verifyHasBalance(data, body);
    if (!survivorsHasBalance) {
      message = 'survivors does not have enough balance to make the exchange';
      logger.error(message);
      return callback(formatResponse(400, message));
    }
    const updatedItemSurvivor = changeItems(data, body);
    const queryUpdate = [
      {
        updateOne: {
          filter: { _id: updatedItemSurvivor[0]._id },
          update: updatedItemSurvivor[0]
        }
      },
      {
        updateOne: {
          filter: { _id: updatedItemSurvivor[1]._id },
          update: updatedItemSurvivor[1]
        }
      }];
    survivorsModels.bulkWrite(queryUpdate, (errorUpdate) => {
      if (errorUpdate) {
        message = 'Change items with error!';
        logger.error(message);
        return callback(formatResponse(500, message));
      }
      message = 'Change items with success!';
      logger.info(message);
      return callback(formatResponse(200, message));
    });
  });
};
