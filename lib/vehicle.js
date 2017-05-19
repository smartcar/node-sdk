'use strict';
var request = require('request-promise');
var util = require('./util');
var _ = require('lodash');
var config = require('./config');
var errors = require('./errors');


/**
 * Initializes Vehicle object
 * @constructor
 * @param {String} token a valid access token
 * @param {string} vid the vehicle's unique identifier
 * @param {String} unitSystem the unit system for vehicle data (metric/imperial)
 */
function Vehicle(vid, token, unitSystem) {
  if (!(this instanceof Vehicle)) {
    // eslint-disable-next-line max-len
    throw new errors.SmartcarError('Vehicle is a constructor. Usage: new Vehicle(vid, token)');
  }
  unitSystem = unitSystem || 'metric';
  validateUnitSystem(unitSystem);
  this.vid = vid;
  this.token = token;
  this.unitSystem = unitSystem;
  this.request = createDefaultRequest(this.vid, this.token, this.unitSystem);

}

function createDefaultRequest(vid, token, unitSystem) {
  return request.defaults({
    baseUrl: util.getUrl(vid),
    auth: {
      bearer: token,
    },
    headers: {
      'User-Agent': `smartcar-node-sdk:${config.version}`,
      'sc-unit-system': unitSystem,
    },
    json: true,
  });
}

function validateUnitSystem(unitSystem) {
  if (['imperial', 'metric'].indexOf(unitSystem) < 0) {
    throw new TypeError('unit system must be one of: \'imperial\', \'metric\'');
  }
}

Vehicle.prototype.setUnitSystem = function(unitSystem) {
  validateUnitSystem(unitSystem);

  this.unitSystem = unitSystem;
  this.request = createDefaultRequest(this.vid, this.token, this.unitSystem);
};

Vehicle.prototype.disconnect = function() {
  return this.request({
    uri: 'application',
    method: 'DELETE',
    auth: {
      bearer: this.token,
    },
  });
};

Vehicle.prototype.permissions = function(paging) {
  var options = {
    uri: 'permissions',
    method: 'GET',
    auth: {
      bearer: this.token,
    },
  };
  if (paging) {
    options.form = paging;
  }
  return this.request(options);
};

/* VEHICLE API METHODS */


/**
 * GET Vehicle.info
 *
 * @return {Promise} A promise for info on the vehicle's info
 */
Vehicle.prototype.info = function() {
  return this.request.get({
    uri: '/',
  });
};

/**
 * GET Vehicle.accelerometer
 *
 * @return {Promise} A promise for info on the vehicle's accelerometer
 */
Vehicle.prototype.accelerometer = function() {
  return this.request.get({
    uri: 'accelerometer',
  });
};

/**
 * GET Vehicle.airbags
 *
 * @return {Promise} A promise for info on the vehicle's airbags
 */
Vehicle.prototype.airbags = function() {
  return this.request.get({
    uri: 'airbags',
  });
};

/**
 * GET Vehicle.barometer
 *
 * @return {Promise} A promise for info on the vehicle's barometer
 */
Vehicle.prototype.barometer = function() {
  return this.request.get({
    uri: 'barometer',
  });
};

/**
 * GET Vehicle.battery
 *
 * @return {Promise} A promise for info on the vehicle's battery
 */
Vehicle.prototype.battery = function() {
  return this.request.get({
    uri: 'battery',
  });
};

/**
 * GET Vehicle.charge
 *
 * @return {Promise} A promise for info on the vehicle's charge
 */
Vehicle.prototype.charge = function() {
  return this.request.get({
    uri: 'charge',
  });
};

/**
 * GET Vehicle.chargeAmmeter
 *
 * @return {Promise} A promise for info on the vehicle's charge ammeter
 */
Vehicle.prototype.chargeAmmeter = function() {
  return this.request.get({
    uri: 'charge/ammeter',
  });
};

/**
 * GET Vehicle.chargeLimit
 *
 * @return {Promise} A promise for info on the vehicle's chargeLimit
 */
Vehicle.prototype.chargeLimit = function() {
  return this.request.get({
    uri: 'charge/limit',
  });
};

/**
 * GET Vehicle.chargeSchedule
 *
 * @return {Promise} A promise for info on the vehicle's chargeSchedule
 */
Vehicle.prototype.chargeSchedule = function() {
  return this.request.get({
    uri: 'charge/schedule',
  });
};

