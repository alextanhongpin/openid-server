// For jwt openid: echo -n "jWt0p3N1d" | openssl dgst -sha256 -hmac "jWt0p3N1d$33rt"
const JWT_SECRET = process.env.CRYPTO_JWT_OPENID_KEY;
const jwt = require('jsonwebtoken');

function signToken(param) {
	const options = {
		audience: param.options.audience, // e.g. http://localhost:3000,
		issuer: param.options.issuer, // e.g. http://localhost:4000,
		subject: param.options.subject// e.g. john.doe,
	}
	const payload = Object.assign({
		exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1hr expiration
	}, param.payload)
	return jwt.sign(payload, JWT_SECRET, options);
}

function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, function(err, decoded) {
			if (err) {
				reject(err);
			} else {
				resolve(decoded);
			}
		});
	});
}


module.exports = { 
	sign: signToken,
	verify: verifyToken 
}



// {
//   "sub"       : "alice", // Asserts the identity of the user, called subject in OpenID (sub).
//   "iss"       : "http://localhost:4000", // Specifies the issuing authority (iss).
//   "aud"       : "finanz", // Is generated for a particular audience, i.e. client (aud).
//   "nonce"     : "n-0S6_WzA2Mj", // May contain a nonce (nonce).
//   "auth_time" : 1311280969,
//   "acr"       : "c2id.loa.hisec", // May specify when (auth_time) and how, in terms of strength (acr), the user was authenticated.
//   "iat"       : 1311280970, // Has an issue (iat) and an expiration date (exp).
//   "exp"       : 1311281970,
//   // may contain scopes
// }
// Scope value	Associated claims
// email	| email, email_verified
// phone	| phone_number, phone_number_verified
// profile	| name, family_name, given_name, middle_name, nickname, preferred_username, profile, picture, website, gender, birthdate, zoneinfo, locale, updated_at
// address	address