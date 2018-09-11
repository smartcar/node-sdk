# Smartcar Node SDK [![Build Status][ci-image]][ci-url] [![npm version][npm-image]][npm-url]

The official Smartcar Node SDK.

## Overview
The [Smartcar API](https://smartcar.com/docs) lets you read vehicle data
(location, odometer) and send commands to vehicles (lock, unlock) using HTTP requests.

To make requests to a vehicle from a web or mobile application, the end user
must connect their vehicle using
[Smartcar's authorization flow](https://smartcar.com/docs#authentication).
This flow follows the OAuth spec and will return a `code` which can be used to
obtain an access token from Smartcar.

The Smartcar Node SDK provides methods to:
1. Generate the link to redirect to for Smartcar's authorization flow.
2. Make a request to Smartcar with the `code` obtained from this authorization
flow to obtain an access and refresh token
3. Make requests to the Smartcar API to read vehicle data and send commands to
vehicles using the access token obtained in step 2.

Before integrating with Smartcar's SDK, you'll need to register an application
in the [Smartcar Developer portal](https://developer.smartcar.com). If you do
not have access to the dashboard, please
[request access](https://smartcar.com/subscribe).

### Flow
* Create a new `AuthClient` object with your `clientId`, `clientSecret`,
`redirectUri`, and required `scope`.
* Redirect the user to Smartcar's authentication flow using `getAuthUrl` or one
of our frontend SDKs.
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
* Get the user's vehicles with `getVehicleIds`.
* Create a new `Vehicle` object using a `vehicleId` from the previous response,
and the `access_token`.
* Make requests to the Smartcar API.
* Use `exchangeRefreshToken` on your saved `refreshToken` to retrieve a new token
when your `accessToken` expires.

### Installation
```shell
npm install smartcar --save
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
  clientSecret: 'SMARTCAR_CLIENT_SECRET',
  redirectUri: 'YOUR_CALLBACK_URI',
  scope: ['read_vehicle_info'],
  testMode: true, // launch the Smartcar auth flow in test mode
});

// Redirect to Smartcar's authentication flow
app.get('/login', function(req, res) {

  const link = client.getAuthUrl({state: 'MY_STATE_PARAM'});

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
      return smartcar.getVehicleIds(access.accessToken);
    })
    .then(function(res) {
      // instantiate first vehicle in vehicle list
      const vehicle = new smartcar.Vehicle(res.vehicles[0], access.accessToken);
      // get identifying information about a vehicle
      return vehicle.info();
    })
    .then(function(data) {
      console.log(data);
      // {
      //   "id": "36ab27d0-fd9d-4455-823a-ce30af709ffc",
      //   "make": "TESLA",
      //   "model": "Model S",
      //   "year": 2014
      // }

      // json response will be sent to the user
      res.json(data);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
```

## SDK Reference

For detailed documentation on parameters and available methods, please refer to
the [SDK Reference](doc/readme.md).

## Contributing
To contribute, please:
1. Open an issue for the feature (or bug) you would like to resolve.
2. Resolve the issue and add tests in your feature branch.
3. Open a PR from your feature branch into `master` that tags the issue.  

To test:
```shell
npm run test
```

[ci-url]: https://travis-ci.com/smartcar/node-sdk
[ci-image]: https://travis-ci.com/smartcar/node-sdk.svg?token=jMbuVtXPGeJMPdsn7RQ5&branch=master
[npm-url]: https://badge.fury.io/js/smartcar
[npm-image]: https://badge.fury.io/js/smartcar.svg
