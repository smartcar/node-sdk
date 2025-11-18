'use strict';

const util = require('./util');
const _ = require('lodash');

const SmartcarService = require('./smartcar-service');
const config = require('./config.json');

/**
 * @const {object<String, Object>} - Every key here is the function name on vehicle
 * This map is used to generate the methods dynamically. Every value is an object of
 * the following fields :
 * - requestType: http request type, defaults to 'get' if not mentioned.
 * - path: url path to hit, defaults to the method name
 * - body: body for post requests.
 */
const METHODS_MAP = {
  vin: {},
  charge: {},
  battery: {},
  batteryCapacity: {path: 'battery/capacity'},
  nominalCapacity: {path: 'battery/nominal_capacity'},
  fuel: {},
  tirePressure: {path: 'tires/pressure'},
  engineOil: {path: 'engine/oil'},
  odometer: {},
  location: {},
  attributes: {path: '/'},
  permissions: {},
  lock: {requestType: 'post', path: 'security', body: {action: 'LOCK'}},
  unlock: {requestType: 'post', path: 'security', body: {action: 'UNLOCK'}},
  startCharge: {requestType: 'post', path: 'charge', body: {action: 'START'}},
  stopCharge: {requestType: 'post', path: 'charge', body: {action: 'STOP'}},
  disconnect: {requestType: 'delete', path: 'application'},
  lockStatus: {path: 'security'},
  sendDestination: {path: 'navigation/destination'},
  serviceHistory: {},
  diagnosticSystemStatus: {path: 'diagnostics/system_status'},
  diagnosticTroubleCodes: {path: 'diagnostics/dtcs'},
};

/** @exports Vehicle */
/**
 * Initializes a new Vehicle to use for making requests to the Smartcar API.
 *
 * @constructor
 * @param {String} id - The vehicle's unique identifier. Retrieve a user's
 * vehicle id using {@link module:smartcar.getVehicles}.
 * @param {String} token - A valid access token
 * @param {Object} [options]
 * @param {String} [options.unitSystem=metric] - The unit system to use for vehicle data
 * must be either `metric` or `imperial`.
 * @param {Object} [options.version] - API version to use
 * @param {Object} [options.flags] - Object of flags where key is the name of the flag
 * and value is string or boolean value.
 */
function Vehicle(id, token, options = {}) {
  this.id = id;
  this.token = token;
  this.unitSystem = options.unitSystem || 'metric';
  this.version = options.version || config.version;
  this.query = {};
  if (options.flags) {
    this.query.flags = util.getFlagsString(options.flags);
  }


  this.service = new SmartcarService({
    baseUrl: util.getUrl(this.id, '', this.version),
    headers: {
      'sc-unit-system': this.unitSystem,
      Authorization: `Bearer ${this.token}`,
    },
    qs: this.query,
  });
}

/* NOTES :
  - We only generate the methods where there is no parameter for calling the method thats
    the majority. For all the ones that require parameters, write them separately.
    Ex. permissions, subscribe, unsubscribe
  - The following snippet generates methods dynamically , but if we are adding a new item,
    make sure we also add the JSDOC for it. These are at the end of the file in a section.
*/

_.forEach(METHODS_MAP, (attributes, methodName) => {
  Vehicle.prototype[methodName] = async function() {
    let bodyObject = null;
    if (attributes.body) {
      bodyObject = attributes.body;
    }
    const response = await this.service.request(
      attributes.requestType || 'get',
      attributes.path ?? methodName,
      bodyObject,
    );
    return response;
  };
});

/**
 * @type {Object}
 * @typedef Permissions
 * @property {String[]} permissions - An array of permissions names.
 * @property {Object} [paging]
 * @property {Number} [paging.count] - The total number of elements for the entire query
 * (not just the given page).
 * @property {Number} [options.offset] - The current start index of the returned list of elements.
 * @property {Meta} meta
 *
 * @example
 * {
 *   permissions: ['read_vehicle_info'],
 *   paging: {
 *      count: 25,
 *      offset: 10
 *   },
 *   meta: {
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *   }
 * }
 */

