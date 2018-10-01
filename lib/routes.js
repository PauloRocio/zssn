const survivors = require('./survivors');
const infected = require('./infected/post-infected-controller');
const changeItems = require('./items/change-items-controller');
const location = require('./location/location-controller');
const reports = require('./reports/get-reports-controller');
const validateEntryData = require('./commons/validate-entry-data');

module.exports = (app) => {
  app.post('/survivors', validateEntryData, survivors.postSurvivorController);
  app.post('/infected/', validateEntryData, infected);
  app.post('/changeitems', validateEntryData, changeItems);
  app.patch('/locations/:name', validateEntryData, location);
  app.get('/reports', validateEntryData, reports);
};
