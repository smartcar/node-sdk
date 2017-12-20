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

const client = new smartcar.AuthClient({
  clientId: '...',
  clientSecret: '...',
  redirectUri: '...',
  scope: ['read_vehicle_info'],
});

// Redirect to OEM login page
app.get('/oemlogin', function(req, res, next){

  // get a link to the 'MOCK' oem login page
  const link = client.getAuthUrl('mock', {state: 'TODO define better'})

  // redirect to the link
  res.redirect(auth);
});

// Handle the redirectUri
app.get('/home', handleAuthCode, function(req, res, next) {
  res.redirect('/data');
});

const handleAuthCode = function(req, res, next) {

  if (req.query.error) {
    // the user denied your requested permissions
    return next(new Error(req.query.error));
  }

  client.exchangeCode(req.query.code)
    .then(/* save tokens to database */)
    .then(next);
}

// Main app endpoint
app.get('/data', function(req, res, next){

  let access ;

  // load a fresh access
  getAccess()
  .then(function(_access){
    access = _access;
    // get the user's vehicles
    return smartcar.getVehicles(newAccess.access_token);
  })
  .then(function(res){
    // get the first vehicle
    const vehicle = new smartcar.Vehicle(res.vehicles[0], access.access_token);
    return vehicle.info();
  })
  .then(function(data){
    // do something with the data!
  });
});

const getAccess = function() {
  return loadAccessFromSafePlace().then(function(access){

    if (smartcar.expired(access)) {
      return client.exchangeToken(access.refresh_token).tap(saveAccess);
    } else {
      return access;
    }

  });
}

app.listen(4000);
```

[ci-url]: https://travis-ci.com/smartcar/node-sdk
[ci-image]: https://travis-ci.com/smartcar/node-sdk.svg?token=jMbuVtXPGeJMPdsn7RQ5&branch=master
