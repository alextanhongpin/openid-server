/*
 * Description: Create a Jwt Token with expiry date
 * 
 * Secret is created with the following command:
 * echo -n "j0tk3y" | openssl dgst -sha256 -hmac "j0ts3cr3t"
 *
**/

const crypto = require('../config/main.js').crypto;
const jwt = require('jsonwebtoken');

// function signToken(payload, expiresIn='5m') {
// 	const options = {
// 		expiresIn: expiresIn
// 	}

// 	return jwt.sign(payload, crypto.jwt_token, options);
// }

function signToken(payload, expiresIn='5m') {
	const options = {
		expiresIn: expiresIn
	}
	return new Promise((resolve, reject) => {
		jwt.sign(payload, crypto.jwt_token, options, (err, encoded) => {
			if (err) {
				reject(err)
			}
			resolve(encoded);
		});
	}) ;
}


// const defaults = {
// 	exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1hr expiration 
// }


function verifyToken(token, cb) {
	if (cb instanceof Function) {
		jwt.verify(token, crypto.jwt_token, cb);
	} else {
		return new Promise((resolve, reject) => {
			jwt.verify(token, crypto.jwt_token, (err, decoded) => {
			  if (err) {
			  	return reject(err);
			  }
			  resolve(decoded);
			});
		});
	}
}

module.exports = { 
	//sign: signToken,
	sign: signToken,
	verify: verifyToken 
}

