'use strict';

/** @exports SmartcarError */

/**
 * Class to handle all errors from Smartcar API
 * Please see our [error guides]{@link https://smartcar.com/docs} to see a list
 * of all the possible error types and codes of both v2.0 and v1.0 requests.
 * */
class SmartcarError extends Error {

  /**
   * @param {number} status - response status
   * @param {object} body - response body
   * @param {object} headers - response headers
   */
  constructor(status, body, headers) {
    const fields = [
      'type', 'code', 'description', 'docURL', 'detail', 'suggestedUserMessage',
    ];
    if (body.error) {
      body.type = body.error;
    }

    if (!body.description) {
      // `error_description` is for handling oauth.
      if (body.error_description) {
        body.description = body.error_description;
      } else if (body.message) {
        body.description = body.message;
      } else if (typeof body !== 'string') {
        body.description = 'Unknown error';
      }
    }

    if (typeof body === 'string') {
      super(body);
    } else {
      super(`${body.type}:${body.code} - ${body.description}`);
    }

    if (headers['retry-after']) {
      this.retryAfter = headers['retry-after'];
    }

    this.statusCode = status;
    this.requestId = body.requestId || headers['sc-request-id'];
    if (typeof body.resolution === 'string') {
      this.resolution = {
        type: body.resolution,
      };
    } else if (body.resolution !== null
        && typeof body.resolution === 'object') {
      this.resolution = body.resolution;
    }

    // Now dynamically set the remaining ones if passed
    fields.forEach((item) => {
      if (body[item]) {
        this[item] = body[item];
      }
    });

    this.name = 'SmartcarError';
  }
}

/**
 * Legacy field from V1 error depicting a category/type/description
 * of the error.
 * @var {string} SmartcarError.error
 */

/**
 * Error message field inherited from StandardError
 * @var {string} SmartcarError.message
 */

/**
 * Description of meaning of the error.
 * @var {string} SmartcarError.description
 */

/**
 * Type of error
 * @var {string} SmartcarError.type
 */

/**
 * Error code
 * @var {string} SmartcarError.code
 */

/**
 * HTTP status code
 * @var {number} SmartcarError.statusCode
 */

/**
 * Unique identifier for request
 * @var {string} SmartcarError.requestId
 */

/**
 * @type {Object}
 * @typedef SmartcarError.Resolution
 * @property {String} type - Possible hint to fixing the issue
 * @property {String} url - A URL to help resolve the issue or resume the operation
 */

/**
 * Possible resolution for fixing the error
 * @var {SmartcarError.Resolution} SmartcarError.resolution
 */

/**
 * Reference to Smartcar documentation
 * @var {string} SmartcarError.docURL
 */

/**
 * Further detail about the error in form of array of objects
 * @memberof SmartcarError
 *
 * @var {object[]} SmartcarError.details
 */

module.exports = SmartcarError;
