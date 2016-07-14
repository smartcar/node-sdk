'use strict';
var util = require('util');

var errors = {};
errors.SmartcarError = function(message){
  this.name = 'smartcar_api_error';
  this.message = message || 'Unexpected error occurred';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.SmartcarError, Error);

errors.ValidationError = function(message){
  this.name = 'validation_error';
  this.statusCode = 400;
  this.message = message || 'Invalid or missing request parameters.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ValidationError, errors.SmartcarError);

errors.AuthenticationError = function(message){
  this.name = 'authentication_error';
  this.statusCode = 401;
  this.message = message || 'Invalid or expired token provided';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.AuthenticationError, errors.SmartcarError);

errors.PermissionError = function(message){
  this.name = 'permission_error';
  this.statusCode = 403;
  this.message = message || 'Insufficient permissions to access requested resource.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.PermissionError, errors.SmartcarError);

errors.ResourceNotFoundError = function(message){
  this.name = 'resource_not_found_error';
  this.statusCode = 404;
  this.message = message || 'The requested resource was not found.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ResourceNotFoundError, errors.SmartcarError);

errors.StateError = function(message){
  this.name = 'vehicle_state_error';
  this.statusCode = 409;
  this.message = message || 'Vehicle is not capable of performing request in current state.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.StateError, errors.SmartcarError);

errors.RateLimitingError = function(message){
  this.name = 'rate_limiting_error';
  this.statusCode = 429;
  this.message = message || "The application has sent too many requests and cannot be served due to the application's rate limit being exhausted.";
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.RateLimitingError, errors.SmartcarError);

errors.MonthlyLimitExceeded = function(message){
  this.name = 'monthly_limit_exceeded';
  this.statusCode = 430;
  this.message = message || 'The application has exceeded its monthly limit. Please upgrade the billing plan on the account dashboard.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.MonthlyLimitExceeded, errors.SmartcarError);

errors.ServerError = function(message){
  this.name = 'server_error';
  this.statusCode = 500;
  this.message = message || 'Unexpected server error, please try again.';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ServerError, errors.SmartcarError);

errors.NotCapableError = function(message){
  this.name = 'not_capable_error';
  this.statusCode = 501;
  this.message = message || 'Vehicle is not capable of performing request';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.NotCapableError, errors.SmartcarError);

module.exports = errors;
