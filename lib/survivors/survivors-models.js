const logger = require('winston');
const db = require('../commons/db');
const validation = require('../validation');

const SURVIVORS_COLLECTION_NAME = 'survivors';

const survivorsModel = {};

survivorsModel.find = (query, options, callback) => {
  const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  survivors.find(query, options).toArray(callback);
};

survivorsModel.findOne = (query, callback) => {
  const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  survivors.findOne(query, callback);
};

survivorsModel.findOneAndUpdate = (query, $set, callback) => {
  const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  survivors.findOneAndUpdate(query, $set, callback);
};

survivorsModel.bulkWrite = (query, callback) => {
  const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
  survivors.bulkWrite(query, callback);
};

survivorsModel.insertOne = (model, callback) => {
  const result = validation.validate(model, SURVIVORS_COLLECTION_NAME);
  if (result.valid) {
    const survivors = db.getCollection(SURVIVORS_COLLECTION_NAME);
    survivors.insertOne(model, (err, insertResult) => {
      if (err) {
        return callback(err);
      }
      callback(null, insertResult.ops[0]);
    });
  } else {
    logger.info('Survivor is not valid: ', model, validation.formatErrorMessage(result));
    return callback(validation.getErrorMessages(result));
  }
};

module.exports = survivorsModel;
