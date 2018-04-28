# Smartcar.js [![Build Status][ci-image]][ci-url]

The official Smartcar Node SDK.

## Overview
The [Smartcar API](https://smartcar.com/docs) lets you read vehicle data (location, odometer) and send commands to vehicles (lock, unlock) to connected vehicles using HTTP requests.

To make requests to a vehicle from a web or mobile application, the end user must connect their vehicle using [Smartcar's authorization flow](https://smartcar.com/docs#authentication). This flow follows the OAuth spec and will return a `code` which can be used to obtain an access token from Smartcar.

The Smartcar Node SDK provides methods to:
1. Generate the link to redirect to for Smartcar's authorization flow.
2. Make a request to Smartcar with the `code` obtained from this authorization flow to obtain an access and refresh token
3. Make requests to the Smartcar API to read vehicle data and send commands to vehicles using the access token obtained in step 2.

Before integrating with Smartcar's SDK, you'll need to register an application in the [Smartcar Developer portal](https://developer.smartcar.com). If you do not have access to the dashboard, please [request access](https://smartcar.com/subscribe).

### Flow
* Create a new `Client` object with your `clientId`, `clientSecret`,
`redirectUri`, `scope`, and `development`.
* Redirect the user to Smartcar's authentication flow using `getAuthUrl`.
* The user will login, and then accept or deny your `scope`'s permissions.
* Handle the get request to `redirectUri`.
  * If the user accepted your permissions, `req.query.code` will contain an
    authentication code.
    * Use `exchangeCode` with this code to obtain an access object
    containing an access token (lasting 2 hours) and a refresh token
    (lasting 60 days).
      * Save this access object.
    * If the user denied your permissions, `req.query.error` will be set
    to `"access_denied"`.
    * If you passed a state parameter to `getAuthUrl`, `req.query.state` will
    contain the state value.
* Redirect to your main app endpoint.
* Handle the get request to your main app endpoint.
* Use `refreshAccess` on your saved access object to automatically refresh an
expired `access_token`.
* Get the user's vehicles with `getVehicles`.
* Create a new `Vehicle` object using a `vehicleId` from the previous response, and
the `access_token`.
* Make requests to the Smartcar API.

### Installation
```shell
npm install smartcar
```

To test:
```shell
npm run test
```

### Example
```javascript
'use strict';

const smartcar = require('smartcar');
const express = require('express');

const app = express();

const port = 4000;

const client = new smartcar.AuthClient({
  clientId: 'SMARTCAR_CLIENT_ID',
  clientSecret: 'SMARTCAR_SECRET',
  redirectUri: 'YOUR_CALLBACK_URI',
  scope: ['read_vehicle_info'],
  development: true, // include "mock" Smartcar brand in vehicle selector for testing
});

// Redirect to Smartcar's authentication flow
app.get('/mock/login', function(req, res) {

  // get a link to the 'MOCK' oem login page
  const link = client.getAuthUrl('mock', {state: 'MY_STATE_PARAM'});

  // redirect to the link
  res.redirect(link);
});

// Handle Smartcar callback with auth code
app.get('/callback', function(req, res, next) {
  let access;

  if (req.query.error) {
    // the user denied your requested permissions
    return next(new Error(req.query.error));
  }

  // exchange auth code for access token
  return client.exchangeCode(req.query.code)
    .then(function(_access) {
      // in a production app you'll want to store this in some kind of persistent storage
      access = _access;
      // get the user's vehicles
      return smartcar.getVehicles(access.access_token);
    })
    .then(function(res) {
      // instantiate first vehicle in vehicle list
      const vehicle = new smartcar.Vehicle(res.vehicles[0], access.access_token);
      // get identifying information about a vehicle
      return vehicle.info();
    })
    .then(function(data) {
      /* Example:
       * {
       *   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
       *   "make": "TESLA",
       *   "model": "Model S",
       *   "year": 2014
       * }
       */
      console.log(data);

      // json response will be sent to the user
      res.json(data);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
```

## Authentication Configuration
### `new Smartcar.AuthClient({options})`
#### Options:
| Parameter       | Type | Description   |
|:--------------- |:---|:------------- |
| `clientId`      | String |Application clientId obtained from [Smartcar Developer Portal](https://developer.smartcar.com). If you do not have access to the dashboard, please [request access](https://smartcar.com/subscribe). |
| `redirectUri`   | String |**Required** RedirectURI set in [application settings](https://developer.smartcar.com/apps). Given URL must match URL in application settings. |
| `scope`         | String[] |**Optional** List of permissions your application requires. This will default to requiring all scopes. The valid permission names are found in the [API Reference](https://smartcar.com/docs#get-all-vehicles). |
| `development`   | Boolean |**Optional** Launch Smartcar auth in development mode to enable the mock vehicle brand. |

### `getAuthurl({options})`
##### Example
```
'https://connect.smartcar.com/oauth/authorize?response_type=token...'
```

#### Options
| Parameter       | Type | Description   |
|:--------------- |:---|:------------- |
| `state`         | String |**Optional** OAuth state parameter passed to the redirectUri. This parameter may be used for identifying the user who initiated the request. |
| `forcePrompt`   | Boolean |**Optional** Setting `forcePrompt` to `true` will show the permissions approval screen on every authentication attempt, even if the user has previously consented to the exact scope of permissions. |

### `exchangeCode(code)`
##### Example
```
'https://connect.smartcar.com/oauth/authorize?response_type=token...'
```

#### Options
| Parameter       | Type | Description   |
|:--------------- |:---|:------------- |
| `code`         | String |Authorization code to exchange with Smartcar for an `access_token`. |

### `exchangeToken(token)`
#### Options
| Parameter       | Type | Description   |
|:--------------- |:---|:------------- |
| `token`         | String |Refresh token to exchange with Smartcar for an `access_token`. |

## Make Requests to a Vehicle
After receiving an `access_token` from the Smartcar Auth flow, your application may make
requests to the vehicle using that `access_token` and the `Vehicle` class.

[ci-url]: https://travis-ci.com/smartcar/node-sdk
[ci-image]: https://travis-ci.com/smartcar/node-sdk.svg?token=jMbuVtXPGeJMPdsn7RQ5&branch=master
