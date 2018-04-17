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
    * [.location()](#Vehicle+location) ⇒ [<code>Promise</code>](#Promise)
    * [.odometer()](#Vehicle+odometer) ⇒ [<code>Promise</code>](#Promise)
    * [.vin()](#Vehicle+vin) ⇒ [<code>Promise</code>](#Promise)
    * [.lock()](#Vehicle+lock) ⇒ [<code>Promise</code>](#Promise)
    * [.unlock()](#Vehicle+unlock) ⇒ [<code>Promise</code>](#Promise)

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
<a name="Vehicle+location"></a>

### vehicle.location() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.location

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's location
<a name="Vehicle+odometer"></a>

### vehicle.odometer() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.odometer

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's odometer
<a name="Vehicle+vin"></a>

### vehicle.vin() ⇒ [<code>Promise</code>](#Promise)
GET Vehicle.vin

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise</code>](#Promise) - A promise for info on the vehicle's vin
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