/**
 * Fetch the list of permissions that this application has been granted
 * @async
 * @method
 * @param {Object} [paging]
 * @param {String} [paging.limit] - number of permissions to return
 * @param {Object} [options.offset] - The current start index of the returned list of elements.
 * @returns {Promise<Permissions>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.permissions = async function(paging = {}) {
  const response = await this.service.request(
    'get',
    'permissions',
    null,
    {qs: paging},
  );
  return response;
};


/**
 * @typedef DiagnosticSystemStatus
 * @type {Object}
 * @property {string} systemId - The identifier for the vehicle's system.
 * @property {string} status - The status of the system, either 'OK' or 'ALERT'.
 * @property {string|null} description - Additional details about the system's status, if any.
 */

/**
 * @typedef DiagnosticSystemStatusResponse
 * @type {Object}
 * @property {DiagnosticSystemStatus[]} systems - An array of diagnostic system statuses.
 * @property {Meta} meta - Metadata about the request.
 */

/**
 * Fetches diagnostic system status information for the vehicle.
 * @async
 * @method
 * @memberof Vehicle
 * @returns {Promise<DiagnosticSystemStatusResponse>} -
 * The response containing diagnostic system statuses.
 * @throws {SmartcarError} - an instance of SmartcarError.
 * See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 * for all possible errors.
 *
 * @example
 * {
 *   "systems": [
 *     {
 *       "systemId": "SYSTEM_TPMS",
 *       "status": "ALERT",
 *       "description": "Left rear tire sensor battery low"
 *     },
 *     {
 *       "systemId": "SYSTEM_AIRBAG",
 *       "status": "OK",
 *       "description": null
 *     },
 *     {
 *       "systemId": "SYSTEM_ABS",
 *       "status": "ALERT",
 *       "description": null
 *     },
 *     // Additional diagnostic systems
 *   ]
 * }
 */
Vehicle.prototype.diagnosticSystemStatus = async function() {
  const response =
    await this.service.request('get', 'diagnostics/system_status');
  return response;
};

/**
 * @typedef {Object} DiagnosticTroubleCode
 * @property {string} code - The diagnostic trouble code identifier.
 * @property {string|null} timestamp -ISO 8601 formatted timestamp
 * indicating when the code was triggered, may be null if not available.
 */

/**
 * @type {Object}
 * @typedef DiagnosticTroubleCodesResponse
 * @property {DiagnosticTroubleCode[]} activeCodes - An array of active diagnostic trouble codes.
 * @property {Meta} meta
 */

/**
 * Fetches active diagnostic trouble codes (DTCs) for the vehicle.
 * @async
 * @method
 * @memberof Vehicle
 * @returns {Promise<DiagnosticTroubleCodesResponse>} - The response containing active
 * diagnostic trouble codes.
 * @throws {SmartcarError} - If there is an error with the API request.
 *
 * @example
 * {
 *   "activeCodes": [
 *     {
 *       "code": "P302D",
 *       "timestamp": "2024-09-05T14:48:00.000Z"
 *     },
 *     {
 *       "code": "P303D",
 *       "timestamp": null
 *     },
 *     // Additional codes as needed
 *   ]
 * }
 */
Vehicle.prototype.diagnosticTroubleCodes = async function() {
  const response =
    await this.service.request('get', 'diagnostics/dtcs');
  return response;
};

/**
 * @type {Object}
 * @typedef ServiceHistory
 * @property {Number|null} serviceID - The unique identifier for the service record,
 * or null if not available.
 * @property {String} serviceDate - The date and time the service was performed.
 * @property {Number} odometerDistance - The odometer reading at the time of service,
 * in miles or kilometers based on the unit system.
 * @property {Array.<ServiceTask>} serviceTasks - A list of tasks performed during the service.
 * @property {ServiceDetails} serviceDetails - Details about the service
 * provider and the type of service.
 * @property {ServiceCost} serviceCost - The cost of the service with currency.
 * @property {Meta} meta - Metadata related to the service record.
 *
 * @example
 * [
 *   {
 *     serviceId: 12345,
 *     serviceDate: "2022-07-10T16:20:00.000Z",
 *     odometerDistance: 50000,
 *     serviceTasks: [
 *       {
 *         taskId: 01,
 *         taskDescription: "oil change"
 *       }
 *     ],
 *     serviceDetails: {
 *       type: "dealership"  // "manual_entry" could be another possible value
 *     },
 *     serviceCost: {
 *       totalCost: 100,
 *       currency: 'USD'
 *     },
 *     meta: {
 *       dataAge: new Date('2023-04-30T07:20:50.844Z'),
 *       unitSystem: 'imperial',
 *       requestId: 'b3c14915-0c26-43c5-8e42-9edfc2a66b2f',
 *       fetchedAt: new Date('2023-04-30T07:20:51.844Z'),
 *     }
 *   }
 *   // ... additional service records
 * ]
 */

