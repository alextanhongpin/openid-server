
const Errors = require('../middleware/error-message.js');



function isClientCredentials(req, res, next) {

	const grantType = req.body.grant_type || req.query.grant_type;

	if (!grantType && grantType !== 'client_credentials') {
		return next({
			error: Errors.INVALID_GRANT,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_GRANT)
		});
	}
	next();
}

function isAuthorizationCode(req, res, next) {

	const grantType = req.body.grant_type || req.query.grant_type;

	if (!grantType && grantType !== 'authorization_code') {
		return next({
			error: Errors.INVALID_GRANT,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_GRANT)
		});
	}
	next();
}

function isRefresh(req, res, next) {

	const grantType = req.body.grant_type || req.query.grant_type;

	if (!grantType && grantType !== 'refresh_token') {
		return next({
			error: Errors.INVALID_GRANT,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_GRANT)
		});
	}
	next();
}
function isPassword(req, res, next) {

	const grantType = req.body.grant_type || req.query.grant_type;

	if (grantType !== 'password') {
		return next({
			error: Errors.INVALID_GRANT,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_GRANT)
		});
	}
	next();
}


function isToken(req, res, next) {

	// check grant type - can be `refresh_token` or `password` 
	const grantType = req.body.grant_type || req.query.grant_type;

	if (!grantType) {
		return next({
			error: Errors.INVALID_GRANT,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_GRANT)
		});
	}
	if (grantType === 'refresh_token') {
		res.locals.grant_type = grantType;
	} else if (grantType === 'password') {
		res.locals.grant_type = grantType;
	} else if (grantType === 'authorization_code') {
		res.locals.grant_type = grantType;
	} else {
		return next({
			error: Errors.INVALID_GRANT,
			error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_GRANT)
		});
	}
	next();
};



module.exports = {
	clientCredentials: isClientCredentials,
	authorizationCode: isAuthorizationCode,
	refresh: isRefresh,
	password: isPassword,
	token: isToken
}