'use strict';


const _ = require('lodash');
const SmartcarError = require('./smartcar-error');
const config = require('./config.json');
const util = require('./util');
const HEADER_TO_META_KEYS = {
  'sc-data-age': 'dataAge',
  'sc-unit-system': 'unitSystem',
  'sc-request-id': 'requestId',
  'sc-fetched-at': 'fetchedAt',
};


const buildMeta = (headers) => {
  const lowerCaseHeaders = _.mapKeys(
    headers,
    (_, key) => key.toLocaleLowerCase(),
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
  if (meta.fetchedAt) {
    meta.fetchedAt = new Date(meta.fetchedAt);
  }

  return meta;
};

const getNameFromPath = (path) => {
  // Using this constant for edge cases.
  // '/' should have a method name of 'attributes'
  // '/tires/pressure' should be tirePressure and NOT tiresPressure
  const BATCH_PATH_TO_ATTRIBUTE = {
    '/security': 'lockStatus',
    '/tires/pressure': 'tirePressure',
    '/diagnostics/system_status': 'diagnosticSystemStatus',
    '/diagnostics/dtcs': 'diagnosticTroubleCodes',
    '/': 'attributes',
  };
  if (BATCH_PATH_TO_ATTRIBUTE[path]) {
    return BATCH_PATH_TO_ATTRIBUTE[path];
  }

  // For everything else camelCase method from lodash works
  // Examples: '/battery/capacity', '/engine/oil', '/odometer', '/tesla/speedometer'
  // converts to 'batteryCapacity', 'engineOil', 'odometer', 'teslaSpeedometer'
  return _.camelCase(path);
};
const buildBatchResponse = async(res) => {

  const {parsedBody: body, parsedHeaders: headers} = await util.handleRes(res);
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
        util.handleError({body: response.body, headers: response.headers, res});
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
 * @param {Object} [options.apiVersion] - API version to use for requests
 */
function SmartcarService(options = {}) {
  const defaultOptions = {
    json: true,
    headers: {
      'User-Agent': util.USER_AGENT,
      'Content-Type': 'application/json',
    },
    timeout: config.timeout,
  };
  this.baseUrl = options.baseUrl || config.api;
  this.defaultOptions = _.merge(defaultOptions, options);
}

function joinUrl(base, path) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

SmartcarService.prototype.request = async function(
  type,
  path,
  body = null,
  options = {},
) {

  const requestOptions = _.merge(
    {},
    this.defaultOptions,
    options,
  );

  const method = type.toUpperCase();
  const apiVersion = requestOptions.apiVersion || config.version;
  requestOptions.method = method;

  const {qs} = requestOptions;

  const params = new URLSearchParams(qs || {});

  if (body) {
    const formEncoded = 'application/x-www-form-urlencoded';
    if (requestOptions.headers['Content-Type'] === formEncoded) {
      requestOptions.body = new URLSearchParams(body);
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  // eslint-disable-next-line max-len
  const requestPath = joinUrl(this.baseUrl, path) + (params.toString() ? `?${params.toString()}` : '');

  const newRequest = new Request(requestPath, requestOptions);

  try {
    const res = await fetch(newRequest,
      {signal: AbortSignal.timeout(requestOptions.timeout)},
    );

    const {parsedBody, parsedHeaders} = await util.handleRes(res);

    if (!res.ok) {
      util.handleError({body: parsedBody, headers: parsedHeaders, res});
    }

    if (Array.isArray(parsedBody)) {
      return {
        data: parsedBody,
        meta: apiVersion === '3' ? parsedHeaders : buildMeta(parsedHeaders),
      };
    } else {
      return {
        ...(parsedBody || {}),
        meta: apiVersion === '3' ? parsedHeaders : buildMeta(parsedHeaders),
      };
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new SmartcarError(
        408,
        'Request timed out',
        {'content-type': 'application/json'},
      );
    }
    throw error;
  }
};

SmartcarService.prototype.batchRequest = async function(paths) {
  const requests = paths.map((path) => ({path}));

  const requestPath = joinUrl(this.baseUrl, '/batch');


  const requestOptions = {
    method: 'POST',
    ...this.defaultOptions,
    body: JSON.stringify({requests}),
  };

  const newRequest = new Request(requestPath, requestOptions);

  try {
    const res = await fetch(newRequest,
      {signal: AbortSignal.timeout(requestOptions.timeout)},
    );

    if (!res.ok) {
      const {parsedBody, parsedHeaders} = await util.handleRes(res);
      util.handleError({body: parsedBody, headers: parsedHeaders, res});
    }

    return buildBatchResponse(res);
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new SmartcarError(
        408,
        'Request timed out',
        {'content-type': 'application/json'},
      );
    }
    throw error;

  }

};

module.exports = SmartcarService;
