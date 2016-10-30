
const RefreshTokenErrors = require('../middleware/error-message.js').RefreshTokenErrors;

function _validateBasicType(req, res, next) {
	const headers = req.headers['authorization'];
	
	if (!headers || headers.indexOf('Basic') === - 1) {
		return next({
			error: RefreshTokenErrors.INVALID_REQUEST,
			error_description: RefreshTokenErrors.getErrorDescriptionFrom(RefreshTokenErrors.INVALID_REQUEST)
		});
	}

	console.log('HeaderAuth: ', headers)
	next();
}
function _validateBearerType(req, res, next) {
	const headers = req.headers['authorization'];
	
	if (!headers || headers.indexOf('Bearer') === - 1) {
		return next({
			error: RefreshTokenErrors.INVALID_REQUEST,
			error_description: RefreshTokenErrors.getErrorDescriptionFrom(RefreshTokenErrors.INVALID_REQUEST)
		});
	}
	console.log('HeaderAuth: ', headers)
	next();
}


module.exports = { 
	basic: _validateBasicType,
	bearer: _validateBearerType
}