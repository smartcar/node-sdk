'use strict';

const util = require('util');

const append = function(message) {
  return message ? `: ${message}` : '';
};

/** @exports errors */
const errors = {};

/**
 * Superclass for all sdk errors.
 *
 * @extends Error
 * @param message - an error description to set
 */
errors.SmartcarError = function(message) {
  this.name = 'smartcar_error';
  this.message = message ? String(message) : 'Unexpected server error';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.SmartcarError, Error);

/**
 * Error thrown by request validation.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.ValidationError = function(message) {
  this.name = 'validation_error';
  this.statusCode = 400;
  /* istanbul ignore next */
  this.message = message || 'Invalid or missing request parameters';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ValidationError, errors.SmartcarError);

/**
 * Error thrown by an invalid parameter when authenticating.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.AuthenticationError = function(message) {
  this.name = 'authentication_error';
  this.statusCode = 401;
  this.message = message;
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.AuthenticationError, errors.SmartcarError);

/**
 * Error thrown due to insufficient permissions.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.PermissionError = function(message) {
  this.name = 'permission_error';
  this.statusCode = 403;
  this.message = 'Insufficient permissions to access requested resource' +
                  append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.PermissionError, errors.SmartcarError);

/**
 * Error thrown when the requested resource is not found.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.ResourceNotFoundError = function(message) {
  this.name = 'resource_not_found_error';
  this.statusCode = 404;
  this.message = 'The requested resource was not found' +
                  append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ResourceNotFoundError, errors.SmartcarError);

/**
 * Error thrown when the vehicle is not capable of performing the request in
 * the current vehicle state.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 * @param code - a vehicle state error code (https://smartcar.com/docs/api#errors)
 */
errors.VehicleStateError = function(message, code) {
  this.name = 'vehicle_state_error';
  this.statusCode = 409;
  this.message = message;
  this.code = code;
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.VehicleStateError, errors.SmartcarError);

/**
 * Error thrown when an application makes too many requests and is throttled.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.RateLimitingError = function(message) {
  this.name = 'rate_limiting_error';
  this.statusCode = 429;
  this.message = 'The application has sent too many requests ' +
                 "and cannot be served due to the application's " +
                 'rate limit being exhausted' + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.RateLimitingError, errors.SmartcarError);

/**
 * Error thrown when an application requests more resources than its allowed
 * limit, e.g., gone over their allotted monthly request limit.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.MonthlyLimitExceeded = function(message) {
  this.name = 'monthly_limit_exceeded';
  this.statusCode = 430;
  this.message = 'The application has exceeded its monthly limit. ' +
                 'Please upgrade the billing plan on the account ' +
                 'dashboard' + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.MonthlyLimitExceeded, errors.SmartcarError);

/**
 * Error thrown when the server throws an unexpected error.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.ServerError = function(message) {
  this.name = 'server_error';
  this.statusCode = 500;
  this.message = 'Unexpected server error' + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ServerError, errors.SmartcarError);

/**
 * Error thrown when vehicle is not capable of performing the request.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.VehicleNotCapableError = function(message) {
  this.name = 'vehicle_not_capable_error';
  this.statusCode = 501;
  this.message =
    'Vehicle is not capable of performing request' + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.VehicleNotCapableError, errors.SmartcarError);

/**
 * Error thrown when Smartcar is not capable of performing the request.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.SmartcarNotCapableError = function(message) {
  this.name = 'smartcar_not_capable_error';
  this.statusCode = 501;
  this.message = message;
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.SmartcarNotCapableError, errors.SmartcarError);

/**
 * Error thrown when gateway to Smartcar times out
 *
 * @param message - an error description to set
 */
errors.GatewayTimeoutError = function(message) {
  this.name = 'smartcar_gateway_timeout_error';
  /* istanbul ignore next */
  this.message = message || 'ELB threw a 504.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.GatewayTimeoutError, errors.SmartcarError);

/**
 * Enhanced errors from API v2.0
 * Please see our [link]{@link https://smartcar.com/docs/errors/v2.0/billing} to see a list of all the possible error types and codes
 *
 * @param {Object|String} error - response body from a v2.0 request
 */
errors.SmartcarErrorV2 = class extends errors.SmartcarError {
  constructor(error) {
    if (typeof error === 'string') {
      super(error);
      this.description = error;
      this.name = 'SmartcarErrorV2';
      return;
    } else {
      super(`${error.type}:${error.code} - ${error.description}`);
    }
    this.name = 'SmartcarErrorV2';

    /**
     * Type of error
     * @type {string}
     * @public
     */
    this.type = error.type;
    /**
     * Error code
     * @type {string}
     * @public
     */
    this.code = error.code;
    /**
     * Description of meaning of the error
     * @type {string}
     * @public
     */
    this.description = error.description;
    /**
     * HTTP status code
     * @type {number}
     * @public
     */
    this.statusCode = error.statusCode;
    /**
     * Unique identifier for request
     * @type {string}
     * @public
     */
    this.requestId = error.requestId;
    /**
     * Possible resolution for fixing the error
     * @type {string}
     * @public
     */
    this.resolution = error.resolution;
    /**
     * Reference to Smartcar documentation
     * @type {string}
     * @public
     */
    this.docURL = error.docURL;
    /**
     * Further detail about the error
     * @type {object[]}
     * @public
     */
    this.detail = error.detail;
  }
};

module.exports = errors;
