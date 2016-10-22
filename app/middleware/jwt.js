
// For jwt jey: echo -n "j0tk3y" | openssl dgst -sha256 -hmac "j0ts3cr3t"

const JWT_SECRET = process.env.CRYPTO_JWT_KEY;
const jwt = require('jsonwebtoken');


function signToken(params) {
	const defaults = {
		exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1hr expiration 
	}
	return jwt.sign(Object.assign(defaults, params), JWT_SECRET);
}

function verifyToken(token, callback) {
	jwt.verify(token, JWT_SECRET, function(err, decoded) {
	  callback(decoded) // bar
	});
}


module.exports = { 
	sign: signToken,
	verify: verifyToken 
}

