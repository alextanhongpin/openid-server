const express = require('express');
const app = express();
const port = require('./app/config/main.js').port;

const mapRoute = require('./app/middleware/map-route.js');
const apis = require('./app/api/_main.js');
const routes = require('./app/route/_main.js');

app.use(express.static(__dirname + '/public'));

// Setup database
require('./app/database/_main.js')

// Setup middlewares
require('./app/middleware/_main.js')(app);

// Setup view routes 
mapRoute(routes, (api) => {
	return app[api.method](api.url, api.handler);
});
// Setup api routes
mapRoute(apis, (api) => {
	return app[api.method](api.url, api.handler);
});

// Setup Error handler
const errorHandler = require('./app/middleware/error-handler.js');
app.use(errorHandler);

let isListening = false;
if (!isListening) {
	app.listen(port, () => {
		isListening = true;
		console.log(`listening to port *:${ port }. press ctrl + c to cancel`)
	});
}
module.exports = app;