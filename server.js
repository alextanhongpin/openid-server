const express = require('express');
const app = express();
const port = require('./app/config/main.js').port;


app.use(express.static(__dirname + '/public'));

// Setup database
require('./app/database/_main.js')

// Setup middlewares
require('./app/middleware/_main.js')(app);

// Setup view routes 
require('./app/route/_main.js')(app);

// Setup api routes
require('./app/api/_main.js')(app);

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