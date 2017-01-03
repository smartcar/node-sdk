'use strict';
var request = require('request-promise');
var util = require('./util');
var _ = require('lodash');
var config = require('./config');

/**
 * Initializes Vehicle object
 * @constructor
 * @param {String} token a valid access token
 * @param {string} vid the vehicle's unique identifier
 */
function Vehicle(vid, token, unitSystem) {
  unitSystem = unitSystem || 'metric';
  if (['imperial', 'metric'].indexOf(unitSystem) < 0) {
    throw new TypeError('unit system must be one of: \'imperial\', \'metric\'');
  }

  this.vid = vid;
  this.token = token;
  this.unitSystem = unitSystem;
  this.request = request.defaults({
    baseUrl: util.getUrl(vid),
    auth: {
      bearer: token,
    },
    headers: {
      'User-Agent': `smartcar-node-sdk:${config.version}`,
    },
    json: true,
  });
}

Vehicle.prototype.setUnitSystem = function(unitSystem) {
  if (['imperial', 'metric'].indexOf(unitSystem) < 0) {
    throw new TypeError('unit system must be one of: \'imperial\', \'metric\'');
  }

  this.unitSystem = unitSystem;
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

  return this.request({
    uri: '/',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.accelerometer
*
* @return {Promise} A promise for info on the vehicle's accelerometer
*/
Vehicle.prototype.accelerometer = function() {

  return this.request({
    uri: 'accelerometer',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.airbags
*
* @return {Promise} A promise for info on the vehicle's airbags
*/
Vehicle.prototype.airbags = function() {

  return this.request({
    uri: 'airbags',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.barometer
*
* @return {Promise} A promise for info on the vehicle's barometer
*/
Vehicle.prototype.barometer = function() {

  return this.request({
    uri: 'barometer',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.battery
*
* @return {Promise} A promise for info on the vehicle's battery
*/
Vehicle.prototype.battery = function() {

  return this.request({
    uri: 'battery',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.charge
*
* @return {Promise} A promise for info on the vehicle's charge
*/
Vehicle.prototype.charge = function() {

  return this.request({
    uri: 'charge',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.chargeLimit
*
* @return {Promise} A promise for info on the vehicle's chargeLimit
*/
Vehicle.prototype.chargeLimit = function() {

  return this.request({
    uri: 'charge/limit',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.chargeSchedule
*
* @return {Promise} A promise for info on the vehicle's chargeSchedule
*/
Vehicle.prototype.chargeSchedule = function() {

  return this.request({
    uri: 'charge/schedule',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.climate
*
* @return {Promise} A promise for info on the vehicle's climate
*/
Vehicle.prototype.climate = function() {

  return this.request({
    uri: 'climate',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.collisionSensor
*
* @return {Promise} A promise for info on the vehicle's collisionSensor
*/
Vehicle.prototype.collisionSensor = function() {

  return this.request({
    uri: 'collision_sensor',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.compass
*
* @return {Promise} A promise for info on the vehicle's compass
*/
Vehicle.prototype.compass = function() {

  return this.request({
    uri: 'compass',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.cruiseControl
*
* @return {Promise} A promise for info on the vehicle's cruiseControl
*/
Vehicle.prototype.cruiseControl = function() {

  return this.request({
    uri: 'cruise_control',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.dimensions
*
* @return {Promise} A promise for info on the vehicle's dimensions
*/
Vehicle.prototype.dimensions = function() {

  return this.request({
    uri: 'dimensions',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.doors
*
* @return {Promise} A promise for info on the vehicle's doors
*/
Vehicle.prototype.doors = function() {

  return this.request({
    uri: 'doors',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.childSafetyLocks
*
* @return {Promise} A promise for info on the vehicle's childSafetyLocks
*/
Vehicle.prototype.childSafetyLocks = function() {

  return this.request({
    uri: 'doors/child_safety_locks',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.driveMode
*
* @return {Promise} A promise for info on the vehicle's driveMode
*/
Vehicle.prototype.driveMode = function() {

  return this.request({
    uri: 'drive_mode',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.engine
*
* @return {Promise} A promise for info on the vehicle's engine
*/
Vehicle.prototype.engine = function() {

  return this.request({
    uri: 'engine',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.engineCoolant
*
* @return {Promise} A promise for info on the vehicle's engineCoolant
*/
Vehicle.prototype.engineCoolant = function() {

  return this.request({
    uri: 'engine/coolant',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.engineHood
*
* @return {Promise} A promise for info on the vehicle's engineHood
*/
Vehicle.prototype.engineHood = function() {

  return this.request({
    uri: 'engine/hood',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.engineOil
*
* @return {Promise} A promise for info on the vehicle's engineOil
*/
Vehicle.prototype.engineOil = function() {

  return this.request({
    uri: 'engine/oil',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.engineThrottle
*
* @return {Promise} A promise for info on the vehicle's engineThrottle
*/
Vehicle.prototype.engineThrottle = function() {

  return this.request({
    uri: 'engine/throttle',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.fuel
*
* @return {Promise} A promise for info on the vehicle's fuel
*/
Vehicle.prototype.fuel = function() {

  return this.request({
    uri: 'fuel',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.gyroscope
*
* @return {Promise} A promise for info on the vehicle's gyroscope
*/
Vehicle.prototype.gyroscope = function() {

  return this.request({
    uri: 'gyroscope',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.ignition
*
* @return {Promise} A promise for info on the vehicle's ignition
*/
Vehicle.prototype.ignition = function() {

  return this.request({
    uri: 'ignition',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.hazardLights
*
* @return {Promise} A promise for info on the vehicle's hazardLights
*/
Vehicle.prototype.hazardLights = function() {

  return this.request({
    uri: 'lights/hazard',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.headlights
*
* @return {Promise} A promise for info on the vehicle's headlights
*/
Vehicle.prototype.headlights = function() {

  return this.request({
    uri: 'lights/headlights',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.interiorLights
*
* @return {Promise} A promise for info on the vehicle's interiorLights
*/
Vehicle.prototype.interiorLights = function() {

  return this.request({
    uri: 'lights/interior',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.turnIndicator
*
* @return {Promise} A promise for info on the vehicle's turnIndicator
*/
Vehicle.prototype.turnIndicator = function() {

  return this.request({
    uri: 'lights/turn_indicator',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.location
*
* @return {Promise} A promise for info on the vehicle's location
*/
Vehicle.prototype.location = function() {

  return this.request({
    uri: 'location',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.sideviewMirrors
*
* @return {Promise} A promise for info on the vehicle's sideviewMirrors
*/
Vehicle.prototype.sideviewMirrors = function() {

  return this.request({
    uri: 'mirrors/side_view',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.odometer
*
* @return {Promise} A promise for info on the vehicle's odometer
*/
Vehicle.prototype.odometer = function() {

  return this.request({
    uri: 'odometer',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.tripOdometers
*
* @return {Promise} A promise for info on the vehicle's tripOdometers
*/
Vehicle.prototype.tripOdometers = function() {

  return this.request({
    uri: 'odometer/trips',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.acceleratorPedal
*
* @return {Promise} A promise for info on the vehicle's acceleratorPedal
*/
Vehicle.prototype.acceleratorPedal = function() {

  return this.request({
    uri: 'pedals/accelerator',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.brakePedal
*
* @return {Promise} A promise for info on the vehicle's brakePedal
*/
Vehicle.prototype.brakePedal = function() {

  return this.request({
    uri: 'pedals/brake',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.rainSensor
*
* @return {Promise} A promise for info on the vehicle's rainSensor
*/
Vehicle.prototype.rainSensor = function() {

  return this.request({
    uri: 'rain_sensor',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.seats
*
* @return {Promise} A promise for info on the vehicle's seats
*/
Vehicle.prototype.seats = function() {

  return this.request({
    uri: 'seats',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.security
*
* @return {Promise} A promise for info on the vehicle's security
*/
Vehicle.prototype.security = function() {

  return this.request({
    uri: 'security',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.sliBattery
*
* @return {Promise} A promise for info on the vehicle's sliBattery
*/
Vehicle.prototype.sliBattery = function() {

  return this.request({
    uri: 'sli_battery',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.speedometer
*
* @return {Promise} A promise for info on the vehicle's speedometer
*/
Vehicle.prototype.speedometer = function() {

  return this.request({
    uri: 'speedometer',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.steeringWheel
*
* @return {Promise} A promise for info on the vehicle's steeringWheel
*/
Vehicle.prototype.steeringWheel = function() {

  return this.request({
    uri: 'steering_wheel',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.sunroof
*
* @return {Promise} A promise for info on the vehicle's sunroof
*/
Vehicle.prototype.sunroof = function() {

  return this.request({
    uri: 'sunroof',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.tachometer
*
* @return {Promise} A promise for info on the vehicle's tachometer
*/
Vehicle.prototype.tachometer = function() {

  return this.request({
    uri: 'tachometer',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.interiorThermistor
*
* @return {Promise} A promise for info on the vehicle's interiorThermistor
*/
Vehicle.prototype.interiorThermistor = function() {

  return this.request({
    uri: 'thermistors/interior',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.exteriorThermistor
*
* @return {Promise} A promise for info on the vehicle's exteriorThermistor
*/
Vehicle.prototype.exteriorThermistor = function() {

  return this.request({
    uri: 'thermistors/exterior',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.tires
*
* @return {Promise} A promise for info on the vehicle's tires
*/
Vehicle.prototype.tires = function() {

  return this.request({
    uri: 'tires',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.transmission
*
* @return {Promise} A promise for info on the vehicle's transmission
*/
Vehicle.prototype.transmission = function() {

  return this.request({
    uri: 'transmission',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.transmissionFluid
*
* @return {Promise} A promise for info on the vehicle's transmissionFluid
*/
Vehicle.prototype.transmissionFluid = function() {

  return this.request({
    uri: 'transmission/fluid',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.frontTrunk
*
* @return {Promise} A promise for info on the vehicle's frontTrunk
*/
Vehicle.prototype.frontTrunk = function() {

  return this.request({
    uri: 'trunks/front',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.rearTrunk
*
* @return {Promise} A promise for info on the vehicle's rearTrunk
*/
Vehicle.prototype.rearTrunk = function() {

  return this.request({
    uri: 'trunks/rear',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.vin
*
* @return {Promise} A promise for info on the vehicle's vin
*/
Vehicle.prototype.vin = function() {

  return this.request({
    uri: 'vin',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.washerFluid
*
* @return {Promise} A promise for info on the vehicle's washerFluid
*/
Vehicle.prototype.washerFluid = function() {

  return this.request({
    uri: 'washer_fluid',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.wheels
*
* @return {Promise} A promise for info on the vehicle's wheels
*/
Vehicle.prototype.wheels = function() {

  return this.request({
    uri: 'wheels',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.wheelSpeeds
*
* @return {Promise} A promise for info on the vehicle's wheelSpeeds
*/
Vehicle.prototype.wheelSpeeds = function() {

  return this.request({
    uri: 'wheels/speeds',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* GET Vehicle.windows
*
* @return {Promise} A promise for info on the vehicle's windows
*/
Vehicle.prototype.windows = function() {

  return this.request({
    uri: 'windows',
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};

/**
* POST Vehicle.startCharging
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.startCharging = function(data) {
  data = data || {};
  data.action = 'START';
  return this.request({
    uri: 'charge',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.stopCharging
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.stopCharging = function(data) {
  data = data || {};
  data.action = 'STOP';
  return this.request({
    uri: 'charge',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.enableChargeLimit
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.enableChargeLimit = function(data) {
  data = data || {};
  data.action = 'ENABLE';
  return this.request({
    uri: 'charge/limit',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.disableChargeLimit
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.disableChargeLimit = function(data) {
  data = data || {};
  data.action = 'DISABLE';
  return this.request({
    uri: 'charge/limit',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.enableChargeSchedule
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.enableChargeSchedule = function(data) {
  data = data || {};
  data.action = 'ENABLE';
  return this.request({
    uri: 'charge/schedule',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.disableChargeSchedule
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.disableChargeSchedule = function(data) {
  data = data || {};
  data.action = 'DISABLE';
  return this.request({
    uri: 'charge/schedule',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.activateChildSafetyLocks
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.activateChildSafetyLocks = function(data) {
  if (_.isNil(data) || _.isNil(data.childSafetyLocks)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to activateChildSafetyLocks must have \'childSafetyLocks\'.');
  }
  data.action = 'LOCK';
  return this.request({
    uri: 'doors/child_safety_locks',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.disableChildSafetyLocks
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.disableChildSafetyLocks = function(data) {
  if (_.isNil(data) || _.isNil(data.childSafetyLocks)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to disableChildSafetyLocks must have \'childSafetyLocks\'.');
  }
  data.action = 'UNLOCK';
  return this.request({
    uri: 'doors/child_safety_locks',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.startClimate
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.startClimate = function(data) {
  data = data || {};
  data.action = 'START';
  return this.request({
    uri: 'climate',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.stopClimate
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.stopClimate = function(data) {
  data = data || {};
  data.action = 'STOP';
  return this.request({
    uri: 'climate',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.openEngineHood
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.openEngineHood = function(data) {
  data = data || {};
  data.action = 'OPEN';
  return this.request({
    uri: 'engine/hood',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.closeEngineHood
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.closeEngineHood = function(data) {
  data = data || {};
  data.action = 'CLOSE';
  return this.request({
    uri: 'engine/hood',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.honkHorn
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.honkHorn = function(data) {
  data = data || {};
  data.action = 'HONK';
  return this.request({
    uri: 'horn',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.startIgnition
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.startIgnition = function(data) {
  data = data || {};
  data.action = 'START';
  return this.request({
    uri: 'ignition',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.setIgnitionOn
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.setIgnitionOn = function(data) {
  data = data || {};
  data.action = 'ON';
  return this.request({
    uri: 'ignition',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.setIgnitionAccessory
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.setIgnitionAccessory = function(data) {
  data = data || {};
  data.action = 'ACCESSORY';
  return this.request({
    uri: 'ignition',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.setIgnitionOff
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.setIgnitionOff = function(data) {
  data = data || {};
  data.action = 'OFF';
  return this.request({
    uri: 'ignition',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.flashHeadlights
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.flashHeadlights = function(data) {
  if (_.isNil(data) || _.isNil(data.type)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to flashHeadlights must have property \'type\'.');
  }
  data.action = 'FLASH';
  return this.request({
    uri: 'lights/headlights',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.tiltSideviewMirrors
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.tiltSideviewMirrors = function(data) {
  if (_.isNil(data) || _.isNil(data.mirrors)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to tiltSideviewMirrors must have \'mirrors\'.');
  }
  data.action = 'TILT';
  return this.request({
    uri: 'mirrors/side_view',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.startPanic
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.startPanic = function(data) {
  data = data || {};
  data.action = 'START';
  return this.request({
    uri: 'panic',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.stopPanic
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.stopPanic = function(data) {
  data = data || {};
  data.action = 'STOP';
  return this.request({
    uri: 'panic',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.openChargePort
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.openChargePort = function(data) {
  data = data || {};
  data.action = 'OPEN';
  return this.request({
    uri: 'ports/charge',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.closeChargePort
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.closeChargePort = function(data) {
  data = data || {};
  data.action = 'CLOSE';
  return this.request({
    uri: 'ports/charge',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.openFuelPort
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.openFuelPort = function(data) {
  data = data || {};
  data.action = 'OPEN';
  return this.request({
    uri: 'ports/fuel',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.closeFuelPort
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.closeFuelPort = function(data) {
  data = data || {};
  data.action = 'CLOSE';
  return this.request({
    uri: 'ports/fuel',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.lock
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.lock = function(data) {
  data = data || {};
  data.action = 'LOCK';
  return this.request({
    uri: 'security',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.unlock
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.unlock = function(data) {
  data = data || {};
  data.action = 'UNLOCK';
  return this.request({
    uri: 'security',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.openSunroof
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.openSunroof = function(data) {
  data = data || {};
  data.action = 'OPEN';
  return this.request({
    uri: 'sunroof',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.ventSunroof
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.ventSunroof = function(data) {
  data = data || {};
  data.action = 'VENT';
  return this.request({
    uri: 'sunroof',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.closeSunroof
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.closeSunroof = function(data) {
  data = data || {};
  data.action = 'CLOSE';
  return this.request({
    uri: 'sunroof',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.openFrontTrunk
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.openFrontTrunk = function(data) {
  data = data || {};
  data.action = 'OPEN';
  return this.request({
    uri: 'trunks/front',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.closeFrontTrunk
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.closeFrontTrunk = function(data) {
  data = data || {};
  data.action = 'CLOSE';
  return this.request({
    uri: 'trunks/front',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.openRearTrunk
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.openRearTrunk = function(data) {
  data = data || {};
  data.action = 'OPEN';
  return this.request({
    uri: 'trunks/rear',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.closeRearTrunk
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.closeRearTrunk = function(data) {
  data = data || {};
  data.action = 'CLOSE';
  return this.request({
    uri: 'trunks/rear',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.openWindows
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.openWindows = function(data) {
  if (_.isNil(data) || _.isNil(data.windows)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to openWindows must have \'windows\'.');
  }
  data.action = 'OPEN';
  return this.request({
    uri: 'windows',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.closeWindows
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.closeWindows = function(data) {
  if (_.isNil(data) || _.isNil(data.windows)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to closeWindows must have \'windows\'.');
  }
  data.action = 'CLOSE';
  return this.request({
    uri: 'windows',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.lockWindows
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.lockWindows = function(data) {
  if (_.isNil(data) || _.isNil(data.windows)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to lockWindows must have \'windows\'.');
  }
  data.action = 'LOCK';
  return this.request({
    uri: 'windows',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};

/**
* POST Vehicle.unlockWindows
*
* @param {Object} data See the API Docs for what keys can be in this object
*
* @return {Promise} A success or failure response
*/
Vehicle.prototype.unlockWindows = function(data) {
  if (_.isNil(data) || _.isNil(data.windows)) {
    // eslint-disable-next-line max-len
    throw new TypeError('parameter object to unlockWindows must have \'windows\'.');
  }
  data.action = 'UNLOCK';
  return this.request({
    uri: 'windows',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'POST',
  });
};


module.exports = Vehicle;