/**
 * @async
 * @name Vehicle#serviceHistory
 * @function
 * @memberof Vehicle
 * @description Returns a list of all the service records performed on the vehicle,
 * filtered by the optional date range. If no dates are specified, records from the
 * last year are returned.
 * @param {String} [startDate] - The start date for the record filter, either in 'YYYY-MM-DD' or
 * 'YYYY-MM-DDTHH:MM:SS.SSSZ' format.
 * @param {String} [endDate] - The end date for the record filter, similar format to startDate.
 * @see {@link https://smartcar.com/docs/api#get-vehicle-service-history|Smartcar API Doc - Vehicle Service History}
 * @return {Promise<Array.<ServiceHistory>>}
 * @throws {SmartcarError} - an instance of SmartcarError. See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors) for all possible errors.
 */
Vehicle.prototype.serviceHistory = async function(startDate, endDate) {
  const response = await this.service.request(
    'get',
    'service/history',
    null,
    {
      qs: {
        // eslint-disable-next-line camelcase
        start_date: startDate,
        // eslint-disable-next-line camelcase
        end_date: endDate,
      },
    },
  );
  return response;
};

/**
 * @typedef ChargeLimit
 * @property {number} limit - the charge limit expressed as a decimal value between 0 and 1.
 */

/**
 * Fetch the charge limit for an electric vehicle
 * @async
 * @method
 * @returns {Promise<ChargeLimit>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 *
 * @example
 * {
 *   limit: .7,
 *   meta: {
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *   }
 * }
 */

Vehicle.prototype.getChargeLimit = async function() {
  const response = await this.service.request(
    'get',
    'charge/limit',
  );

  return response;
};

/**
 * Set the charge limit for an electric vehicle.
 * @async
 * @method
 * @param {number} limit - a number between 0 and 1
 * @returns {Promise<ChargeLimit>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 *
 * @example
 * {
 *   status: string,
 *   meta: {
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *   }
 * }
 */
Vehicle.prototype.setChargeLimit = async function(limit) {

  const body = {
    limit: String(limit),
  };

  const response = await this.service.request(
    'post',
    'charge/limit',
    body,
  );

  return response;
};

/**
 * Send a destination to the vehicle's navigation system.
 * @async
 * @method
 * @param {number} latitude - Latitude of the destination. Must be a valid latitude
 *                            value between -90 and 90 (inclusive).
 * @param {number} longitude - Longitude of the destination. Must be a valid longitude
 *                             value between -180 and 180 (inclusive).
 * @returns {Promise<ActionResponse>} - A Response object containing the status and metadata.
 * @throws {SmartcarError} - An instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 *
 * @example
 * {
 *   status: string,
 *   meta: {
 *     requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *   }
 * }
 */
Vehicle.prototype.sendDestination = async function(latitude, longitude) {
  // Validate the latitude and longitude values
  if (latitude < -90 || latitude > 90) {
    throw new Error('Invalid latitude value. It must be between -90 and 90.');
  }
  if (longitude < -180 || longitude > 180) {
    throw new Error(
      'Invalid longitude value. It must be between -180 and 180.',
    );
  }

  const body = {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };

  const response = await this.service.request(
    'post',
    'navigation/destination',
    body,
  );

  return response;
};


/**
 * @type {Object}
 * @typedef WebhookSubscription
 * @property {String} webhookId - Webhook Id that the vehicle was subscribed to
 * @property {String} vehicleId - Current vehicle id that was subscribed to the webhook
 * @property {Meta} meta
 *
 * @example
 * {
 *   webhookId: 'dd214915-0c26-13c5-8e42-7edfc2ab320a',
 *   vehicleId: '19c0cc8c-80e0-4182-9372-6ef903c7599c',
 *   meta: {
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *   }
 * }
 */
