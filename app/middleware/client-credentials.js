const base64 = require('./base64.js');
const RefreshTokenErrors = require('./error-message.js').RefreshTokenErrors;

const Client = require('../model/client.js');

/*
 * A utility to encode/decode client id and client secret
**/
function decode(encoded_credentials) {

	return new Promise((resolve, reject) => {

		// client credentials shall be decoded in the format client_id:client_secret
		const decodedCredentials = base64.decode(encoded_credentials);

		// Check for semi-colon, ':'
		const hasSemiColon = decodedCredentials.indexOf(':');
		if (!hasSemiColon) {
			reject({
				error: RefreshTokenErrors.INVALID_REQUEST,
				error_description: RefreshTokenErrors.getErrorDescriptionFrom(RefreshTokenErrors.INVALID_REQUEST)
			});
		}

		const [ clientId, clientSecret ] = decodedCredentials.split(':');

		resolve({ clientId, clientSecret });
	});

}
function encode(clientId, clientSecret) {
	// client credentials are encoded in the format client_id:client_secret
	return base64.encode(`${ clientId }:${ clientSecret }`);
}

function validate(req, res, next) {
	const encodedCredentials = res.locals.encoded_credentials;


	decode(encodedCredentials)
	.then((decodedCredentials) => {

		if (!decodedCredentials) {
			return next({
				error: 'Invalid Client',
				error_description: 'The credentials are invalid'
			});
		}
		return Client.findSecret(decodedCredentials);
	})
	.then((client) => {
		if (!client) {
			return next({
				error: RefreshTokenErrors.INVALID_CLIENT,
				error_description: RefreshTokenErrors.getErrorDescriptionFrom(RefreshTokenErrors.INVALID_CLIENT)
			});
		}
		res.locals.client = client;
		return next();
	});
}

module.exports = { decode, encode, validate }