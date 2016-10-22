
const HttpStatus = require('http-status-codes');

const Token = require('../model/token.js');

const extractHeaderAuth = require('../middleware/header-auth.js');
const jwtToken = require('../middleware/jwt-openid');


// Apis
// Capture all Routes *
const authorizeTokenRoute = {
	method: 'use',
	route: '/tokens',
	command(req, res, next) {
		const { accessToken, grantType } = extractHeaderAuth(req.headers['authorization']);
		jwtToken.verify(accessToken).then((data) => {

			// set the user id to reuse it
			if (data && data.user_id) {
				req.user = {
					id: data.user_id
				}
				return next();
			}
		}).catch((err) => {
			if (err) res.redirect('/register');
		})
	}
}

const validateToken = {
	method: 'post',
	route: '/tokens/validate',
	command(req, res, next) {

		const { accessToken, grantType } = extractHeaderAuth(req.headers.authorization); 

		// carry out validation here
		res.status(HttpStatus.OK).json({
			success: true
		});

	},
}

const refreshToken = {
	
}

const getTokens = {
	method: 'get',
	route: '/tokens',
	command(req, res, next) {


		Token.getByOwnerId({ id: req.user.id }).then((data) => {
	
			res.status(200).json({
				success: true,
				results: data
			});
		});
	}
}


module.exports = [
authorizeTokenRoute,
	validateToken,
	getTokens
]


