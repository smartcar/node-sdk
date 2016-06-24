### Smartcar SDK

Here lies the smartcar software developement kit (or is this an API to the smartcar API?)
Currently there is only support for Node
There **_WILL_** be support for Swift and Java
There *PROBABLY* will be support for Python, Ruby, and Go

It will work something like this:
```javascript
var smartcar = require('smartcar')
var client = smartcar.client({
    id: '945feb12-921c-4c28-916d-649612ae831c',
    secret: '123e4567-e89b-12d3-a456-426655440000',
    redirect: 'https://grindr.io.ru/callback',
    scope: [
        'read_engine_hood',
        'control_trunk',
        'control_panic'
    ],
    units: 'metric'
})
// something to do with tokens and authentication and then getting vehicles

```