[![Build Status][ci-image]][ci-url]

<h1 align="center">Smartcar SDK</h1>
<p align="center">Node.js client SDK for the Smartcar API.<p>

### Overall Flow

* Create a new `Client` object with your `clientId`, `clientSecret`,
`redirectUri`, and `scope`
* Redirect the user to an OEM login page with `getAuthUrl`
* The user will login, and then accept or deny your `scope`'s permissions
* Handle the get request to `redirectUri`
  * If the user accepted your permissions, `req.query.code` will contain an
    authentication code
    * Use `exchangeCode` with this code to obtain an access object
    containing an access token (lasting 2 hours) and a refresh token
    (lasting 60 days)
      * save this access object
    * If the user denied your permissions, `req.query.error` will be set
    to `"access_denied"`
    * If you passed a state parameter to `getAuthUrl`, req.query.state will
    contain the state value.
* Redirect to your main app endpoint
* Handle the get request to your main app endpoint
* Use `refreshAccess` on your saved access object to automatically refresh an
expired `access_token`
* Get the user's vehicles with `getVehicles`
* Create a new `Vehicle` object using a vehicleId from the previous response, and
the `access_token`
* Do stuff with the vehicle data!

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
});

// Redirect to OEM login page
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
      // instantiate frist vehicle in vehicle list
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

[ci-url]: https://travis-ci.com/smartcar/node-sdk
[ci-image]: https://travis-ci.com/smartcar/node-sdk.svg?token=jMbuVtXPGeJMPdsn7RQ5&branch=master
