const createSurvivor = require('./create-survivor');
const bodyPostSurvivor = require('./post-survivor');
const bodyPostInfected = require('./post-infected');
const bodyPostchangeItems = require('./post-items');
const bodyPatchcLocation = require('./patch-location');
const populateSurvivors = require('./populate-survivors');

module.exports = {
  createSurvivor,
  bodyPostSurvivor,
  bodyPostInfected,
  bodyPostchangeItems,
  bodyPatchcLocation,
  populateSurvivors
};
