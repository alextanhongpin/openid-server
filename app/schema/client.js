const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const ClientSchema = new Schema({
	client_secret: {
		type: String,
		required: true 
	},
	client_id: {
		type: String,
		required: true 
	},
	created_at: {
		type: Date,
		default: Date.now 
	},
	updated_at: {
		type: Date,
		default: Date.now 
	},

	// should be an array....
	redirect_url: {
		type: String,
		required: true 
	},
	auth_url: {
		type: String,
		required: true 
	},
	domain_url: {
		type: String,
		required: true 
	},
	application_name: {
		type: String,
		required: true,
		// unique: true
	},
	application_category: {
		type: String,
		required: true
	},
	api_version: {
		type: String,
		default: '0.0.1'
	}

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