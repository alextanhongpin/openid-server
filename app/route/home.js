


const HeaderCredentials = require('../middleware/header-credentials.js');

const getHomeView = {
	method: 'get',
	url: '/',
	handler: [
		HeaderCredentials.include,
		function renderPage(req, res, next) {
			res.render('home');
		}
	]
}



module.exports = {getHomeView}