'use strict';

const _ = require('lodash');

const util = require('./util');

/** @exports Vehicle */

/**
 * Initializes a new Vehicle to use for making requests to the Smartcar API.
 *
 * @constructor
 * @param {String} id - the vehicle's unique identifier
 * @param {String} token - a valid access token
 * @param {String} [unitSystem=metric] - the unit system to use for vehicle data
 * (metric/imperial)
 */
function Vehicle(id, token, unitSystem) {
  if (!(this instanceof Vehicle)) {
    // eslint-disable-next-line max-len
    throw new TypeError("Class constructor Vehicle cannot be invoked without 'new'");
  }

  this.id = id;
  this.token = token;
  this.request = util.request.defaults();
  this.setUnitSystem(unitSystem || 'metric');

  this.updateRequest({
    baseUrl: util.getUrl(this.id),
    auth: {
      bearer: this.token,
    },
  });
}

Vehicle.prototype.updateRequest = function(options) {
  this.request = this.request.defaults(options);
};

/**
 * Update the unit system to use in requests to the Smartcar API.
 *
 * @param {String} unitSystem - the unit system to use (metric/imperial)
 */
Vehicle.prototype.setUnitSystem = function(unitSystem) {

  if (['imperial', 'metric'].indexOf(unitSystem) < 0) {
    throw new TypeError('unit system must be one of: \'imperial\', \'metric\'');
  }

  this.unitSystem = unitSystem;
  this.updateRequest({
    headers: {
      'sc-unit-system': this.unitSystem,
    },
  });

};

/**
 * Disconnect this vehicle from the connected application.
 *
 * Note: Calling this method will invalidate your access token and you will
 * have to have the user reauthorize the vehicle to your application if
 * you wish to make requests to it
 *
 * @return {Promise} // TODO document return type more throughly
 */
Vehicle.prototype.disconnect = function() {
  return util.wrap(this.request.delete('application'));
};

/**
 * Fetch the list of permissions that this application has been granted for
 * this vehicle.
 *
 * @return {Promise} // TODO document return type more throughly
 */
Vehicle.prototype.permissions = function() {
  return util.wrap(this.request.get('permissions'));
};

/* VEHICLE API METHODS */


/**
 * GET Vehicle.info
 *
 * @return {Promise} A promise for info on the vehicle's info
 */
Vehicle.prototype.info = function() {
  return util.wrap(this.request.get('/'));
};

/**
 * GET Vehicle.accelerometer
 *
 * @return {Promise} A promise for info on the vehicle's accelerometer
 */
Vehicle.prototype.accelerometer = function() {
  return util.wrap(this.request.get('accelerometer'));
};

/**
 * GET Vehicle.airbags
 *
 * @return {Promise} A promise for info on the vehicle's airbags
 */
Vehicle.prototype.airbags = function() {
  return util.wrap(this.request.get('airbags'));
};

/**
 * GET Vehicle.barometer
 *
 * @return {Promise} A promise for info on the vehicle's barometer
 */
Vehicle.prototype.barometer = function() {
  return util.wrap(this.request.get('barometer'));
};

/**
 * GET Vehicle.battery
 *
 * @return {Promise} A promise for info on the vehicle's battery
 */
Vehicle.prototype.battery = function() {
  return util.wrap(this.request.get('battery'));
};

/**
 * GET Vehicle.charge
 *
 * @return {Promise} A promise for info on the vehicle's charge
 */
Vehicle.prototype.charge = function() {
  return util.wrap(this.request.get('charge'));
};

/**
 * GET Vehicle.chargeAmmeter
 *
 * @return {Promise} A promise for info on the vehicle's charge ammeter
 */
Vehicle.prototype.chargeAmmeter = function() {
  return util.wrap(this.request.get('charge/ammeter'));
};

/**
 * GET Vehicle.chargeLimit
 *
 * @return {Promise} A promise for info on the vehicle's chargeLimit
 */
Vehicle.prototype.chargeLimit = function() {
  return util.wrap(this.request.get('charge/limit'));
};

/**
 * GET Vehicle.chargeSchedule
 *
 * @return {Promise} A promise for info on the vehicle's chargeSchedule
 */
Vehicle.prototype.chargeSchedule = function() {
  return util.wrap(this.request.get('charge/schedule'));
};

/**
 * GET Vehicle.chargeVoltmeter
 *
 * @return {Promise} A promise for info on the vehicle's charge voltmeter
 */
Vehicle.prototype.chargeVoltmeter = function() {
  return util.wrap(this.request.get('charge/voltmeter'));
};

