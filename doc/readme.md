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

## Functions

<dl>
<dt><a href="#parseAge">parseAge(response)</a> ⇒ <code>Date</code> | <code>null</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Access">Access</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Info">Info</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Location">Location</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Odometer">Odometer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#EngineOil">EngineOil</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TirePressure">TirePressure</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Fuel">Fuel</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Battery">Battery</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BatteryCapacity">BatteryCapacity</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Charge">Charge</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ActionSuccess">ActionSuccess</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Batch">Batch</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_smartcar"></a>

## smartcar

* [smartcar](#module_smartcar)
    * _static_
        * [.errors](#module_smartcar.errors)
        * [.Vehicle](#module_smartcar.Vehicle)
        * [.AuthClient](#module_smartcar.AuthClient)
        * [.isExpired(expiration)](#module_smartcar.isExpired) ⇒ <code>Boolean</code>
        * [.getVehicleIds(token, [paging])](#module_smartcar.getVehicleIds) ⇒ [<code>Promise.&lt;VehicleIds&gt;</code>](#module_smartcar..VehicleIds)
        * [.getUserId(token)](#module_smartcar.getUserId) ⇒ <code>Promise.&lt;String&gt;</code>
    * _inner_
        * [~VehicleIds](#module_smartcar..VehicleIds) : <code>Object</code>

<a name="module_smartcar.errors"></a>

### smartcar.errors
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: [errors](#module_errors)
<a name="module_smartcar.Vehicle"></a>

### smartcar.Vehicle
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: [Vehicle](#Vehicle)
<a name="module_smartcar.AuthClient"></a>

### smartcar.AuthClient
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: [AuthClient](#AuthClient)
<a name="module_smartcar.isExpired"></a>

### smartcar.isExpired(expiration) ⇒ <code>Boolean</code>
Check if a token has expired.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Returns**: <code>Boolean</code> - true if expired, false if not expired

| Param | Type | Description |
| --- | --- | --- |
| expiration | <code>Date</code> \| <code>String</code> | token expiration timestamp |

<a name="module_smartcar.getVehicleIds"></a>

### smartcar.getVehicleIds(token, [paging]) ⇒ [<code>Promise.&lt;VehicleIds&gt;</code>](#module_smartcar..VehicleIds)
Return list of the user's vehicles ids.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Returns**: [<code>Promise.&lt;VehicleIds&gt;</code>](#module_smartcar..VehicleIds) - A promise with the vehicle ids.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | access token |
| [paging] | <code>Object</code> |  |
| [paging.limit] | <code>Number</code> | number of vehicles to return |
| [paging.offset] | <code>Number</code> | index to start vehicle list |

<a name="module_smartcar.getUserId"></a>

### smartcar.getUserId(token) ⇒ <code>Promise.&lt;String&gt;</code>
Return the user's id.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Returns**: <code>Promise.&lt;String&gt;</code> - the user id
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | access token |

<a name="module_smartcar..VehicleIds"></a>

### smartcar~VehicleIds : <code>Object</code>
**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| vehicles | <code>Array.&lt;String&gt;</code> | A list of the user's authorized vehicle ids. |
| paging | <code>Object</code> |  |
| paging.count- | <code>Number</code> | The total number of vehicles. |
| paging.offset | <code>Number</code> | The current start index of returned vehicle ids. |

**Example**
```js
{
  vehicles: [
    '36ab27d0-fd9d-4455-823a-ce30af709ffc',
    '770bdda4-2429-4b20-87fd-6af475c4365e',
  ],
  paging: {
    count: 2,
    offset: 0,
  }
}
```
<a name="module_errors"></a>

## errors

* [errors](#module_errors)
    * [.SmartcarError(message)](#module_errors.SmartcarError) ⇐ <code>Error</code>
    * [.ValidationError(message)](#module_errors.ValidationError) ⇐ <code>SmartcarError</code>
    * [.AuthenticationError(message)](#module_errors.AuthenticationError) ⇐ <code>SmartcarError</code>
    * [.PermissionError(message)](#module_errors.PermissionError) ⇐ <code>SmartcarError</code>
    * [.ResourceNotFoundError(message)](#module_errors.ResourceNotFoundError) ⇐ <code>SmartcarError</code>
    * [.VehicleStateError(message, code)](#module_errors.VehicleStateError) ⇐ <code>SmartcarError</code>
    * [.RateLimitingError(message)](#module_errors.RateLimitingError) ⇐ <code>SmartcarError</code>
    * [.MonthlyLimitExceeded(message)](#module_errors.MonthlyLimitExceeded) ⇐ <code>SmartcarError</code>
    * [.ServerError(message)](#module_errors.ServerError) ⇐ <code>SmartcarError</code>
    * [.VehicleNotCapableError(message)](#module_errors.VehicleNotCapableError) ⇐ <code>SmartcarError</code>
    * [.SmartcarNotCapableError(message)](#module_errors.SmartcarNotCapableError) ⇐ <code>SmartcarError</code>
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
Error thrown by an invalid parameter when authenticating.

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

### errors.VehicleStateError(message, code) ⇐ <code>SmartcarError</code>
Error thrown when the vehicle is not capable of performing the request in
the current vehicle state.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |
| code | a vehicle state error code (https://smartcar.com/docs/api#errors) |

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
Error thrown when an application requests more resources than its allowed
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

<a name="module_errors.VehicleNotCapableError"></a>

### errors.VehicleNotCapableError(message) ⇐ <code>SmartcarError</code>
Error thrown when vehicle is not capable of performing the request.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.SmartcarNotCapableError"></a>

### errors.SmartcarNotCapableError(message) ⇐ <code>SmartcarError</code>
Error thrown when Smartcar is not capable of performing the request.

**Kind**: static method of [<code>errors</code>](#module_errors)
**Extends**: <code>SmartcarError</code>

| Param | Description |
| --- | --- |
| message | an error description to set |

<a name="module_errors.GatewayTimeoutError"></a>

### errors.GatewayTimeoutError(message)
Error thrown when gateway to Smartcar times out

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
    * [.getAuthUrl([options])](#AuthClient+getAuthUrl) ⇒ <code>String</code>
    * [.exchangeCode(code)](#AuthClient+exchangeCode) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
    * [.exchangeRefreshToken(token)](#AuthClient+exchangeRefreshToken) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
    * [.isCompatible(vin, scope, [country])](#AuthClient+isCompatible) ⇒ <code>Promise.&lt;Boolean&gt;</code>

<a name="new_AuthClient_new"></a>

### new AuthClient(options)
Create a Smartcar OAuth client for your application.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.clientId | <code>String</code> |  | Application client id obtained from [Smartcar Developer Portal](https://developer.smartcar.com). If you do not have access to the dashboard, please [request access](https://smartcar.com/subscribe). |
| options.clientSecret | <code>String</code> |  | The application's client secret. |
| options.redirectUri | <code>String</code> |  | Redirect URI registered in the [application settings](https://developer.smartcar.com/apps). The given URL must exactly match one of the registered URLs. |
| [options.scope] | <code>Array.&lt;String&gt;</code> | <code>all</code> | List of permissions your application requires. This will default to requiring all scopes. The valid permission names are found in the [API Reference](https://smartcar.com/docs#get-all-vehicles). |
| [options.testMode] | <code>Boolean</code> | <code>false</code> | Launch Smartcar Connect in [test mode](https://smartcar.com/docs/guides/testing/). |
| [options.development] | <code>Boolean</code> | <code>false</code> | DEPRECATED: Launch Smartcar auth in development mode to enable mock vehicle brands. |

<a name="AuthClient+getAuthUrl"></a>

### authClient.getAuthUrl([options]) ⇒ <code>String</code>
Generate the Smartcar Connect URL.

By default users are not shown the permission dialog if they have already
approved the set of scopes for this application. The application can elect
to always display the permissions dialog to the user by setting
approval_prompt to `force`.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: <code>String</code> - Smartcar Connect URL to direct user to.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
for all possible errors.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.state] | <code>String</code> |  | OAuth state parameter passed to the redirect uri. This parameter may be used for identifying the user who initiated the request. |
| [options.forcePrompt] | <code>Boolean</code> | <code>false</code> | Setting `forcePrompt` to `true` will show the permissions approval screen on every authentication attempt, even if the user has previously consented to the exact scope of permissions. |
| [options.vehicleInfo.make] | <code>Object</code> |  | `vehicleInfo` is an object with an optional property `make`. An optional parameter that allows users to bypass the car brand selection screen. For a complete list of supported makes, please see our [API Reference](https://smartcar.com/docs/api#authorization) documentation. |
| [options.singleSelect] | <code>Boolean</code> \| <code>Object</code> |  | An optional value that sets the behavior of the grant dialog displayed to the user. If set to `true`, `single_select` limits the user to selecting only one vehicle. If `single_select` is an object with the property `vin`, Smartcar will only authorize the vehicle with the specified VIN. See the [Single Select guide](https://smartcar.com/docs/guides/single-select/) for more information. |
| [options.flags] | <code>Array.&lt;String&gt;</code> |  | List of feature flags that your application has early access to. |

**Example**
```js
https://connect.smartcar.com/oauth/authorize?
response_type=code
&client_id=8229df9f-91a0-4ff0-a1ae-a1f38ee24d07
&scope=read_odometer read_vehicle_info
&redirect_uri=https://example.com/home
&state=0facda3319
&make=TESLA
&single_select=true
&single_select_vin=5YJSA1E14FF101307
&flags=country:DE color:00819D
```
<a name="AuthClient+exchangeCode"></a>

### authClient.exchangeCode(code) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange an authorization code for an access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: [<code>Promise.&lt;Access&gt;</code>](#Access) - Access and Refresh tokens.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Authorization code to exchange for a Smartcar access token and refresh token. |

<a name="AuthClient+exchangeRefreshToken"></a>

### authClient.exchangeRefreshToken(token) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange a refresh token for a new access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: [<code>Promise.&lt;Access&gt;</code>](#Access) - New set of Access and Refresh tokens.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | Refresh token to exchange for a new set of Access and Refresh tokens. |

<a name="AuthClient+isCompatible"></a>

### authClient.isCompatible(vin, scope, [country]) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Determine whether a vehicle is compatible with Smartcar.

A compatible vehicle is a vehicle that:
1. has the hardware required for internet connectivity,
2. belongs to the makes and models Smartcar supports, and
3. supports the permissions.

_To use this function, please contact us!_

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - false if the vehicle is not compatible. true if the
  vehicle is likely compatible.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vin | <code>String</code> |  | the VIN of the vehicle |
| scope | <code>Array.&lt;String&gt;</code> |  | list of permissions to check compatibility for |
| [country] | <code>String</code> | <code>&#x27;US&#x27;</code> | an optional country code according to [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). |

<a name="Vehicle"></a>

## Vehicle
**Kind**: global class

* [Vehicle](#Vehicle)
    * [new Vehicle(id, token, [unitSystem])](#new_Vehicle_new)
    * [.setUnitSystem(unitSystem)](#Vehicle+setUnitSystem)
    * [.disconnect()](#Vehicle+disconnect) ⇒ [<code>Promise</code>](#Promise)
    * [.permissions()](#Vehicle+permissions) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
    * [.hasPermissions(permissions)](#Vehicle+hasPermissions) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.info()](#Vehicle+info) ⇒ [<code>Promise.&lt;Info&gt;</code>](#Info)
    * [.location()](#Vehicle+location) ⇒ [<code>Promise.&lt;Location&gt;</code>](#Location)
    * [.odometer()](#Vehicle+odometer) ⇒ [<code>Promise.&lt;Odometer&gt;</code>](#Odometer)
    * [.oil()](#Vehicle+oil) ⇒ [<code>Promise.&lt;EngineOil&gt;</code>](#EngineOil)
    * [.tirePressure()](#Vehicle+tirePressure) ⇒ [<code>Promise.&lt;TirePressure&gt;</code>](#TirePressure)
    * [.fuel()](#Vehicle+fuel) ⇒ [<code>Promise.&lt;Fuel&gt;</code>](#Fuel)
    * [.battery()](#Vehicle+battery) ⇒ [<code>Promise.&lt;Battery&gt;</code>](#Battery)
    * [.batteryCapacity()](#Vehicle+batteryCapacity) ⇒ [<code>Promise.&lt;BatteryCapacity&gt;</code>](#BatteryCapacity)
    * [.charge()](#Vehicle+charge) ⇒ [<code>Promise.&lt;Charge&gt;</code>](#Charge)
    * [.vin()](#Vehicle+vin) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.lock()](#Vehicle+lock) ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
    * [.unlock()](#Vehicle+unlock) ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
    * [.startCharge()](#Vehicle+startCharge) ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
    * [.stopCharge()](#Vehicle+stopCharge) ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
    * [.batch(paths)](#Vehicle+batch) ⇒ [<code>Promise.&lt;Batch&gt;</code>](#Batch)

<a name="new_Vehicle_new"></a>

### new Vehicle(id, token, [unitSystem])
Initializes a new Vehicle to use for making requests to the Smartcar API.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | The vehicle's unique identifier. Retrieve a user's vehicle id using [getVehicleIds](#module_smartcar.getVehicleIds). |
| token | <code>String</code> |  | A valid access token |
| [unitSystem] | <code>String</code> | <code>metric</code> | The unit system to use for vehicle data , must be either `metric` or `imperial`. |

<a name="Vehicle+setUnitSystem"></a>

### vehicle.setUnitSystem(unitSystem)
Update the unit system to use in requests to the Smartcar API.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)

| Param | Type | Description |
| --- | --- | --- |
| unitSystem | <code>String</code> | The unit system to use, must be either `metric` or `imperial`. |

<a name="Vehicle+disconnect"></a>

### vehicle.disconnect() ⇒ [<code>Promise</code>](#Promise)
Disconnect this vehicle from the connected application.

Note: Calling this method will invalidate your token's access to the vehicle.
You will have to reauthorize the user to your application again if you wish
to make requests to it again.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise resolved on successful disconnect.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+permissions"></a>

### vehicle.permissions() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Fetch the list of permissions that this application has been granted for
this vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - An array of permissions names.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**Example**
```js
['read_vehicle_info', 'read_odometer', 'control_security']
```
<a name="Vehicle+hasPermissions"></a>

### vehicle.hasPermissions(permissions) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Checks if permissions granted to a vehicle contain the specified permission(s).

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - Whether the vehicle has the specified permission(s)

| Param | Type | Description |
| --- | --- | --- |
| permissions | <code>Array.&lt;String&gt;</code> \| <code>String</code> | Permission(s) to check |

<a name="Vehicle+info"></a>

### vehicle.info() ⇒ [<code>Promise.&lt;Info&gt;</code>](#Info)
GET Vehicle.info

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Info&gt;</code>](#Info) - A promise for info on the vehicle's info
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+location"></a>

### vehicle.location() ⇒ [<code>Promise.&lt;Location&gt;</code>](#Location)
GET Vehicle.location

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Location&gt;</code>](#Location) - A promise for info on the vehicle's location.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+odometer"></a>

### vehicle.odometer() ⇒ [<code>Promise.&lt;Odometer&gt;</code>](#Odometer)
GET Vehicle.odometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Odometer&gt;</code>](#Odometer) - A promise for info on the vehicle's odometer.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+oil"></a>

### vehicle.oil() ⇒ [<code>Promise.&lt;EngineOil&gt;</code>](#EngineOil)
GET Vehicle.oil

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;EngineOil&gt;</code>](#EngineOil) - A promise for info on the vehicle's engine oil.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+tirePressure"></a>

### vehicle.tirePressure() ⇒ [<code>Promise.&lt;TirePressure&gt;</code>](#TirePressure)
GET Vehicle.tirePressure

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;TirePressure&gt;</code>](#TirePressure) - A promise for info on the vehicle's tire pressure.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+fuel"></a>

### vehicle.fuel() ⇒ [<code>Promise.&lt;Fuel&gt;</code>](#Fuel)
GET Vehicle.fuel

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Fuel&gt;</code>](#Fuel) - A promise for info on the vehicle's fuel status.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+battery"></a>

### vehicle.battery() ⇒ [<code>Promise.&lt;Battery&gt;</code>](#Battery)
GET Vehicle.battery

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Battery&gt;</code>](#Battery) - A promise for info on the vehicle's battery status.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+batteryCapacity"></a>

### vehicle.batteryCapacity() ⇒ [<code>Promise.&lt;BatteryCapacity&gt;</code>](#BatteryCapacity)
GET Vehicle.batteryCapacity

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;BatteryCapacity&gt;</code>](#BatteryCapacity) - A promise for info on the vehicle's battery capacity.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+charge"></a>

### vehicle.charge() ⇒ [<code>Promise.&lt;Charge&gt;</code>](#Charge)
GET Vehicle.charge

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Charge&gt;</code>](#Charge) - A promise for info on the vehicle's charge status.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+vin"></a>

### vehicle.vin() ⇒ <code>Promise.&lt;String&gt;</code>
GET Vehicle.vin

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise for info on the vehicle's vin.
**Throws**:

- <code>SmartcarError</code> - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+lock"></a>

### vehicle.lock() ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
POST Vehicle.lock

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess) - response on successful request
**Throws**:

- <code>SmartcarError</code> - on unsuccessful request. An instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+unlock"></a>

### vehicle.unlock() ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
POST Vehicle.unlock

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess) - response on successful request
**Throws**:

- <code>SmartcarError</code> - on unsuccessful request. An instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+startCharge"></a>

### vehicle.startCharge() ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
POST Vehicle.startCharge

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess) - response on successful request
**Throws**:

- <code>SmartcarError</code> - on unsuccessful request. An instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+stopCharge"></a>

### vehicle.stopCharge() ⇒ [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess)
POST Vehicle.stopCharge

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;ActionSuccess&gt;</code>](#ActionSuccess) - response on successful request
**Throws**:

- <code>SmartcarError</code> - on unsuccessful request. An instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+batch"></a>

### vehicle.batch(paths) ⇒ [<code>Promise.&lt;Batch&gt;</code>](#Batch)
POST Vehicle.batch

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Batch&gt;</code>](#Batch) - response on successful request
**Throws**:

- <code>SmartcarError</code> - on unsuccessful request. An instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;String&gt;</code> | A list of paths of endpoints to send requests to. |

<a name="parseAge"></a>

## parseAge(response) ⇒ <code>Date</code> \| <code>null</code>
**Kind**: global function
**Returns**: <code>Date</code> \| <code>null</code> - A parsed age or null if no age exists

| Param | Type |
| --- | --- |
| response | <code>Object</code> |

<a name="Access"></a>

## Access : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| expiration | <code>Date</code> | Date object which represents when the access token expires. |
| accessToken | <code>String</code> | A token to be used for requests to the Smartcar API |
| refreshToken | <code>String</code> | A token which is used to renew access when the current access token expires, expires in 60 days |
| refreshExpiration | <code>Date</code> | Date object which represents when the refresh token expires. |

**Example**
```js
{
  expiration: new Date('2017-05-26T01:21:27.070Z'),
  accessToken: '88704225-9f6c-4919-93e7-e0cec71317ce',
  refreshToken: '60a9e801-6d26-4d88-926e-5c7f9fc13486',
  refreshExpiration: new Date('2017-05-26T01:21:27.070Z'),
}
```
<a name="Info"></a>

## Info : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The vehicle's unique Smartcar identifier. |
| make | <code>String</code> | The brand of the vehicle. |
| model | <code>String</code> | The specific model of the vehicle. |
| year | <code>Number</code> | The model year of the vehicle. |

**Example**
```js
{
  id: '19c0cc8c-80e0-4182-9372-6ef903c7599c',
  make: 'TESLA',
  model: 'S',
  year: 2017,
}
```
<a name="Location"></a>

## Location : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.latitude | <code>Number</code> | The vehicle latitude (in degrees). |
| data.longitude | <code>Number</code> | The vehicle longitude (in degrees). |
| age | <code>Date</code> | The timestamp of when the data was recorded. |

**Example**
```js
{
  data: {
    latitude: 37.400880,
    longitude: -122.057804,
  }
  age: new Date('2018-05-04T07:20:50.844Z'),
}
```
<a name="Odometer"></a>

## Odometer : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.distance | <code>Number</code> | The reading of the vehicle's odometer (in   kms or miles). To set unit, see [setUnitSystem](#Vehicle+setUnitSystem). |
| age | <code>Date</code> | The timestamp of when the data was recorded. |
| unitSystem | <code>String</code> | The unit system of the returned odometer reading. `metric` signifies kilometers, `imperial` signifies miles. To set, see [setUnitSystem](#Vehicle+setUnitSystem). |

**Example**
```js
{
  data: {
    distance: 1234.12,
  }
  age: new Date('2018-05-04T07:20:50.844Z'),
  unitSystem: 'imperial',
}
```
<a name="EngineOil"></a>

## EngineOil : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.lifeRemaining | <code>Number</code> | The engine oil's remaining life span (as a percentage). Oil life is based on the current quality of the oil. |
| age | <code>Date</code> | The timestamp of when the data was recorded. |

**Example**
```js
{
  data: {
    lifeRemaining: 0.86,
  }
  age: new Date('2018-05-04T07:20:50.844Z')
}
```
<a name="TirePressure"></a>

## TirePressure : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.frontLeft | <code>Number</code> | The current air pressure of the front left tire |
| data.frontRight | <code>Number</code> | The current air pressure of the back right tire |
| data.backLeft | <code>Number</code> | The current air pressure of the back left tire |
| data.backRight | <code>Number</code> | The current air pressure of the back right tire |
| age | <code>Date</code> | The timestamp of when the data was recorded. |
| unitSystem | <code>String</code> | The unit system of the returned odometer reading. `metric` signifies kilopascals (kpa), `imperial` signifies pounds per square inch (psi). To set, see [setUnitSystem](#Vehicle+setUnitSystem). |

**Example**
```js
{
  data: {
    frontleft: 33,
    frontRight: 34,
    backLeft: 34,
    backRight: 33
  }
  age: new Date('2018-05-04T07:20:50.844Z'),
  unitSystem: 'imperial'
}
```
<a name="Fuel"></a>

## Fuel : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.range | <code>Number</code> | The estimated remaining distance the car can  travel (in kms or miles). To set unit, see [setUnitSystem](#Vehicle+setUnitSystem). |
| data.percentRemaining | <code>Number</code> | The remaining level of fuel in   the tank (in percent). |
| data.amountRemaining | <code>Number</code> | The amount of fuel in the tank (in  liters or gallons (US)). To set unit, see [setUnitSystem](#Vehicle+setUnitSystem). |
| age | <code>Date</code> | The timestamp of when the data was recorded. |
| unitSystem | <code>String</code> | The unit system of the returned data.   To set, see [setUnitSystem](#Vehicle+setUnitSystem). |

**Example**
```js
{
  data: {
    range: 40.5,
    percentRemaining: 0.3,
    amountRemaining: 40.5,
  }
  age: new Date('2018-05-04T07:20:50.844Z'),
  unitSystem: 'imperial',
}
```
<a name="Battery"></a>

## Battery : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.range | <code>Number</code> | The estimated remaining distance the car can  travel (in kms or miles). To set unit, see [setUnitSystem](#Vehicle+setUnitSystem). |
| data.percentRemaining | <code>Number</code> | The remaining level of charge in   the battery (in percent). |
| age | <code>Date</code> | The timestamp of when the data was recorded. |
| unitSystem | <code>String</code> | The unit system of the returned data.   To set, see [setUnitSystem](#Vehicle+setUnitSystem). |

**Example**
```js
{
  data: {
    range: 40.5,
    percentRemaining: 0.3,
  }
  age: new Date('2018-05-04T07:20:50.844Z'),
  unitSystem: 'imperial',
}
```
<a name="BatteryCapacity"></a>

## BatteryCapacity : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.capacity | <code>Number</code> | The total capacity of the  vehicle's battery (in kilowatt-hours) |
| age | <code>Date</code> | The timestamp of when the data was recorded. |
| unitSystem | <code>String</code> | The unit system of the returned data.   To set, see [setUnitSystem](#Vehicle+setUnitSystem). |

**Example**
```js
{
  data: {
    capacity: 24,
  }
  age: new Date('2018-05-04T07:20:50.844Z'),
  unitSystem: 'metric',
}
```
<a name="Charge"></a>

## Charge : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The returned vehicle data. |
| data.isPluggedIn | <code>Number</code> | Indicates whether charging cable is   plugged in. |
| data.state | <code>Number</code> | Indicates the current state of the charge   system. Can be `FULLY_CHARGED`, `CHARGING`, or `NOT_CHARGING`. |
| age | <code>Date</code> | The timestamp of when the data was recorded. |

**Example**
```js
{
  data: {
    isPluggedIn: false,
    state: "FULLY_CHARGED",
  }
  age: new Date('2018-05-04T07:20:50.844Z'),
}
```
<a name="ActionSuccess"></a>

## ActionSuccess : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>String</code> | set to `success` on successful request |

**Example**
```js
{
  status: 'success',
}
```
<a name="Batch"></a>

## Batch : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| responses | <code>Object</code> | The object containing multiple HTTP responses. |
| data.ENDPOINT | <code>Object</code> | The HTTP response for a given endpoint. ENDPOINT is a Smartcar endpoint (i.e. /odometer, /fuel). |
| data.ENDPOINT.code | <code>Number</code> | The HTTP status code for this response. |
| data.ENDPOINT.headers | <code>Object</code> | The HTTP headers for this response. |
| data.ENDPOINT.body | <code>Object</code> | The body for this response. |

**Example**
```js
{
   "/odometer" : {
     "body": {
       "distance": 37829
     },
     "code": 200,
     "headers": {
       "sc-data-age": "2019-10-24T00:43:46.000Z",
       "sc-unit-system": "metric"
      }
   },
   "/location" : {
     "body": {
       "latitude": 37.4292,
       "longitude": 122.1381
     },
     "code": 200,
     "headers": {
       "sc-data-age": "2019-10-24T00:43:46.000Z"
     }
   }
}
```
