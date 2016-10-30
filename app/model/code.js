
const AuthorizationCode = require('../schema/code.js');
const mongoose = require('mongoose');

const Model = {
	create(param) {

		const code = new AuthorizationCode({
			code: param.code
		});

		return code.save();
	},


	findOne(param) {
		return AuthorizationCode.findOne({
			code: param.code
		});
	},
}


module.exports = Model;