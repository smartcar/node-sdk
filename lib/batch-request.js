'use strict';

const util = require('./util');
const _ = require('lodash');

/** @exports Vehicle */

/**
 * @param {Object} response
 *
 * @return {Date|null} A parsed age or null if no age exists
 */
const parseAge = function(response) {
  const age = _.get(response, 'headers.sc-data-age', null);
  return age ? new Date(age) : null;
};

/**
 * Initializes a new BatchRequest to use for making
 * batch requests to the Smartcar API.
 *
 * @constructor
 * @param {String} id - The vehicle's unique identifier. Retrieve a user's
 * vehicle id using {@link module:smartcar.getVehicleIds}.
 * @param {String} token - A valid access token
 * @param {String} [unitSystem=metric] - The unit system to use for vehicle data
 * , must be either `metric` or `imperial`.
 */
function BatchRequest(defaultHeaders) {
  this.headers = defaultHeaders;
  this.requests = [];
}

/**
 * Update the unit system to use in requests to the Smartcar API.
 *
 * @param {Object} headerObject - The unit system to use, must be either `metric`
 * or `imperial`.
 * @param {Object} headerObject.headers -
 * @param {String} headerObject.headers.unitSystem -
 */
BatchRequest.prototype.addRequest = function(path, {headers}) {
  this.requests.push({
    path,
    headers,
  });
};

module.exports = BatchRequest;
