// Description: The token stored for users accessing the services from different clients. The client here refers to mobile/laptop.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwtToken = require('../middleware/jwt-openid.js');

const TokenSchema = new Schema({
	refresh_token: {
		type: String,
		required: true,
		unique: true
	},
	access_token: {
		type: String,
		required: true,
		unique: true
	},
	created_at: {
		type: Date,
		default: Date.now,
		// expires: 300, // 1 min
	},
	updated_at: {
		type: Date,
		default: Date.now
	},
	owner_id:  { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User',
		required: true
	},
	user_agent: {
		type: String,
		required: true
	},
	// If client id is not provided, then it is from the 'Resource Password Credentials Grant'
	client_id: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Client' 
	},
});

TokenSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

TokenSchema.methods.sign = function (payload, options) {
	return jwtToken.sign2(payload, options);
}
TokenSchema.methods.verify = function (token) {
	return jwtToken.verify(token);
}
// // TODO: Deprecate methods
// TokenSchema.methods.generateAccessToken = function (params) {
// 	return jwtToken.sign2(params);
// }

// TokenSchema.methods.validateAccessToken = function (params) {
// 	return jwtToken.verify(this.access_token);
// }
// TokenSchema.methods.generateRefreshToken = function (params) {
// 	return jwtToken.sign(params); 
// }
// TokenSchema.methods.validateRefreshToken = function (params) {
// 	return jwtToken.verify(this.refresh_token);
// }

module.exports = mongoose.model('Token', TokenSchema);