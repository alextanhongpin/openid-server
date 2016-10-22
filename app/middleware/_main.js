

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


module.exports = app => {

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: false }))

	// parse application/json
	app.use(bodyParser.json())
	app.use(cookieParser())

	// set default view engine
	app.set('view engine', 'ejs');
}