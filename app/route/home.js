


const HeaderCredentials = require('../middleware/header-credentials.js');

const getHomeView = {
	method: 'get',
	route: '/',
	command: [
		HeaderCredentials.include,
		function renderPage(req, res, next) {
			res.render('home');
		}
	]
}



module.exports = [
	getHomeView
]
