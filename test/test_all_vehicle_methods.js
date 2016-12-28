'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var Vehicle = require('../lib/vehicle');
var methods = require('../lib/vehicle_methods');

var VALID_TOKEN = 'valid-token';
var VALID_AUTHORIZATION = `Bearer ${VALID_TOKEN}`;
var VALID_VID = 'valid-vid';
var SUCCESS = {status: 'success'};

suite('Vehicle', function() {

  var vehicle = new Vehicle(VALID_VID, VALID_TOKEN);

  suiteSetup(function() {

    var apiNock = nock('https://api.smartcar.com/v1.0');

    Object.keys(methods).forEach(function(method) {
      var config = methods[method];
      if (config.type === 'action') {
        apiNock
          .post(`/vehicles/${VALID_VID}/${config.endpoint}`).times(2)
          .matchHeader('Authorization', VALID_AUTHORIZATION)
          .reply(200, SUCCESS);
      } else {
        apiNock
          .get(`/vehicles/${VALID_VID}/${config.endpoint || ''}`)
          .matchHeader('Authorization', VALID_AUTHORIZATION)
          .reply(200, SUCCESS);
      }
    });
  });

  suiteTeardown(function() {
    nock.cleanAll();
  });

  test('info no args', function() {
    return vehicle.info()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('accelerometer no args', function() {
    return vehicle.accelerometer()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('airbags no args', function() {
    return vehicle.airbags()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('barometer no args', function() {
    return vehicle.barometer()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('battery no args', function() {
    return vehicle.battery()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('charge no args', function() {
    return vehicle.charge()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('chargeLimit no args', function() {
    return vehicle.chargeLimit()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('chargeSchedule no args', function() {
    return vehicle.chargeSchedule()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('climate no args', function() {
    return vehicle.climate()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('collisionSensor no args', function() {
    return vehicle.collisionSensor()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('compass no args', function() {
    return vehicle.compass()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('cruiseControl no args', function() {
    return vehicle.cruiseControl()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('dimensions no args', function() {
    return vehicle.dimensions()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('doors no args', function() {
    return vehicle.doors()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('childSafetyLocks no args', function() {
    return vehicle.childSafetyLocks()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('driveMode no args', function() {
    return vehicle.driveMode()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('engine no args', function() {
    return vehicle.engine()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('engineCoolant no args', function() {
    return vehicle.engineCoolant()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('engineHood no args', function() {
    return vehicle.engineHood()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('engineOil no args', function() {
    return vehicle.engineOil()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('engineThrottle no args', function() {
    return vehicle.engineThrottle()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('fuel no args', function() {
    return vehicle.fuel()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('gyroscope no args', function() {
    return vehicle.gyroscope()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('ignition no args', function() {
    return vehicle.ignition()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('hazardLights no args', function() {
    return vehicle.hazardLights()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('headlights no args', function() {
    return vehicle.headlights()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('interiorLights no args', function() {
    return vehicle.interiorLights()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('turnIndicator no args', function() {
    return vehicle.turnIndicator()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('location no args', function() {
    return vehicle.location()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('sideviewMirrors no args', function() {
    return vehicle.sideviewMirrors()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('odometer no args', function() {
    return vehicle.odometer()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('tripOdometers no args', function() {
    return vehicle.tripOdometers()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('acceleratorPedal no args', function() {
    return vehicle.acceleratorPedal()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('brakePedal no args', function() {
    return vehicle.brakePedal()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('rainSensor no args', function() {
    return vehicle.rainSensor()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('seats no args', function() {
    return vehicle.seats()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('security no args', function() {
    return vehicle.security()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('sliBattery no args', function() {
    return vehicle.sliBattery()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('speedometer no args', function() {
    return vehicle.speedometer()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('steeringWheel no args', function() {
    return vehicle.steeringWheel()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('sunroof no args', function() {
    return vehicle.sunroof()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('tachometer no args', function() {
    return vehicle.tachometer()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('interiorThermistor no args', function() {
    return vehicle.interiorThermistor()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('exteriorThermistor no args', function() {
    return vehicle.exteriorThermistor()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('tires no args', function() {
    return vehicle.tires()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('transmission no args', function() {
    return vehicle.transmission()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('transmissionFluid no args', function() {
    return vehicle.transmissionFluid()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('frontTrunk no args', function() {
    return vehicle.frontTrunk()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('rearTrunk no args', function() {
    return vehicle.rearTrunk()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('vin no args', function() {
    return vehicle.vin()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('washerFluid no args', function() {
    return vehicle.washerFluid()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('wheels no args', function() {
    return vehicle.wheels()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('wheelSpeeds no args', function() {
    return vehicle.wheelSpeeds()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('windows no args', function() {
    return vehicle.windows()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });



  test('startCharging no args', function() {
    return vehicle.startCharging()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('startCharging args', function() {
    return vehicle.startCharging({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('stopCharging no args', function() {
    return vehicle.stopCharging()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('stopCharging args', function() {
    return vehicle.stopCharging({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('enableChargeLimit no args', function() {
    return vehicle.enableChargeLimit()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('enableChargeLimit args', function() {
    return vehicle.enableChargeLimit({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('disableChargeLimit no args', function() {
    return vehicle.disableChargeLimit()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('disableChargeLimit args', function() {
    return vehicle.disableChargeLimit({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('enableChargeSchedule no args', function() {
    return vehicle.enableChargeSchedule()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('enableChargeSchedule args', function() {
    return vehicle.enableChargeSchedule({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('disableChargeSchedule no args', function() {
    return vehicle.disableChargeSchedule()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('disableChargeSchedule args', function() {
    return vehicle.disableChargeSchedule({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('activateChildSafetyLocks no args', function() {
    return vehicle.activateChildSafetyLocks()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('activateChildSafetyLocks args', function() {
    return vehicle.activateChildSafetyLocks({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('disableChildSafetyLocks no args', function() {
    return vehicle.disableChildSafetyLocks()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('disableChildSafetyLocks args', function() {
    return vehicle.disableChildSafetyLocks({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('startClimate no args', function() {
    return vehicle.startClimate()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('startClimate args', function() {
    return vehicle.startClimate({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('stopClimate no args', function() {
    return vehicle.stopClimate()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('stopClimate args', function() {
    return vehicle.stopClimate({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openEngineHood no args', function() {
    return vehicle.openEngineHood()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openEngineHood args', function() {
    return vehicle.openEngineHood({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeEngineHood no args', function() {
    return vehicle.closeEngineHood()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeEngineHood args', function() {
    return vehicle.closeEngineHood({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('honkHorn no args', function() {
    return vehicle.honkHorn()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('honkHorn args', function() {
    return vehicle.honkHorn({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('startIgnition no args', function() {
    return vehicle.startIgnition()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('startIgnition args', function() {
    return vehicle.startIgnition({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('setIgnitionOn no args', function() {
    return vehicle.setIgnitionOn()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('setIgnitionOn args', function() {
    return vehicle.setIgnitionOn({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('setIgnitionAccessory no args', function() {
    return vehicle.setIgnitionAccessory()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('setIgnitionAccessory args', function() {
    return vehicle.setIgnitionAccessory({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('setIgnitionOff no args', function() {
    return vehicle.setIgnitionOff()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('setIgnitionOff args', function() {
    return vehicle.setIgnitionOff({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('flashHeadlights no args', function() {
    return vehicle.flashHeadlights()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('flashHeadlights args', function() {
    return vehicle.flashHeadlights({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('tiltSideviewMirrors no args', function() {
    return vehicle.tiltSideviewMirrors()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('tiltSideviewMirrors args', function() {
    return vehicle.tiltSideviewMirrors({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('startPanic no args', function() {
    return vehicle.startPanic()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('startPanic args', function() {
    return vehicle.startPanic({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('stopPanic no args', function() {
    return vehicle.stopPanic()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('stopPanic args', function() {
    return vehicle.stopPanic({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openChargePort no args', function() {
    return vehicle.openChargePort()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openChargePort args', function() {
    return vehicle.openChargePort({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeChargePort no args', function() {
    return vehicle.closeChargePort()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeChargePort args', function() {
    return vehicle.closeChargePort({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openFuelPort no args', function() {
    return vehicle.openFuelPort()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openFuelPort args', function() {
    return vehicle.openFuelPort({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeFuelPort no args', function() {
    return vehicle.closeFuelPort()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeFuelPort args', function() {
    return vehicle.closeFuelPort({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('lock no args', function() {
    return vehicle.lock()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('lock args', function() {
    return vehicle.lock({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('unlock no args', function() {
    return vehicle.unlock()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('unlock args', function() {
    return vehicle.unlock({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openSunroof no args', function() {
    return vehicle.openSunroof()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openSunroof args', function() {
    return vehicle.openSunroof({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('ventSunroof no args', function() {
    return vehicle.ventSunroof()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('ventSunroof args', function() {
    return vehicle.ventSunroof({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeSunroof no args', function() {
    return vehicle.closeSunroof()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeSunroof args', function() {
    return vehicle.closeSunroof({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openFrontTrunk no args', function() {
    return vehicle.openFrontTrunk()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openFrontTrunk args', function() {
    return vehicle.openFrontTrunk({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeFrontTrunk no args', function() {
    return vehicle.closeFrontTrunk()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeFrontTrunk args', function() {
    return vehicle.closeFrontTrunk({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openRearTrunk no args', function() {
    return vehicle.openRearTrunk()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openRearTrunk args', function() {
    return vehicle.openRearTrunk({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeRearTrunk no args', function() {
    return vehicle.closeRearTrunk()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeRearTrunk args', function() {
    return vehicle.closeRearTrunk({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openWindows no args', function() {
    return vehicle.openWindows()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('openWindows args', function() {
    return vehicle.openWindows({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeWindows no args', function() {
    return vehicle.closeWindows()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('closeWindows args', function() {
    return vehicle.closeWindows({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('lockWindows no args', function() {
    return vehicle.lockWindows()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('lockWindows args', function() {
    return vehicle.lockWindows({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('unlockWindows no args', function() {
    return vehicle.unlockWindows()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('unlockWindows args', function() {
    return vehicle.unlockWindows({arg: 'test'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
});
