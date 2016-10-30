



const Errors = require('./error-message.js');

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
	responseType(req, res, next) {
		
	}
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

}

module.exports = {
	// authorize: AuthorizationCodeGrantFlow.authorize,
	// token: AuthorizationCodeGrantFlow.refresh,

	AuthorizationCodeGrantFlow,
	//ClientCredentialsGrant,
	//ResourceOwnerPasswordCredentialsGrant

}