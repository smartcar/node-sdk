'use strict';

const Joi = require('joi');

const errors = require('./errors');

const validators = {schemas: {}};

validators.schemas.requestData = Joi.object().keys({
  clientId: Joi.string().guid({
    version: [
      'uuidv4',
    ],
  }).required(),
  clientSecret: Joi.string().guid({
    version: [
      'uuidv4',
    ],
  }).required(),
  redirectUri: Joi.string().uri().required(),
  scope: Joi.array().items(Joi.string()),
  development: Joi.boolean(),
});

validators.validateRequestData = function(req) {
  try {
    Joi.assert(req, validators.schemas.requestData);
  } catch (err) {
    throw new errors.ValidationError(err);
  }
};

module.exports = validators;
