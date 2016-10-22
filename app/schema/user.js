// // Load the bcrypt module
// var bcrypt = require('bcrypt');
// // Generate a salt
// var salt = bcrypt.genSaltSync(10);
// // Hash the password with the salt
// var hash = bcrypt.hashSync("my password", salt);

// // Load the password hash from DB
// // Let's assume it's stored in a variable called `hash`
// bcrypt.compareSync("my password", hash); // true
// bcrypt.compareSync("not my password", hash); // false


// var bcrypt = require('bcrypt');
// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("my password", salt, function(err, hash) {
//         // Store hash in your password DB.
//     });
// });
 
// // or
 
// bcrypt.hash('bacon', 10, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load password hash from DB
// bcrypt.compare("my password", hash, function(err, res) {
//     // res === true
// });
// bcrypt.compare("not my password", hash, function(err, res) {
//     // res === false
// });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = require('bluebird');//global.Promise;


const UserSchema = new Schema({
	version: {type: String, default: '0.0.1' },

	token: {
		access_token: String,
		refresh_token: String
	},

	local: {
		email: String,
		password: String,
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		//name: String
	},
	twitter: {
		id: String,
		token: String,
		//displayName: String,
		//username: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		//name: String
	},
	location: {
		address_line_1: String,
		address_line_2: String,
		city: String,
		state: String,
		postal_code: String,
		country: String,
		address_full: String,
		iso_code: String,
		latitude: Number,
		longitude: Number
	},
	sub: String,
	name: String,
	given_name: String,
	family_name: String,
	middle_name: String,
	nickname: String,
	preffered_username: String,
	profile: String,
	picture: String,
	website: String,
	email: String,
	email_verified: {type: Boolean, default: false },
	gender: String,
	birthdate: String,
	zoneinfo: String,
	locale: String,
	phone_number: Number,
	phone_number_verified: {type: Boolean, default: false },
	address: String,



	// Version 0.0.1
	created_at: {type: Date, default: Date.now },
	updated_at: {type: Date, default: Date.now },
	// Version 0.0.2
	tagline: String,

	// Version 0.0.3
	fingerprint: String, // for tracking unique views
	
	// Version 0.0.4
	role: { type: String, default: 'user' },
	invited_by:  { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User' 
	},
	invited: { type: Boolean, default: false },

}, {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	} 
});


// UserSchema.virtual('full_name').get(function () {
//     return [this.first_name, this.last_name].join(' ');
// });
UserSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

UserSchema.methods.validatePassword = function (password) {
	return bcrypt.compareSync(password, this.local.password);
}


module.exports = mongoose.model('User', UserSchema);
// UserModel


// {
//    "sub": "248289761001",
//    "name": "Jane Doe",
//    "given_name": "Jane",
//    "family_name": "Doe",
//    "preferred_username": "j.doe",
//    "email": "janedoe@example.com",
//    "picture": "http://example.com/janedoe/me.jpg"
//   }