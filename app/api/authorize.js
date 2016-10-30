// Description: The authorize api is meant for client with 
// the 'Authorization Code Grant Flow'. For internal use,
// refer to the 'Resource Owner Password Credentials' flow.

// Modules
const HttpStatus = require('http-status-codes');
const querystring = require('querystring');

// Middlewares
const asyncWrapper = require('../middleware/async-wrapper.js');
const AuthorizationCodeGrantFlow = require('../middleware/oauth2.js').AuthorizationCodeGrantFlow;
const HeaderCredentials = require('../middleware/header-credentials.js');
const jwtToken = require('../middleware/jwt.js');
const jwtTokenOpenId = require('../middleware/jwt-openid.js');
const rurl = require('../middleware/rurl.js');

// Validators
const HeaderAuth = require('../validator/header-auth.js');
const ContentType = require('../validator/content-type.js');
const GrantType = require('../validator/grant-type.js');

const authorizeRequest = {
	method: 'get',
	route: '/oauth2/authorize',
	command: [
		// store the clients in the res.locals.client
		asyncWrapper(AuthorizationCodeGrantFlow.authorize),

		function renderPage(req, res, next) {

			console.log('Render ConsentPage')
			// console.log(res.locals.client)
			const client = res.locals.client;
			// // successful, render the consent view
			res.locals.application_name = client && client.application_name;
			res.locals.scope = client.scope || [];
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
	route: '/oauth2/authorize',
	command: [
		// Must be bearer
		HeaderAuth.bearer,
		// Store the extracted access token as res.locals.encoded_credentials
		HeaderCredentials.extract,

		function decodeClient(req, res, next) {
			// Client is the encoded authorization request
			const client = req.body.client;

			if (!client) {
				res.status(HttpStatus.BAD_REQUEST).json({
					error: 'Invalid client',
					error_description: 'This client is not authorized'
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
				user_agent: req.headers['user-agent'],
				user_id: res.locals.user_id
			}, '5m').then((code) => {

				const client = res.locals.decoded_client;
				const redirectUri = client.redirect_uri;
				const state = client.state;
				

				
				if (isAuthorized) {

					const redirect_url = rurl.construct(redirectUri, { code, state })
					res.status(HttpStatus.OK).json({ redirect_url });
				} else {
					const redirect_url = rurl.construct(redirectUri, { error: 'access_denied' })
					res.status(HttpStatus.OK).json({ redirect_url });
				}
			});



		}
	]
}

module.exports = [
	authorizeRequest,
	authorizeResponse
]
