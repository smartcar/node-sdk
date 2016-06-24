var util = require('./util')

var Smartcar = function(){}

Smartcar.serializeToken = function(callback){}

Smartcar.authorizeCodeHandler = function(request, response, next){}

Smartcar.loadToken = function(token){}

/*
    GET REQUESTS
*/
Smartcar.getVehicles = function(limit, offset){ 
    util.sendGetRequest().form({
        limit: limit || 10,
        offset: offset || 0
    }).then(function(response){
        return response.vehicles
    }).catch(console.log)
}

_getVehicle = getJSON() // make, model, year
getMake = _getVehicle.make
getModel = _getVehicle.model
getYear = _getVehicle.year

_getBattery = getJSON('battery') // range, percentRemaining
getBatteryRange = _getBattery.range
getBatteryRemaining = _getBattery.percentRemaining

getChargeState = getJSON('charge').state

_getClimate = getJSON('climate') // temperature, isOn
getTemperature = _getClimate.temperature
isClimateOn = _getClimate.isOn

getHeading = getJSON('compass').heading
_getDoors = getJSON('doors').doors 
/*
    {
      "location": "FRONT_RIGHT",
      "isOpen": false
    },
    {
      "location": "BACK_RIGHT",
      "isOpen": false
    },
    {
      "location": "FRONT_LEFT",
      "isOpen": false
    },
    {
      "location": "BACK_LEFT",
      "isOpen": false
    }
*/
// OFF, ACCESSORY_1, ACCESSORY_2, STARTED
getEngineState = getJSON('engine').state

isFrontTrunkOpen = getJSON('front_trunk').isOpen

_getFuel = getJSON('fuel') // range, percentRemaining
getFuelRange = _getFuel.range
getFuelRemaining = _getFuel.percentRemaining

_getLocation = getJSON('location') // latitude, longitude
getLatitude = _getLocation.latitude
getLongitude = _getLocation.longitude

// or maybe getDistance?
getOdometer = getJSON('odometer').distance

isLocked = getJSON('security').isLocked

// or maybe getSpeed?
getSpeedometer = getJSON('speedometer').speed

isSunroofOpen = getJSON('sunroof').isOpen

_getTires = getJSON('tires').tires
/*
    {
      "location": "FRONT_RIGHT",
      "pressure": 219.3
    },
    {
      "location": "BACK_RIGHT",
      "pressure": 218.7
    },
    {
      "location": "FRONT_LEFT",
      "pressure": 219.2
    },
    {
      "location": "BACK_RIGHT",
      "pressure": 215.5
    }
*/
// type: AUTOMATIC, ELECTTRIC, MANUAL
// state: PARK, NEUTRAL, REVERSE, DRIVE, OTHER
_getTransmission = getJSON('transmission')
isRearTrunkOpen = getJSON('trunk').isOpen
_getWindows = getJSON('windows').windows
/*
   {
      "location": "FRONT_RIGHT",
      "percentOpen": 0.0
    },
    {
      "location": "BACK_RIGHT",
      "percentOpen": 0.34
    },
    {
      "location": "FRONT_LEFT",
      "percentOpen": 0.0
    },
    {
      "location": "BACK_LEFT",
      "percentOpen": 0.0
    } 
*/

/*
    POST REQUESTS
*/
openChargePort = // POST /VID/charge/port action=OPEN
closeChargePort = // POST /VID/charge/port action=CLOSE
// climate: startClimate, stopClimate, setClimate?
startClimate = // POST /VID/climate action=START
stopClimate = // POST /VID/climate action=STOP
setClimate = // POST /VID/climate action=? temperature=TEMP
startEngine = // POST /VID/engine action=START
stopEngine = // POST /VID/engine action=STOP
openFrontTrunk
closeFrontTrunk
openFuelPort = // POST /VID/fuel/port action=OPEN
closeFuelPort = // POST /VID/fuel/port action=CLOSE
flashHeadlights = //POST /VID/headlight action=FLASH
honkHorn = //POST /VID/horn action=HONK
lock = //POST /VID/security action=LOCK
unlock = //POST /VID/security action=UNLOCK
openSunroof = //POST /VID/sunroof action=OPEN
closeSunroof = //POST /VID/sunroof action=CLOSE
ventSunroof = //POST /VID/sunroof action=VENT
openRearTrunk 
closeRearTrunk
startPanic
stopPanic



_module.exports = Smartcar