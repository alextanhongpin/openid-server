const Client = require('../model/client.js');




// Render the client view
const getClientView = {
	method: 'get',
	route: '/clients',
	command(req, res, next) {
		res.render('client.ejs');
	}
}

module.exports = [
	getClientView
]
