const Client = require('../schema/client.js');

const AUTHORIZATION_ERROR = {
	invalid_request: 0,
	unauthorized_client: 1,
	access_denied: 2,
	unsupported_response_type: 3,
	invalid_scope: 4,
	server_error: 5,
	temporarily_unavailable: 6,
}

const path = require('path');
const url = require('url');
const querystring = require('querystring');


const Token = require('../schema/token');
const crypto = require('crypto');
const fullUrl = require('../middleware/url.js');
const apiCrypto = require('../middleware/api-crypto.js');
const HttpStatus = require('http-status-codes');
const jwtToken = require('../middleware/jwt.js');
const jwtTokenUser = require('../middleware/jwt-openid');
const extractHeaderAuth = require('../middleware/header-auth.js');

	const authorizeTokenRoute = {
		method: 'use',
		route: '/oauth',
		command(req, res, next) {
			const value = extractHeaderAuth(req.headers['authorization']);
			if (!value) return next();
			const { accessToken, grantType } = value;
			if (!accessToken) return next();
			jwtTokenUser.verify(accessToken)
			.then((data) => {

				// set the user id to reuse it
				if (data && data.user_id) {
					req.user = {
						id: data.user_id
					}
					return next();
				}
			}).catch((err) => {
				console.log(err)
				return next();
			})
		}
	}


	const getClientView = {
		method: 'get',
		route: '/oauth/authorize',
		command(req, res, next) {

			// Validation Rules
			const incorrectResponseType = req.query.response_type !== 'code';
			const clientIdIsNotProvided = !req.query.client_id;

			if (incorrectResponseType || clientIdIsNotProvided) {
				// res.status(HttpStatus.BAD_REQUEST).json({
				// 	success: false,
				// 	error_code: HttpStatus.BAD_REQUEST,
				// 	error_type: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
				// 	error_message: 'One or more fields are invalid.'
				// });
				//return Promise.reject('invalid_request')

				res.locals.application_name  = '';
				res.locals.scope = [];
				res.locals.error = 'invalid_request';


			}
			
			Client.findOne({
				//response_type: req.query.response_type.trim(), // required (code)
				client_secret: req.query.client_secret.trim(),
				client_id: req.query.client_id.trim(), // required
				//scope: req.query.scope, // optional
				//state: req.query.state, // recommended
				//domain_url: querystring.unescape(domainUrl(req)).split('?')[0],
				redirect_url: req.query.redirect_uri.trim() // optional
			}).then((results) => {
				if (!results) {
					res.locals.application_name  = '';
					res.locals.scope = [];
					res.locals.error = 'unauthorized_client';
				} else {

					const urlBreach = results.domain_url.indexOf(req.protocol) === -1 || results.domain_url.indexOf(req.hostname) === -1;

					if (urlBreach) {
						res.locals.error = 'access_denied';
						res.locals.application_name  = '';
						res.locals.scope = [];

					} else {

						res.locals.error = null;
						res.locals.application_name  = results.application_name;
						res.locals.scope = req.query.scope.split(' ');
						res.locals.token = jwtToken.sign({results});
						// create a jwt token
						res.locals.id = results._id;
					}
					
				}


				res.render('consent');

			}).catch((err) => {
				console.log('err', err)
				res.locals.error = err;
				res.render('consent');
			});
		}
	}





	const postAuthorize = {
		method: 'post',
		route: '/oauth/authorize',
		command(req, res, next) {

			// Validation Rules
			
			const token = jwtToken.verify(req.body.token, (decoded) => {


				const results = decoded.results;
				const incorrectResponseType = results.response_type !== 'code';
				const clientIdIsNotProvided = !results.client_id;

				

				if (incorrectResponseType || clientIdIsNotProvided) {
				}

				
				Client.findOne({
					//response_type: req.query.response_type.trim(), // required (code)
					client_secret: results.client_secret.trim(),
					client_id: results.client_id.trim(), // required
					//scope: req.query.scope, // optional
					//state: req.query.state, // recommended
					//domain_url: querystring.unescape(domainUrl(req)).split('?')[0],
					redirect_url: results.redirect_url.trim() // optional
				}).then((results) => {

					if (!results) {
						res.status(HttpStatus.BAD_REQUEST).json({
							error_code: HttpStatus.BAD_REQUEST,
							error_type: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST) 
						});
					} else {

						const urlBreach = results.domain_url.indexOf(req.protocol) === -1 || results.domain_url.indexOf(req.hostname) === -1;

						if (urlBreach) {
							res.locals.error = 'access_denied';
							res.locals.application_name  = '';
							//res.locals.scope = [];

						} else {
							res.locals.error = null;
							res.locals.application_name  = results.application_name;
							//res.locals.scope = req.query.scope.split(' ');
						}
					}
					const value = appendQuery(results.redirect_url, jwtToken.sign({ 
						grant_type: 'authorization',
						user_id: req.user.id
					}), 'xyz');

					res.status(HttpStatus.OK).json({
						redirect_url: value
					});

				}).catch((err) => {

					console.log(err);
				});

			});
		}
	}

	function appendQuery(cleanUrl, code, state) {
		var obj = url.parse(cleanUrl, true, false);   
		obj.query['code'] = code;
		obj.query['state'] = state;
		delete obj.search; // this makes format compose the search string out of the query object
		var trackedUrl = url.format(obj);
		return trackedUrl;
	}

	const postAccessToken = {
		method: 'post',
		route: '/oauth/access_token',
		command(req, res, next) {

			jwtToken.verify(req.body.code, (decoded) => {
				console.log('/POST oauth/access_token', decoded)

				const issuer = fullUrl(req);
				const audience = decoded.domain;
				const subject = 'john.doe';
				const accessToken = jwtTokenUser.sign({
					payload: {
						user_id: decoded.user_id,
					},
					options: {
						issuer,
						audience,
						subject
					}
				});

				if (decoded.grant_type === 'authorization') {

					const refreshToken = apiCrypto.encrypt(req.headers['user-agent'] || 'no user agent');
					const token = new Token();

					token.refresh_token = refreshToken;
					token.application_url = decoded.domain;
					token.application_name = decoded.name;
					token.owner_id =  decoded.user_id;
					token.user_agent = req.headers['user-agent'] || 'unknown';

					token.save().then((data) => {
						res.status(200).json({
						    accessToken: accessToken,
						    token_type: 'Authorization',
						    expires_in: 3600,
						    refresh_token: refreshToken
						});
					});
				}

			});
		}
	}


	module.exports = [
	authorizeTokenRoute,
		getClientView,
		postAccessToken,
		postAuthorize,
	]