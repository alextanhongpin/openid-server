const Client = require('../model/client.js');




	// Views

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
