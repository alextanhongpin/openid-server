# Writing guideline for server side js

### Passing data to the next middleware

Use `res.locals` to pass data to the next middleware.
Note that the naming should be pascal.
```javascript
app.get('/index', function(req, res, next) {
 res.locals.client_credentials = 'client_credentials';
 next();
}, function (req, res, next) {
    const clientCredentials = res.locals.client_credentials;
    // do something with client credentials
}
```

Export api as plugin. You can also store the routes in the array and iterate through them.
```javascript
// Old practice
// old_api.js
module.exports = function(app) {
    app.get('/', function (req, res, next) {
        console.log('Hello world!')
    });
}
// old_server.js
require('./api/old_api.js')(app);

// New practice
// new_api.js
module.exports = {
    method: 'get',
    url: '/'
    handler: function (req, res, next) {
        console.log('Hello world!')
    }
}
// new_server.js
const api = require('./api/new_api.js');
app[api.method](api.route, api.handler);

// in arrays
const api1 = require('./api/api1.js');
const api2 = require('./api/api2.js');
const api3 = require('./api/api3.js');

[api1, api2, api3].map((api) => {
    app[api.method](api.route, api.handler);
});
```

Naming pracitices:
When naming a page, use the pattern `noun-Page` in camel case, e.g.
+ registrationPage
+ clientPage

When naming the route handler that renders the page, use the pattern `renderPageName`:
+ renderRegistrationPage
```
### Createing Secrets

Secrets can be created from many ways:
```
echo -n "j0tk3y" | openssl dgst -sha256 -hmac "j0ts3cr3t"
// For api key: echo -n "@p1k3y" | openssl dgst -sha256 -hmac "@pig3n3r@t0r"
// or 
const crypto = require('crypto');
crypto.randomBytes(32).toString('hex')
```