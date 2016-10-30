// Description: The token stored for users accessing the services from different clients. The client here refers to mobile/laptop.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const crypto = require('crypto');

const AuthorizationCodeSchema = new Schema({
	code: {
		type: String,
		required: true,
		unique: true
	},
	useragent: {
		type: String,
	},
	created_at: {
		type: Date,
		expires: 300, // 5 minutes
		default: Date.now
	}
});

// AuthorizationCodeSchema.generateCode = function() {
// 	return crypto.randomBytes(32).toString('hex');
// }
module.exports = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);