/**
 * Subscribe the vehicle to given webhook Id
 * @async
 * @method
 * @param {String} webhookId - Webhook Id to subscribe to.
 * @return {Promise<Object>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.subscribe = async function(webhookId) {
  const response = await this.service.request('post', `webhooks/${webhookId}`);
  return response;
};

/**
 * Unsubscribe  the vehicle from given webhook Id
 * @async
 * @method
 * @param {String} amt - Application management token to be used as authorization
 * @param {String} webhookId - Webhook Id to unsubscribe from.
 * @return {Promise<Meta>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.unsubscribe = async function(amt, webhookId) {
  const response = await this.service.request(
    'delete',
    `webhooks/${webhookId}`,
    {},
    {headers: {Authorization: `Bearer ${amt}`}},
  );
  return response;
};


/**
 * @type {Object}
 * @typedef Batch
 * @property { function(): Object} ENDPOINT - The response object for a given ENDPOINT where
 * ENDPOINT is a Smartcar endpoint (i.e. /odometer, /fuel) or throws SmartcarError
 * if the endpoint resulted in an error.
 *
 * @example
 * {
 *    "odometer" : function() => returns odometer object or throws SmartcarError,
 *    "location" : function() => returns odometer location or throws SmartcarError,
 * }
 */

/**
 * Make batch requests for supported items
 * @see {@link https://smartcar.com/docs/api#post-batch-request|Smartcar API Doc - Batch Request}
 * @param {String[]} paths - A list of paths of endpoints to send requests to.
 * @return {Promise<Batch>}
 *
 * @throws {SmartcarError} - on unsuccessful request. An instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.batch = async function(paths) {
  const response = await this.service.batchRequest(paths);
  return response;
};

/**
 * @type {Object}
 * @typedef Response
 * @property {String} body - The response body
 * @property {Meta} meta
 *
 * @example
 * {
 *  body: { distance: 59801.6373441601 },
 *  meta: {
 *    dataAge: 2022-01-20T02:55:25.041Z,
 *    unitSystem: 'imperial',
 *    requestId: 'f787849d-d228-482d-345f-459a5154sg73',
 *    fetchedAt: 2022-01-20T02:55:25.041Z
 *  }
 * }
 */

/**
 * General purpose method to make a request to a Smartcar endpoint.
 * @async
 * @method
 * @param {String} method - The HTTP request method to use.
 * @param {String} path - The path to make the request to.
 * @param {Object} body - The request body.
 * @param {Object} headers - The headers to include in the request.
 * @param {String} apiVersion - The API version to use for the request.
 * @return {Promise<Response>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.request = async function(
  method,
  path,
  body = null,
  headers = {},
  apiVersion = this.version,
) {
  const options = {
    baseUrl: util.getUrl(this.id, '', apiVersion),
    headers: _.merge({'sc-unit-system': this.unitSystem}, headers),
    apiVersion,
  };

  if (!headers.Authorization) {
    options.headers.Authorization = `Bearer ${this.token}`;
  }

  const rawResponse = await new SmartcarService(options).request(
    method.toLowerCase(),
    path,
    body,
  );

  const response = {
    body: _.omit(rawResponse, 'meta'),
    meta: rawResponse.meta,
  };

  return response;
};

/**
 * @typedef {Object} SignalsRes
 * @property {SignalsResBody} body - The signal response data.
 * @property {Object} [headers] - Response headers
 */

/**
 * @type {Object}
 * @typedef SignalsResBody
 * @property {Array<SignalResBody>} data - The array of signal objects.
 * @example
 * {
 *  "data": [
 *      {
 *          "id": "charge-activelimit",
 *          "type": "signal",
 *          "attributes": {
 *              "code": "charge-activelimit",
 *              "name": "ActiveLimit",
 *              "group": "Charge",
 *              "status": {
 *                  "value": "SUCCESS"
 *              },
 *              "body": {
 *                  "value": 80
 *              }
 *          },
 *          "meta": {},
 *          "links": {
 *              "self": "/vehicles/tst2e255-d3c8-4f90-9fec-e6e68b98e9cb/signals/charge-activelimit"
 *          }
 *      },
 *      {
 *          "id": "charge-amperage",
 *          "type": "signal",
 *          "attributes": {
 *              "code": "charge-amperage",
 *              "name": "Amperage",
 *              "group": "Charge",
 *              "status": {
 *                  "value": "SUCCESS"
 *              },
 *              "body": {
 *                  "value": 0
 *              }
 *          },
 *          "meta": {},
 *          "links": {
 *              "self": "/vehicles/tst2e255-d3c8-4f90-9fec-e6e68b98e9cb/signals/charge-amperage"
 *          }
 *      }
 *  ]
 * }
*/

