### Smartcar SDK

Here lies the smartcar software developement kit (or is this an API to the smartcar API?)
Currently there is only support for Node
There **_WILL_** be support for Swift and Java
There *PROBABLY* will be support for Python, Ruby, and Go

It will work something like this:
```javascript
var Smartcar = require('node-sdk')
var client = new Smartcar({
    clientId: '945feb12-921c-4c28-916d-649612ae831c',
    clientSecret: '123e4567-e89b-12d3-a456-426655440000',
    redirectUri: 'https://sub.domain.tld/callback',
    scope: [
        'read_engine_hood',
        'control_trunk',
        'control_panic'
    ],
});

client.serializeToken(function(access, req, next){
	put_into_my_db(access);
	next();
});
app.get('/callback', client.handleAuthCode, 
	function(req, res, next){
		res.render('callback');
	}
);
app.get('/userinterface', function(req, res, next){
	client.getVehicles(access_from_my_db)
	.then(function(vehicles){
		return vehicles[0].odometer();
	}).then(function(distance){
		res.send("" + distance);
	})
});

```

#TODO

 * [ ] handle refresh tokens
 * [ ] allow callbacks and promise style "nodify"
