'use strict';

var util = require('util');

var append = function(message){
  return message 
    ? ': ' + message 
    : '';
}

var errors = {};
errors.SmartcarError = function(message){
  this.name = 'SmartcarError';
  this.message = message || 'Unexpected server error';
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.SmartcarError, Error);

errors.ValidationError = function(message){
  this.name = 'ValidationError';
  this.statusCode = 400;
  this.message = 'Invalid or missing request parameters' + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ValidationError, errors.SmartcarError);

errors.AuthenticationError = function(message){
  this.name = 'AuthenticationError';
  this.statusCode = 401;
  this.message = "Invalid or expired token provided" + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.AuthenticationError, errors.SmartcarError);

errors.PermissionError = function(message){
  this.name = 'PermissionError';
  this.statusCode = 403;
  this.message = "Insufficient permissions to access requested resource" + 
                  append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.PermissionError, errors.SmartcarError);

errors.ResourceNotFoundError = function(message){
  this.name = "ResourceNotFoundError";
  this.statusCode = 404;
  this.message = "The requested resource was not found" + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ResourceNotFoundError, errors.SmartcarError);

errors.StateError = function(message){
  this.name = "StateError";
  this.statusCode = 409;
  this.message = "Vehicle is not capable of performing request in current state" +
                  append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.StateError, errors.SmartcarError);

errors.RateLimitingError = function(message){
  this.name = "RateLimitingError";
  this.statusCode = 429;
  this.message = "The application has sent too many requests and cannot be " +
  "served due to the application's rate limit being exhausted" + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.RateLimitingError, errors.SmartcarError);

errors.MonthlyLimitExceeded = function(message){
  this.name = "MonthlyLimitExceeded";
  this.statusCode = 430;
  this.message = "The application has exceeded its monthly limit. " + 
  "Please upgrade the billing plan on the account dashboard" + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.MonthlyLimitExceeded, errors.SmartcarError);

errors.ServerError = function(message){
  this.name = "ServerError";
  this.statusCode = 500;
  this.message = "Unexpected server error" + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.ServerError, errors.SmartcarError);

errors.NotCapableError = function(message){
  this.name = "NotCapableError";
  this.statusCode = 501;
  this.message = "Vehicle is not capable of performing request" + append(message);
  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.NotCapableError, errors.SmartcarError);

module.exports = errors;
