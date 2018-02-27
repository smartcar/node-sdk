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
  this.message = message || 'Invalid or missing request parameters';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ValidationError, errors.SmartcarError);

/**
 * Error thrown by an invalid or expired token.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.AuthenticationError = function(message) {
  this.name = 'authentication_error';
  this.statusCode = 401;
  this.message = 'Invalid or expired token provided' +
                  append(message);
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
 */
errors.VehicleStateError = function(message) {
  this.name = 'vehicle_state_error';
  this.statusCode = 409;
  this.message = 'Vehicle is not capable of performing request in ' +
                 'current state' + append(message);
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
 * Error thrown when vehicle is not capable of performing the method.
 *
 * @extends SmartcarError
 * @param message - an error description to set
 */
errors.NotCapableError = function(message) {
  this.name = 'not_capable_error';
  this.statusCode = 501;
  this.message = 'Vehicle is not capable of performing request' +
                  append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.NotCapableError, errors.SmartcarError);

/**
 * Error thrown when gateway to Smartcar times out
 *
 * @param message - an error description to set
 */
errors.GatewayTimeoutError = function(message) {
  this.name = 'smartcar_gateway_timeout_error';
  this.message = message || 'ELB threw a 504.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.GatewayTimeoutError, errors.SmartcarError);

module.exports = errors;
