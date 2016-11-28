### Smartcar SDK [![Build Status](https://travis-ci.com/smartcar/node-sdk.svg?token=jMbuVtXPGeJMPdsn7RQ5&branch=master)](https://travis-ci.com/smartcar/node-sdk) [![Coverage Status](https://coveralls.io/repos/github/smartcar/node-sdk/badge.svg?t=ckIXmq)](https://coveralls.io/github/smartcar/node-sdk)

Node.js client SDK for the Smartcar API.

### Overall Flow

* Create a new `Smartcar` object with your `clientId`, `clientSecret`, 
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
* Do stuff with the vehicle data!

### Example
```javascript
var Smartcar = require('smartcar-sdk');
var express = require('express');

var app = express();
var client = new Smartcar({
  clientId: '...',
  clientSecret: '...',
  redirectUri: '...',
  scope: [ 'read_vehicle_info' ]
});

saveAccess = function(access){
  // put your access somewhere safe!
}

loadAccessFromSafePlace = function(access){
  // Return the saved access
}

handleAuthCode = function(req, res, next){
  if (req.query.error) {
    // the user denied your requested permissions
    next();
  } else {
    client.exchangeCode(req.query.code)
    .then(saveAccess)
    .then(next);
  }
}

getAccess = function(){
  return loadAccessFromSafePlace()
  .then(function(access){
    if(client.expired(access)){
      client.exchangeToken(access.refresh_token)
      .tap(saveAccess)
      .then(function(access){
        return access;
      });
    } else {
      return access;
    }
  });
}

// Redirect to OEM login page
app.get('/oemlogin', function(req, res, next){
  // get a link to the 'MOCK' oem login page
  var auth = client.getAuthUrl('mock')
  // redirect to the link
  res.redirect(auth);
});

// Handle the redirectUri
app.get('/home',
  handleAuthCode, 
  function(req, res, next){
    res.redirect('/data');
  }
);

// Main app endpoint
app.get('/data', function(req, res, next){
  // load a fresh access
  getAccess()
  .bind({})
  .then(function(newAccess){
    this.access = newAccess;
    // get the user's vehicles
    return client.getVehicles(newAccess.access_token);
  })
  .then(function(res){
    // get the first vehicle
    var vehicle = client.getVehicle(this.access.access_token, res.vehicles[0]);
    return vehicle.info();
  })
  .then(function(data){
    // do something with the data!
  });
});

app.listen(4000);
```
