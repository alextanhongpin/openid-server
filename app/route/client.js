const Client = require('../model/client.js');




// Render the client view
const getClientView = {
	method: 'get',
	url: '/clients',
	handler(req, res, next) {
		res.render('client.ejs');
	}
}

module.exports = {
	getClientView
}