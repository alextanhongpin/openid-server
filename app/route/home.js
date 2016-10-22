


	const getHomeView = {
		method: 'get',
		route: '/',
		command(req, res, next) {
			res.render('home');
		}
	}

	

	module.exports = [
		getHomeView
	]
