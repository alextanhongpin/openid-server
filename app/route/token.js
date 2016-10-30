
// The flow mentioned here is for the 'Client Credentials Flow'.

// Service provider can also carry out refresh


// Modules, A-Z
const ms = require('ms');

// Middlewares, A-Z
const asyncWrapper = require('../middleware/async-wrapper.js');
const nocache = require('../middleware/nocache.js');
const jwt = require('../middleware/jwt.js');
const jwtToken = require('../middleware/jwt-openid.js');

const rurl = require('../middleware/rurl.js');
const fullUrl = require('../middleware/url.js');
const HeaderCredentials = require('../middleware/header-credentials.js');
const Errors = require('../middleware/error-message.js');
const RestHandler = require('../middleware/rest-handler');


// Models, A-Z
const User = require('../model/user.js');
const Token = require('../model/token.js');

// Validators, A-Z
const ContentType = require('../validator/content-type.js');
const HeaderAuth = require('../validator/header-auth.js');
const GrantType = require('../validator/grant-type.js');


/*
 * GET /register
 * Description: Render the registration page
**/
const registrationPage = {
	method: 'get',
	url: '/register',
	handler: [

		HeaderCredentials.include,
		
		function renderView(req, res, next) {
			// Render the view

			// The referrer and client refers to the registered client 
			// that goes through the consent view
			// the query paramater for the authorization is encoded in the client
			res.locals.referrer = JSON.stringify(req.query.referrer || '');
			res.locals.client = JSON.stringify(req.query.client || '');
			//res.locals.token = JSON.stringify(req.query.token || '');
			res.render('register');
		}
	]
}
// TODO: Change to grant token flow (access or password)
const refreshTokenFlow = {
	method: 'post',
	url: '/token',
	handler: [
		// Authorization header must be of type Basic
		HeaderAuth.basic,
		// return header credentials as res.locals.encodedCredentials,
		HeaderCredentials.extract,
		// verify the encoded credentials with the secret
		// will exit here if there is an error
		asyncWrapper(HeaderCredentials.verify),
		// return grant_type as res.locals.grant_type, 
		// can be `password` or `refresh_token`
		GrantType.token,
		// validate if the fields are present first
		asyncWrapper(function* parseRequestBody(req, res, next) {
	
			const flow = EnumFlow(res.locals.grant_type);

			if (flow.isPassword) {
				
				const { username, password } = req.body;

				if (!username || !password) {
					return next({
						error: Errors.UNAUTHORIZED_CLIENT,
						error_description: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
					});		
				} 

			} else if (flow.isRefreshToken) {
				const { grant_type, refresh_token } = req.body;

				if (!grant_type || !refresh_token) {
					// Required request
					return next({
						error: Errors.UNAUTHORIZED_CLIENT,
						error_description: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
					});			
				}
			}
			next();
		}),

		// if grant_type is `password`, return user data as res.locals.user,
		// else if grant_type is `refresh_token`, return user data res.locals.token
		asyncWrapper(function* validateRequestBody(req, res, next) {


			const flow = EnumFlow(res.locals.grant_type);

			if (flow.isPassword) {

				const email = req.body.username; // the default name is username, but we are taking the user's email instead
				const password = req.body.password;
				const user = yield User.findByEmail({ email });

				if (!user) {
					res.locals.user = yield User.create({ email, password });
					// send verification email
					return next();
				}
			
				if (!user.validatePassword(password)) {
					return next({
						error: 'FORBIDDEN',
						error_description: 'sasda'
					});
				}

				res.locals.user = user;
				return next();
			
			} else if (flow.isRefreshToken) {

				const refreshToken = req.body.refresh_token;
				const matchingToken = yield Token.findRefreshToken(refreshToken);

				if (!matchingToken) {
					return next({
						error: Errors.UNAUTHORIZED_CLIENT,
						error_description: Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT)
					});
				}
				res.locals.token = matchingToken;
				return next();



			}
		}),
		// if grant_type is `password`, create a new token,
		// else if grant_type is `refresh_token`, update existing token
		asyncWrapper(function* parseResponse(req, res, next) {

			const flow = EnumFlow(res.locals.grant_type);
			const expiresIn = '60s';
			res.locals.expiresIn = expiresIn;

			if (flow.isPassword) {
				const user = res.locals.user;
				const user_agent = req.headers['user-agent'];

				const options = {
					audience: fullUrl(req),
					issuer: fullUrl(req),
					subject: user.name || user.given_name || user.local.email.split('@')[0]		
				}

				// Only access tokens have expiration date
				const accessTokenOptions = Object.assign(options, { expiresIn });

				const token = yield Token.create({
					access_token_options: accessTokenOptions,
					refresh_token_options: options,
					user_id: user._id,
					user_agent: user_agent
				});

				res.locals.token = token;
				next();

			} else if (flow.isRefreshToken) {

				const token = res.locals.token;
				const { owner_id, user_agent, application_name, application_url } = token;
				const payload = {
					user_id:  owner_id
				}
				const options = {
					audience: fullUrl(req),
					issuer: fullUrl(req),
					subject: owner_id.toString(),
					expiresIn: expiresIn
				}



				const newAccessToken = yield token.sign(payload, options);
				token.access_token = newAccessToken;
				const updatedToken = yield token.save();
				res.locals.token = updatedToken;
				next();
			}
		}),
		// check if the url is a redirection from conesent view
		// contains referrer and also encoded client
		// 
		function validateReferrer(req, res, next) {
			console.log('validateReferrer', req.body.refferer)
			const referrer = req.body.referrer;
			if (!referrer) return next();
			// The refferer is a url http://localhost:3000
			res.locals.referrer = referrer;

			next();
		},
		function validateClient(req, res, next) {
			console.log('validateClient', req.body.client)
			const client = req.body.client;
			if (!client) return next();

			jwt.verify(client).then((data) => {
				console.log('validateClient:jwt', data)
				res.locals.decoded_client = data;
				next();
			}).catch((err) => {
				return next(err);
			});
		},

		// If the registration is coming from consent page, 
		// costruct a redirect url
		function constructRedirectUrl(req, res, next) {
			if (!res.locals.decoded_client) return next();

			const decoded_client = res.locals.decoded_client;
			res.locals.redirect = true;
			const AUTH_ENDPOINT = 'http://localhost:4000/oauth2/authorize';

			res.locals.redirect_url = rurl.construct(AUTH_ENDPOINT, {
				state: decoded_client.state,
				scope: decoded_client.scope,
				redirect_uri: decoded_client.redirect_uri,
				client_secret: decoded_client.client_secret,
				client_id: decoded_client.client_id,
				response_type: decoded_client.response_type
			});
			console.log(res.locals)
			next();
		},
		nocache,
		function returnResponse(req, res, next) {
			RestHandler(req, res).success({
				access_token: res.locals.token.access_token,
				token_type: 'Bearer',
				expires_in: ms(res.locals.expiresIn) / 1000, // Convert to milliseconds
				refresh_token: res.locals.token.refresh_token,
				// the user should be redirected to the consent page
				redirect: res.locals.redirect,
				redirect_url: res.locals.redirect_url
			});
		}

	]
}


