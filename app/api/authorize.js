// Description: The authorize api is meant for client with 
// the 'Authorization Code Grant Flow'. For internal use,
// refer to the 'Resource Owner Password Credentials' flow.

// Modules
const HttpStatus = require('http-status-codes');

// Models
const AuthorizationCode = require('../model/code.js');

// Middlewares
const asyncWrapper = require('../middleware/async-wrapper.js');
const AuthorizationCodeGrantFlow = require('../middleware/oauth2.js').AuthorizationCodeGrantFlow;
const Errors = require('../middleware/error-message.js');
const HeaderCredentials = require('../middleware/header-credentials.js');
const jwtToken = require('../middleware/jwt.js');
const jwtTokenOpenId = require('../middleware/jwt-openid.js');
const rurl = require('../middleware/rurl.js');

// Validators
const HeaderAuth = require('../validator/header-auth.js');



const authorizeRequest = {
	method: 'get',
	url: '/oauth2/authorize',
	handler: [
		// Requires the bearer token for refresh
		HeaderCredentials.include,
		// store the clients in the res.locals.client
		asyncWrapper(AuthorizationCodeGrantFlow.authorize),

		function renderPage(req, res, next) {


			const client = res.locals.client;
			res.locals.application_name = client && client.application_name;
			res.locals.scope = client.scope || [];
			res.locals.redirect_url = req.query.redirect_uri;

			// Unfortunately, there is no way to access the client data securely from client side
			// Encrypt it and resend it to the server side
			// Set expiration date to 5min max
			jwtToken.sign(req.query).then((encodedClient) => {
				res.locals.client = encodedClient;
				res.render('consent');
			});
		}
	]
}

const authorizeResponse = {
	method: 'post',
	url: '/oauth2/authorize',
	handler: [
		// Must be bearer
		HeaderAuth.bearer,
		// Store the extracted access token as res.locals.encoded_credentials
		HeaderCredentials.extract,

		function decodeClient(req, res, next) {
			// Client is the encoded authorization request
			const client = req.body.client;

			if (!client) {
				res.status(HttpStatus.BAD_REQUEST).json({
					error: Errors.UNAUTHORIZED_CLIENT,
					error_description: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
				});
			}

			jwtToken.verify(client).then((data) => {
				res.locals.decoded_client = data;
				// Also grab the `user_id` from the current token to 
				// pass back to the user
				return jwtTokenOpenId.verify(res.locals.encoded_credentials);
			}).then((user) => {
				res.locals.user_id = user.user_id;
				return next();
			}).catch((err) => {
				return next(err);
			});
		},
		// store the clients in the res.locals.client
		asyncWrapper(AuthorizationCodeGrantFlow.authorize),

		function response(req, res, next) {
			const isAuthorized = req.body.isAuthorized;
			// Success!
			// redirect_uri?code=code&state=state
			// create authorization code that expires in 5-10 minutes
			jwtToken.sign({
				useragent: req.headers['user-agent'],
				user_id: res.locals.user_id
			}, '5m').then((code) => {

				const client = res.locals.decoded_client;
				const redirectUri = client.redirect_uri;
				const state = client.state;
				
				// Should store the token here
				return AuthorizationCode.create({
					code: code
				}).then((data) => {
	
					if (isAuthorized) {
						const redirect_url = rurl.construct(redirectUri, { code, state })
						return res.status(HttpStatus.OK).json({ redirect_url });
					} else {
						const redirect_url = rurl.construct(redirectUri, {
							error: Errors.ACCESS_DENIED,
							error_description: Errors.getErrorDescriptionFrom(Errors.ACCESS_DENIED)
						})
						return res.status(HttpStatus.OK).json({ redirect_url });
					}
				});
			});



		}
	]
}

module.exports = {
	authorizeRequest,
	authorizeResponse
}

