
// Validate the jwt-encoded access token
const Errors = require('../middleware/error-message.js');

const util = require('util')

const jwtToken = require('../middleware/jwt-openid');

function bearer(req, res, next) {
	const accessToken = res.locals.encoded_credentials;
	jwtToken.verify(accessToken).then((decoded) => {

		console.dir(decoded, {depth: null, colors: true})
		if (decoded) {

			res.locals.access_token = accessToken;
			res.locals.user_id = decoded.user_id;
			res.locals.expires_in_seconds = decoded.expires_in_seconds;
			return next();
		} 
	}).catch((err) => {

		console.log(util.inspect(err, {depth: null, colors: true}))
		//console.dir(err, {depth: null, colors: true})
		console.log('validator/access-token:err', err)
		return next(err);
	});
}

function body(req, res, next) {
	const accessToken = res.locals.access_token;
	jwtToken.verify(accessToken).then((decoded) => {

		console.dir(decoded, {depth: null, colors: true})
		if (decoded) {

			res.locals.access_token = accessToken;
			res.locals.user_id = decoded.user_id;
			res.locals.expires_in_seconds = decoded.expires_in_seconds;
			return next();
		} 
	}).catch((err) => {

		console.log(util.inspect(err, {depth: null, colors: true}))
		//console.dir(err, {depth: null, colors: true})
		console.log('validator/access-token:err', err)
		return next(err);
	});
}


module.exports = {
	bearer,
	body
}