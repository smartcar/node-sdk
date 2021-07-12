
'use strict';

const _ = require('lodash');
const requestPromise = require('request-promise');
const config = require('./config');
const util = require('./util');
const HEADER_TO_META_KEYS = {
  'sc-data-age': 'dataAge',
  'sc-unit-system': 'unitSystem',
  'sc-request-id': 'requestId',
};


const buildMeta = (headers) => {
  const lowerCaseHeaders = _.mapKeys(
    headers,
    (_, key) => key.toLocaleLowerCase()
  );
  const meta = {};
  Object.entries(HEADER_TO_META_KEYS).forEach(([headerName, key]) => {
    if (lowerCaseHeaders[headerName]) {
      meta[key] = lowerCaseHeaders[headerName];
    }
  });
  if (meta.dataAge) {
    meta.dataAge = new Date(meta.dataAge);
  }

  return meta;
};

const getNameFromPath = (path) => {
  // Using this constant just for the ones with nested path.
  const BATCH_PATH_TO_ATTRIBUTE = {
    '/battery/capacity': 'batteryCapacity',
    '/engine/oil': 'engineOil',
    '/tires/pressure': 'tirePressure',
    '/': 'attributes',
  };
  if (BATCH_PATH_TO_ATTRIBUTE[path]) {
    return BATCH_PATH_TO_ATTRIBUTE[path];
  }

  // For non nested path, it is just everything after '/'
  return path.replace('/', '');
};
const buildBatchResponse = (body, headers) => {
  const batchResponse = {};
  body.responses.forEach((response) => {
    const attributeName = getNameFromPath(response.path);
    if ([200, 204].includes(response.code)) {
      batchResponse[attributeName] = () => {
        return {
          ...(response.body || {}),
          meta: buildMeta({
            ...headers,
            ...response.headers,
          }),
        };
      };
    } else {
      batchResponse[attributeName] = () => {
        util.handleError({
          statusCode: response.code,
          response: {
            body: response.body,
            headers: {
              ...headers,
              ...response.headers,
            },
          },
        });
      };
    }
  });
  return batchResponse;
};
/**
 * Initializes a new Service object to make requests to the Smartcar API.
 *
 * @constructor
 * @param {Object} [options]
 * @param {String} [options.baseUrl] - Host/Base URL for the requests
 * @param {Object} [options.auth] - authorization options
 * @param {Object} [options.headers] - headers to add
 */
function SmartcarService(options = {}) {
  const defaultOptions = {
    json: true,
    headers: {
      'User-Agent': util.USER_AGENT,
    },
    timeout: config.timeout,
  };
  this.requestObject = requestPromise.defaults(
    _.merge(defaultOptions, options),
  );
}

SmartcarService.prototype.request = async function(
  type,
  path,
  body = {},
  options = {},
) {
  body.resolveWithFullResponse = true;
  const response = await util.wrap(
    this.requestObject.defaults(options)[type](path, body),
  );

  return {
    ...(response.body || {}),
    meta: buildMeta(response.headers),
  };
};

SmartcarService.prototype.batchRequest = async function(paths) {
  const requests = paths.map((path) => ({path}));
  const response = await util.wrap(
    this.requestObject.post('batch', {
      body: {requests},
      resolveWithFullResponse: true,
    }),
  );

  return buildBatchResponse(response.body, response.headers);
};

module.exports = SmartcarService;