/**
 * Get the vehicle signals (v3 endpoint)
 * @async
 * @method
 * @return {Promise<SignalsRes>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.getSignals = async function() {
  const response = await this.request(
    'get',
    'signals',
    null,
    {},
    '3',
  );
  return {
    body: response.body,
    headers: response.meta,
  };
};

/**
 * @typedef {Object} SignalRes
 * @property {SignalResBody} body - The signal response data.
 * @property {Object} [headers] - Response headers
 */

/**
 * @type {Object}
 * @typedef SignalResBody
 * @property {String} id - The signal code identifier.
 * @property {String} type - The type of signal, e.g., "signal".
 * @property {Object} attributes - The attributes of the signal
 * @property {String} attributes.code - The signal code.
 * @property {String} attributes.name - The name of the signal.
 * @property {String} attributes.group - The group to which the signal belongs.
 * @property {Object} attributes.status - The status of the signal.
 * @property {String} attributes.status.value - The value of the signal status, e.g., "SUCCESS".
 * @property {Object} attributes.body - The body of the signal containing the actual data.
 * @property {Object} meta - Metadata about the signal retrieval.
 * @property {Number} meta.retrievedAt - Timestamp when the signal was retrieved.
 * @property {Number} meta.oemUpdatedAt - Timestamp when the signal was last updated by the OEM.
 * @property {Object} links - Links related to the signal.
 * @property {String} links.self - The self-referential link for the signal.
 * @example
 * {
 *   "id": "odometer-traveleddistance",
 *   "type": "signal",
 *   "attributes": {
 *     "code": "odometer-traveleddistance",
 *     "name": "TraveledDistance",
 *     "group": "Odometer",
 *     "status": {
 *         "value": "SUCCESS"
 *     },
 *     "body": {
 *         "unit": "kilometers",
 *         "value": 115071.50046584333
 *     }
 * },
 * "meta": {
 *     "retrievedAt": 1752104218549,
 *     "oemUpdatedAt": 1752104118549
 * },
 * "links": {
 *     "self": "/vehicles/tst2e255-d3c8-4f90-9fec-e6e68b98e9cb/signals/odometer-traveleddistance"
 *  }
 * }
 */

/**
 * Get a specific signal for a vehicle (v3 endpoint)
 * @async
 * @method
 * @param {String} signalCode - the signal code to retrieve
 * @return {Promise<SignalRes>}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.getSignal = async function(signalCode) {
  const response = await this.request(
    'get',
    `signals/${signalCode}`,
    null,
    {},
    '3',
  );
  return {
    body: response.body,
    headers: response.meta,
  };
};


/* JSDOC for dynamically generated methods */
/**
 * @type {Object}
 * @typedef Meta
 * @property {Date} dataAge - The timestamp of when the data was recorded; returned if applicable.
 * @property {Date} fetchedAt - The timestamp when the data was fetched from the vehicle
 * @property {String} requestId - The smartcar request ID for debugging
 * @property {String} unitSystem - Unit system used, metric or imperial; returned if applicable.
 *
 * @example
 * {
 *   requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
 *   dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *   unitSystem: 'imperial',
 *   fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 * }
 */

/**
 * @type {Object}
 * @typedef Vin
 * @property {String} vin - VIN of the vehicle
 * @property {Meta} meta
 *
 * @example
 * {
 *   vin: '12345678901234567',
 *   meta: {
 *     requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
 *   }
 * }
 */
/**
 * @name Vehicle#vin
 * @function
 * @memberof Vehicle
 * @description  Returns the vehicle's manufacturer identifier (VIN).
 * @see {@link https://smartcar.com/docs/api#get-vin|Smartcar API Doc - VIN}
 * @return {Vin}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */


