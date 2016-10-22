
const Client = require('../schema/client.js');

const crypto = require('../middleware/api-crypto.js');
const mongoose = require('mongoose');



const Model = {
	create(param) {
		const client = new Client({
			client_secret: crypto.encrypt(param.application_name.trim()),
			client_id: crypto.encrypt(param.redirect_url.trim()),
			created_at: new Date(new Date().toUTCString()).getTime(),
			updated_at: new Date(new Date().toUTCString()).getTime(),
			redirect_url: param.redirect_url.trim(),
			auth_url: param.auth_url.trim(),
			domain_url: param.domain_url.trim(),
			application_category: param.application_category.trim(),
			application_name: param.application_name.trim()
		});
		return client.save();
	},
	error() {
		return {
			error: 'invalid_request',
			error_description: 'The request is invalid',
			error_uri: 'http://localhost:3000/error',
			state: 'xyz'
		}
	},
	success() {
		this.collection.push({
			client_secret: 'secret',
			client_id: 'id',
			created_at: new Date(2016, 0, 1),
			updated_at: new Date(2016, 0, 1),
			redirect_url: 'http://localhost:3000/callback',
			auth_url: 'http://localhost:3000',
			domain_url: 'http://localhost:3000',
			scope: ['email', 'profile']
		});
	},

	getById(param) {
		return Client.findOne({
			_id: param.id
		});
	},

	remove(param) {
		return Client.findOneAndRemove({
			_id: param.id
		});
	},
	get(param) {
		return Promise.all([
			Client
			.find({})
			.skip(param.offset)
			.limit(param.limit),

			Client
			.find({})
			.count()
		]).then((data) => {
			return {
				collection: data[0],
				total_count: data[1],
				last_record: param.offset * param.limit === data[1],
			}
		})
	},

	updateById(param) {
		return Client.findOneAndUpdate({
			_id: mongoose.Types.ObjectId(param.id),
			$set: {

			}
		})
		return true;
	}
}


module.exports = Model;