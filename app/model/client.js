
const Client = require('../schema/client.js');

const nodecrypto = require('crypto');
const crypto = require('../middleware/api-crypto.js');
const mongoose = require('mongoose');



const Model = {
	create(param) {

		console.log(param)
		const client = new Client({
			client_secret: crypto.encrypt(param.application_name.trim()),
			client_id: nodecrypto.randomBytes(16).toString('hex'),//crypto.encrypt(param.redirect_url.trim()),
			created_at: new Date(new Date().toUTCString()).getTime(),
			// Don't forget to update this
			updated_at: new Date(new Date().toUTCString()).getTime(),
			redirect_urls: param.redirect_urls,
			whitelisted_domains: param.whitelisted_domains,
			blacklisted_domains: param.blacklisted_domains,
			website: param.website,
			description: param.description,
			logo_image: param.logo_image,
			category: param.application_category.trim(),
			subcategory: param.subcategory,
			application_name: param.application_name.trim(),
			owner_id: param.id
		});
		console.log(client)
		return client.save();
	},
	findSecret({ clientId, clientSecret }) {
		return Client.findOne({
			client_id: clientId,
			client_secret: clientSecret
		});
	},
	getById(param) {
		return Client.findOne({
			client_secret: param.client_secret,
			client_id: param.client_id
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