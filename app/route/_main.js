
// import routes here

module.exports = app => {

	[ 
		require('./client.js'),
		require('./auth.js'),
		require('./register.js'),
		require('./home.js')
	].map((actions) => {
		actions.map((action) => {
			return app[action.method](action.route, action.command);
		})
	})
}