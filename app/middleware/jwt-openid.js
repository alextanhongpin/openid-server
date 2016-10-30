// For jwt openid: echo -n "jWt0p3N1d" | openssl dgst -sha256 -hmac "jWt0p3N1d$33rt"


const crypto = require('../config/main.js').crypto;
const jwt = require('jsonwebtoken');
const ms = require('ms');


const expires_in_seconds = 60 * 1;

function createPayloadOptions(param) {
	return {
		audience: param.audience,
		issuer: param.issuer,
		subject: param.subject,
		expiresIn: param.expiresIn
	}
}

/*
 * @param options (optional)
 * @param payload (required)
**/
function signToken(param) {
	const options = {
		audience: param.options.audience, // e.g. http://localhost:3000,
		issuer: param.options.issuer, // e.g. http://localhost:4000,
		subject: param.options.subject,// e.g. john.doe,
		expiresIn: expires_in_seconds
	}
	return jwt.sign(param.payload, crypto.jwt_openid_key, options);
}
function signToken2(payload, options) {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, crypto.jwt_openid_key, options, (err, code) => {
			if (err) {
				reject(err)
			} else {
				resolve(code);
			}
		});
	})
}





function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, crypto.jwt_openid_key, (err, decoded) => {
			if (err) {
				return reject(err);
			} else {
				decoded.expires_in_seconds = calculateExpirationTime(decoded);
				return resolve(decoded);
			}
		});
	});
}

function calculateExpirationTime(decoded) {
	return Math.floor(expires_in_seconds - (Date.now() / 1000 - decoded.iat));
}

module.exports = { 
	sign: signToken,
	sign2: signToken2, 
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