/**
 * GET Vehicle.climate
 *
 * @return {Promise} A promise for info on the vehicle's climate
 */
Vehicle.prototype.climate = function() {
  return util.wrap(this.request.get('climate'));
};

/**
 * GET Vehicle.collisionSensor
 *
 * @return {Promise} A promise for info on the vehicle's collisionSensor
 */
Vehicle.prototype.collisionSensor = function() {
  return util.wrap(this.request.get('collision_sensor'));
};

/**
 * GET Vehicle.compass
 *
 * @return {Promise} A promise for info on the vehicle's compass
 */
Vehicle.prototype.compass = function() {
  return util.wrap(this.request.get('compass'));
};

/**
 * GET Vehicle.cruiseControl
 *
 * @return {Promise} A promise for info on the vehicle's cruiseControl
 */
Vehicle.prototype.cruiseControl = function() {
  return util.wrap(this.request.get('cruise_control'));
};

/**
 * GET Vehicle.dimensions
 *
 * @return {Promise} A promise for info on the vehicle's dimensions
 */
Vehicle.prototype.dimensions = function() {
  return util.wrap(this.request.get('dimensions'));
};

/**
 * GET Vehicle.doors
 *
 * @return {Promise} A promise for info on the vehicle's doors
 */
Vehicle.prototype.doors = function() {
  return util.wrap(this.request.get('doors'));
};

/**
 * GET Vehicle.childSafetyLocks
 *
 * @return {Promise} A promise for info on the vehicle's childSafetyLocks
 */
Vehicle.prototype.childSafetyLocks = function() {
  return util.wrap(this.request.get('doors/child_safety_locks'));
};

/**
 * GET Vehicle.driveMode
 *
 * @return {Promise} A promise for info on the vehicle's driveMode
 */
Vehicle.prototype.driveMode = function() {
  return util.wrap(this.request.get('drive_mode'));
};

/**
 * GET Vehicle.engine
 *
 * @return {Promise} A promise for info on the vehicle's engine
 */
Vehicle.prototype.engine = function() {
  return util.wrap(this.request.get('engine'));
};

/**
 * GET Vehicle.engineCoolant
 *
 * @return {Promise} A promise for info on the vehicle's engineCoolant
 */
Vehicle.prototype.engineCoolant = function() {
  return util.wrap(this.request.get('engine/coolant'));
};

/**
 * GET Vehicle.engineHood
 *
 * @return {Promise} A promise for info on the vehicle's engineHood
 */
Vehicle.prototype.engineHood = function() {
  return util.wrap(this.request.get('engine/hood'));
};

/**
 * GET Vehicle.engineOil
 *
 * @return {Promise} A promise for info on the vehicle's engineOil
 */
Vehicle.prototype.engineOil = function() {
  return util.wrap(this.request.get('engine/oil'));
};

/**
 * GET Vehicle.engineThrottle
 *
 * @return {Promise} A promise for info on the vehicle's engineThrottle
 */
Vehicle.prototype.engineThrottle = function() {
  return util.wrap(this.request.get('engine/throttle'));
};

/**
 * GET Vehicle.fuel
 *
 * @return {Promise} A promise for info on the vehicle's fuel
 */
Vehicle.prototype.fuel = function() {
  return util.wrap(this.request.get('fuel'));
};

/**
 * GET Vehicle.gyroscope
 *
 * @return {Promise} A promise for info on the vehicle's gyroscope
 */
Vehicle.prototype.gyroscope = function() {
  return util.wrap(this.request.get('gyroscope'));
};

/**
 * GET Vehicle.ignition
 *
 * @return {Promise} A promise for info on the vehicle's ignition
 */
Vehicle.prototype.ignition = function() {
  return util.wrap(this.request.get('ignition'));
};

/**
 * GET Vehicle.hazardLight
 *
 * @return {Promise} A promise for info on the vehicle's hazardLight
 */
Vehicle.prototype.hazardLight = function() {
  return util.wrap(this.request.get('lights/hazard'));
};

/**
 * GET Vehicle.headlights
 *
 * @return {Promise} A promise for info on the vehicle's headlights
 */
Vehicle.prototype.headlights = function() {
  return util.wrap(this.request.get('lights/headlights'));
};

/**
 * GET Vehicle.interiorLights
 *
 * @return {Promise} A promise for info on the vehicle's interiorLights
 */
Vehicle.prototype.interiorLights = function() {
  return util.wrap(this.request.get('lights/interior'));
};

