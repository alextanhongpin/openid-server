
// The flow here is 'Authorization Code Grant' flow;

// Only third party registered clients can use it

// Middlewares
const asyncWrapper = require('../middleware/async-wrapper');
const RestHandler = require('../middleware/rest-handler');
const jwtToken = require('../middleware/jwt-openid');
const jwt = require('../middleware/jwt');

// Models
const AuthorizationCode = require('../model/code.js');
const Token = require('../model/token.js');



const AuthorizationCodeGrantFlow = require('../middleware/oauth2.js').AuthorizationCodeGrantFlow;
const ClientCredentials = require('../middleware/client-credentials.js');
const HeaderCredentials = require('../middleware/header-credentials.js');
const useragent = require('../middleware/useragent.js');
const Errors = require('../middleware/error-message.js');
const fullUrl = require('../middleware/url.js');
const nocache = require('../middleware/nocache.js');

// Modules
const HttpStatus = require('http-status-codes');
const ms = require('ms');

// Route
const route = require('../config/main.js').route;

const HeaderAuth = require('../validator/header-auth.js');
const ContentType = require('../validator/content-type.js');
const GrantType = require('../validator/grant-type.js');
const IntrospectToken = require('../validator/introspect.js');
const AccessToken = require('../validator/access-token.js');

/*
 * POST /oauth2/introspect
 * 
 * Description: Validate if the access token is coming from the provider.
 * Will return the refresh token too if the verified token has expired
 *
**/
const validateToken = {
	method: 'post',
	url: '/oauth2/introspect',
	handler:[	
		// Check if the content-type is application/x-www-form-urlencoded
		ContentType.form,
		// Check if the authorization header contain basic
		HeaderAuth.basic, 
		// Store the encodedCredentials as res.locals.encoded_credentials
		HeaderCredentials.extract,
		// Validate the encoded credentials, query the DB for the client
		// and store the client found as res.locals.client
		ClientCredentials.validate,
		// store introspected token as res.locals.access_token
		IntrospectToken.accessToken,
		// Validate the access token, and store it in
		// res.locals.access_token, together with the expiry time
		AccessToken.body,

		function response(req, res, next) {
			res.status(200).json({
				active: true,
				access_token: res.locals.access_token,
				expires_in: res.locals.expires_in_seconds
			});
		},

	]
}

/*
 * GET /tokens
 * 
 * Description: Get a list of tokens created by the user
 * Example of firing the request with the bearer header
**/
const getTokens = {
	method: 'get',
	url: route.tokens,
	handler: [
		// Must be application/json
		ContentType.json,
		// Bearer type
		HeaderAuth.bearer,
		// get the encoded credentials in the header
		HeaderCredentials.extract,
		// validate the jwt token to see if it is valid
		AccessToken.bearer,

		function(req, res, next) {
			Token.getByOwnerId({ 
				id: res.locals.user_id
			}).then(RestHandler(req, res).success);
		}
	]
}

