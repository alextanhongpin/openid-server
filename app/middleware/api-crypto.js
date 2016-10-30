

const crypto = require('crypto');
const config = require('../config/main.js').crypto;
const ALGORITHM = config.algorithm;
const HMAC_ALGORITHM = config.hmac_algorithm;

// Create a new Buffer
const KEY = new Buffer(32);
const HMAC_KEY = new Buffer(32);

// Write string to buffer
KEY.write(config.api_crypto, 0);
HMAC_KEY.write(config.api_crypto_hmac, 0);

const encrypt = function(plain_text) {
	console.log(plain_text)
	const IV = new Buffer(crypto.randomBytes(16));

	const encryptor = crypto.createCipheriv(ALGORITHM, KEY, IV);
	encryptor.setEncoding('hex');
	encryptor.write(plain_text);
	encryptor.end();

	const cipher_text = encryptor.read();

	const hmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
	hmac.update(cipher_text)
	hmac.update(IV.toString('hex'));

	return cipher_text + '$' + IV.toString('hex') + '$' + hmac.digest('hex');
}


const decrypt = function(cipher_text) {


	const cipher_blob = cipher_text.split('$');
	const ct = cipher_blob[0];
	const IV = new Buffer(cipher_blob[1], 'hex');
	const hmac = cipher_blob[2];

	const chmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
	chmac.update(ct);
	chmac.update(IV.toString('hex'));

	if (!constant_time_compare(chmac.digest('hex'), hmac)) {
		console.log('Encrypted Blob has been tampered with...');
		return null;
	}

	const decryptor = crypto.createDecipheriv(ALGORITHM, KEY, IV);
	const decryptedText = decryptor.update(ct, 'hex', 'utf-8');

	return decryptedText + decryptor.final('utf-8');
}

const constant_time_compare = function (val1, val2) {
	let sentinel = null;
	if (val1.length !== val2.length) {
		return false;
	}

	for (var i = 0; i <= (val1.length - 1); i += 1) {
		sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
	}

	return sentinel === 0;
}

module.exports = { encrypt, decrypt };