/**
 * GET Vehicle.chargeVoltmeter
 *
 * @return {Promise} A promise for info on the vehicle's charge voltmeter
 */
Vehicle.prototype.chargeVoltmeter = function() {
  return this.request.get({
    uri: 'charge/voltmeter',
  });
};

/**
 * GET Vehicle.climate
 *
 * @return {Promise} A promise for info on the vehicle's climate
 */
Vehicle.prototype.climate = function() {
  return this.request.get({
    uri: 'climate',
  });
};

/**
 * GET Vehicle.collisionSensor
 *
 * @return {Promise} A promise for info on the vehicle's collisionSensor
 */
Vehicle.prototype.collisionSensor = function() {
  return this.request.get({
    uri: 'collision_sensor',
  });
};

/**
 * GET Vehicle.compass
 *
 * @return {Promise} A promise for info on the vehicle's compass
 */
Vehicle.prototype.compass = function() {
  return this.request.get({
    uri: 'compass',
  });
};

/**
 * GET Vehicle.cruiseControl
 *
 * @return {Promise} A promise for info on the vehicle's cruiseControl
 */
Vehicle.prototype.cruiseControl = function() {
  return this.request.get({
    uri: 'cruise_control',
  });
};

/**
 * GET Vehicle.dimensions
 *
 * @return {Promise} A promise for info on the vehicle's dimensions
 */
Vehicle.prototype.dimensions = function() {
  return this.request.get({
    uri: 'dimensions',
  });
};

/**
 * GET Vehicle.doors
 *
 * @return {Promise} A promise for info on the vehicle's doors
 */
Vehicle.prototype.doors = function() {
  return this.request.get({
    uri: 'doors',
  });
};

/**
 * GET Vehicle.childSafetyLocks
 *
 * @return {Promise} A promise for info on the vehicle's childSafetyLocks
 */
Vehicle.prototype.childSafetyLocks = function() {
  return this.request.get({
    uri: 'doors/child_safety_locks',
  });
};

/**
 * GET Vehicle.driveMode
 *
 * @return {Promise} A promise for info on the vehicle's driveMode
 */
Vehicle.prototype.driveMode = function() {
  return this.request.get({
    uri: 'drive_mode',
  });
};

/**
 * GET Vehicle.engine
 *
 * @return {Promise} A promise for info on the vehicle's engine
 */
Vehicle.prototype.engine = function() {
  return this.request.get({
    uri: 'engine',
  });
};

/**
 * GET Vehicle.engineCoolant
 *
 * @return {Promise} A promise for info on the vehicle's engineCoolant
 */
Vehicle.prototype.engineCoolant = function() {
  return this.request.get({
    uri: 'engine/coolant',
  });
};

/**
 * GET Vehicle.engineHood
 *
 * @return {Promise} A promise for info on the vehicle's engineHood
 */
Vehicle.prototype.engineHood = function() {
  return this.request.get({
    uri: 'engine/hood',
  });
};

/**
 * GET Vehicle.engineOil
 *
 * @return {Promise} A promise for info on the vehicle's engineOil
 */
Vehicle.prototype.engineOil = function() {
  return this.request.get({
    uri: 'engine/oil',
  });
};

/**
 * GET Vehicle.engineThrottle
 *
 * @return {Promise} A promise for info on the vehicle's engineThrottle
 */
Vehicle.prototype.engineThrottle = function() {
  return this.request.get({
    uri: 'engine/throttle',
  });
};

/**
 * GET Vehicle.fuel
 *
 * @return {Promise} A promise for info on the vehicle's fuel
 */
Vehicle.prototype.fuel = function() {
  return this.request.get({
    uri: 'fuel',
  });
};

/**
 * GET Vehicle.gyroscope
 *
 * @return {Promise} A promise for info on the vehicle's gyroscope
 */
Vehicle.prototype.gyroscope = function() {
  return this.request.get({
    uri: 'gyroscope',
  });
};

/**
 * GET Vehicle.ignition
 *
 * @return {Promise} A promise for info on the vehicle's ignition
 */
Vehicle.prototype.ignition = function() {
  return this.request.get({
    uri: 'ignition',
  });
};

/**
 * GET Vehicle.hazardLight
 *
 * @return {Promise} A promise for info on the vehicle's hazardLight
 */
Vehicle.prototype.hazardLight = function() {
  return this.request.get({
    uri: 'lights/hazard',
  });
};