/**
 * @type {Object}
 * @typedef Charge
 * @property {Boolean} isPluggedIn - Indicates whether charging cable is
 *   plugged in.
 * @property {String} state - Indicates the current state of the charge
 *   system. Can be `FULLY_CHARGED`, `CHARGING`, or `NOT_CHARGING`.
 * @property {Meta} meta
 *
 * @example
 * {
 *   isPluggedIn: false,
 *   state: "FULLY_CHARGED",
 *   meta: {
 *     dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *     fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *   }
 * }
 */
/**
 * @name Vehicle#charge
 * @function
 * @memberof Vehicle
 * @description  Returns the current charge status of the vehicle.
 * @see {@link https://smartcar.com/docs/api#get-ev-charging-status|Smartcar API Doc - EV charging status}
 * @return {Charge}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef Battery
 * @property {Number} range - The estimated remaining distance the car can
 *  travel (in kms or miles). Unit is passed as a parameter in vehicle constructor.
 * @property {Number} percentRemaining - The remaining level of charge in
 *   the battery (in percent).
 * @property {Meta} meta
 *
 * @example
 * {
 *   range: 40.5,
 *   percentRemaining: 0.3,
 *   meta: {
 *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *    unitSystem: 'imperial',
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *    fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *   }
 * }
 */
/**
 * @name Vehicle#battery
 * @function
 * @memberof Vehicle
 * @description  Returns the state of charge (SOC) and remaining range of an electric or
 * plug-in hybrid vehicle's battery.
 * @see {@link https://smartcar.com/docs/api#get-ev-battery|Smartcar API Doc - EV battery level}
 * @return {Battery}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef BatteryCapacity
 * @property {Number} capacity - The total capacity of the vehicle's battery
 * (in kilowatt-hours)
 * @property {Meta} meta
 *
 * @example
 * {
 *   capacity: 24,
 *   meta: {
 *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *    unitSystem: 'imperial',
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *    fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *   }
 * }
 */
/**
 * @name Vehicle#batteryCapacity
 * @function
 * @memberof Vehicle
 * @description  Returns the capacity of an electric or plug-in hybrid vehicle's battery.
 * @see {@link https://smartcar.com/docs/api#get-ev-battery-capacity|Smartcar API Doc - EV battery capacity}
 * @return {BatteryCapacity}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef NominalCapacity
 * @property {Array} availableCapacities - A list of the rated nominal
 * capacities available for a vehicle
 * @property {Object} capacity - The rated nominal capacity for the vehicle's battery in kWh
 * @property {String} url - A URL that will launch the flow for a vehicle owner
 * to specify the correct battery capacity for a vehicle
 * @property {Meta} meta
 *
 * @example
 * {
 *  "availableCapacities": [
 *        {
 *            "capacity" :  70.9,
 *           "description" : null
 *       },
 *       {
 *           "capacity" :  80.9,
 *           "description" : null
 *       },
 *       {
 *           "capacity" :  90.9,
 *           "description" : "BEV:Extended Range"
 *       }
 *   ],
 *   "capacity": null,
 *   "url" : "https://connect.smartcar.com/battery-capacity?vehicle_id=36ab27d0-fd9d-4455-823a-ce30af709ffc&client_id=8229df9f-91a0-4ff0-a1ae-a1f38ee24d07&token=90abecb6-e7ab-4b85-864a-e1c8bf67f2ad&response_type=vehicle_id&redirect_uri="
 * }
 */
/**
 * @name Vehicle#nominalCapacity
 * @function
 * @memberof Vehicle
 * @description  Returns a list of nominal rated battery capacities for a vehicle.
 * @see {@link https://smartcar.com/docs/api-reference/get-nominal-capacity|Smartcar API Doc - nominal capacity}
 * @return {NominalCapacity}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef Fuel
 * @property {Number} range - The estimated remaining distance the car can
 *  travel (in kms or miles). Unit is passed as a parameter in vehicle constructor.
 * @property {Number} percentRemaining - The remaining level of fuel in
 *   the tank (in percent).
 * @property {Number} amountRemaining - The amount of fuel in the tank (in
 *  liters or gallons (US)). Unit is passed as a parameter in vehicle constructor.
 * @property {Meta} meta
 *
 * @example
 * {
 *   range: 40.5,
 *   percentRemaining: 0.3,
 *   amountRemaining: 40.5,
 *   meta: {
 *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *    unitSystem: 'imperial',
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *    fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *   }
 * }
 */
