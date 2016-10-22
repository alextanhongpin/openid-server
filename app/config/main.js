module.exports = {
	port: 4000,
	mongodb: {
		uri: 'mongodb://localhost/openid'
	},
	crypto: {
		algorithm: 'aes-256-cbc',
		hmac_algorithm: 'sha1',
	}
}