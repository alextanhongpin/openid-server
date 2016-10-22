const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwtToken = require('../middleware/jwt-openid.js');

const TokenSchema = new Schema({
	refresh_token: {
		type: String,
		required: true
	},
	// access_token: {
	// 	type: String,
	// 	required: true
	// },
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	},
	owner_id:  { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User' 
	},
	user_agent: {
		type: String,
		required: true
	},
	application_name: {
		type: String,
	},
	application_url: {
		type: String
	}
});


TokenSchema.methods.generateAccessToken = function (params) {
	return jwtToken.sign(params);
}
TokenSchema.methods.validateAccessToken = function (params) {
	return jwtToken.verify(this.access_token);
}
TokenSchema.methods.generateRefreshToken = function (params) {
	return jwtToken.sign(params); 
}
TokenSchema.methods.validateRefreshToken = function (params) {
	return jwtToken.verify(this.refresh_token);
}

module.exports = mongoose.model('Token', TokenSchema);