/**
 * @name Vehicle#fuel
 * @function
 * @memberof Vehicle
 * @description  Returns the status of the fuel remaining in the vehicle's gas tank.
 * @see {@link https://smartcar.com/docs/api#get-fuel-tank|Smartcar API Doc - Fuel tank}
 * @return {Fuel}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef TirePressure
 * @property {Number} frontLeft - The current air pressure of the front left tire
 * @property {Number} frontRight - The current air pressure of the back right tire
 * @property {Number} backLeft - The current air pressure of the back left tire
 * @property {Number} backRight - The current air pressure of the back right tire
 * @property {Meta} meta
 *
 * @example
 * {
 *   frontLeft: 33,
 *   frontRight: 34,
 *   backLeft: 34,
 *   backRight: 33
 *   meta: {
 *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *    unitSystem: 'imperial',
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *    fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *   }
 * }
 */
/**
 * @name Vehicle#tirePressure
 * @function
 * @memberof Vehicle
 * @description  Returns the air pressure of each of the vehicle's tires.
 * @see {@link https://smartcar.com/docs/api#get-tire-pressure|Smartcar API Doc - Tire pressure}
 * @return {TirePressure}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef EngineOil
 * @property {Number} lifeRemaining - The engine oil's remaining life span
 * (as a percentage). Oil life is based on the current quality of the oil.
 * @property {Meta} meta
 *
 * @example
 * {
 *   lifeRemaining: 0.86,
 *   meta: {
 *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *    unitSystem: 'imperial',
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *    fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *   }
 * }
 */
/**
 * @name Vehicle#engineOil
 * @function
 * @memberof Vehicle
 * @description  Returns the remaining life span of a vehicle's engine oil
 * @see {@link https://smartcar.com/docs/api#get-engine-oil-life|Smartcar API Doc - Engine oil life}
 * @return {EngineOil}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef Odometer
 * @property {Number} distance - The reading of the vehicle's odometer (in
 *   kms or miles). Unit is passed as a parameter in vehicle constructor.
 * @property {Meta} meta
 *
 * @example
 * {
 *   distance: 1234.12,
 *   meta: {
 *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *    unitSystem: 'imperial',
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *    fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *   }
 * }
 */

/**
 * @type {Object}
 * @typedef SecurityResponse
 * @property {Boolean} isLocked - Whether the vehicle is locked or not.
 * @property {Array} doors - The status of each of the vehicle's doors.
 * @property {Array} windows - The status of each of the vehicle's windows.
 * @property {Array} sunroof - The status of each of the vehicle's sunroof.
 * @property {Array} storage - The status of each of the vehicle's storage.
 * @property {Array} chargingPort - The status of each of the vehicle's chargingPort.
 * @property {Meta} meta
 *
 * @example
 * {
 *    isLocked: true,
 *    doors: [
 *       {
 *           type: 'frontLeft',
 *           status: 'LOCKED',
 *       },
 *       {
 *           type: 'frontRight',
 *           status: 'LOCKED',
 *       },
 *       {
 *           type: 'backLeft',
 *           status: 'LOCKED',
 *       },
 *       {
 *           type: 'backRight',
 *           status: 'LOCKED',
 *       },
 *    ],
 *    windows: [
 *       {
 *           type: 'frontLeft',
 *           status: 'CLOSED',
 *       },
 *       {
 *           type: 'frontRight',
 *           status: 'CLOSED',
 *       },
 *       {
 *           type: 'backLeft',
 *           status: 'CLOSED',
 *       },
 *       {
 *           type: 'backRight',
 *           status: 'CLOSED',
 *       },
 *    ],
 *    sunroof: [
 *       {
 *           type: 'sunroof',
 *           status: 'CLOSED',
 *       },
 *    ],
 *    storage: [
 *       {
 *           type: 'rear',
 *           status: 'CLOSED',
 *       },
 *       {
 *           type: 'front',
 *           status: 'CLOSED',
 *       },
 *    ],
 *    chargingPort: [
 *       {
 *           type: 'chargingPort',
 *           status: 'CLOSED',
 *       },
 *    ],
 *    meta: {
 *        dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *        requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *        fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
 *    },
 * }
 */

