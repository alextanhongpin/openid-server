// Description: Pass in the encoded header credentials into the response

const config = require('../config/main.js');
const ClientCredentials = require('../middleware/client-credentials.js');

/*
 * Include the authorization header credentials
 * as encoded [clientid:clientsecret]
**/
function includeHeaderCredentials(req, res, next) {
	const clientId = config.client_id;
	const clientSecret = config.client_secret;

	if (!clientId) {
		return next({
			error: 'Invalid client id',
			error_description: 'Please provide a valid client id'
		});
	} else if (!clientSecret) {
		return next({
			error: 'Invalid client secret',
			error_description: 'Please provide a valid client secret'
		});
	}


	const encodedCredentials = ClientCredentials.encode(clientId, clientSecret);

	// Data to be accessed in the view
	res.locals.bearer_type = 'Basic';
	res.locals.encoded_credentials = encodedCredentials;
	next();
}

/*
 * Extract the authorization header credentials
 * and return as res.locals.encodedCredentials
**/
function extractHeaderCredentials(req, res, next) {
	const header = req.headers['authorization'];

	const headerAuth = header.split(' ');

	if (headerAuth.length !== 2) {
		return next({
			code: 'BAD_REQUEST', 
			message: 'Invalid authorization request'
		});
	}

	const [ authType, encodedCredentials ] = headerAuth;

	if (!encodedCredentials) {
		return next({
			code: 'FORBIDDEN', 
			message: 'Invalid token'
		});
	}

	res.locals.encoded_credentials = encodedCredentials;

	next();
}

/*
 * Verify the format of the decoded credentials as encoded [clientid:clientsecret]
 * and throws an error if it is invalid
**/

function* verifyHeaderCredentials(req, res, next) {

	const { clientId, clientSecret } = yield ClientCredentials.decode(res.locals.encoded_credentials);
	if (config.client_id !== clientId || config.client_secret !== clientSecret) {
		return next({
			error: 'Invalid ',
			error_description: 'Please provide a valid client secret'
		});
	}
	next();
}

module.exports = { 
	include: includeHeaderCredentials,
	extract: extractHeaderCredentials,
	verify: verifyHeaderCredentials
}