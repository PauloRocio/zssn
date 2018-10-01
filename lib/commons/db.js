const config = require('./config');
const { MongoClient } = require('mongodb');
const async = require('async');
const logger = require('winston');

const dbUrl = config.get('MONGO_URL');
const dbUrlTest = config.get('MONGO_URL_TEST');
let url;
let db;
const Database = {};
const self = Database;
const collections = [];

Database.connect = (env, callback) => {
  if (db) {
    callback(null, db);
    return;
  }
  if (!env || env !== 'test') {
    url = dbUrl;
  } else {
    url = dbUrlTest;
  }

  MongoClient.connect(url, (err, idb) => {
    if (err) {
      throw new Error(err);
    }
    db = idb;
    if (callback) {
      callback(null, db);
    }
  });
};

Database.getCollection = (collectionName) => {
  let collection = collections[collectionName];

  if (!collection) {
    collection = db.collection(collectionName);
    collections[collectionName] = collection;
  }

  return collection;
};

Database.dropCollections = (...theArgs) => {
  const lastIndex = theArgs.length - 1;
  const collectionsToDrop = [];
  let done;

  for (let i = 0; i < theArgs.length; i += 1) {
    const arg = theArgs[i];
    if (i === lastIndex && typeof arg === 'function') {
      done = arg;
    } else {
      const collection = self.getCollection(arg);
      if (collection) {
        collectionsToDrop.push(collection);
      }
    }
  }

  if (done) {
    async.each(collectionsToDrop, (collectionDrop, callback) => {
      collectionDrop.drop(() => {
        callback();
      });
    }, done);
  }
};

Database.close = (callback) => {
  logger.info('[MongoDB] Database trying to disconnect');

  if (db) {
    db.close((err) => {
      if (err) {
        logger.error('[MongoDB] Error closing database');
      }
      callback(err);
    });
  }
};

module.exports = Database;