/**
 * @name Vehicle#odometer
 * @function
 * @memberof Vehicle
 * @description Returns the vehicle's last known odometer reading.
 * @see {@link https://smartcar.com/docs/api#get-odometer|Smartcar API Doc - Odometer}
 * @return {Odometer}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef Location
 * @property {Number} latitude - The vehicle latitude (in degrees).
 * @property {Number} longitude - The vehicle longitude (in degrees).
 * @property {Meta} meta
 *
 * @example
 * {
 *   latitude: 37.400880,
 *   longitude: -122.057804,
 *   meta: {
 *    dataAge: new Date('2018-05-04T07:20:50.844Z'),
 *    unitSystem: 'imperial',
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *    fetchedAt: new Date('2022-01-20T02:55:25.041Z'),
 *   }
 * }
 */
/**
 * @name Vehicle#location
 * @function
 * @memberof Vehicle
 * @description Returns the last known location of the vehicle in geographic coordinates.
 * @see {@link https://smartcar.com/docs/api#get-location|Smartcar API Doc - Location}
 * @return {Location}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef Attributes
 * @property {String} id - The vehicle's unique Smartcar identifier.
 * @property {String} make - The brand of the vehicle.
 * @property {String} model - The specific model of the vehicle.
 * @property {Number} year - The model year of the vehicle.
 * @property {Meta} meta
 *
 * @example
 * {
 *   id: '19c0cc8c-80e0-4182-9372-6ef903c7599c',
 *   make: 'TESLA',
 *   model: 'S',
 *   year: 2017,
 *   meta: {
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *   }
 * }
 */
/**
 * @name Vehicle#attributes
 * @function
 * @memberof Vehicle
 * @description Returns make model year and id of the vehicle
 * @see {@link https://smartcar.com/docs/api#get-vehicle-attributes|Smartcar API Doc - Vehicle attributes}
 * @return {Attributes}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @type {Object}
 * @typedef ActionResponse
 * @property {String} status - set to `success` on successful request
 * @property {Meta} meta
 *
 * @example
 * {
 *   status: 'success',
 *   meta: {
 *    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
 *   }
 * }
 */

/**
 * @name Vehicle#lock
 * @function
 * @memberof Vehicle
 * @description Attempts to lock the vehicle.
 * @see {@link https://smartcar.com/docs/api#post-lockunlock|Smartcar API Doc - Lock}
 * @return {ActionResponse}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @name Vehicle#unlock
 * @function
 * @memberof Vehicle
 * @description Attempts to lock the vehicle.
 * @see {@link https://smartcar.com/docs/api#post-lockunlock|Smartcar API Doc - Unlock}
 * @return {ActionResponse}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @name Vehicle#startCharge
 * @function
 * @memberof Vehicle
 * @description Attempts to start charging the vehicle.
 * @see {@link https://smartcar.com/docs/api#post-ev-startstop-charge|Smartcar API Doc - EV start charge}
 * @return {ActionResponse}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @name Vehicle#stopCharge
 * @function
 * @memberof Vehicle
 * @description Attempts to stop charging the vehicle.
 * @see {@link https://smartcar.com/docs/api#post-ev-startstop-charge|Smartcar API Doc - EV stop charge}
 * @return {ActionResponse}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @name Vehicle#disconnect
 * @function
 * @memberof Vehicle
 * @description Disconnect this vehicle from the connected application.
 * Note: Calling this method will invalidate your token's access to the vehicle.
 * You will have to reauthorize the user to your application again if you wish
 * to make requests to it again.
 * @see {@link https://smartcar.com/docs/api#delete-disconnect|Smartcar API Doc - Disconnect}
 * @return {ActionResponse}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

/**
 * @name Vehicle#lockStatus
 * @function
 * @memberof Vehicle
 * @description Returns the lock status of the vehicle.
 * @see {@link https://smartcar.com/docs/api#get-security|Smartcar API Doc - Lock Status}
 * @return {LockStatus}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */

module.exports = Vehicle;
