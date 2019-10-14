'use strict';

const Joi = require('joi');

const {ValidationError} = require('./errors');

const schema = Joi.object().keys({
  'sc-unit-system': Joi.string().required(),
});
const validateHeaders = (headers) => {
  const {error} = schema.validate(headers);

  if (error) {
    throw new ValidationError(error.message);
  }
};

/** @exports BatchRequest */

/**
 * Note: Batch request is a pro feature and will not work if your user account
 * does not have the correct permissions.
 *
 * @param {Object} defaultHeaders - Default headers for batch requests
 *
 * @description - Builds a single request object to be passed into the Vehicle
 * class to allow submitting multiple requests to different endpoints.
 *
 * @constructor
 * @return {Object}
 */

function BatchRequest(defaultHeaders) {
  validateHeaders(defaultHeaders);
  this.defaultHeaders = defaultHeaders;
  this.requests = [];
}

/**
 * @param {String} path - The Smartcar endpoint to retrieve data from
 * @param {Object} headers - Optional headers to be passed in. You may use
 * the Smartcar [headers](https://smartcar.com/docs/api#headers) as a default
 *
 * @example
 * ('/location', headers);
 * @return {Object} A batch request object
 */

BatchRequest.prototype.addRequest = function(path, headers = null) {
  const request = {path};
  if (headers) {
    validateHeaders(headers);
    request.headers = headers;
  }

  this.requests.push(request);
};

module.exports = BatchRequest;
