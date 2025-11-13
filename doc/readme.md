# Smartcar Node SDK

Smartcar Node SDK documentation.


## Modules

<dl>
<dt><a href="#module_smartcar">smartcar</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Promise">Promise</a></dt>
<dd></dd>
<dt><a href="#AuthClient">AuthClient</a></dt>
<dd></dd>
<dt><a href="#SmartcarError">SmartcarError</a></dt>
<dd><p>Class to handle all errors from Smartcar API
Please see our <a href="https://smartcar.com/docs">error guides</a> to see a list
of all the possible error types and codes of both v2.0 and v1.0 requests.</p>
</dd>
<dt><a href="#SmartcarService">SmartcarService</a></dt>
<dd></dd>
<dt><a href="#Vehicle">Vehicle</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#METHODS_MAP">METHODS_MAP</a> : <code>object.&lt;String, Object&gt;</code></dt>
<dd><p>Every key here is the function name on vehicle
This map is used to generate the methods dynamically. Every value is an object of
the following fields :</p>
<ul>
<li>requestType: http request type, defaults to &#39;get&#39; if not mentioned.</li>
<li>path: url path to hit, defaults to the method name</li>
<li>body: body for post requests.</li>
</ul>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Access">Access</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Permissions">Permissions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#DiagnosticSystemStatus">DiagnosticSystemStatus</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#DiagnosticSystemStatusResponse">DiagnosticSystemStatusResponse</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#DiagnosticTroubleCode">DiagnosticTroubleCode</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#DiagnosticTroubleCodesResponse">DiagnosticTroubleCodesResponse</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ServiceHistory">ServiceHistory</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ChargeLimit">ChargeLimit</a></dt>
<dd></dd>
<dt><a href="#WebhookSubscription">WebhookSubscription</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Batch">Batch</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Response">Response</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SignalsRes">SignalsRes</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SignalsResBody">SignalsResBody</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SignalRes">SignalRes</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SignalResBody">SignalResBody</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Meta">Meta</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Vin">Vin</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Charge">Charge</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Battery">Battery</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BatteryCapacity">BatteryCapacity</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#NominalCapacity">NominalCapacity</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Fuel">Fuel</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#TirePressure">TirePressure</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#EngineOil">EngineOil</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Odometer">Odometer</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#SecurityResponse">SecurityResponse</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Location">Location</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Attributes">Attributes</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ActionResponse">ActionResponse</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_smartcar"></a>

## smartcar