/**
 * GET Vehicle.headlights
 *
 * @return {Promise} A promise for info on the vehicle's headlights
 */
Vehicle.prototype.headlights = function() {
  return this.request.get({
    uri: 'lights/headlights',
  });
};

/**
 * GET Vehicle.interiorLights
 *
 * @return {Promise} A promise for info on the vehicle's interiorLights
 */
Vehicle.prototype.interiorLights = function() {
  return this.request.get({
    uri: 'lights/interior',
  });
};

/**
 * GET Vehicle.turnIndicator
 *
 * @return {Promise} A promise for info on the vehicle's turnIndicator
 */
Vehicle.prototype.turnIndicator = function() {
  return this.request.get({
    uri: 'lights/turn_indicator',
  });
};

/**
 * GET Vehicle.location
 *
 * @return {Promise} A promise for info on the vehicle's location
 */
Vehicle.prototype.location = function() {
  return this.request.get({
    uri: 'location',
  });
};

/**
 * GET Vehicle.sideviewMirrors
 *
 * @return {Promise} A promise for info on the vehicle's sideviewMirrors
 */
Vehicle.prototype.sideviewMirrors = function() {
  return this.request.get({
    uri: 'mirrors/side_view',
  });
};

/**
 * GET Vehicle.odometer
 *
 * @return {Promise} A promise for info on the vehicle's odometer
 */
Vehicle.prototype.odometer = function() {
  return this.request.get({
    uri: 'odometer',
  });
};

/**
 * GET Vehicle.tripOdometers
 *
 * @return {Promise} A promise for info on the vehicle's tripOdometers
 */
Vehicle.prototype.tripOdometers = function() {
  return this.request.get({
    uri: 'odometer/trips',
  });
};

/**
 * GET Vehicle.acceleratorPedal
 *
 * @return {Promise} A promise for info on the vehicle's acceleratorPedal
 */
Vehicle.prototype.acceleratorPedal = function() {
  return this.request.get({
    uri: 'pedals/accelerator',
  });
};

/**
 * GET Vehicle.brakePedal
 *
 * @return {Promise} A promise for info on the vehicle's brakePedal
 */
Vehicle.prototype.brakePedal = function() {
  return this.request.get({
    uri: 'pedals/brake',
  });
};

/**
 * GET Vehicle.rainSensor
 *
 * @return {Promise} A promise for info on the vehicle's rainSensor
 */
Vehicle.prototype.rainSensor = function() {
  return this.request.get({
    uri: 'rain_sensor',
  });
};

/**
 * GET Vehicle.seats
 *
 * @return {Promise} A promise for info on the vehicle's seats
 */
Vehicle.prototype.seats = function() {
  return this.request.get({
    uri: 'seats',
  });
};

/**
 * GET Vehicle.security
 *
 * @return {Promise} A promise for info on the vehicle's security
 */
Vehicle.prototype.security = function() {
  return this.request.get({
    uri: 'security',
  });
};

/**
 * GET Vehicle.sliBattery
 *
 * @return {Promise} A promise for info on the vehicle's sliBattery
 */
Vehicle.prototype.sliBattery = function() {
  return this.request.get({
    uri: 'sli_battery',
  });
};

/**
 * GET Vehicle.speedometer
 *
 * @return {Promise} A promise for info on the vehicle's speedometer
 */
Vehicle.prototype.speedometer = function() {
  return this.request.get({
    uri: 'speedometer',
  });
};

/**
 * GET Vehicle.steeringWheel
 *
 * @return {Promise} A promise for info on the vehicle's steeringWheel
 */
Vehicle.prototype.steeringWheel = function() {
  return this.request.get({
    uri: 'steering_wheel',
  });
};

/**
 * GET Vehicle.sunroof
 *
 * @return {Promise} A promise for info on the vehicle's sunroof
 */
Vehicle.prototype.sunroof = function() {
  return this.request.get({
    uri: 'sunroof',
  });
};

/**
 * GET Vehicle.tachometer
 *
 * @return {Promise} A promise for info on the vehicle's tachometer
 */
Vehicle.prototype.tachometer = function() {
  return this.request.get({
    uri: 'tachometer',
  });
};

/**
 * GET Vehicle.interiorThermistor
 *
 * @return {Promise} A promise for info on the vehicle's interiorThermistor
 */
Vehicle.prototype.interiorThermistor = function() {
  return this.request.get({
    uri: 'thermistors/interior',
  });
};

