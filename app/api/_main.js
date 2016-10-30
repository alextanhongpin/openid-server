
// import routes here

module.exports = app => {



	[ 
		require('./authorize.js'),
		require('./client.js'),
		require('./token.js'),
	].map((actions) => {
		actions.map((action) => {
			return app[action.method](action.route, action.command);
		});
	});
}