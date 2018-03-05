# Smartcar Node SDK

Smartcar Node SDK documentation.


## Modules

<dl>
<dt><a href="#module_smartcar">smartcar</a></dt>
<dd></dd>
<dt><a href="#module_errors">errors</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Promise">Promise</a></dt>
<dd></dd>
<dt><a href="#AuthClient">AuthClient</a></dt>
<dd></dd>
<dt><a href="#Vehicle">Vehicle</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Access">Access</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_smartcar"></a>

## smartcar

* [smartcar](#module_smartcar)
    * [.errors](#module_smartcar.errors)
    * [.Vehicle](#module_smartcar.Vehicle)
    * [.AuthClient](#module_smartcar.AuthClient)
    * [.getVehicles](#module_smartcar.getVehicles) ⇒ [<code>Promise</code>](#Promise)
    * [.expired(access)](#module_smartcar.expired) ⇒ <code>Boolean</code>

<a name="module_smartcar.errors"></a>

### smartcar.errors
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: modules
<a name="module_smartcar.Vehicle"></a>

### smartcar.Vehicle
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: Vehicle
<a name="module_smartcar.AuthClient"></a>

### smartcar.AuthClient
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: AuthClient
<a name="module_smartcar.getVehicles"></a>

### smartcar.getVehicles ⇒ [<code>Promise</code>](#Promise)
Return list of the user's vehicles.

**Kind**: static property of [<code>smartcar</code>](#module_smartcar)

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | access token |
| [paging] | <code>Object</code> |  |
| [paging.limit] | <code>Number</code> | number of vehicles to return |
| [paging.offset] | <code>Number</code> | index to start vehicle list |

<a name="module_smartcar.expired"></a>

### smartcar.expired(access) ⇒ <code>Boolean</code>
Check if an access object's access token is expired.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Returns**: <code>Boolean</code> - true if expired, false if not expired

| Param | Type | Description |
| --- | --- | --- |
| access | [<code>Access</code>](#Access) \| <code>String</code> | access object or expiration to be checked |

<a name="module_errors"></a>

## errors

* [errors](#module_errors)
    * [.SmartcarError(message)](#module_errors.SmartcarError) ⇐ <code>Error</code>
    * [.ValidationError(message)](#module_errors.ValidationError) ⇐ <code>SmartcarError</code>
    * [.AuthenticationError(message)](#module_errors.AuthenticationError) ⇐ <code>SmartcarError</code>
    * [.PermissionError(message)](#module_errors.PermissionError) ⇐ <code>SmartcarError</code>
    * [.ResourceNotFoundError(message)](#module_errors.ResourceNotFoundError) ⇐ <code>SmartcarError</code>
    * [.VehicleStateError(message)](#module_errors.VehicleStateError) ⇐ <code>SmartcarError</code>
    * [.RateLimitingError(message)](#module_errors.RateLimitingError) ⇐ <code>SmartcarError</code>
    * [.MonthlyLimitExceeded(message)](#module_errors.MonthlyLimitExceeded) ⇐ <code>SmartcarError</code>
    * [.ServerError(message)](#module_errors.ServerError) ⇐ <code>SmartcarError</code>
    * [.NotCapableError(message)](#module_errors.NotCapableError) ⇐ <code>SmartcarError</code>
    * [.GatewayTimeoutError(message)](#module_errors.GatewayTimeoutError)

<a name="module_errors.SmartcarError"></a>

### errors.SmartcarError(message) ⇐ <code>Error</code>
Superclass for all sdk errors.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>Error</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.ValidationError"></a>

### errors.ValidationError(message) ⇐ <code>SmartcarError</code>
Error thrown by request validation.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.AuthenticationError"></a>

### errors.AuthenticationError(message) ⇐ <code>SmartcarError</code>
Error thrown by an invalid or expired token.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.PermissionError"></a>

### errors.PermissionError(message) ⇐ <code>SmartcarError</code>
Error thrown due to insufficient permissions.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.ResourceNotFoundError"></a>

### errors.ResourceNotFoundError(message) ⇐ <code>SmartcarError</code>
Error thrown when the requested resource is not found.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.VehicleStateError"></a>

### errors.VehicleStateError(message) ⇐ <code>SmartcarError</code>
Error thrown when the vehicle is not capable of performing the request in
the current vehicle state.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.RateLimitingError"></a>

### errors.RateLimitingError(message) ⇐ <code>SmartcarError</code>
Error thrown when an application makes too many requests and is throttled.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.MonthlyLimitExceeded"></a>

### errors.MonthlyLimitExceeded(message) ⇐ <code>SmartcarError</code>
Error thrown when an application requests more resources than it's allowed
limit, e.g., gone over their allotted monthly request limit.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.ServerError"></a>

### errors.ServerError(message) ⇐ <code>SmartcarError</code>
Error thrown when the server throws an unexpected error.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.NotCapableError"></a>

### errors.NotCapableError(message) ⇐ <code>SmartcarError</code>
Error thrown when vehicle is not capable of performing the method.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.GatewayTimeoutError"></a>

### errors.GatewayTimeoutError(message)
**Kind**: static method of [<code>errors</code>](#module_errors)

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="Promise"></a>

## Promise
**Kind**: global class
**See**: http://bluebirdjs.com/docs/api-reference.html
<a name="AuthClient"></a>

## AuthClient
**Kind**: global class

* [AuthClient](#AuthClient)
    * [new AuthClient(options)](#new_AuthClient_new)
    * [.getAuthUrl(make, [options])](#AuthClient+getAuthUrl) ⇒ <code>String</code>
    * [.exchangeCode(code)](#AuthClient+exchangeCode) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
    * [.exchangeToken(token)](#AuthClient+exchangeToken) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)

<a name="new_AuthClient_new"></a>

### new AuthClient(options)
Create a Smartcar OAuth client for your application.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> |  |
| options.clientId | <code>String</code> | The application's client id |
| options.clientSecret | <code>String</code> | The application's client secret |
| options.redirectUri | <code>String</code> | one of the application's preregistered redirect URIs |
| [options.scope] | <code>Array.&lt;String&gt;</code> | list of permissions to request from user |

<a name="AuthClient+getAuthUrl"></a>

### authClient.getAuthUrl(make, [options]) ⇒ <code>String</code>
Generate the OAuth authorization URL for a given vehicle make.

By default users are not shown the permission dialog if they have already
approved the set of scopes for this application. The application can elect
to always display the permissions dialog to the user by setting
approval_prompt to `force`.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: <code>String</code> - OAuth authorization URL to redirect user to

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| make | <code>String</code> |  | the vehicle make to generate the URL for |
| [options] | <code>Object</code> |  |  |
| [options.state] | <code>String</code> |  | extra application state to pass along |
| [options.approvalPrompt] | <code>Boolean</code> | <code>auto</code> | see 2nd paragraph above |

<a name="AuthClient+exchangeCode"></a>

### authClient.exchangeCode(code) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange an authorization code for an access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | authorization code to exchange |

<a name="AuthClient+exchangeToken"></a>

### authClient.exchangeToken(token) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange a refresh token for a new access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | refresh token to exchange |

<a name="Vehicle"></a>

## Vehicle
**Kind**: global class

* [Vehicle](#Vehicle)
    * [new Vehicle(id, token, [unitSystem])](#new_Vehicle_new)
    * [.setUnitSystem(unitSystem)](#Vehicle+setUnitSystem)
    * [.disconnect()](#Vehicle+disconnect) ⇒ [<code>Promise</code>](#Promise)
    * [.permissions()](#Vehicle+permissions) ⇒ [<code>Promise</code>](#Promise)
    * [.info()](#Vehicle+info) ⇒ [<code>Promise</code>](#Promise)
    * [.accelerometer()](#Vehicle+accelerometer) ⇒ [<code>Promise</code>](#Promise)
    * [.airbags()](#Vehicle+airbags) ⇒ [<code>Promise</code>](#Promise)
    * [.barometer()](#Vehicle+barometer) ⇒ [<code>Promise</code>](#Promise)
    * [.battery()](#Vehicle+battery) ⇒ [<code>Promise</code>](#Promise)
    * [.charge()](#Vehicle+charge) ⇒ [<code>Promise</code>](#Promise)
    * [.chargeAmmeter()](#Vehicle+chargeAmmeter) ⇒ [<code>Promise</code>](#Promise)
    * [.chargeLimit()](#Vehicle+chargeLimit) ⇒ [<code>Promise</code>](#Promise)
    * [.chargeSchedule()](#Vehicle+chargeSchedule) ⇒ [<code>Promise</code>](#Promise)
    * [.chargeVoltmeter()](#Vehicle+chargeVoltmeter) ⇒ [<code>Promise</code>](#Promise)
    * [.climate()](#Vehicle+climate) ⇒ [<code>Promise</code>](#Promise)
    * [.collisionSensor()](#Vehicle+collisionSensor) ⇒ [<code>Promise</code>](#Promise)
    * [.compass()](#Vehicle+compass) ⇒ [<code>Promise</code>](#Promise)
    * [.cruiseControl()](#Vehicle+cruiseControl) ⇒ [<code>Promise</code>](#Promise)
    * [.dimensions()](#Vehicle+dimensions) ⇒ [<code>Promise</code>](#Promise)
    * [.doors()](#Vehicle+doors) ⇒ [<code>Promise</code>](#Promise)
    * [.childSafetyLocks()](#Vehicle+childSafetyLocks) ⇒ [<code>Promise</code>](#Promise)
    * [.driveMode()](#Vehicle+driveMode) ⇒ [<code>Promise</code>](#Promise)
    * [.engine()](#Vehicle+engine) ⇒ [<code>Promise</code>](#Promise)
    * [.engineCoolant()](#Vehicle+engineCoolant) ⇒ [<code>Promise</code>](#Promise)
    * [.engineHood()](#Vehicle+engineHood) ⇒ [<code>Promise</code>](#Promise)
    * [.engineOil()](#Vehicle+engineOil) ⇒ [<code>Promise</code>](#Promise)
    * [.engineThrottle()](#Vehicle+engineThrottle) ⇒ [<code>Promise</code>](#Promise)
    * [.fuel()](#Vehicle+fuel) ⇒ [<code>Promise</code>](#Promise)
    * [.gyroscope()](#Vehicle+gyroscope) ⇒ [<code>Promise</code>](#Promise)
    * [.ignition()](#Vehicle+ignition) ⇒ [<code>Promise</code>](#Promise)
    * [.hazardLight()](#Vehicle+hazardLight) ⇒ [<code>Promise</code>](#Promise)
    * [.headlights()](#Vehicle+headlights) ⇒ [<code>Promise</code>](#Promise)
    * [.interiorLights()](#Vehicle+interiorLights) ⇒ [<code>Promise</code>](#Promise)
    * [.turnIndicator()](#Vehicle+turnIndicator) ⇒ [<code>Promise</code>](#Promise)
    * [.location()](#Vehicle+location) ⇒ [<code>Promise</code>](#Promise)
    * [.sideviewMirrors()](#Vehicle+sideviewMirrors) ⇒ [<code>Promise</code>](#Promise)
    * [.odometer()](#Vehicle+odometer) ⇒ [<code>Promise</code>](#Promise)
    * [.tripOdometers()](#Vehicle+tripOdometers) ⇒ [<code>Promise</code>](#Promise)
    * [.acceleratorPedal()](#Vehicle+acceleratorPedal) ⇒ [<code>Promise</code>](#Promise)
    * [.brakePedal()](#Vehicle+brakePedal) ⇒ [<code>Promise</code>](#Promise)
    * [.rainSensor()](#Vehicle+rainSensor) ⇒ [<code>Promise</code>](#Promise)
    * [.seats()](#Vehicle+seats) ⇒ [<code>Promise</code>](#Promise)
    * [.security()](#Vehicle+security) ⇒ [<code>Promise</code>](#Promise)
    * [.sliBattery()](#Vehicle+sliBattery) ⇒ [<code>Promise</code>](#Promise)
    * [.speedometer()](#Vehicle+speedometer) ⇒ [<code>Promise</code>](#Promise)
    * [.steeringWheel()](#Vehicle+steeringWheel) ⇒ [<code>Promise</code>](#Promise)
    * [.sunroof()](#Vehicle+sunroof) ⇒ [<code>Promise</code>](#Promise)
    * [.tachometer()](#Vehicle+tachometer) ⇒ [<code>Promise</code>](#Promise)
    * [.interiorThermistor()](#Vehicle+interiorThermistor) ⇒ [<code>Promise</code>](#Promise)
    * [.exteriorThermistor()](#Vehicle+exteriorThermistor) ⇒ [<code>Promise</code>](#Promise)
    * [.tires()](#Vehicle+tires) ⇒ [<code>Promise</code>](#Promise)
    * [.transmission()](#Vehicle+transmission) ⇒ [<code>Promise</code>](#Promise)
    * [.transmissionFluid()](#Vehicle+transmissionFluid) ⇒ [<code>Promise</code>](#Promise)
    * [.frontTrunk()](#Vehicle+frontTrunk) ⇒ [<code>Promise</code>](#Promise)
    * [.rearTrunk()](#Vehicle+rearTrunk) ⇒ [<code>Promise</code>](#Promise)
    * [.vin()](#Vehicle+vin) ⇒ [<code>Promise</code>](#Promise)
    * [.washerFluid()](#Vehicle+washerFluid) ⇒ [<code>Promise</code>](#Promise)
    * [.wheels()](#Vehicle+wheels) ⇒ [<code>Promise</code>](#Promise)
    * [.wheelSpeeds()](#Vehicle+wheelSpeeds) ⇒ [<code>Promise</code>](#Promise)
    * [.windows()](#Vehicle+windows) ⇒ [<code>Promise</code>](#Promise)
    * [.startCharging()](#Vehicle+startCharging) ⇒ [<code>Promise</code>](#Promise)
    * [.stopCharging()](#Vehicle+stopCharging) ⇒ [<code>Promise</code>](#Promise)
    * [.enableChargeLimit([limit])](#Vehicle+enableChargeLimit) ⇒ [<code>Promise</code>](#Promise)
    * [.disableChargeLimit()](#Vehicle+disableChargeLimit) ⇒ [<code>Promise</code>](#Promise)
    * [.enableChargeSchedule(startTime)](#Vehicle+enableChargeSchedule) ⇒ [<code>Promise</code>](#Promise)
    * [.disableChargeSchedule()](#Vehicle+disableChargeSchedule) ⇒ [<code>Promise</code>](#Promise)
    * [.activateChildSafetyLocks(childSafetyLocksArr)](#Vehicle+activateChildSafetyLocks) ⇒ [<code>Promise</code>](#Promise)
    * [.disableChildSafetyLocks(childSafetyLocksArr)](#Vehicle+disableChildSafetyLocks) ⇒ [<code>Promise</code>](#Promise)
    * [.startClimate(temperature)](#Vehicle+startClimate) ⇒ [<code>Promise</code>](#Promise)
    * [.stopClimate()](#Vehicle+stopClimate) ⇒ [<code>Promise</code>](#Promise)
    * [.openEngineHood()](#Vehicle+openEngineHood) ⇒ [<code>Promise</code>](#Promise)
    * [.closeEngineHood()](#Vehicle+closeEngineHood) ⇒ [<code>Promise</code>](#Promise)
    * [.honkHorn()](#Vehicle+honkHorn) ⇒ [<code>Promise</code>](#Promise)
    * [.startIgnition()](#Vehicle+startIgnition) ⇒ [<code>Promise</code>](#Promise)
    * [.setIgnitionOn()](#Vehicle+setIgnitionOn) ⇒ [<code>Promise</code>](#Promise)
    * [.setIgnitionAccessory()](#Vehicle+setIgnitionAccessory) ⇒ [<code>Promise</code>](#Promise)
    * [.setIgnitionOff()](#Vehicle+setIgnitionOff) ⇒ [<code>Promise</code>](#Promise)
    * [.flashHeadlights(type)](#Vehicle+flashHeadlights) ⇒ [<code>Promise</code>](#Promise)
    * [.tiltSideviewMirrors(mirrorsArr)](#Vehicle+tiltSideviewMirrors) ⇒ [<code>Promise</code>](#Promise)
    * [.startPanic()](#Vehicle+startPanic) ⇒ [<code>Promise</code>](#Promise)
    * [.stopPanic()](#Vehicle+stopPanic) ⇒ [<code>Promise</code>](#Promise)
    * [.openChargePort()](#Vehicle+openChargePort) ⇒ [<code>Promise</code>](#Promise)
    * [.closeChargePort()](#Vehicle+closeChargePort) ⇒ [<code>Promise</code>](#Promise)
    * [.openFuelPort()](#Vehicle+openFuelPort) ⇒ [<code>Promise</code>](#Promise)
    * [.closeFuelPort()](#Vehicle+closeFuelPort) ⇒ [<code>Promise</code>](#Promise)
    * [.lock()](#Vehicle+lock) ⇒ [<code>Promise</code>](#Promise)
    * [.unlock()](#Vehicle+unlock) ⇒ [<code>Promise</code>](#Promise)
    * [.openSunroof(percentOpen)](#Vehicle+openSunroof) ⇒ [<code>Promise</code>](#Promise)
    * [.ventSunroof()](#Vehicle+ventSunroof) ⇒ [<code>Promise</code>](#Promise)
    * [.closeSunroof()](#Vehicle+closeSunroof) ⇒ [<code>Promise</code>](#Promise)
    * [.openFrontTrunk()](#Vehicle+openFrontTrunk) ⇒ [<code>Promise</code>](#Promise)
    * [.closeFrontTrunk()](#Vehicle+closeFrontTrunk) ⇒ [<code>Promise</code>](#Promise)
    * [.openRearTrunk()](#Vehicle+openRearTrunk) ⇒ [<code>Promise</code>](#Promise)
    * [.closeRearTrunk()](#Vehicle+closeRearTrunk) ⇒ [<code>Promise</code>](#Promise)
    * [.openWindows(windowsArr)](#Vehicle+openWindows) ⇒ [<code>Promise</code>](#Promise)
    * [.closeWindows(windowsArr)](#Vehicle+closeWindows) ⇒ [<code>Promise</code>](#Promise)
    * [.lockWindows(windowsArr)](#Vehicle+lockWindows) ⇒ [<code>Promise</code>](#Promise)
    * [.unlockWindows(windowsArr)](#Vehicle+unlockWindows) ⇒ [<code>Promise</code>](#Promise)

<a name="new_Vehicle_new"></a>

### new Vehicle(id, token, [unitSystem])
Initializes a new Vehicle to use for making requests to the Smartcar API.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | the vehicle's unique identifier |
| token | <code>String</code> |  | a valid access token |
| [unitSystem] | <code>String</code> | <code>metric</code> | the unit system to use for vehicle data (metric/imperial) |

<a name="Vehicle+setUnitSystem"></a>

### vehicle.setUnitSystem(unitSystem)
Update the unit system to use in requests to the Smartcar API.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)

| Param | Type | Description |
| --- | --- | --- |
| unitSystem | <code>String</code> | the unit system to use (metric/imperial) |

<a name="Vehicle+disconnect"></a>

### vehicle.disconnect() ⇒ [<code>Promise</code>](#Promise)
Disconnect this vehicle from the connected application.

Note: Calling this method will invalidate your access token and you will
have to have the user reauthorize the vehicle to your application if
you wish to make requests to it

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - // TODO document return type more throughly
<a name="Vehicle+permissions"></a>

### vehicle.permissions() ⇒ [<code>Promise</code>](#Promise)
Fetch the list of permissions that this application has been granted for
this vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - // TODO document return type more throughly
<a name="Vehicle+info"></a>

### vehicle.info() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.info

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's info
<a name="Vehicle+accelerometer"></a>

### vehicle.accelerometer() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.accelerometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's accelerometer
<a name="Vehicle+airbags"></a>

### vehicle.airbags() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.airbags

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's airbags
<a name="Vehicle+barometer"></a>

### vehicle.barometer() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.barometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's barometer
<a name="Vehicle+battery"></a>

### vehicle.battery() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.battery

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's battery
<a name="Vehicle+charge"></a>

### vehicle.charge() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.charge

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's charge
<a name="Vehicle+chargeAmmeter"></a>

### vehicle.chargeAmmeter() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.chargeAmmeter

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's charge ammeter
<a name="Vehicle+chargeLimit"></a>

### vehicle.chargeLimit() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.chargeLimit

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's chargeLimit
<a name="Vehicle+chargeSchedule"></a>

### vehicle.chargeSchedule() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.chargeSchedule

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's chargeSchedule
<a name="Vehicle+chargeVoltmeter"></a>

### vehicle.chargeVoltmeter() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.chargeVoltmeter

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's charge voltmeter
<a name="Vehicle+climate"></a>

### vehicle.climate() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.climate

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's climate
<a name="Vehicle+collisionSensor"></a>

### vehicle.collisionSensor() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.collisionSensor

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's collisionSensor
<a name="Vehicle+compass"></a>

### vehicle.compass() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.compass

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's compass
<a name="Vehicle+cruiseControl"></a>

### vehicle.cruiseControl() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.cruiseControl

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's cruiseControl
<a name="Vehicle+dimensions"></a>

### vehicle.dimensions() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.dimensions

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's dimensions
<a name="Vehicle+doors"></a>

### vehicle.doors() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.doors

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's doors
<a name="Vehicle+childSafetyLocks"></a>

### vehicle.childSafetyLocks() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.childSafetyLocks

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's childSafetyLocks
<a name="Vehicle+driveMode"></a>

### vehicle.driveMode() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.driveMode

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's driveMode
<a name="Vehicle+engine"></a>

### vehicle.engine() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.engine

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's engine
<a name="Vehicle+engineCoolant"></a>

### vehicle.engineCoolant() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.engineCoolant

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's engineCoolant
<a name="Vehicle+engineHood"></a>

### vehicle.engineHood() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.engineHood

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's engineHood
<a name="Vehicle+engineOil"></a>

### vehicle.engineOil() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.engineOil

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's engineOil
<a name="Vehicle+engineThrottle"></a>

### vehicle.engineThrottle() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.engineThrottle

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's engineThrottle
<a name="Vehicle+fuel"></a>

### vehicle.fuel() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.fuel

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's fuel
<a name="Vehicle+gyroscope"></a>

### vehicle.gyroscope() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.gyroscope

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's gyroscope
<a name="Vehicle+ignition"></a>

### vehicle.ignition() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.ignition

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's ignition
<a name="Vehicle+hazardLight"></a>

### vehicle.hazardLight() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.hazardLight

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's hazardLight
<a name="Vehicle+headlights"></a>

### vehicle.headlights() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.headlights

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's headlights
<a name="Vehicle+interiorLights"></a>

### vehicle.interiorLights() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.interiorLights

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's interiorLights
<a name="Vehicle+turnIndicator"></a>

### vehicle.turnIndicator() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.turnIndicator

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's turnIndicator
<a name="Vehicle+location"></a>

### vehicle.location() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.location

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's location
<a name="Vehicle+sideviewMirrors"></a>

### vehicle.sideviewMirrors() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.sideviewMirrors

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's sideviewMirrors
<a name="Vehicle+odometer"></a>

### vehicle.odometer() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.odometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's odometer
<a name="Vehicle+tripOdometers"></a>

### vehicle.tripOdometers() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.tripOdometers

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's tripOdometers
<a name="Vehicle+acceleratorPedal"></a>

### vehicle.acceleratorPedal() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.acceleratorPedal

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's acceleratorPedal
<a name="Vehicle+brakePedal"></a>

### vehicle.brakePedal() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.brakePedal

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's brakePedal
<a name="Vehicle+rainSensor"></a>

### vehicle.rainSensor() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.rainSensor

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's rainSensor
<a name="Vehicle+seats"></a>

### vehicle.seats() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.seats

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's seats
<a name="Vehicle+security"></a>

### vehicle.security() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.security

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's security
<a name="Vehicle+sliBattery"></a>

### vehicle.sliBattery() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.sliBattery

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's sliBattery
<a name="Vehicle+speedometer"></a>

### vehicle.speedometer() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.speedometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's speedometer
<a name="Vehicle+steeringWheel"></a>

### vehicle.steeringWheel() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.steeringWheel

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's steeringWheel
<a name="Vehicle+sunroof"></a>

### vehicle.sunroof() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.sunroof

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's sunroof
<a name="Vehicle+tachometer"></a>

### vehicle.tachometer() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.tachometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's tachometer
<a name="Vehicle+interiorThermistor"></a>

### vehicle.interiorThermistor() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.interiorThermistor

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's interiorThermistor
<a name="Vehicle+exteriorThermistor"></a>

### vehicle.exteriorThermistor() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.exteriorThermistor

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's exteriorThermistor
<a name="Vehicle+tires"></a>

### vehicle.tires() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.tires

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's tires
<a name="Vehicle+transmission"></a>

### vehicle.transmission() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.transmission

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's transmission
<a name="Vehicle+transmissionFluid"></a>

### vehicle.transmissionFluid() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.transmissionFluid

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's transmissionFluid
<a name="Vehicle+frontTrunk"></a>

### vehicle.frontTrunk() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.frontTrunk

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's frontTrunk
<a name="Vehicle+rearTrunk"></a>

### vehicle.rearTrunk() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.rearTrunk

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's rearTrunk
<a name="Vehicle+vin"></a>

### vehicle.vin() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.vin

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's vin
<a name="Vehicle+washerFluid"></a>

### vehicle.washerFluid() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.washerFluid

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's washerFluid
<a name="Vehicle+wheels"></a>

### vehicle.wheels() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.wheels

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's wheels
<a name="Vehicle+wheelSpeeds"></a>

### vehicle.wheelSpeeds() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.wheelSpeeds

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's wheelSpeeds
<a name="Vehicle+windows"></a>

### vehicle.windows() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.windows

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's windows
<a name="Vehicle+startCharging"></a>

### vehicle.startCharging() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.startCharging

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+stopCharging"></a>

### vehicle.stopCharging() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.stopCharging

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+enableChargeLimit"></a>

### vehicle.enableChargeLimit([limit]) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.enableChargeLimit

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| [limit] | <code>Float</code> | override the previously set limit,                          must be between 0 - 1 |

<a name="Vehicle+disableChargeLimit"></a>

### vehicle.disableChargeLimit() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.disableChargeLimit

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+enableChargeSchedule"></a>

### vehicle.enableChargeSchedule(startTime) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.enableChargeSchedule

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| startTime | <code>String</code> | the datetime string representing when to start charging, i.e, '11:11' |

<a name="Vehicle+disableChargeSchedule"></a>

### vehicle.disableChargeSchedule() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.disableChargeSchedule

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+activateChildSafetyLocks"></a>

### vehicle.activateChildSafetyLocks(childSafetyLocksArr) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.activateChildSafetyLocks

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| childSafetyLocksArr | <code>Array</code> | array of child safety lock objects, i.e, [{location: 'BACK_LEFT'}] |

<a name="Vehicle+disableChildSafetyLocks"></a>

### vehicle.disableChildSafetyLocks(childSafetyLocksArr) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.disableChildSafetyLocks

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| childSafetyLocksArr | <code>Array</code> | array of child safety lock objects, i.e, [{location: 'BACK_LEFT'}] |

<a name="Vehicle+startClimate"></a>

### vehicle.startClimate(temperature) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.startClimate

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| temperature | <code>Number</code> | the temperature to set the car to |

<a name="Vehicle+stopClimate"></a>

### vehicle.stopClimate() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.stopClimate

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+openEngineHood"></a>

### vehicle.openEngineHood() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.openEngineHood

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+closeEngineHood"></a>

### vehicle.closeEngineHood() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.closeEngineHood

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+honkHorn"></a>

### vehicle.honkHorn() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.honkHorn

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+startIgnition"></a>

### vehicle.startIgnition() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.startIgnition

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+setIgnitionOn"></a>

### vehicle.setIgnitionOn() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.setIgnitionOn

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+setIgnitionAccessory"></a>

### vehicle.setIgnitionAccessory() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.setIgnitionAccessory

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+setIgnitionOff"></a>

### vehicle.setIgnitionOff() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.setIgnitionOff

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+flashHeadlights"></a>

### vehicle.flashHeadlights(type) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.flashHeadlights

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | the type of headlight to perform the action on, i.e 'HIGH_BEAM' |

<a name="Vehicle+tiltSideviewMirrors"></a>

### vehicle.tiltSideviewMirrors(mirrorsArr) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.tiltSideviewMirrors

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| mirrorsArr | <code>Array</code> | array of mirror objects to perform action on, i.e [{location: 'LEFT'}] |

<a name="Vehicle+startPanic"></a>

### vehicle.startPanic() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.startPanic

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+stopPanic"></a>

### vehicle.stopPanic() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.stopPanic

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+openChargePort"></a>

### vehicle.openChargePort() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.openChargePort

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+closeChargePort"></a>

### vehicle.closeChargePort() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.closeChargePort

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+openFuelPort"></a>

### vehicle.openFuelPort() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.openFuelPort

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+closeFuelPort"></a>

### vehicle.closeFuelPort() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.closeFuelPort

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+lock"></a>

### vehicle.lock() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.lock

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+unlock"></a>

### vehicle.unlock() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.unlock

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+openSunroof"></a>

### vehicle.openSunroof(percentOpen) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.openSunroof

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| percentOpen | <code>Number</code> | max: 1, min: 0 |

<a name="Vehicle+ventSunroof"></a>

### vehicle.ventSunroof() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.ventSunroof

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+closeSunroof"></a>

### vehicle.closeSunroof() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.closeSunroof

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+openFrontTrunk"></a>

### vehicle.openFrontTrunk() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.openFrontTrunk

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+closeFrontTrunk"></a>

### vehicle.closeFrontTrunk() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.closeFrontTrunk

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+openRearTrunk"></a>

### vehicle.openRearTrunk() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.openRearTrunk

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+closeRearTrunk"></a>

### vehicle.closeRearTrunk() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.closeRearTrunk

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response
<a name="Vehicle+openWindows"></a>

### vehicle.openWindows(windowsArr) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.openWindows

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| windowsArr | <code>Array</code> | array of window objects to perform action upon, i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}] |

<a name="Vehicle+closeWindows"></a>

### vehicle.closeWindows(windowsArr) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.closeWindows

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| windowsArr | <code>Array</code> | array of window objects to perform action upon, i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}] |

<a name="Vehicle+lockWindows"></a>

### vehicle.lockWindows(windowsArr) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.lockWindows

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| windowsArr | <code>Array</code> | array of window objects to perform action upon, i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}] |

<a name="Vehicle+unlockWindows"></a>

### vehicle.unlockWindows(windowsArr) ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.unlockWindows

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response

| Param | Type | Description |
| --- | --- | --- |
| windowsArr | <code>Array</code> | array of window objects to perform action upon, i.e [{location: 'BACK_LEFT'}, {location: 'FRONT_RIGHT'}] |

<a name="Access"></a>

## Access : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tokenType | <code>String</code> | Always set to `Bearer` |
| expiresIn | <code>Number</code> | Number of seconds the access token is valid |
| expiration | <code>String</code> | ISO 8601 Datetime string which represents when the token expires |
| accessToken | <code>String</code> | A token to be used for requests to the Smartcar API |
| refreshToken | <code>String</code> | A token which is used to renew access when the current access token expires, expires in 60 days |

**Example**
```js
{
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "expiration": "2017-05-26T01:21:27.070Z",
  "accessToken": "88704225-9f6c-4919-93e7-e0cec71317ce",
  "refreshToken": "60a9e801-6d26-4d88-926e-5c7f9fc13486",
}
```
