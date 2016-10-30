// Description: An owner can create applications by creating oauth2 clients

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const ClientSchema = new Schema({

	// A secret that will be generated for clients to use
	client_secret: {
		type: String,
		required: true 
	},
	// The id of the application that will be generated automatically
	client_id: {
		type: String,
		required: true 
	},
	// Date at which the client is created
	created_at: {
		type: Date,
		default: Date.now 
	},
	// Date when the secret is updated
	updated_at: {
		type: Date,
		default: Date.now 
	},

	// A list of accepted redirect urls
	redirect_urls: [{
		type: String,
		required: true
	}],

	// A list of whitelisted domains */
	whitelisted_domains: [{
		type: String
	}],

	// A list of blacklisted domains
	blacklisted_domains: [{
		type: String
	}],

	// The website of the application
	website: {
		type: String,
		required: true 
	},
	description: {
		type: String,
	},
	logo_image: {
		type: String,
	},
	application_name: {
		type: String,
		required: true,
		unique: true
	},
	category: {
		type: String,
		required: true
	},
	subcategory: [{
		type: String
	}],
	api_version: {
		type: String,
		default: '0.0.1'
	},
	owner_id:  { 
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'User',
		required: true
	},

	/*
	email: {
		type: String,
		required: true,
		validate: {
			validator(v) {
				return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(v);
			},
			message: '{VALUE} is not a valid email'
		}
	}
	*/
});


let Client = null;
try {
  Client = mongoose.model('Client')
} catch (error) {
  Client = mongoose.model('Client', ClientSchema)
}

module.exports = Client;