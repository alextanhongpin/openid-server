

const ClientCredentials = require('./client-credentials.js');

function* encodedClient(req, res, next) {

	const authorizationHeader = req.headers['authorization'];

	if (!authorizationHeader) {
		return new Error('Invalid authorization header');
	}

	const splitAuthorizationHeader = authorizationHeader.split(' ');
	if (splitAuthorizationHeader.length !== 2) {
		return new Error('Invalid authorization header');
	}
	const bearerType = splitAuthorizationHeader[0];
	const encodedCredentials = splitAuthorizationHeader[1];

	//const { clientId, clientSecret } =  
	const { clientId, clientSecret } = yield ClientCredentials.decode(encodedCredentials);
	if (clientId !== registrationId || clientSecret !== registrationSecret) {
		return new Error('Invalid registration');
	}

	req.client = {
		id: clientId,
		secret: clientSecret
	}

	next();
}

module.exports = {
	encode: encodedClient
}