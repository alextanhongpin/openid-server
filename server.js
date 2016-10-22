const express = require('express');
const app = express();
const port = require('./app/config/main.js').port;


// Setup database
require('./app/database/_main.js')

// Setup middlewares
require('./app/middleware/_main.js')(app);

// Setup view routes 
require('./app/route/_main.js')(app);

// Setup api routes
require('./app/api/_main.js')(app);

app.listen(port, () => {
	console.log(`listening to port *:${ port }. press ctrl + c to cancel`)
});