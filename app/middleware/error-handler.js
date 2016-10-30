const RestHandler = require('./rest-handler');

module.exports = function(err, req, res, next) {
	console.log('ErrorHandler', err)
	if (err) {
		const restHandler = RestHandler(req, res);

		const payload = {
			error: err.error,
			error_description: err.error_description
		}
		const error = err.code || 'BAD_REQUEST';
		const message = err.message || 'Unknown Error';
		return restHandler.error(error, message, payload);
	}
}