* [smartcar](#module_smartcar)
    * _static_
        * [.SmartcarError](#module_smartcar.SmartcarError)
        * [.Vehicle](#module_smartcar.Vehicle)
        * [.AuthClient](#module_smartcar.AuthClient)
        * [.setApiVersion(version)](#module_smartcar.setApiVersion)
        * [.getApiVersion()](#module_smartcar.getApiVersion) ⇒ <code>String</code>
        * [.getUser(accessToken)](#module_smartcar.getUser) ⇒ [<code>User</code>](#module_smartcar..User)
        * [.getVehicles(accessToken, [paging])](#module_smartcar.getVehicles) ⇒ [<code>VehicleIds</code>](#module_smartcar..VehicleIds)
        * [.getVehicle(accessToken, vehicleId)](#module_smartcar.getVehicle) ⇒ [<code>VehicleRes</code>](#module_smartcar..VehicleRes)
        * [.getCompatibility(vin, scope, [country], [options])](#module_smartcar.getCompatibility) ⇒ [<code>Compatibility</code>](#module_smartcar..Compatibility)
        * [.getCompatibilityMatrix(region, [options])](#module_smartcar.getCompatibilityMatrix) ⇒ [<code>CompatibilityMatrix</code>](#module_smartcar..CompatibilityMatrix)
        * [.hashChallenge(amt, challenge)](#module_smartcar.hashChallenge) ⇒ <code>String</code>
        * [.verifyPayload(amt, signature, body)](#module_smartcar.verifyPayload) ⇒ <code>Boolean</code>
    * _inner_
        * [~User](#module_smartcar..User) : <code>Object</code>
        * [~VehicleIds](#module_smartcar..VehicleIds) : <code>Object</code>
        * [~VehicleRes](#module_smartcar..VehicleRes) : <code>Object</code>
        * [~Vehicle](#module_smartcar..Vehicle) : <code>Object</code>
        * [~Compatibility](#module_smartcar..Compatibility) : <code>Object</code>
        * [~CompatibilityMatrixEntry](#module_smartcar..CompatibilityMatrixEntry) : <code>Object</code>
        * [~CompatibilityMatrix](#module_smartcar..CompatibilityMatrix) : <code>Object</code>
        * [~GetConnections](#module_smartcar..GetConnections) ⇒ <code>Promise.&lt;GetConnections&gt;</code>
        * [~DeleteConnections](#module_smartcar..DeleteConnections) ⇒ <code>Promise.&lt;DeleteConnections&gt;</code>

<a name="module_smartcar.SmartcarError"></a>

### smartcar.SmartcarError
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: [module:errors](module:errors)
<a name="module_smartcar.Vehicle"></a>

### smartcar.Vehicle
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: [Vehicle](#Vehicle)
<a name="module_smartcar.AuthClient"></a>

### smartcar.AuthClient
**Kind**: static property of [<code>smartcar</code>](#module_smartcar)
**See**: [AuthClient](#AuthClient)
<a name="module_smartcar.setApiVersion"></a>

### smartcar.setApiVersion(version)
Sets the version of Smartcar API you are using

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)

| Param | Type |
| --- | --- |
| version | <code>String</code> |

<a name="module_smartcar.getApiVersion"></a>

### smartcar.getApiVersion() ⇒ <code>String</code>
Gets the version of Smartcar API that is set

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Returns**: <code>String</code> - version
<a name="module_smartcar.getUser"></a>

### smartcar.getUser(accessToken) ⇒ [<code>User</code>](#module_smartcar..User)
Return the user's id.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| accessToken | <code>String</code> | access token |

<a name="module_smartcar.getVehicles"></a>

### smartcar.getVehicles(accessToken, [paging]) ⇒ [<code>VehicleIds</code>](#module_smartcar..VehicleIds)
Return list of the user's vehicles ids.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| accessToken | <code>String</code> | access token |
| [paging] | <code>Object</code> |  |
| [paging.limit] | <code>Number</code> | number of vehicles to return |
| [paging.offset] | <code>Number</code> | index to start vehicle list |

<a name="module_smartcar.getVehicle"></a>

### smartcar.getVehicle(accessToken, vehicleId) ⇒ [<code>VehicleRes</code>](#module_smartcar..VehicleRes)
Return basic info about a vehicle.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| accessToken | <code>String</code> | access token |
| vehicleId | <code>String</code> | vehicle id |

<a name="module_smartcar.getCompatibility"></a>

### smartcar.getCompatibility(vin, scope, [country], [options]) ⇒ [<code>Compatibility</code>](#module_smartcar..Compatibility)
Determine whether a vehicle is compatible with Smartcar.

A compatible vehicle is a vehicle that:
1. has the hardware required for internet connectivity,
2. belongs to the makes and models Smartcar supports, and
3. supports the permissions.

_To use this function, please contact us!_

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vin | <code>String</code> |  | the VIN of the vehicle |
| scope | <code>Array.&lt;String&gt;</code> |  | list of permissions to check compatibility for |
| [country] | <code>String</code> | <code>&#x27;US&#x27;</code> | an optional country code according to [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). |
| [options] | <code>Object</code> |  |  |
| [options.testMode] | <code>Boolean</code> |  | Deprecated, please use `mode` instead. Launch Smartcar Connect in [test mode](https://smartcar.com/docs/guides/testing/). |
| [options.mode] | <code>String</code> |  | Determine what mode Smartcar Connect should be launched in. Should be one of test, live or simulated. |
| [options.testModeCompatibilityLevel] | <code>String</code> |  | This string determines which permissions the simulated vehicle is capable of. Possible Values can be found at this link: (https://smartcar.com/docs/integration-guide/test-your-integration/test-requests/#test-successful-api-requests-with-specific-vins) |

**Example**
```js
// Called with country parameter
const compatibility = await smartcar.getCompatibility(
  '5YJ3E1EA7KF317XXX',
  ['read_odometer', 'read_location'],
  'US',
  { mode: 'live' },
);
```
**Example**
```js
// Called without country parameter
const compatibility = await smartcar.getCompatibility(
  '5YJ3E1EA7KF317XXX',
  ['read_odometer', 'read_location'],
  { mode: 'live' },
);
```
<a name="module_smartcar.getCompatibilityMatrix"></a>

### smartcar.getCompatibilityMatrix(region, [options]) ⇒ [<code>CompatibilityMatrix</code>](#module_smartcar..CompatibilityMatrix)
Retrieve the Smartcar compatibility matrix for a given region.
Provides the ability to filter by scope, make, and type.

A compatible vehicle is a vehicle that:
1. has the hardware required for internet connectivity,
2. belongs to the makes and models Smartcar supports, and
3. supports the permissions.

_To use this function, please contact us!_

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| region | <code>String</code> | the region to retrieve the compatibility matrix for |
| [options] | <code>Object</code> |  |
| [options.scope] | <code>Array.&lt;String&gt;</code> | list of permissions to filter the matrix by |
| [options.make] | <code>Array.&lt;String&gt;</code> | list of makes to filter the matrix by |
| [options.type] | <code>String</code> | Engine type to filter the matrix by (e.g., "ICE", "HEV", "PHEV", "BEV"). |
| [options.mode] | <code>String</code> | Determine what mode Smartcar Connect should be launched in. Should be one of test, live or simulated. |
| [options.version] | <code>String</code> | API version to use for the request |

<a name="module_smartcar.hashChallenge"></a>

### smartcar.hashChallenge(amt, challenge) ⇒ <code>String</code>
Generate hash challenege for webhooks. It does HMAC_SHA256(amt, challenge)

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Returns**: <code>String</code> - String representing the hex digest

| Param | Type | Description |
| --- | --- | --- |
| amt | <code>String</code> | Application Management Token |
| challenge | <code>String</code> | Challenge string |

<a name="module_smartcar.verifyPayload"></a>

### smartcar.verifyPayload(amt, signature, body) ⇒ <code>Boolean</code>
Verify webhook payload with AMT and signature.

**Kind**: static method of [<code>smartcar</code>](#module_smartcar)
**Returns**: <code>Boolean</code> - true if signature matches the hex digest of amt and body

| Param | Type | Description |
| --- | --- | --- |
| amt | <code>String</code> | Application Management Token |
| signature | <code>String</code> | sc-signature header value |
| body | <code>object</code> | webhook response body |

<a name="module_smartcar..User"></a>

### smartcar~User : <code>Object</code>
**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | User Id |
| meta | <code>module:smartcar.Vehicle.Meta</code> |  |

**Example**
```js
{
  id: "e0514ef4-5226-11e8-8c13-8f6e8f02e27e",
  meta: {
    requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
  }
}
```
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
| meta | <code>module:smartcar.Vehicle.Meta</code> |  |

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
  },
  meta: {
    requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
  }
}
```
<a name="module_smartcar..VehicleRes"></a>

### smartcar~VehicleRes : <code>Object</code>
**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| body | [<code>Vehicle</code>](#Vehicle) | The vehicle response data. |
| [headers] | <code>Object</code> | Response headers |

<a name="module_smartcar..Vehicle"></a>

### smartcar~Vehicle : <code>Object</code>
**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Vehicle Id |
| type | <code>String</code> | Resource type |
| attributes | <code>Object</code> |  |
| attributes.make | <code>String</code> | Vehicle make |
| attributes.model | <code>String</code> | Vehicle model |
| attributes.year | <code>Number</code> | Vehicle year |
| links | <code>Object</code> |  |
| links.self | <code>String</code> | Link to vehicle resource |

**Example**
```js
{
  "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
  "type": "vehicle",
  "attributes": {
    "make": "TESLA",
    "model": "Model 3",
    "year": 2019
  },
  "links": {
    "self": "/vehicles/36ab27d0-fd9d-4455-823a-ce30af709ffc"
  }
}
```
<a name="module_smartcar..Compatibility"></a>

### smartcar~Compatibility : <code>Object</code>
**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)
**Properties**

| Name | Type |
| --- | --- |
| compatible | <code>Boolean</code> |
| reason | <code>VEHICLE\_NOT\_COMPATIBLE</code> \| <code>MAKE\_NOT\_COMPATIBLE</code> \| <code>null</code> |
| capabilities | <code>Array.&lt;String&gt;</code> |
| capabilities[].permission | <code>String</code> |
| capabilities[].endpoint | <code>String</code> |
| capabilities[].capable | <code>Boolean</code> |
| capabilities[].reason | <code>VEHICLE\_NOT\_COMPATIBLE</code> \| <code>MAKE\_NOT\_COMPATIBLE</code> \| <code>null</code> |
| meta | <code>module:smartcar.Vehicle.Meta</code> |

**Example**
```js
{
 compatible: true,
 reason: null,
 capabilities: [
   {
     capable: false,
     endpoint: '/engine/oil',
     permission: 'read_engine_oil',
     reason: 'SMARTCAR_NOT_CAPABLE',
   },
   {
     capable: true,
     endpoint: '/vin',
     permission: 'read_vin',
     reason: null,
   },
 ],
 meta: {
   'requestId':'6d4226e7-a7dd-44e0-b29c-9eed26be249d'
 }
}
```
<a name="module_smartcar..CompatibilityMatrixEntry"></a>

### smartcar~CompatibilityMatrixEntry : <code>Object</code>
**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)
**Properties**

| Name | Type |
| --- | --- |
| model | <code>String</code> |
| startYear | <code>Number</code> |
| endYear | <code>Number</code> |
| type | <code>String</code> |
| endpoints | <code>Array.&lt;String&gt;</code> |
| permissions | <code>Array.&lt;String&gt;</code> |

**Example**
```js
{
  model: "LEAF",
  startYear: 2018,
  endYear: 2022,
  type: "BEV",
  endpoints: [
    "EV battery",
    "EV charging status",
    "Location",
    "Lock & unlock",
    "Odometer"
  ],
  permissions: [
    "read_battery",
    "read_charge",
    "read_location",
    "control_security",
    "read_odometer"
  ]
}
```
<a name="module_smartcar..CompatibilityMatrix"></a>

### smartcar~CompatibilityMatrix : <code>Object</code>
**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| makes | <code>Object.&lt;String, Array.&lt;CompatibilityMatrixEntry&gt;&gt;</code> | A mapping of make names to arrays of CompatibilityMatrixEntry objects. |

**Example**
```js
{
  "NISSAN": [
    {
      "model": "LEAF",
      "startYear": 2018,
      "endYear": 2022,
      "type": "BEV",
      "endpoints": [
        "EV battery",
        "EV charging status",
        "Location",
        "Lock & unlock",
        "Odometer"
      ],
      "permissions": [
        "read_battery",
        "read_charge",
        "read_location",
        "control_security",
        "read_odometer"
      ]
    }
  ],
  "TESLA": [
    {
      "model": "3",
      "startYear": 2017,
      "endYear": 2023,
      "type": "BEV",
      "endpoints": [
        "EV battery",
        "EV charging status",
        "EV start & stop charge",
        "Location",
        "Lock & unlock",
        "Odometer",
        "Tire pressure"
      ],
      "permissions": [
        "read_battery",
        "read_charge",
        "control_charge",
        "read_location",
        "control_security",
        "read_odometer",
        "read_tires"
      ]
    }
  ]
}
```
<a name="module_smartcar..GetConnections"></a>

### smartcar~GetConnections ⇒ <code>Promise.&lt;GetConnections&gt;</code>
Returns a paged list of all the vehicles that are connected to the application associated
with the management API token used sorted in descending order by connection date.

**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)

| Param | Type | Description |
| --- | --- | --- |
| amt | <code>String</code> | Application Management Token |
| filter | <code>object</code> |  |
| filter.userId | <code>String</code> |  |
| filter.vehicleId | <code>String</code> |  |
| paging | <code>object</code> |  |
| paging.limit | <code>number</code> |  |
| paging.cursor | <code>String</code> |  |

**Properties**

| Name | Type |
| --- | --- |
| vehicleId | <code>String</code> |
| userId | <code>String</code> |
| connectedAt | <code>String</code> |
| connections | <code>Array.&lt;Connection&gt;</code> |
| [paging] | <code>Object</code> |
| [paging.cursor] | <code>string</code> |

<a name="module_smartcar..DeleteConnections"></a>

### smartcar~DeleteConnections ⇒ <code>Promise.&lt;DeleteConnections&gt;</code>
Deletes all the connections by vehicle or user ID and returns a
list of all connections that were deleted.

**Kind**: inner typedef of [<code>smartcar</code>](#module_smartcar)

| Param | Type | Description |
| --- | --- | --- |
| amt | <code>String</code> | Application Management Token |
| filter | <code>object</code> |  |
| filter.userId | <code>String</code> |  |
| filter.vehicleId | <code>String</code> |  |

**Properties**

| Name | Type |
| --- | --- |
| vehicleId | <code>String</code> |
| userId | <code>String</code> |
| connections | <code>Array.&lt;Connection&gt;</code> |

<a name="Promise"></a>

## Promise
**Kind**: global class
**See**: http://bluebirdjs.com/docs/api-reference.html
<a name="AuthClient"></a>

## AuthClient
**Kind**: global class

* [AuthClient](#AuthClient)
    * [new AuthClient(options)](#new_AuthClient_new)
    * [.getAuthUrl([scope], [options])](#AuthClient+getAuthUrl) ⇒ <code>String</code>
    * [.exchangeCode(code)](#AuthClient+exchangeCode) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
    * [.exchangeRefreshToken(token)](#AuthClient+exchangeRefreshToken) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)

<a name="new_AuthClient_new"></a>

### new AuthClient(options)
Create a Smartcar OAuth client for your application.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  |  |
| options.clientId | <code>String</code> |  | Application client id obtained from [Smartcar Developer Portal](https://developer.smartcar.com). If you do not have access to the dashboard, please [request access](https://smartcar.com/subscribe). |
| options.clientSecret | <code>String</code> |  | The application's client secret. |
| [options.redirectUri] | <code>String</code> |  | Redirect URI registered in the [application settings](https://developer.smartcar.com/apps). The given URL must exactly match one of the registered URLs. This parameter is optional and should normally be set within the Smartcar Dashboard. |
| [options.testMode] | <code>Boolean</code> | <code>false</code> | Deprecated, please use `mode` instead. Launch Smartcar Connect in [test mode](https://smartcar.com/docs/guides/testing/). |
| [options.mode] | <code>String</code> | <code>&#x27;live&#x27;</code> | Determine what mode Smartcar Connect should be launched in. Should be one of test, live or simulated. |

<a name="AuthClient+getAuthUrl"></a>

### authClient.getAuthUrl([scope], [options]) ⇒ <code>String</code>
Generate the Smartcar Connect URL.

By default users are not shown the permission dialog if they have already
approved the set of scopes for this application. The application can elect
to always display the permissions dialog to the user by setting
approval_prompt to `force`.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: <code>String</code> - Smartcar Connect URL to direct user to.

| Param | Type | Description |
| --- | --- | --- |
| [scope] | <code>Array.&lt;String&gt;</code> | List of permissions your application requires. The valid permission names are found in the [API Reference](https://smartcar.com/docs/guides/scope/). This is an optional parameter that should normally be set up within the Smartcar Dashboard. |
| [options] | <code>Object</code> |  |
| [options.forcePrompt] | <code>Boolean</code> | Setting `forcePrompt` to `true` will show the permissions approval screen on every authentication attempt, even if the user has previously consented to the exact scope of permissions. |
| [options.singleSelect] | <code>Boolean</code> \| <code>Object</code> | An optional value that sets the behavior of the grant dialog displayed to the user. Object can contain two keys :  - enabled - Boolean value, if set to `true`, `single_select` limits the user to    selecting only one vehicle.  - vin - String vin, if set, Smartcar will only authorize the vehicle with the specified VIN. See the [Single Select guide](https://smartcar.com/docs/guides/single-select/) for more information. |
| [options.state] | <code>String</code> | OAuth state parameter passed to the redirect uri. This parameter may be used for identifying the user who initiated the request. |
| [options.makeBypass] | <code>Object</code> | An optional parameter that allows users to bypass the car brand selection screen. For a complete list of supported makes, please see our [API Reference](https://smartcar.com/docs/api#authorization) documentation. |
| [options.flags] | <code>Object</code> | Object of flags where key is the name of the flag value is string or boolean value. |
| [options.user] | <code>String</code> | An optional unique identifier for a vehicle owner. This identifier is used to aggregate analytics across Connect sessions for each vehicle owner. |

**Example**
```js
// Called with `scope` parameter.
authClient.getAuthUrl(['read_odometer', 'read_vehicle_info'], {
  user: '61a3e3d2-5198-47ba-aabd-4623ce4a4042'
});
```
**Example**
```js
// Called with only `options` parameter.
authClient.getAuthUrl({
  user: '61a3e3d2-5198-47ba-aabd-4623ce4a4042'
});
```
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
&user=61a3e3d2-5198-47ba-aabd-4623ce4a4042
```
<a name="AuthClient+exchangeCode"></a>

### authClient.exchangeCode(code) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange an authorization code for an access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: [<code>Promise.&lt;Access&gt;</code>](#Access) - New set of Access and Refresh tokens.
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| code | <code>String</code> | Authorization code to exchange for a Smartcar access token and refresh token. |
| [options.flags] | <code>Object</code> | Object of flags where key is the name of the flag value is string or boolean value. |

<a name="AuthClient+exchangeRefreshToken"></a>

### authClient.exchangeRefreshToken(token) ⇒ [<code>Promise.&lt;Access&gt;</code>](#Access)
Exchange a refresh token for a new access object.

**Kind**: instance method of [<code>AuthClient</code>](#AuthClient)
**Returns**: [<code>Promise.&lt;Access&gt;</code>](#Access) - New set of Access and Refresh tokens.
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | Refresh token to exchange for a new set of Access and Refresh tokens. |
| [options.flags] | <code>Object</code> | Object of flags where key is the name of the flag value is string or boolean value. |

<a name="SmartcarError"></a>

## SmartcarError
Class to handle all errors from Smartcar API
Please see our [error guides](https://smartcar.com/docs) to see a list
of all the possible error types and codes of both v2.0 and v1.0 requests.

**Kind**: global class

* [SmartcarError](#SmartcarError)
    * [new SmartcarError(status, body, headers)](#new_SmartcarError_new)
    * [.error](#SmartcarError.error) : <code>string</code>
    * [.message](#SmartcarError.message) : <code>string</code>
    * [.description](#SmartcarError.description) : <code>string</code>
    * [.type](#SmartcarError.type) : <code>string</code>
    * [.code](#SmartcarError.code) : <code>string</code>
    * [.statusCode](#SmartcarError.statusCode) : <code>number</code>
    * [.requestId](#SmartcarError.requestId) : <code>string</code>
    * [.resolution](#SmartcarError.resolution) : [<code>Resolution</code>](#SmartcarError.Resolution)
    * [.docURL](#SmartcarError.docURL) : <code>string</code>
    * [.details](#SmartcarError.details) : <code>Array.&lt;object&gt;</code>
    * [.Resolution](#SmartcarError.Resolution) : <code>Object</code>

<a name="new_SmartcarError_new"></a>

### new SmartcarError(status, body, headers)

| Param | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | response status |
| body | <code>object</code> | response body |
| headers | <code>object</code> | response headers |

<a name="SmartcarError.error"></a>

### SmartcarError.error : <code>string</code>
Legacy field from V1 error depicting a category/type/description
of the error.

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.message"></a>

### SmartcarError.message : <code>string</code>
Error message field inherited from StandardError

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.description"></a>

### SmartcarError.description : <code>string</code>
Description of meaning of the error.

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.type"></a>

### SmartcarError.type : <code>string</code>
Type of error

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.code"></a>

### SmartcarError.code : <code>string</code>
Error code

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.statusCode"></a>

### SmartcarError.statusCode : <code>number</code>
HTTP status code

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.requestId"></a>

### SmartcarError.requestId : <code>string</code>
Unique identifier for request

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.resolution"></a>

### SmartcarError.resolution : [<code>Resolution</code>](#SmartcarError.Resolution)
Possible resolution for fixing the error

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.docURL"></a>

### SmartcarError.docURL : <code>string</code>
Reference to Smartcar documentation

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.details"></a>

### SmartcarError.details : <code>Array.&lt;object&gt;</code>
Further detail about the error in form of array of objects

**Kind**: static property of [<code>SmartcarError</code>](#SmartcarError)
<a name="SmartcarError.Resolution"></a>

### SmartcarError.Resolution : <code>Object</code>
**Kind**: static typedef of [<code>SmartcarError</code>](#SmartcarError)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>String</code> | Possible hint to fixing the issue |
| url | <code>String</code> | A URL to help resolve the issue or resume the operation |

<a name="SmartcarService"></a>

## SmartcarService
**Kind**: global class
<a name="new_SmartcarService_new"></a>

### new SmartcarService([options])
Initializes a new Service object to make requests to the Smartcar API.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> |  |
| [options.baseUrl] | <code>String</code> | Host/Base URL for the requests |
| [options.auth] | <code>Object</code> | authorization options |
| [options.headers] | <code>Object</code> | headers to add |
| [options.apiVersion] | <code>Object</code> | API version to use for requests |

<a name="Vehicle"></a>

## Vehicle
**Kind**: global class

* [Vehicle](#Vehicle)
    * [new Vehicle(id, token, [options])](#new_Vehicle_new)
    * [.permissions([paging])](#Vehicle+permissions) ⇒ [<code>Promise.&lt;Permissions&gt;</code>](#Permissions)
    * [.diagnosticSystemStatus()](#Vehicle+diagnosticSystemStatus) ⇒ [<code>Promise.&lt;DiagnosticSystemStatusResponse&gt;</code>](#DiagnosticSystemStatusResponse)
    * [.diagnosticTroubleCodes()](#Vehicle+diagnosticTroubleCodes) ⇒ [<code>Promise.&lt;DiagnosticTroubleCodesResponse&gt;</code>](#DiagnosticTroubleCodesResponse)
    * [.serviceHistory([startDate], [endDate])](#Vehicle+serviceHistory) ⇒ <code>Promise.&lt;Array.&lt;ServiceHistory&gt;&gt;</code>
    * [.getChargeLimit()](#Vehicle+getChargeLimit) ⇒ [<code>Promise.&lt;ChargeLimit&gt;</code>](#ChargeLimit)
    * [.setChargeLimit(limit)](#Vehicle+setChargeLimit) ⇒ [<code>Promise.&lt;ChargeLimit&gt;</code>](#ChargeLimit)
    * [.sendDestination(latitude, longitude)](#Vehicle+sendDestination) ⇒ [<code>Promise.&lt;ActionResponse&gt;</code>](#ActionResponse)
    * [.subscribe(webhookId)](#Vehicle+subscribe) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.unsubscribe(amt, webhookId)](#Vehicle+unsubscribe) ⇒ [<code>Promise.&lt;Meta&gt;</code>](#Meta)
    * [.batch(paths)](#Vehicle+batch) ⇒ [<code>Promise.&lt;Batch&gt;</code>](#Batch)
    * [.request(method, path, body, headers, apiVersion)](#Vehicle+request) ⇒ [<code>Promise.&lt;Response&gt;</code>](#Response)
    * [.getSignals()](#Vehicle+getSignals) ⇒ [<code>Promise.&lt;SignalsRes&gt;</code>](#SignalsRes)
    * [.getSignal(signalCode)](#Vehicle+getSignal) ⇒ [<code>Promise.&lt;SignalRes&gt;</code>](#SignalRes)
    * [.vin()](#Vehicle+vin) ⇒ [<code>Vin</code>](#Vin)
    * [.charge()](#Vehicle+charge) ⇒ [<code>Charge</code>](#Charge)
    * [.battery()](#Vehicle+battery) ⇒ [<code>Battery</code>](#Battery)
    * [.batteryCapacity()](#Vehicle+batteryCapacity) ⇒ [<code>BatteryCapacity</code>](#BatteryCapacity)
    * [.nominalCapacity()](#Vehicle+nominalCapacity) ⇒ [<code>NominalCapacity</code>](#NominalCapacity)
    * [.fuel()](#Vehicle+fuel) ⇒ [<code>Fuel</code>](#Fuel)
    * [.tirePressure()](#Vehicle+tirePressure) ⇒ [<code>TirePressure</code>](#TirePressure)
    * [.engineOil()](#Vehicle+engineOil) ⇒ [<code>EngineOil</code>](#EngineOil)
    * [.odometer()](#Vehicle+odometer) ⇒ [<code>Odometer</code>](#Odometer)
    * [.location()](#Vehicle+location) ⇒ [<code>Location</code>](#Location)
    * [.attributes()](#Vehicle+attributes) ⇒ [<code>Attributes</code>](#Attributes)
    * [.lock()](#Vehicle+lock) ⇒ [<code>ActionResponse</code>](#ActionResponse)
    * [.unlock()](#Vehicle+unlock) ⇒ [<code>ActionResponse</code>](#ActionResponse)
    * [.startCharge()](#Vehicle+startCharge) ⇒ [<code>ActionResponse</code>](#ActionResponse)
    * [.stopCharge()](#Vehicle+stopCharge) ⇒ [<code>ActionResponse</code>](#ActionResponse)
    * [.disconnect()](#Vehicle+disconnect) ⇒ [<code>ActionResponse</code>](#ActionResponse)
    * [.lockStatus()](#Vehicle+lockStatus) ⇒ <code>LockStatus</code>

<a name="new_Vehicle_new"></a>

### new Vehicle(id, token, [options])
Initializes a new Vehicle to use for making requests to the Smartcar API.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>String</code> |  | The vehicle's unique identifier. Retrieve a user's vehicle id using [getVehicles](#module_smartcar.getVehicles). |
| token | <code>String</code> |  | A valid access token |
| [options] | <code>Object</code> |  |  |
| [options.unitSystem] | <code>String</code> | <code>metric</code> | The unit system to use for vehicle data must be either `metric` or `imperial`. |
| [options.version] | <code>Object</code> |  | API version to use |
| [options.flags] | <code>Object</code> |  | Object of flags where key is the name of the flag and value is string or boolean value. |

<a name="Vehicle+permissions"></a>

### vehicle.permissions([paging]) ⇒ [<code>Promise.&lt;Permissions&gt;</code>](#Permissions)
Fetch the list of permissions that this application has been granted

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| [paging] | <code>Object</code> |  |
| [paging.limit] | <code>String</code> | number of permissions to return |
| [options.offset] | <code>Object</code> | The current start index of the returned list of elements. |

<a name="Vehicle+diagnosticSystemStatus"></a>

### vehicle.diagnosticSystemStatus() ⇒ [<code>Promise.&lt;DiagnosticSystemStatusResponse&gt;</code>](#DiagnosticSystemStatusResponse)
Fetches diagnostic system status information for the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;DiagnosticSystemStatusResponse&gt;</code>](#DiagnosticSystemStatusResponse) - -
The response containing diagnostic system statuses.
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
for all possible errors.

**Example**
```js
{
  "systems": [
    {
      "systemId": "SYSTEM_TPMS",
      "status": "ALERT",
      "description": "Left rear tire sensor battery low"
    },
    {
      "systemId": "SYSTEM_AIRBAG",
      "status": "OK",
      "description": null
    },
    {
      "systemId": "SYSTEM_ABS",
      "status": "ALERT",
      "description": null
    },
    // Additional diagnostic systems
  ]
}
```
<a name="Vehicle+diagnosticTroubleCodes"></a>

### vehicle.diagnosticTroubleCodes() ⇒ [<code>Promise.&lt;DiagnosticTroubleCodesResponse&gt;</code>](#DiagnosticTroubleCodesResponse)
Fetches active diagnostic trouble codes (DTCs) for the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;DiagnosticTroubleCodesResponse&gt;</code>](#DiagnosticTroubleCodesResponse) - - The response containing active
diagnostic trouble codes.
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - If there is an error with the API request.

**Example**
```js
{
  "activeCodes": [
    {
      "code": "P302D",
      "timestamp": "2024-09-05T14:48:00.000Z"
    },
    {
      "code": "P303D",
      "timestamp": null
    },
    // Additional codes as needed
  ]
}
```
<a name="Vehicle+serviceHistory"></a>

### vehicle.serviceHistory([startDate], [endDate]) ⇒ <code>Promise.&lt;Array.&lt;ServiceHistory&gt;&gt;</code>
Returns a list of all the service records performed on the vehicle,
filtered by the optional date range. If no dates are specified, records from the
last year are returned.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError. See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors) for all possible errors.

**See**: [Smartcar API Doc - Vehicle Service History](https://smartcar.com/docs/api#get-vehicle-service-history)

| Param | Type | Description |
| --- | --- | --- |
| [startDate] | <code>String</code> | The start date for the record filter, either in 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:MM:SS.SSSZ' format. |
| [endDate] | <code>String</code> | The end date for the record filter, similar format to startDate. |

<a name="Vehicle+getChargeLimit"></a>

### vehicle.getChargeLimit() ⇒ [<code>Promise.&lt;ChargeLimit&gt;</code>](#ChargeLimit)
Fetch the charge limit for an electric vehicle

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**Example**
```js
{
  limit: .7,
  meta: {
   requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
  }
}
```
<a name="Vehicle+setChargeLimit"></a>

### vehicle.setChargeLimit(limit) ⇒ [<code>Promise.&lt;ChargeLimit&gt;</code>](#ChargeLimit)
Set the charge limit for an electric vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | a number between 0 and 1 |

**Example**
```js
{
  status: string,
  meta: {
   requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
  }
}
```
<a name="Vehicle+sendDestination"></a>

### vehicle.sendDestination(latitude, longitude) ⇒ [<code>Promise.&lt;ActionResponse&gt;</code>](#ActionResponse)
Send a destination to the vehicle's navigation system.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Returns**: [<code>Promise.&lt;ActionResponse&gt;</code>](#ActionResponse) - - A Response object containing the status and metadata.
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - An instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| latitude | <code>number</code> | Latitude of the destination. Must be a valid latitude                            value between -90 and 90 (inclusive). |
| longitude | <code>number</code> | Longitude of the destination. Must be a valid longitude                             value between -180 and 180 (inclusive). |

**Example**
```js
{
  status: string,
  meta: {
    requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
  }
}
```
<a name="Vehicle+subscribe"></a>

### vehicle.subscribe(webhookId) ⇒ <code>Promise.&lt;Object&gt;</code>
Subscribe the vehicle to given webhook Id

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| webhookId | <code>String</code> | Webhook Id to subscribe to. |

<a name="Vehicle+unsubscribe"></a>

### vehicle.unsubscribe(amt, webhookId) ⇒ [<code>Promise.&lt;Meta&gt;</code>](#Meta)
Unsubscribe  the vehicle from given webhook Id

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| amt | <code>String</code> | Application management token to be used as authorization |
| webhookId | <code>String</code> | Webhook Id to unsubscribe from. |

<a name="Vehicle+batch"></a>

### vehicle.batch(paths) ⇒ [<code>Promise.&lt;Batch&gt;</code>](#Batch)
Make batch requests for supported items

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - on unsuccessful request. An instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Batch Request](https://smartcar.com/docs/api#post-batch-request)

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;String&gt;</code> | A list of paths of endpoints to send requests to. |

<a name="Vehicle+request"></a>

### vehicle.request(method, path, body, headers, apiVersion) ⇒ [<code>Promise.&lt;Response&gt;</code>](#Response)
General purpose method to make a request to a Smartcar endpoint.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | The HTTP request method to use. |
| path | <code>String</code> | The path to make the request to. |
| body | <code>Object</code> | The request body. |
| headers | <code>Object</code> | The headers to include in the request. |
| apiVersion | <code>String</code> | The API version to use for the request. |

<a name="Vehicle+getSignals"></a>

### vehicle.getSignals() ⇒ [<code>Promise.&lt;SignalsRes&gt;</code>](#SignalsRes)
Get the vehicle signals (v3 endpoint)

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

<a name="Vehicle+getSignal"></a>

### vehicle.getSignal(signalCode) ⇒ [<code>Promise.&lt;SignalRes&gt;</code>](#SignalRes)
Get a specific signal for a vehicle (v3 endpoint)

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.


| Param | Type | Description |
| --- | --- | --- |
| signalCode | <code>String</code> | the signal code to retrieve |

<a name="Vehicle+vin"></a>

### vehicle.vin() ⇒ [<code>Vin</code>](#Vin)
Returns the vehicle's manufacturer identifier (VIN).

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - VIN](https://smartcar.com/docs/api#get-vin)
<a name="Vehicle+charge"></a>

### vehicle.charge() ⇒ [<code>Charge</code>](#Charge)
Returns the current charge status of the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - EV charging status](https://smartcar.com/docs/api#get-ev-charging-status)
<a name="Vehicle+battery"></a>

### vehicle.battery() ⇒ [<code>Battery</code>](#Battery)
Returns the state of charge (SOC) and remaining range of an electric or
plug-in hybrid vehicle's battery.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - EV battery level](https://smartcar.com/docs/api#get-ev-battery)
<a name="Vehicle+batteryCapacity"></a>

### vehicle.batteryCapacity() ⇒ [<code>BatteryCapacity</code>](#BatteryCapacity)
Returns the capacity of an electric or plug-in hybrid vehicle's battery.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - EV battery capacity](https://smartcar.com/docs/api#get-ev-battery-capacity)
<a name="Vehicle+nominalCapacity"></a>

### vehicle.nominalCapacity() ⇒ [<code>NominalCapacity</code>](#NominalCapacity)
Returns a list of nominal rated battery capacities for a vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - nominal capacity](https://smartcar.com/docs/api-reference/get-nominal-capacity)
<a name="Vehicle+fuel"></a>

### vehicle.fuel() ⇒ [<code>Fuel</code>](#Fuel)
Returns the status of the fuel remaining in the vehicle's gas tank.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Fuel tank](https://smartcar.com/docs/api#get-fuel-tank)
<a name="Vehicle+tirePressure"></a>

### vehicle.tirePressure() ⇒ [<code>TirePressure</code>](#TirePressure)
Returns the air pressure of each of the vehicle's tires.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Tire pressure](https://smartcar.com/docs/api#get-tire-pressure)
<a name="Vehicle+engineOil"></a>

### vehicle.engineOil() ⇒ [<code>EngineOil</code>](#EngineOil)
Returns the remaining life span of a vehicle's engine oil

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Engine oil life](https://smartcar.com/docs/api#get-engine-oil-life)
<a name="Vehicle+odometer"></a>

### vehicle.odometer() ⇒ [<code>Odometer</code>](#Odometer)
Returns the vehicle's last known odometer reading.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Odometer](https://smartcar.com/docs/api#get-odometer)
<a name="Vehicle+location"></a>

### vehicle.location() ⇒ [<code>Location</code>](#Location)
Returns the last known location of the vehicle in geographic coordinates.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Location](https://smartcar.com/docs/api#get-location)
<a name="Vehicle+attributes"></a>

### vehicle.attributes() ⇒ [<code>Attributes</code>](#Attributes)
Returns make model year and id of the vehicle

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Vehicle attributes](https://smartcar.com/docs/api#get-vehicle-attributes)
<a name="Vehicle+lock"></a>

### vehicle.lock() ⇒ [<code>ActionResponse</code>](#ActionResponse)
Attempts to lock the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Lock](https://smartcar.com/docs/api#post-lockunlock)
<a name="Vehicle+unlock"></a>

### vehicle.unlock() ⇒ [<code>ActionResponse</code>](#ActionResponse)
Attempts to lock the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Unlock](https://smartcar.com/docs/api#post-lockunlock)
<a name="Vehicle+startCharge"></a>

### vehicle.startCharge() ⇒ [<code>ActionResponse</code>](#ActionResponse)
Attempts to start charging the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - EV start charge](https://smartcar.com/docs/api#post-ev-startstop-charge)
<a name="Vehicle+stopCharge"></a>

### vehicle.stopCharge() ⇒ [<code>ActionResponse</code>](#ActionResponse)
Attempts to stop charging the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - EV stop charge](https://smartcar.com/docs/api#post-ev-startstop-charge)
<a name="Vehicle+disconnect"></a>

### vehicle.disconnect() ⇒ [<code>ActionResponse</code>](#ActionResponse)
Disconnect this vehicle from the connected application.
Note: Calling this method will invalidate your token's access to the vehicle.
You will have to reauthorize the user to your application again if you wish
to make requests to it again.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Disconnect](https://smartcar.com/docs/api#delete-disconnect)
<a name="Vehicle+lockStatus"></a>

### vehicle.lockStatus() ⇒ <code>LockStatus</code>
Returns the lock status of the vehicle.

**Kind**: instance method of [<code>Vehicle</code>](#Vehicle)
**Throws**:

- [<code>SmartcarError</code>](#SmartcarError) - an instance of SmartcarError.
  See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
  for all possible errors.

**See**: [Smartcar API Doc - Lock Status](https://smartcar.com/docs/api#get-security)
<a name="METHODS_MAP"></a>

## METHODS\_MAP : <code>object.&lt;String, Object&gt;</code>
Every key here is the function name on vehicle
This map is used to generate the methods dynamically. Every value is an object of
the following fields :
- requestType: http request type, defaults to 'get' if not mentioned.
- path: url path to hit, defaults to the method name
- body: body for post requests.

**Kind**: global constant
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
<a name="Permissions"></a>

## Permissions : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| permissions | <code>Array.&lt;String&gt;</code> | An array of permissions names. |
| [paging] | <code>Object</code> |  |
| [paging.count] | <code>Number</code> | The total number of elements for the entire query (not just the given page). |
| [options.offset] | <code>Number</code> | The current start index of the returned list of elements. |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
  permissions: ['read_vehicle_info'],
  paging: {
     count: 25,
     offset: 10
  },
  meta: {
   requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
  }
}
```
<a name="DiagnosticSystemStatus"></a>

## DiagnosticSystemStatus : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| systemId | <code>string</code> | The identifier for the vehicle's system. |
| status | <code>string</code> | The status of the system, either 'OK' or 'ALERT'. |
| description | <code>string</code> \| <code>null</code> | Additional details about the system's status, if any. |

<a name="DiagnosticSystemStatusResponse"></a>

## DiagnosticSystemStatusResponse : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| systems | [<code>Array.&lt;DiagnosticSystemStatus&gt;</code>](#DiagnosticSystemStatus) | An array of diagnostic system statuses. |
| meta | [<code>Meta</code>](#Meta) | Metadata about the request. |

<a name="DiagnosticTroubleCode"></a>

## DiagnosticTroubleCode : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | The diagnostic trouble code identifier. |
| timestamp | <code>string</code> \| <code>null</code> | ISO 8601 formatted timestamp indicating when the code was triggered, may be null if not available. |

<a name="DiagnosticTroubleCodesResponse"></a>

## DiagnosticTroubleCodesResponse : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| activeCodes | [<code>Array.&lt;DiagnosticTroubleCode&gt;</code>](#DiagnosticTroubleCode) | An array of active diagnostic trouble codes. |
| meta | [<code>Meta</code>](#Meta) |  |

<a name="ServiceHistory"></a>

## ServiceHistory : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| serviceID | <code>Number</code> \| <code>null</code> | The unique identifier for the service record, or null if not available. |
| serviceDate | <code>String</code> | The date and time the service was performed. |
| odometerDistance | <code>Number</code> | The odometer reading at the time of service, in miles or kilometers based on the unit system. |
| serviceTasks | <code>Array.&lt;ServiceTask&gt;</code> | A list of tasks performed during the service. |
| serviceDetails | <code>ServiceDetails</code> | Details about the service provider and the type of service. |
| serviceCost | <code>ServiceCost</code> | The cost of the service with currency. |
| meta | [<code>Meta</code>](#Meta) | Metadata related to the service record. |

**Example**
```js
[
  {
    serviceId: 12345,
    serviceDate: "2022-07-10T16:20:00.000Z",
    odometerDistance: 50000,
    serviceTasks: [
      {
        taskId: 01,
        taskDescription: "oil change"
      }
    ],
    serviceDetails: {
      type: "dealership"  // "manual_entry" could be another possible value
    },
    serviceCost: {
      totalCost: 100,
      currency: 'USD'
    },
    meta: {
      dataAge: new Date('2023-04-30T07:20:50.844Z'),
      unitSystem: 'imperial',
      requestId: 'b3c14915-0c26-43c5-8e42-9edfc2a66b2f',
      fetchedAt: new Date('2023-04-30T07:20:51.844Z'),
    }
  }
  // ... additional service records
]
```
<a name="ChargeLimit"></a>

## ChargeLimit
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | the charge limit expressed as a decimal value between 0 and 1. |

<a name="WebhookSubscription"></a>

## WebhookSubscription : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| webhookId | <code>String</code> | Webhook Id that the vehicle was subscribed to |
| vehicleId | <code>String</code> | Current vehicle id that was subscribed to the webhook |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
  webhookId: 'dd214915-0c26-13c5-8e42-7edfc2ab320a',
  vehicleId: '19c0cc8c-80e0-4182-9372-6ef903c7599c',
  meta: {
   requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
  }
}
```
<a name="Batch"></a>

## Batch : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ENDPOINT | <code>function</code> | The response object for a given ENDPOINT where ENDPOINT is a Smartcar endpoint (i.e. /odometer, /fuel) or throws SmartcarError if the endpoint resulted in an error. |

**Example**
```js
{
   "odometer" : function() => returns odometer object or throws SmartcarError,
   "location" : function() => returns odometer location or throws SmartcarError,
}
```
<a name="Response"></a>

## Response : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| body | <code>String</code> | The response body |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
 body: { distance: 59801.6373441601 },
 meta: {
   dataAge: 2022-01-20T02:55:25.041Z,
   unitSystem: 'imperial',
   requestId: 'f787849d-d228-482d-345f-459a5154sg73',
   fetchedAt: 2022-01-20T02:55:25.041Z
 }
}
```
<a name="SignalsRes"></a>

## SignalsRes : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| body | [<code>SignalsResBody</code>](#SignalsResBody) | The signal response data. |
| [headers] | <code>Object</code> | Response headers |

<a name="SignalsResBody"></a>

## SignalsResBody : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>Array.&lt;SignalResBody&gt;</code>](#SignalResBody) | The array of signal objects. |

**Example**
```js
{
 "data": [
     {
         "id": "charge-activelimit",
         "type": "signal",
         "attributes": {
             "code": "charge-activelimit",
             "name": "ActiveLimit",
             "group": "Charge",
             "status": {
                 "value": "SUCCESS"
             },
             "body": {
                 "value": 80
             }
         },
         "meta": {},
         "links": {
             "self": "/vehicles/tst2e255-d3c8-4f90-9fec-e6e68b98e9cb/signals/charge-activelimit"
         }
     },
     {
         "id": "charge-amperage",
         "type": "signal",
         "attributes": {
             "code": "charge-amperage",
             "name": "Amperage",
             "group": "Charge",
             "status": {
                 "value": "SUCCESS"
             },
             "body": {
                 "value": 0
             }
         },
         "meta": {},
         "links": {
             "self": "/vehicles/tst2e255-d3c8-4f90-9fec-e6e68b98e9cb/signals/charge-amperage"
         }
     }
 ]
}
```
<a name="SignalRes"></a>

## SignalRes : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| body | [<code>SignalResBody</code>](#SignalResBody) | The signal response data. |
| [headers] | <code>Object</code> | Response headers |

<a name="SignalResBody"></a>

## SignalResBody : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The signal code identifier. |
| type | <code>String</code> | The type of signal, e.g., "signal". |
| attributes | <code>Object</code> | The attributes of the signal |
| attributes.code | <code>String</code> | The signal code. |
| attributes.name | <code>String</code> | The name of the signal. |
| attributes.group | <code>String</code> | The group to which the signal belongs. |
| attributes.status | <code>Object</code> | The status of the signal. |
| attributes.status.value | <code>String</code> | The value of the signal status, e.g., "SUCCESS". |
| attributes.body | <code>Object</code> | The body of the signal containing the actual data. |
| meta | <code>Object</code> | Metadata about the signal retrieval. |
| meta.retrievedAt | <code>Number</code> | Timestamp when the signal was retrieved. |
| meta.oemUpdatedAt | <code>Number</code> | Timestamp when the signal was last updated by the OEM. |
| links | <code>Object</code> | Links related to the signal. |
| links.self | <code>String</code> | The self-referential link for the signal. |

**Example**
```js
{
  "id": "odometer-traveleddistance",
  "type": "signal",
  "attributes": {
    "code": "odometer-traveleddistance",
    "name": "TraveledDistance",
    "group": "Odometer",
    "status": {
        "value": "SUCCESS"
    },
    "body": {
        "unit": "kilometers",
        "value": 115071.50046584333
    }
},
"meta": {
    "retrievedAt": 1752104218549,
    "oemUpdatedAt": 1752104118549
},
"links": {
    "self": "/vehicles/tst2e255-d3c8-4f90-9fec-e6e68b98e9cb/signals/odometer-traveleddistance"
 }
}
```
<a name="Meta"></a>

## Meta : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| dataAge | <code>Date</code> | The timestamp of when the data was recorded; returned if applicable. |
| fetchedAt | <code>Date</code> | The timestamp when the data was fetched from the vehicle |
| requestId | <code>String</code> | The smartcar request ID for debugging |
| unitSystem | <code>String</code> | Unit system used, metric or imperial; returned if applicable. |

**Example**
```js
{
  requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
  dataAge: new Date('2018-05-04T07:20:50.844Z'),
  unitSystem: 'imperial',
  fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
}
```
<a name="Vin"></a>

## Vin : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| vin | <code>String</code> | VIN of the vehicle |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
  vin: '12345678901234567',
  meta: {
    requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
  }
}
```
<a name="Charge"></a>

## Charge : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| isPluggedIn | <code>Boolean</code> | Indicates whether charging cable is   plugged in. |
| state | <code>String</code> | Indicates the current state of the charge   system. Can be `FULLY_CHARGED`, `CHARGING`, or `NOT_CHARGING`. |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
  isPluggedIn: false,
  state: "FULLY_CHARGED",
  meta: {
    dataAge: new Date('2018-05-04T07:20:50.844Z'),
    fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
  }
}
```
<a name="Battery"></a>

## Battery : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| range | <code>Number</code> | The estimated remaining distance the car can  travel (in kms or miles). Unit is passed as a parameter in vehicle constructor. |
| percentRemaining | <code>Number</code> | The remaining level of charge in   the battery (in percent). |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
  range: 40.5,
  percentRemaining: 0.3,
  meta: {
   dataAge: new Date('2018-05-04T07:20:50.844Z'),
   unitSystem: 'imperial',
   requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
  }
}
```
<a name="BatteryCapacity"></a>

## BatteryCapacity : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| capacity | <code>Number</code> | The total capacity of the vehicle's battery (in kilowatt-hours) |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
  capacity: 24,
  meta: {
   dataAge: new Date('2018-05-04T07:20:50.844Z'),
   unitSystem: 'imperial',
   requestId: '26c14915-0c26-43c5-8e42-9edfc2a66a0f',
   fetchedAt: new Date('2018-05-04T07:20:51.844Z'),
  }
}
```
<a name="NominalCapacity"></a>

## NominalCapacity : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| availableCapacities | <code>Array</code> | A list of the rated nominal capacities available for a vehicle |
| capacity | <code>Object</code> | The rated nominal capacity for the vehicle's battery in kWh |
| url | <code>String</code> | A URL that will launch the flow for a vehicle owner to specify the correct battery capacity for a vehicle |
| meta | [<code>Meta</code>](#Meta) |  |

**Example**
```js
{
 "availableCapacities": [
       {
           "capacity" :  70.9,
          "description" : null
      },
      {
          "capacity" :  80.9,
          "description" : null
      },
      {
          "capacity" :  90.9,
          "description" : "BEV:Extended Range"
      }
  ],
  "capacity": null,
  "url" : "https://connect.smartcar.com/battery-capacity?vehicle_id=36ab27d0-fd9d-4455-823a-ce30af709ffc&client_id=8229df9f-91a0-4ff0-a1ae-a1f38ee24d07&t