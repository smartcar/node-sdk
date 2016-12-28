'use strict';
var request = require('request-promise');
var util = require('./util');


/**
 * Initializes Vehicle object
 * @constructor
 * @param {String} token a valid access token
 * @param {string} vid the vehicle's unique identifier
 */
function Vehicle(vid, token, unitSystem) {
  unitSystem = unitSystem || 'metric';
  if (!(['imperial', 'metric'].includes(unitSystem))) {
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
    json: true,
  });
}

Vehicle.prototype.setUnitSystem = function(unitSystem) {
  if (!(['imperial', 'metric'].includes(unitSystem))) {
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

Vehicle.prototype.info = function(data) {
  data = data || {};

  return this.request({
    uri: '/',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.accelerometer = function(data) {
  data = data || {};

  return this.request({
    uri: 'accelerometer',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.airbags = function(data) {
  data = data || {};

  return this.request({
    uri: 'airbags',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.barometer = function(data) {
  data = data || {};

  return this.request({
    uri: 'barometer',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.battery = function(data) {
  data = data || {};

  return this.request({
    uri: 'battery',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.charge = function(data) {
  data = data || {};

  return this.request({
    uri: 'charge',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.chargeLimit = function(data) {
  data = data || {};

  return this.request({
    uri: 'charge/limit',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.chargeSchedule = function(data) {
  data = data || {};

  return this.request({
    uri: 'charge/schedule',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.climate = function(data) {
  data = data || {};

  return this.request({
    uri: 'climate',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.collisionSensor = function(data) {
  data = data || {};

  return this.request({
    uri: 'collision_sensor',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.compass = function(data) {
  data = data || {};

  return this.request({
    uri: 'compass',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.cruiseControl = function(data) {
  data = data || {};

  return this.request({
    uri: 'cruise_control',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.dimensions = function(data) {
  data = data || {};

  return this.request({
    uri: 'dimensions',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.doors = function(data) {
  data = data || {};

  return this.request({
    uri: 'doors',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.childSafetyLocks = function(data) {
  data = data || {};

  return this.request({
    uri: 'doors/child_safety_locks',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.driveMode = function(data) {
  data = data || {};

  return this.request({
    uri: 'drive_mode',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.engine = function(data) {
  data = data || {};

  return this.request({
    uri: 'engine',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.engineCoolant = function(data) {
  data = data || {};

  return this.request({
    uri: 'engine/coolant',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.engineHood = function(data) {
  data = data || {};

  return this.request({
    uri: 'engine/hood',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.engineOil = function(data) {
  data = data || {};

  return this.request({
    uri: 'engine/oil',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.engineThrottle = function(data) {
  data = data || {};

  return this.request({
    uri: 'engine/throttle',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.fuel = function(data) {
  data = data || {};

  return this.request({
    uri: 'fuel',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.gyroscope = function(data) {
  data = data || {};

  return this.request({
    uri: 'gyroscope',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.ignition = function(data) {
  data = data || {};

  return this.request({
    uri: 'ignition',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.hazardLights = function(data) {
  data = data || {};

  return this.request({
    uri: 'lights/hazard',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.headlights = function(data) {
  data = data || {};

  return this.request({
    uri: 'lights/headlights',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.interiorLights = function(data) {
  data = data || {};

  return this.request({
    uri: 'lights/interior',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.turnIndicator = function(data) {
  data = data || {};

  return this.request({
    uri: 'lights/turn_indicator',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.location = function(data) {
  data = data || {};

  return this.request({
    uri: 'location',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.sideviewMirrors = function(data) {
  data = data || {};

  return this.request({
    uri: 'mirrors/side_view',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.odometer = function(data) {
  data = data || {};

  return this.request({
    uri: 'odometer',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.tripOdometers = function(data) {
  data = data || {};

  return this.request({
    uri: 'odometer/trips',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.acceleratorPedal = function(data) {
  data = data || {};

  return this.request({
    uri: 'pedals/accelerator',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.brakePedal = function(data) {
  data = data || {};

  return this.request({
    uri: 'pedals/brake',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.rainSensor = function(data) {
  data = data || {};

  return this.request({
    uri: 'rain_sensor',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.seats = function(data) {
  data = data || {};

  return this.request({
    uri: 'seats',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.security = function(data) {
  data = data || {};

  return this.request({
    uri: 'security',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.sliBattery = function(data) {
  data = data || {};

  return this.request({
    uri: 'sli_battery',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.speedometer = function(data) {
  data = data || {};

  return this.request({
    uri: 'speedometer',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.steeringWheel = function(data) {
  data = data || {};

  return this.request({
    uri: 'steering_wheel',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.sunroof = function(data) {
  data = data || {};

  return this.request({
    uri: 'sunroof',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.tachometer = function(data) {
  data = data || {};

  return this.request({
    uri: 'tachometer',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.interiorThermistor = function(data) {
  data = data || {};

  return this.request({
    uri: 'thermistors/interior',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.exteriorThermistor = function(data) {
  data = data || {};

  return this.request({
    uri: 'thermistors/exterior',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.tires = function(data) {
  data = data || {};

  return this.request({
    uri: 'tires',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.transmission = function(data) {
  data = data || {};

  return this.request({
    uri: 'transmission',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.transmissionFluid = function(data) {
  data = data || {};

  return this.request({
    uri: 'transmission/fluid',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.frontTrunk = function(data) {
  data = data || {};

  return this.request({
    uri: 'trunks/front',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.rearTrunk = function(data) {
  data = data || {};

  return this.request({
    uri: 'trunks/rear',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.vin = function(data) {
  data = data || {};

  return this.request({
    uri: 'vin',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.washerFluid = function(data) {
  data = data || {};

  return this.request({
    uri: 'washer_fluid',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.wheels = function(data) {
  data = data || {};

  return this.request({
    uri: 'wheels',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.wheelSpeeds = function(data) {
  data = data || {};

  return this.request({
    uri: 'wheels/speeds',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


Vehicle.prototype.windows = function(data) {
  data = data || {};

  return this.request({
    uri: 'windows',
    body: data,
    headers: {
      'sc-unit-system': this.unitSystem,
    },
    method: 'GET',
  });
};


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


Vehicle.prototype.activateChildSafetyLocks = function(data) {
  data = data || {};
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


Vehicle.prototype.disableChildSafetyLocks = function(data) {
  data = data || {};
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


Vehicle.prototype.flashHeadlights = function(data) {
  data = data || {};
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


Vehicle.prototype.tiltSideviewMirrors = function(data) {
  data = data || {};
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


Vehicle.prototype.openWindows = function(data) {
  data = data || {};
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


Vehicle.prototype.closeWindows = function(data) {
  data = data || {};
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


Vehicle.prototype.lockWindows = function(data) {
  data = data || {};
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


Vehicle.prototype.unlockWindows = function(data) {
  data = data || {};
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
