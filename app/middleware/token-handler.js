// Don't do this

// Models
const fullUrl = require('../middleware/url');
const Token = require('../model/token.js');
const JWTErrorType = {
	INVALID: 'JsonWebTokenError',
	EXPIRED: 'TokenExpiredError'
}
const {
	getAccessToken,
	getUserAgent,
	getRefreshToken,
	getGrantType
} = require('../middleware/request-parser.js');
const jwtToken = require('../middleware/jwt-openid');
module.exports = function *(req, res, next) {
		
	const accessToken = getAccessToken(req, res, next);
	const userAgentValidator = getUserAgent(req, res, next);

	try {
		const decoded = yield jwtToken.verify(accessToken);
		if (decoded) {
			req.user = {
				id: decoded.user_id,
				grantType: 'validated',
				expiresIn: decoded.expires_in
			}
			return next();
		} 
	} catch(err) {

		const refreshToken = getRefreshToken(req, res, next);
		const errorName = err.name; // can be JsonWebTokenError or TokenExpiredError

		if (errorName === JWTErrorType.INVALID) {
			return next();
		} else if (errorName === JWTErrorType.EXPIRED) {

			const token = yield Token.findOneRefreshToken(refreshToken);

			if (!token) return next({ code: 'BAD_REQUEST', message: 'Invalid Credentials' });

			userAgentValidator(token.user_agent);

			const payload = {
				user_id: token.owner_id
			}

			const options = {
				audience: fullUrl(req),
				issuer: fullUrl(req),
				subject: token.application_name,
				expiresIn: '1m'
			}

			token.access_token = token.signAccessToken(payload, options);
			const saveToken = yield token.save();

			req.user = {
				id: saveToken.owner_id,
				grantType: 'refreshed',
				accessToken: saveToken.access_token
			}
			return next();
		}
	}
}

// Oauth2Strategy