/*
 * GET /openid/access_token
 * 
 * Description: Create an access and refresh token pair based
 * on the provided authorization token, if grant_type is `refresh_token`,
 * then a new access token will be provided
 *
**/
const accessTokenRequest = {
	method: 'post',
	url: '/oauth2/token',
	// accessTokenRequest
	handler: [
		// Turn off caching
		nocache, 
		//GrantType.authorizationCode,
		// Can be either `authorization_code` or `refresh_token`
		GrantType.token,
		// Check if the authorization header contain basic
		HeaderAuth.basic, 
		// Must be application/x-www-form-urlencoded 
		ContentType.form,
		// Store the encoded credentials in res.locals.encodedCredentials
		HeaderCredentials.extract,
		// Validate the encodedCredentials as decoded [clientId:clientSecret],
		// store the client as res.locals.client
		ClientCredentials.validate,
		
		asyncWrapper(function* handleRefreshToken(req, res, next) {

			if (res.locals.grant_type === 'refresh_token') {


				const useragentParser = useragent(req, res);
				const matchingResult = res.locals.client;

				// Parse request body

				const { refresh_token } = req.body;


				const matchingToken = yield Token.findRefreshToken(refresh_token);

				if (!matchingToken) {
					return next({
						error: Errors.UNAUTHORIZED_CLIENT,
						error_description: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
					});
				}
				const { owner_id, user_agent, application_name, application_url } = matchingToken;

				const matchingUserAgent = useragentParser(user_agent);
				console.log('matchingUserAgent', matchingUserAgent)
				if (!matchingUserAgent) {
					return next({
						code: 'bad_request',
						message: 'User agent do not match'
					});
				}

				// Create JWT Payload
				const payload = {
					user_id:  owner_id
				}

				// Create JWT Options
				const expiresIn = '1m';
				const options = {
					audience: application_url,
					issuer: fullUrl(req),
					subject: application_name,
					expiresIn: expiresIn
				}


				console.dir(options, {depth: null, colors: true})
				matchingToken.access_token = yield matchingToken.sign(payload, options);
				const updatedToken = yield matchingToken.save();

				return res.status(200).json({
					access_token: updatedToken.access_token,
					token_type: 'bearer',
					expires_in: ms(expiresIn) / 1000, // Convert to milliseconds
					refresh_token: refresh_token					
				});
				// Skip all, end the middleware chain now
				return next('route');
			} 
			next();
		}),

		function parseRequest(req, res, next) {

			if (res.locals.grant_type !== 'authorization_code') {
				return next({
					error: 'Invalid grant type',
					error_description: 'The provided grant type is invalid'
				});
			}
			const code = req.body.code;
			const redirectUri = req.body.redirect_uri;
			

			if (!code) {
				return next({
					error: Errors.INVALID_REQUEST,
					error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST)
				});
			}
			if (!redirectUri) {
				// is valid url?

				// url still needs to be validated to be equal the client redirect url
				return next({
					error: Errors.INVALID_REQUEST,
					error_description: Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST)
				});
			}

			const client = res.locals.client;
			if (client.redirect_urls.indexOf(redirectUri) === -1) {
				return next({
					error: Errors.UNAUTHORIZED_CLIENT,
					error_description: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
				});	
			}
			next();
		},

		function generateToken(req, res, next) {


			// Every validation pass
			// Create Token

			const redirectUri = req.body.redirect_uri;
			const options = {
				audience: redirectUri,
				issuer: fullUrl(req),
				subject: redirectUri,
			}
			const expiresIn = '60s';
			res.locals.expiresIn = expiresIn;
			// Only access tokens have expiration date
			const accessTokenOptions = Object.assign(options, { expiresIn });

			const code = req.body.code;

			AuthorizationCode.findOne({
				code: code,
			}).then((model) => {
				if (!model) {
					return next({
						error: Errors.UNAUTHORIZED_CLIENT,
						error_description: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
					});	
				}
				// The authorization code can only be used once
				return model.remove();
			}).then((data) => {
				return jwt.verify(code)
			}).then((decoded) => {

				// The code should only be used once
				// If there are subsequent code, it should be delete
				const user_id = decoded.user_id;
				// Do checking for the headers here
				const user_agent = decoded.headers;
				
				// store the access token and refresh token pair 
				// together with the device info
				return Token.create({
					client_id: res.locals.client._id,
					access_token_options: accessTokenOptions,
					refresh_token_options: options,
					user_id: user_id,
					user_agent: req.headers['user-agent']
				});
			}).then((token) => {
				res.locals.token = token;
				return next();
			}).catch((err) => {
				return next(err);
			});
		},
		function response(req, res, next) {

			res.status(200).json({
				access_token: res.locals.token.access_token,
				token_type: 'Bearer',
				expires_in: ms(res.locals.expiresIn) / 1000, // Convert to milliseconds
				refresh_token: res.locals.token.refresh_token,
				// other parameters
			});
		}
	]
}

module.exports = {
	//authorizeTokenRoute,
	validateToken,
	getTokens,
	//refreshToken,
	accessTokenRequest
}



