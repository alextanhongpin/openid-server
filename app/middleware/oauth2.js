

const AccessTokenErrors = require('./error-message.js').AccessTokenErrors;

const Errors = require('./error-message.js').AuthenticationErrors;

const Client = require('../model/client.js');
const ClientCredentials = require('./client-credentials.js');
const HttpStatus = require('http-status-codes');

// Validators
const HeaderAuth = require('../validator/header-auth.js');
const HeaderCredentials = require('../middleware/header-credentials.js');
const config = require('../config/main.js');
const asyncWrapper = require('../middleware/async-wrapper');

const rurl = require('../middleware/rurl.js');

function constructErrorUrl(res) {
	return function (callbackUrl, error, error_description, state) {
		// check each params individually

		const redirectUrl = rurl.construct(callbackUrl, { error, error_description, state });
		return res.redirect(redirectUrl);
	}
}


// Should export four different modules
// AuthorizationCodeGrantFlow
// ImplicitGrantFlow
// ClientCredentialsGrant
// ResourceOwnerPasswordCredentialsGrant
const ACGF = {

}
const ROPC = {

}

// Entirely for third-party clients
const AuthorizationCodeGrantFlow = {
	authorize: function* authorize(req, res, next) {

		console.log('AuthorizationCodeGrantFlow:Initialize')
		const errorUrlConstructor = constructErrorUrl(res);

		const decoded_client = res.locals.decoded_client || {};
		const responseType = req.query.response_type || decoded_client.response_type;
		const clientId = req.query.client_id || decoded_client.client_id;
		const clientSecret = req.query.client_secret || decoded_client.client_secret;
		const redirectUri = req.query.redirect_uri || decoded_client.redirect_uri;
		const scope = req.query.scope || decoded_client.scope;
		const state = req.query.state || decoded_client.state;
		// Must be `code`
		if (responseType !== 'code') {
			return errorUrlConstructor(redirectUri, Errors.UNSUPPORTED_RESPONSE_TYPE, Errors.getErrorDescriptionFrom(Errors.UNSUPPORTED_RESPONSE_TYPE), state);
		}

		// Required
		if (!clientId) {
			return errorUrlConstructor(redirectUri, Errors.UNAUTHORIZED_CLIENT, Errors.getErrorDescriptionFrom(Errors.UNAUTHORIZED_CLIENT), state);
		}

		// Required
		if (!redirectUri) {
			// validate url?
			return errorUrlConstructor(redirectUri, Errors.INVALID_REQUEST, Errors.getErrorDescriptionFrom(Errors.INVALID_REQUEST), state);
		}
		// optional
		if (!scope) {
			// validate scopes?
			return errorUrlConstructor(redirectUri, Errors.INVALID_SCOPE, Errors.getErrorDescriptionFrom(Errors.INVALID_SCOPE), state);
		}

		// recommended
		if (!state) {
			// optional
		}
	
		// Validate Client
		const client = yield Client.findSecret({ clientId, clientSecret });

		// Client does not exist
		if (!client) {
			return errorUrlConstructor(redirectUri, Errors.INVALID_CLIENT, Errors.getErrorDescriptionFrom(Errors.INVALID_CLIENT), state);
		}
		
		// Client redirect url does not match the provided one
		if (client.redirect_urls.indexOf(redirectUri) === -1) {
			return errorUrlConstructor(redirectUri, Errors.INVALID_CLIENT, Errors.getErrorDescriptionFrom(Errors.INVALID_CLIENT), state);
		}

		// Store the client data
		res.locals.client = client;

		next();
	},

	refresh: function* token(req, res, next) {
		// #request RFC 6749
		// const grantType = req.body.grant_type;
		// contains the user agent as well as owner id
		const code = req.body.code;
		const redirectUri = req.body.redirect_uri;
		// const contentType =	req.headers['content-type'];

		// if (contentType !== 'application/x-www-form-urlencoded') {
		// 	return next({
		// 		error: 'Invalid Content-Type',
		// 		error_description: 'Content-Type should be x-www-form-urlencoded instead of ' + contentType
		// 	});
		// }

		// const authorization = req.headers['authorization'];

		// if (authorization.indexOf('Basic') === -1) {
		// 	return next({
		// 		error: AccessTokenErrors.INVALID_CLIENT,
		// 		error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.INVALID_CLIENT)
		// 	});
		// } 
		
		//const encryptedClientCredentials = authorization.split(' ')[1];
		//const { clientId, clientSecret } = yield ClientCredentials.decode(encryptedClientCredentials);
		
		// console.log('client_id', clientId)
		// console.log('client_secret', clientSecret)
		// if (!grantType) {
		// 	return next({
		// 		error: AccessTokenErrors.INVALID_GRANT,
		// 		error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.INVALID_GRANT)
		// 	});
		// }

		// if (grantType !== 'authorization_code') {
		// 	return next({
		// 		error: AccessTokenErrors.UNSUPPORTED_GRANT_TYPE,
		// 		error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.UNSUPPORTED_GRANT_TYPE)
		// 	});
		// }
		//console.log('code', code)

		if (!code) {
			return next({
				error: AccessTokenErrors.INVALID_REQUEST,
				error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.INVALID_REQUEST)
			});
		}
		if (!redirectUri) {
			// is valid url?

			// url still needs to be validated to be equal the client redirect url
			return next({
				error: AccessTokenErrors.INVALID_REQUEST,
				error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.INVALID_REQUEST)
			});
		}
		// if (!clientId) {
		// 	return next({
		// 		error: AccessTokenErrors.UNAUTHORIZED_CLIENT,
		// 		error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.UNAUTHORIZED_CLIENT)
		// 	});
		// }

		// query client database
		// const client = yield Client.findSecret({
		// 	clientId,
		// 	clientSecret
		// });
		// console.log('client', client)

		// if (!client) {
		// 	return next({
		// 		error: AccessTokenErrors.INVALID_CLIENT,
		// 		error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.INVALID_CLIENT)
		// 	});
		// }

		//console.log('redirectUri', redirectUri)
		//console.log('indexof', client.redirect_urls.indexOf(redirectUri))
		const client = res.locals.client;
		if (client.redirect_urls.indexOf(redirectUri) === -1) {
			return next({
				error: AccessTokenErrors.UNAUTHORIZED_CLIENT,
				error_description: AccessTokenErrors.getErrorDescriptionFrom(AccessTokenErrors.UNAUTHORIZED_CLIENT)
			});	
		}
		// grant_type=authorization_code
		// code
		// redirect_uri
		// client_id
		res.locals.client = client;
		next();
	},

	permission() {
		// Validate the route for calling the services
		// Must be bearer type
		// must have encodedCredentials
		// must be a valid token
		// 
	}
}

module.exports = {
	// authorize: AuthorizationCodeGrantFlow.authorize,
	// token: AuthorizationCodeGrantFlow.refresh,

	AuthorizationCodeGrantFlow,
	//ClientCredentialsGrant,
	//ResourceOwnerPasswordCredentialsGrant

}