/**
 * GET Vehicle.turnIndicator
 *
 * @return {Promise} A promise for info on the vehicle's turnIndicator
 */
Vehicle.prototype.turnIndicator = function() {
  return util.wrap(this.request.get('lights/turn_indicator'));
};

/**
 * GET Vehicle.location
 *
 * @return {Promise} A promise for info on the vehicle's location
 */
Vehicle.prototype.location = function() {
  return util.wrap(this.request.get('location'));
};

/**
 * GET Vehicle.sideviewMirrors
 *
 * @return {Promise} A promise for info on the vehicle's sideviewMirrors
 */
Vehicle.prototype.sideviewMirrors = function() {
  return util.wrap(this.request.get('mirrors/side_view'));
};

/**
 * GET Vehicle.odometer
 *
 * @return {Promise} A promise for info on the vehicle's odometer
 */
Vehicle.prototype.odometer = function() {
  return util.wrap(this.request.get('odometer'));
};

/**
 * GET Vehicle.tripOdometers
 *
 * @return {Promise} A promise for info on the vehicle's tripOdometers
 */
Vehicle.prototype.tripOdometers = function() {
  return util.wrap(this.request.get('odometer/trips'));
};

/**
 * GET Vehicle.acceleratorPedal
 *
 * @return {Promise} A promise for info on the vehicle's acceleratorPedal
 */
Vehicle.prototype.acceleratorPedal = function() {
  return util.wrap(this.request.get('pedals/accelerator'));
};

/**
 * GET Vehicle.brakePedal
 *
 * @return {Promise} A promise for info on the vehicle's brakePedal
 */
Vehicle.prototype.brakePedal = function() {
  return util.wrap(this.request.get('pedals/brake'));
};

/**
 * GET Vehicle.rainSensor
 *
 * @return {Promise} A promise for info on the vehicle's rainSensor
 */
Vehicle.prototype.rainSensor = function() {
  return util.wrap(this.request.get('rain_sensor'));
};

/**
 * GET Vehicle.seats
 *
 * @return {Promise} A promise for info on the vehicle's seats
 */
Vehicle.prototype.seats = function() {
  return util.wrap(this.request.get('seats'));
};

/**
 * GET Vehicle.security
 *
 * @return {Promise} A promise for info on the vehicle's security
 */
Vehicle.prototype.security = function() {
  return util.wrap(this.request.get('security'));
};

/**
 * GET Vehicle.sliBattery
 *
 * @return {Promise} A promise for info on the vehicle's sliBattery
 */
Vehicle.prototype.sliBattery = function() {
  return util.wrap(this.request.get('sli_battery'));
};

/**
 * GET Vehicle.speedometer
 *
 * @return {Promise} A promise for info on the vehicle's speedometer
 */
Vehicle.prototype.speedometer = function() {
  return util.wrap(this.request.get('speedometer'));
};

/**
 * GET Vehicle.steeringWheel
 *
 * @return {Promise} A promise for info on the vehicle's steeringWheel
 */
Vehicle.prototype.steeringWheel = function() {
  return util.wrap(this.request.get('steering_wheel'));
};

/**
 * GET Vehicle.sunroof
 *
 * @return {Promise} A promise for info on the vehicle's sunroof
 */
Vehicle.prototype.sunroof = function() {
  return util.wrap(this.request.get('sunroof'));
};

/**
 * GET Vehicle.tachometer
 *
 * @return {Promise} A promise for info on the vehicle's tachometer
 */
Vehicle.prototype.tachometer = function() {
  return util.wrap(this.request.get('tachometer'));
};

/**
 * GET Vehicle.interiorThermistor
 *
 * @return {Promise} A promise for info on the vehicle's interiorThermistor
 */
Vehicle.prototype.interiorThermistor = function() {
  return util.wrap(this.request.get('thermistors/interior'));
};

/**
 * GET Vehicle.exteriorThermistor
 *
 * @return {Promise} A promise for info on the vehicle's exteriorThermistor
 */
Vehicle.prototype.exteriorThermistor = function() {
  return util.wrap(this.request.get('thermistors/exterior'));
};

/**
 * GET Vehicle.tires
 *
 * @return {Promise} A promise for info on the vehicle's tires
 */
Vehicle.prototype.tires = function() {
  return util.wrap(this.request.get('tires'));
};

/**
 * GET Vehicle.transmission
 *
 * @return {Promise} A promise for info on the vehicle's transmission
 */
