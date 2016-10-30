
const Errors = require('../middleware/error-message.js');

function redirectUri(req, res, next) {
	if (!req.query.redirectUri) {
		return next({
			error: Errors.INVALID_REQUEST,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST)
		});
	}
	next();
}