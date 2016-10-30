

const Errors = require('../middleware/error-message.js');


function isBasic(req, res, next) {
	const headers = req.headers['authorization'];
	
	if (!headers || headers.indexOf('Basic') === - 1) {
		return next({
			error: Errors.INVALID_REQUEST,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST)
		});
	}
	next();
}


function isBearer(req, res, next) {
	const headers = req.headers['authorization'];
	
	if (!headers || headers.indexOf('Bearer') === - 1) {
		return next({
			error: Errors.INVALID_REQUEST,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST)
		});
	}
	next();
}


module.exports = { 
	basic: isBasic,
	bearer: isBearer
}