function EnumFlow (grantType) {

	const isPassword = grantType === 'password';
	const isRefreshToken = grantType === 'refresh_token';
	return { isPassword, isRefreshToken }
}


/*
 * POST /instrospect
 *
 * Desciption: Check if the access token is valid, 
 * if invalid or expired, return the appropriate error message
 *
**/
const introspectRoute = {
	method: 'post',
	url: '/instrospect', // introspect
	handler: [
		// Check if the content-type is application/x-www-form-urlencoded
		ContentType.form,
		// Authorization header must be of type bearer
		HeaderAuth.bearer, 
		// Extract the access token from the header, 'Bearer [ACCESS_TOKEN]'
		HeaderCredentials.extract, 
		function validateAccessToken(req, res, next) {
			console.log('validateAccessToken', res.locals.encoded_credentials)

			const accessToken = res.locals.encoded_credentials;

			jwtToken.verify(accessToken)
			.then((decoded) => {
				console.log(decoded)
				if (decoded) {

					RestHandler(req, res).success({
						access_token: accessToken,
						expires_in_seconds: decoded.expires_in_seconds
					});
				} 
			}).catch((err) => {
				return next({
					error: err.name,
					error_description: err.message
				});
			});
		}
	]
}

let count = 0;
const appsRoute = {
	method: 'get',
	url: '/apps',
	handler(req, res, next) {
		console.log(count)
		count += 1;
		if (count === 1) {

			return res.status(400).json({
				error: 'token expired'
			});
		} else {
			setTimeout(()=> {
				return res.status(200).json({
					results: ['1', '2']
				})
			}, 500)

		}
	}
}
const carsRoute = {
	method: 'get',
	url: '/cars',
	handler(req, res, next) {

		setTimeout(()=> {
			return res.status(200).json({
				results: ['1', '2']
			})
		}, 500)
	}
}
module.exports = {
	registrationPage,
	refreshTokenFlow,
	introspectRoute,
	appsRoute,
	carsRoute
}

