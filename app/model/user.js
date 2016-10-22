
const User = require('../schema/user.js');
const mongoose = require('mongoose');

const Model = {
	create(param) {
		const user = new User();
		user.local.email = param.email;
		user.local.password = user.generateHash(param.password);
		return user.save();
	},

	checkIfEmailExist(param) {
		return User.findOne({
			'local.email': param.email
		});
	},

}


module.exports = Model;