Vehicle.prototype.transmission = function() {
  return util.wrap(this.request.get('transmission'));
};

/**
 * GET Vehicle.transmissionFluid
 *
 * @return {Promise} A promise for info on the vehicle's transmissionFluid
 */
Vehicle.prototype.transmissionFluid = function() {
  return util.wrap(this.request.get('transmission/fluid'));
};

/**
 * GET Vehicle.frontTrunk
 *
 * @return {Promise} A promise for info on the vehicle's frontTrunk
 */
Vehicle.prototype.frontTrunk = function() {
  return util.wrap(this.request.get('trunks/front'));
};

/**
 * GET Vehicle.rearTrunk
 *
 * @return {Promise} A promise for info on the vehicle's rearTrunk
 */
Vehicle.prototype.rearTrunk = function() {
  return util.wrap(this.request.get('trunks/rear'));
};

/**
 * GET Vehicle.vin
 *
 * @return {Promise} A promise for info on the vehicle's vin
 */
Vehicle.prototype.vin = function() {
  return util.wrap(this.request.get('vin'));
};

/**
 * GET Vehicle.washerFluid
 *
 * @return {Promise} A promise for info on the vehicle's washerFluid
 */
Vehicle.prototype.washerFluid = function() {
  return util.wrap(this.request.get('washer_fluid'));
};

/**
 * GET Vehicle.wheels
 *
 * @return {Promise} A promise for info on the vehicle's wheels
 */
Vehicle.prototype.wheels = function() {
  return util.wrap(this.request.get('wheels'));
};

/**
 * GET Vehicle.wheelSpeeds
 *
 * @return {Promise} A promise for info on the vehicle's wheelSpeeds
 */
Vehicle.prototype.wheelSpeeds = function() {
  return util.wrap(this.request.get('wheels/speeds'));
};

/**
 * GET Vehicle.windows
 *
 * @return {Promise} A promise for info on the vehicle's windows
 */
Vehicle.prototype.windows = function() {
  return util.wrap(this.request.get('windows'));
};

