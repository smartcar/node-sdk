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
    * [.isCompatible(vin)](#AuthClient+isCompatible) ⇒ <code>Promise.&lt;Boolean&gt;</code>

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
| [options.testMode] | <code>Boolean</code> | <code>false</code> | Launch the Smartcar auth flow in test mode. [API Reference](https://smartcar.com/docs#request-authorization). |
| [options.development] | <code>Boolean</code> | <code>false</code> | DEPRECATED: Launch Smartcar auth in development mode to enable mock vehicle brands. |

<a name="AuthClient+getAuthUrl"></a>

### authClient.getAuthUrl([options]) ⇒ <code>String</code>
Generate the OAuth authorization URL.

By default users are not shown the permission dialog if they have already
approved the set of scopes for this application. The application can elect
to always display the permissions dialog to the user by setting
approval_prompt to `force`.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: <code>String</code> - OAuth authorization URL to direct user to.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  |  |
| [options.state] | <code>String</code> |  | OAuth state parameter passed to the redirect uri. This parameter may be used for identifying the user who initiated the request. |
| [options.forcePrompt] | <code>Boolean</code> | <code>false</code> | Setting `forcePrompt` to `true` will show the permissions approval screen on every authentication attempt, even if the user has previously consented to the exact scope of permissions. |
| [options.vehicleInfo.make] | <code>Object</code> |  | `vehicleInfo` is an object with an optional property `make`. An optional parameter that allows users to bypass the car brand selection screen. For a complete list of supported makes, please see our [API Reference](https://smartcar.com/docs/api#authorization) documentation. |

**Example**
```js
https://connect.smartcar.com/oauth/authorize?
response_type=code
&client_id=8229df9f-91a0-4ff0-a1ae-a1f38ee24d07
&scope=read_odometer read_vehicle_info
&redirect_uri=https://example.com/home
&state=0facda3319
&make=TESLA
```
<a name="AuthClient+exchangeCode"></a>

### authClient.exchangeCode(code) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange an authorization code for an access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: [<code>Promise.&lt;Access&gt;</code>](#Access) - Access and Refresh tokens.

| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Authorization code to exchange for a Smartcar access token and refresh token. |

<a name="AuthClient+exchangeRefreshToken"></a>

### authClient.exchangeRefreshToken(token) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange a refresh token for a new access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: [<code>Promise.&lt;Access&gt;</code>](#Access) - New set of Access and Refresh tokens.

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | Refresh token to exchange for a new set of Access and Refresh tokens. |

<a name="AuthClient+isCompatible"></a>

### authClient.isCompatible(vin) ⇒ <code>Promise.&lt;Boolean&gt;</code>
Determine vehicle compatibility with Smartcar.

A compatible vehicle is a vehicle that:
1. has the hardware required for internet connectivity,
2. belongs to the makes and models Smartcar supports, and
3. supports the permissions.

_To use this function, please contact us!_

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: <code>Promise.&lt;Boolean&gt;</code> - `false` if the vehicle is not compatible. `true` if the vehicle is _likely_ compatible*.

| Param | Type | Description |
| --- | --- | --- |
| vin | <code>String</code> | The VIN of the vehicle |
| scope | <code>Array.&lt;String&gt;</code> | The list of permissions to check compatibility for. Valid permission names are found in the [API Reference](https://smartcar.com/docs/api#get-all-vehicles). |

**\*Note:** as we are only using the vin, we can only guarantee if a vehicle is NOT compatible with the platform.

<a name="Vehicle"></a>

## Vehicle
**Kind**: global class

* [Vehicle](#Vehicle)
    * [new Vehicle(id, token, [unitSystem])](#new_Vehicle_new)
    * [.setUnitSystem(unitSystem)](#Vehicle+setUnitSystem)
    * [.disconnect()](#Vehicle+disconnect) ⇒ [<code>Promise</code>](#Promise)
    * [.permissions()](#Vehicle+permissions) ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
    * [.info()](#Vehicle+info) ⇒ [<code>Promise.&lt;Info&gt;</code>](#Info)
    * [.location()](#Vehicle+location) ⇒ [<code>Promise.&lt;Location&gt;</code>](#Location)
    * [.odometer()](#Vehicle+odometer) ⇒ [<code>Promise.&lt;Odometer&gt;</code>](#Odometer)
    * [.vin()](#Vehicle+vin) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.lock()](#Vehicle+lock) ⇒ [<code>Promise</code>](#Promise)
    * [.unlock()](#Vehicle+unlock) ⇒ [<code>Promise</code>](#Promise)

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
<a name="Vehicle+permissions"></a>

### vehicle.permissions() ⇒ <code>Promise.&lt;Array.&lt;String&gt;&gt;</code>
Fetch the list of permissions that this application has been granted for
this vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: <code>Promise.&lt;Array.&lt;String&gt;&gt;</code> - An array of permissions names.
**Example**
```js
['read_vehicle_info', 'read_odometer', 'control_security']
```
<a name="Vehicle+info"></a>

### vehicle.info() ⇒ [<code>Promise.&lt;Info&gt;</code>](#Info)
GET Vehicle.info

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Info&gt;</code>](#Info) - A promise for info on the vehicle's info
<a name="Vehicle+location"></a>

### vehicle.location() ⇒ [<code>Promise.&lt;Location&gt;</code>](#Location)
GET Vehicle.location

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Location&gt;</code>](#Location) - A promise for info on the vehicle's location.
<a name="Vehicle+odometer"></a>

### vehicle.odometer() ⇒ [<code>Promise.&lt;Odometer&gt;</code>](#Odometer)
GET Vehicle.odometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;Odometer&gt;</code>](#Odometer) - A promise for info on the vehicle's odometer.
<a name="Vehicle+vin"></a>

### vehicle.vin() ⇒ <code>Promise.&lt;String&gt;</code>
GET Vehicle.vin

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise for info on the vehicle's vin.
<a name="Vehicle+lock"></a>

### vehicle.lock() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.lock

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response.
<a name="Vehicle+unlock"></a>

### vehicle.unlock() ⇒ [<code>Promise</code>](#Promise)
POST Vehicle.unlock

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A success or failure response.
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
| data.distance | <code>Number</code> | The reading of the vehicle's odometer. |
| age | <code>Date</code> | The timestamp of when the data was recorded. |
| unitSystem | <code>String</code> | The unit system of the returned odometer. reading. `metric` signifies kilometers, `imperial` signifies miles. |

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
