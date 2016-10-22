
const Token = require('../schema/token.js');
const mongoose = require('mongoose');
const useragent = require('useragent');

const Model = {
	create(param) {
		const token = new Token();

		token.access_token = token.generateAccessToken({
			payload: param.payload_user,
			options: param.options
		});

		token.refresh_token = token.generateRefreshToken({
			payload: param.payload_device,
			options: param.options
		});

		token.owner_id = param.payload_user.user_id;
		token.user_agent = param.payload_device.user_agent;

		return token.save();
	},

	get() {
		// add pagination later on
		return Token.find()
	},

	getByOwnerId(param) {
		return Token.find({
			owner_id: param.id
		}).then((collection) => {


			return collection.map((model) => {
				const agent = useragent.parse(model.user_agent);
				let schema = {}
				schema.device = agent.device.toString(); // 'Asus A100'
				schema.os = agent.os.toString(); // 'Mac OSX 10.8.1'
				schema.browser = agent.toAgent(); // 'Chrome 15.0.874'
				schema.access_token = model.access_token;
				schema.refresh_token = model.refresh_token;
				schema.created_at = model.created_at;
				schema.updated_at = model.updated_at;
				schema.id = model._id;
				return schema;
			});
		});
	},

	remove(param) {
		return Token.findOneAndRemove({
			_id: param.id
		});
	},

	refresh() {
		// check if the token is correct
		// check if the user agent is correct
		// if same user agent, refresh the access token
		// else create a new device, and send an email which can allow you to deactivate it
		return Token.findOneAndUpdate();
	}
}


module.exports = Model;