/**
 * POST Vehicle.startCharging
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startCharging = function() {
  return util.wrap(this.request.post('charge', {
    body: {action: 'START'},
  }));
};

/**
 * POST Vehicle.stopCharging
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.stopCharging = function() {
  return util.wrap(this.request.post('charge', {
    body: {action: 'STOP'},
  }));
};

/**
 * POST Vehicle.enableChargeLimit
 *
 * @param {Float} [limit] - override the previously set limit,
 *                          must be between 0 - 1
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.enableChargeLimit = function(limit) {
  return util.wrap(this.request.post('charge/limit', {
    body: {limit, action: 'ENABLE'},
  }));
};

/**
 * POST Vehicle.disableChargeLimit
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.disableChargeLimit = function() {
  return util.wrap(this.request.post('charge/limit', {
    body: {action: 'DISABLE'},
  }));
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
  return util.wrap(this.request.post('charge/schedule', {
    body: {action: 'ENABLE', startTime},
  }));
};

/**
 * POST Vehicle.disableChargeSchedule
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.disableChargeSchedule = function() {
  return util.wrap(this.request.post('charge/schedule', {
    body: {action: 'DISABLE'},
  }));
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
  return util.wrap(this.request.post('doors/child_safety_locks', {
    body: {action: 'LOCK', childSafetyLocks: childSafetyLocksArr},
  }));
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
  return util.wrap(this.request.post('doors/child_safety_locks', {
    body: {action: 'UNLOCK', childSafetyLocks: childSafetyLocksArr},
  }));
};

/**
 * POST Vehicle.startClimate
 *
 * @param {Number} temperature the temperature to set the car to
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startClimate = function(temperature) {
  return util.wrap(this.request.post('climate', {
    body: {action: 'START', temperature},
  }));
};

/**
 * POST Vehicle.stopClimate
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.stopClimate = function() {
  return util.wrap(this.request.post('climate', {
    body: {action: 'STOP'},
  }));
};

/**
 * POST Vehicle.openEngineHood
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openEngineHood = function() {
  return util.wrap(this.request.post('engine/hood', {
    body: {action: 'OPEN'},
  }));
};

/**
 * POST Vehicle.closeEngineHood
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeEngineHood = function() {
  return util.wrap(this.request.post('engine/hood', {
    body: {action: 'CLOSE'},
  }));
};

/**
 * POST Vehicle.honkHorn
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.honkHorn = function() {
  return util.wrap(this.request.post('horn', {
    body: {action: 'HONK'},
  }));
};

/**
 * POST Vehicle.startIgnition
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startIgnition = function() {
  return util.wrap(this.request.post('ignition', {
    body: {action: 'START'},
  }));
};

/**
 * POST Vehicle.setIgnitionOn
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.setIgnitionOn = function() {
  return util.wrap(this.request.post('ignition', {
    body: {action: 'ON'},
  }));
};

/**
 * POST Vehicle.setIgnitionAccessory
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.setIgnitionAccessory = function() {
  return util.wrap(this.request.post('ignition', {
    body: {action: 'ACCESSORY'},
  }));
};

/**
 * POST Vehicle.setIgnitionOff
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.setIgnitionOff = function() {
  return util.wrap(this.request.post('ignition', {
    body: {action: 'OFF'},
  }));
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
  return util.wrap(this.request.post('lights/headlights', {
    body: {action: 'FLASH', type},
  }));
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
  return util.wrap(this.request.post('mirrors/side_view', {
    body: {action: 'TILT', mirrors: mirrorsArr},
  }));
};

/**
 * POST Vehicle.startPanic
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.startPanic = function() {
  return util.wrap(this.request.post('panic', {
    body: {action: 'START'},
  }));
};

/**
 * POST Vehicle.stopPanic
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.stopPanic = function() {
  return util.wrap(this.request.post('panic', {
    body: {action: 'STOP'},
  }));
};

/**
 * POST Vehicle.openChargePort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openChargePort = function() {
  return util.wrap(this.request.post('ports/charge', {
    body: {action: 'OPEN'},
  }));
};

/**
 * POST Vehicle.closeChargePort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeChargePort = function() {
  return util.wrap(this.request.post('ports/charge', {
    body: {action: 'CLOSE'},
  }));
};

/**
 * POST Vehicle.openFuelPort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openFuelPort = function() {
  return util.wrap(this.request.post('ports/fuel', {
    body: {action: 'OPEN'},
  }));
};

/**
 * POST Vehicle.closeFuelPort
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeFuelPort = function() {
  return util.wrap(this.request.post('ports/fuel', {
    body: {action: 'CLOSE'},
  }));
};

/**
 * POST Vehicle.lock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.lock = function() {
  return util.wrap(this.request.post('security', {
    body: {action: 'LOCK'},
  }));
};

/**
 * POST Vehicle.unlock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.unlock = function() {
  return util.wrap(this.request.post('security', {
    body: {action: 'UNLOCK'},
  }));
};

/**
 * POST Vehicle.openSunroof
 *
 * @param {Number} percentOpen max: 1, min: 0
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openSunroof = function(percentOpen) {

  if (!_.isNumber(percentOpen)) {
    throw new TypeError('"percentOpen" argument must be a number');
  }

  return util.wrap(this.request.post('sunroof', {
    body: {action: 'OPEN', percentOpen},
  }));
};

/**
 * POST Vehicle.ventSunroof
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.ventSunroof = function() {
  return util.wrap(this.request.post('sunroof', {
    body: {action: 'VENT'},
  }));
};

/**
 * POST Vehicle.closeSunroof
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeSunroof = function() {
  return util.wrap(this.request.post('sunroof', {
    body: {action: 'CLOSE'},
  }));
};

/**
 * POST Vehicle.openFrontTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openFrontTrunk = function() {
  return util.wrap(this.request.post('trunks/front', {
    body: {action: 'OPEN'},
  }));
};

/**
 * POST Vehicle.closeFrontTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeFrontTrunk = function() {
  return util.wrap(this.request.post('trunks/front', {
    body: {action: 'CLOSE'},
  }));
};

/**
 * POST Vehicle.openRearTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.openRearTrunk = function() {
  return util.wrap(this.request.post('trunks/rear', {
    body: {action: 'OPEN'},
  }));
};

/**
 * POST Vehicle.closeRearTrunk
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.closeRearTrunk = function() {
  return util.wrap(this.request.post('trunks/rear', {
    body: {action: 'CLOSE'},
  }));
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
  return util.wrap(this.request.post('windows', {
    body: {action: 'OPEN', windows: windowsArr},
  }));
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
  return util.wrap(this.request.post('windows', {
    body: {action: 'CLOSE', windows: windowsArr},
  }));
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
  return util.wrap(this.request.post('windows', {
    body: {action: 'LOCK', windows: windowsArr},
  }));
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
  return util.wrap(this.request.post('windows', {
    body: {action: 'UNLOCK', windows: windowsArr},
  }));
};


module.exports = Vehicle;