/**
 * GET Vehicle.exteriorThermistor
 *
 * @return {Promise} A promise for info on the vehicle's exteriorThermistor
 */
Vehicle.prototype.exteriorThermistor = function() {
  return this.request.get({
    uri: 'thermistors/exterior',
  });
};

/**
 * GET Vehicle.tires
 *
 * @return {Promise} A promise for info on the vehicle's tires
 */
Vehicle.prototype.tires = function() {
  return this.request.get({
    uri: 'tires',
  });
};

/**
 * GET Vehicle.transmission
 *
 * @return {Promise} A promise for info on the vehicle's transmission
 */
Vehicle.prototype.transmission = function() {
  return this.request.get({
    uri: 'transmission',
  });
};

/**
 * GET Vehicle.transmissionFluid
 *
 * @return {Promise} A promise for info on the vehicle's transmissionFluid
 */
Vehicle.prototype.transmissionFluid = function() {
  return this.request.get({
    uri: 'transmission/fluid',
  });
};

/**
 * GET Vehicle.frontTrunk
 *
 * @return {Promise} A promise for info on the vehicle's frontTrunk
 */
Vehicle.prototype.frontTrunk = function() {
  return this.request.get({
    uri: 'trunks/front',
  });
};

/**
 * GET Vehicle.rearTrunk
 *
 * @return {Promise} A promise for info on the vehicle's rearTrunk
 */
Vehicle.prototype.rearTrunk = function() {
  return this.request.get({
    uri: 'trunks/rear',
  });
};

/**
 * GET Vehicle.vin
 *
 * @return {Promise} A promise for info on the vehicle's vin
 */
Vehicle.prototype.vin = function() {
  return this.request.get({
    uri: 'vin',
  });
};

/**
 * GET Vehicle.washerFluid
 *
 * @return {Promise} A promise for info on the vehicle's washerFluid
 */
Vehicle.prototype.washerFluid = function() {
  return this.request.get({
    uri: 'washer_fluid',
  });
};

/**
 * GET Vehicle.wheels
 *
 * @return {Promise} A promise for info on the vehicle's wheels
 */
Vehicle.prototype.wheels = function() {
  return this.request.get({
    uri: 'wheels',
  });
};

/**
 * GET Vehicle.wheelSpeeds
 *
 * @return {Promise} A promise for info on the vehicle's wheelSpeeds
 */
Vehicle.prototype.wheelSpeeds = function() {
  return this.request.get({
    uri: 'wheels/speeds',
  });
};

/**
 * GET Vehicle.windows
 *
 * @return {Promise} A promise for info on the vehicle's windows
 */
Vehicle.prototype.windows = function() {
  return this.request.get({
    uri: 'windows',
  });
};

