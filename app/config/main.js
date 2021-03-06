module.exports = {
	port: 4000,
	mongodb: {
		uri: 'mongodb://localhost/openid'
	},
	crypto: {
		algorithm: 'aes-256-cbc',
		hmac_algorithm: 'sha1',
		jwt_token: process.env.CRYPTO_JWT_KEY,
		jwt_openid_key: process.env.CRYPTO_JWT_OPENID_KEY,
		authorization_expires_in_seconds: 60,
		api_crypto: process.env.CRYPTO_API_KEY,
		api_crypto_hmac: process.env.CRYPTO_HMAC_KEY,
		key: process.env.CRYPTO_KEY,
		hmac: process.env.CRYPTO_HMAC_KEY
	},

	route: {
		tokens: '/tokens',
		tokens_validate: '/tokens/validate'
	},
	api_route: {
		// Should add versioning
		clients: '/api/clients',
		clients_id: '/api/clients/:id'
	},
	client_id: process.env.CLIENT_ID,
	client_secret: process.env.CLIENT_SECRET
}