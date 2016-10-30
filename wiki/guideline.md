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