/**
 * POST Vehicle.startCharging
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startCharging = function() {
  return this.request.post({
    uri: 'charge',
    body: {action: 'START'},
  });
};

/**
 * POST Vehicle.stopCharging
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.stopCharging = function() {
  return this.request.post({
    uri: 'charge',
    body: {action: 'STOP'},
  });
};

/**
 * POST Vehicle.enableChargeLimit
 *
 * @param {Float} [limit] - override the previously set limit,
 *                          must be between 0 - 1
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.setChargeLimit = function(limit) {
  return this.request.post({
    uri: 'charge/limit',
    body: {limit, action: 'ENABLE'},
  });
};

/**
 * POST Vehicle.disableChargeLimit
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.disableChargeLimit = function() {
  return this.request.post({
    uri: 'charge/limit',
    body: {action: 'DISABLE'},
  });
};

/**
 * POST Vehicle.enableChargeSchedule
 *
 * @param {String} startTime the datetime string representing when to start
 * charging, i.e, '11:11'
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.enableChargeSchedule = function(startTime) {
  return this.request.post({
    uri: 'charge/schedule',
    body: {action: 'ENABLE', startTime},
  });
};

/**
 * POST Vehicle.disableChargeSchedule
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.disableChargeSchedule = function() {
  return this.request.post({
    uri: 'charge/schedule',
    body: {action: 'DISABLE'},
  });
};

/**
 * POST Vehicle.activateChildSafetyLocks
 *
 * @param {Array} childSafetyLocksArr array of child safety lock objects,
 * i.e, [{location: 'BACK_LEFT'}]
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.activateChildSafetyLocks = function(childSafetyLocksArr) {
  // eslint-disable-next-line max-len
  if (_.isNil(childSafetyLocksArr) || !Array.isArray(childSafetyLocksArr)) {
    // eslint-disable-next-line max-len
    throw new TypeError('activateChildSafetyLocks requires an array of safety locks');
  }
  return this.request.post({
    uri: 'doors/child_safety_locks',
    body: {action: 'LOCK', childSafetyLocks: childSafetyLocksArr},
  });
};

/**
 * POST Vehicle.disableChildSafetyLocks
 *
 * @param {Array} childSafetyLocksArr array of child safety lock objects,
 * i.e, [{location: 'BACK_LEFT'}]
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.disableChildSafetyLocks = function(childSafetyLocksArr) {
  // eslint-disable-next-line max-len
  if (_.isNil(childSafetyLocksArr) || !Array.isArray(childSafetyLocksArr)) {
    // eslint-disable-next-line max-len
    throw new TypeError('disableChildSafetyLocks requires an array of safety locks');
  }
  return this.request.post({
    uri: 'doors/child_safety_locks',
    body: {action: 'UNLOCK', childSafetyLocks: childSafetyLocksArr},
  });
};

/**
 * POST Vehicle.startClimate
 *
 * @param {Number} temperature the temperature to set the car to
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startClimate = function(temperature) {
  return this.request.post({
    uri: 'climate',
    body: {action: 'START', temperature},
  });
};

/**
 * POST Vehicle.stopClimate
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.stopClimate = function() {
  return this.request.post({
    uri: 'climate',
    body: {action: 'STOP'},
  });
};

/**
 * POST Vehicle.openEngineHood
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openEngineHood = function() {
  return this.request.post({
    uri: 'engine/hood',
    body: {action: 'OPEN'},
  });
};

/**
 * POST Vehicle.closeEngineHood
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeEngineHood = function() {
  return this.request.post({
    uri: 'engine/hood',
    body: {action: 'CLOSE'},
  });
};

/**
 * POST Vehicle.honkHorn
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.honkHorn = function() {
  return this.request.post({
    uri: 'horn',
    body: {action: 'HONK'},
  });
};

/**
 * POST Vehicle.startIgnition
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startIgnition = function() {
  return this.request.post({
    uri: 'ignition',
    body: {action: 'START'},
  });
};

/**
 * POST Vehicle.setIgnitionOn
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.setIgnitionOn = function() {
  return this.request.post({
    uri: 'ignition',
    body: {action: 'ON'},
  });
};

/**
 * POST Vehicle.setIgnitionAccessory
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.setIgnitionAccessory = function() {
  return this.request.post({
    uri: 'ignition',
    body: {action: 'ACCESSORY'},
  });
};

/**
 * POST Vehicle.setIgnitionOff
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.setIgnitionOff = function() {
  return this.request.post({
    uri: 'ignition',
    body: {action: 'OFF'},
  });
};

/**
 * POST Vehicle.flashHeadlights
 *
 * @param {String} type the type of headlight to perform the action on,
 * i.e 'HIGH_BEAM'
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.flashHeadlights = function(type) {
  if (_.isNil(type) || typeof type !== 'string') {
    // eslint-disable-next-line max-len
    throw new TypeError('flashHeadlights requires a string describing type of flash');
  }
  return this.request.post({
    uri: 'lights/headlights',
    body: {action: 'FLASH', type},
  });
};

/**
 * POST Vehicle.tiltSideviewMirrors
 *
 * @param {Array} mirrorsArr array of mirror objects to perform action on,
 * i.e [{location: 'LEFT'}]
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.tiltSideviewMirrors = function(mirrorsArr) {
  // eslint-disable-next-line max-len
  if (_.isNil(mirrorsArr) || !Array.isArray(mirrorsArr)) {
    // eslint-disable-next-line max-len
    throw new TypeError('tiltSideviewMirrors requires an array of mirrors');
  }
  return this.request.post({
    uri: 'mirrors/side_view',
    body: {action: 'TILT', mirrors: mirrorsArr},
  });
};

/**
 * POST Vehicle.startPanic
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startPanic = function() {
  return this.request.post({
    uri: 'panic',
    body: {action: 'START'},
  });
};

/**
 * POST Vehicle.stopPanic
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.stopPanic = function() {
  return this.request.post({
    uri: 'panic',
    body: {action: 'STOP'},
  });
};

/**
 * POST Vehicle.openChargePort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openChargePort = function() {
  return this.request.post({
    uri: 'ports/charge',
    body: {action: 'OPEN'},
  });
};

/**
 * POST Vehicle.closeChargePort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeChargePort = function() {
  return this.request.post({
    uri: 'ports/charge',
    body: {action: 'CLOSE'},
  });
};

/**
 * POST Vehicle.openFuelPort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openFuelPort = function() {
  return this.request.post({
    uri: 'ports/fuel',
    body: {action: 'OPEN'},
  });
};

/**
 * POST Vehicle.closeFuelPort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeFuelPort = function() {
  return this.request.post({
    uri: 'ports/fuel',
    body: {action: 'CLOSE'},
  });
};

/**
 * POST Vehicle.lock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.lock = function() {
  return this.request.post({
    uri: 'security',
    body: {action: 'LOCK'},
  });
};

/**
 * POST Vehicle.unlock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.unlock = function() {
  return this.request.post({
    uri: 'security',
    body: {action: 'UNLOCK'},
  });
};

/**
 * POST Vehicle.openSunroof
 *
 * @param {Number} percentOpen max: 1, min: 0
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openSunroof = function(percentOpen) {
  return this.request.post({
    uri: 'sunroof',
    body: {action: 'OPEN', percentOpen},
  });
};

/**
 * POST Vehicle.ventSunroof
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.ventSunroof = function() {
  return this.request.post({
    uri: 'sunroof',
    body: {action: 'VENT'},
  });
};

/**
 * POST Vehicle.closeSunroof
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeSunroof = function() {
  return this.request.post({
    uri: 'sunroof',
    body: {action: 'CLOSE'},
  });
};

/**
 * POST Vehicle.openFrontTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openFrontTrunk = function() {
  return this.request.post({
    uri: 'trunks/front',
    body: {action: 'OPEN'},
  });
};

/**
 * POST Vehicle.closeFrontTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeFrontTrunk = function() {
  return this.request.post({
    uri: 'trunks/front',
    body: {action: 'CLOSE'},
  });
};

/**
 * POST Vehicle.openRearTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openRearTrunk = function() {
  return this.request.post({
    uri: 'trunks/rear',
    body: {action: 'OPEN'},
  });
};

/**
 * POST Vehicle.closeRearTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeRearTrunk = function() {
  return this.request.post({
    uri: 'trunks/rear',
    body: {action: 'CLOSE'},
  });
};

/**
 * POST Vehicle.openWindows
 *
 * @param {Array} windowsArr array of window objects to perform action upon,
 * i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}]
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openWindows = function(windowsArr) {
  if (_.isNil(windowsArr) || !Array.isArray(windowsArr)) {
    // eslint-disable-next-line max-len
    throw new TypeError('openWindows requires an array of windows');
  }
  return this.request.post({
    uri: 'windows',
    body: {action: 'OPEN', windows: windowsArr},
  });
};

/**
 * POST Vehicle.closeWindows
 *
 * @param {Array} windowsArr array of window objects to perform action upon,
 * i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}]
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeWindows = function(windowsArr) {
  if (_.isNil(windowsArr) || !Array.isArray(windowsArr)) {
    // eslint-disable-next-line max-len
    throw new TypeError('closeWindows requires an array of windows');
  }
  return this.request.post({
    uri: 'windows',
    body: {action: 'CLOSE', windows: windowsArr},
  });
};

/**
 * POST Vehicle.lockWindows
 *
 * @param {Array} windowsArr array of window objects to perform action upon,
 * i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}]
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.lockWindows = function(windowsArr) {
  if (_.isNil(windowsArr) || !Array.isArray(windowsArr)) {
    // eslint-disable-next-line max-len
    throw new TypeError('lockWindows requires an array of windows');
  }
  return this.request.post({
    uri: 'windows',
    body: {action: 'LOCK', windows: windowsArr},
  });
};

/**
 * POST Vehicle.unlockWindows
 *
 * @param {Array} windowsArr array of window objects to perform action upon,
 * i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}]
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.unlockWindows = function(windowsArr) {
  if (_.isNil(windowsArr) || !Array.isArray(windowsArr)) {
    // eslint-disable-next-line max-len
    throw new TypeError('windowsArr requires an array of windows');
  }
  return this.request.post({
    uri: 'windows',
    body: {action: 'UNLOCK', windows: windowsArr},
  });
};


module.exports = Vehicle;
