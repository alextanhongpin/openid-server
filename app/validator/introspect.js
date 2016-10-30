
// Validate the introspect token as access token 
// and store it in res.locals.access_token
const Errors = require('../middleware/error-message.js');

function introspectAccessToken(req, res, next) {
	const { token, token_type_hint } = req.body;

	if (!token || !token_type_hint || token_type_hint !== 'access_token') {
		return next({
			error: Errors.INVALID_REQUEST,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST)
		});
	}

	res.locals.access_token = token;

	return next();
}


module.exports = {
	accessToken: introspectAccessToken
}