const tv4 = require('tv4');
const usersModelSchema = require('./schema-models/users-model-schema.json');
const postSurvivorSchema = require('./schemas/post-survivor-schema.json');
const postInfectedSchema = require('./schemas/post-infected-schema.json');
const postChangeItemsSchema = require('./schemas/post-change-items-schema.json');
const patchLocation = require('./schemas/patch-location-schema.json');

const Validator = {};
const self = Validator;

tv4.addSchema(postSurvivorSchema);
tv4.addSchema(usersModelSchema);
tv4.addSchema(postInfectedSchema);
tv4.addSchema(postChangeItemsSchema);
tv4.addSchema(patchLocation);

Validator.getErrorMessages = (result) => {
  const errors = [];
  result.errors.forEach((error) => {
    errors.push(error.message);
  });
  return errors;
};

Validator.formatErrorMessage = (result) => {
  const errors = self.getErrorMessages(result);
  return `${errors.join('.\n')}.`;
};

Validator.validate = (json, schemaId) => tv4.validateMultiple(json, schemaId);

module.exports = Validator;
