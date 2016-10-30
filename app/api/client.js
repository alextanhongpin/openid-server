// Middlewares
const asyncWrapper = require('../middleware/async-wrapper');

const jwtToken = require('../middleware/jwt-openid');

// Modules
const HttpStatus = require('http-status-codes');

// Models
const Client = require('../model/client.js');

const OAuth2 = require('../middleware/oauth2.js');
const HeaderCredentials = require('../middleware/header-credentials.js');
// Route
const route = require('../config/main.js').api_route;


/*
 * USE /clients
 * 
 * Description: Middleware to handle all /tokens route
 *
**/
const authorizeUser = {
	method: 'use',
	url: route.clients,

	//command: asyncWrapper(OAuth2.token)
	handler: [
		// Store the encoded credentials in res.locals.encodedCredentials
		HeaderCredentials.extract,
		asyncWrapper(function *(req, res, next) {
			// extract access token

			const accessToken = res.locals.encodedCredentials;

			try {
				const decoded = yield jwtToken.verify(accessToken);
				if (decoded && decoded.user_id) {

					req.user = {
						id: decoded.user_id,
						grantType: 'validated',
					}
					return next();
				}
			} catch(err) {
				console.log(err)
			}
		})
	]
}
// Apis

const getClients = {
	method: 'get',
	url: route.clients,
	handler(req, res, next) {
		Client.get({
			limit: 10,
			offset: 0,
		}).then((results) => {
			console.log(results)

			res.status(HttpStatus.OK).json({
				success: true,
				results: results.collection,
				meta: {
					total_count: results.total_count,
					last_record: results.last_record
				}
			});

		}).catch((err) => {
			res.status(HttpStatus.OK).json({
				err: err
			});
			next(err);
		});
	},
}

const createClient = {
	method: 'post',
	url: route.clients,
	handler(req, res, next) {
		const param = Object.assign(req.body, req.user || {});
		console.log(param)
		Client.create(param)
		.then((results) => {
			return res.status(HttpStatus.CREATED).json({
				success: true,
				results: results
			});
		}).catch((err) => {
			console.log(err)

			return res.status(HttpStatus.BAD_REQUEST).json({
				success: false,
				error_code: HttpStatus.BAD_REQUEST,
				error_type: HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
				error_message: err.message,
				error_name: err.name,
				err: err
			});
		})
	},
}

const getClientById = {
	method: 'get',
	url: route.clients_id,
	handler(req, res, next) {
		Client.getById({
			id: req.params.id
		}).then((results) => {
			res.status(HttpStatus.OK).json({
				success: true,
				results: results
			});
		}).catch((err) => {
			next(err);
		});
	}
}

const deleteClient = {
	method: 'delete',
	url: route.clients_id,
	handler(req, res, next) {
		Client.remove({
			id: req.params.id.toString()
		}).then((results) => {
			res.status(HttpStatus.OK).json({
				success: true,
				results: results
			});
		}).catch((err) => {
			console.log(err)
			next(err);
		});
	}
}

const removeAll = {
	method: 'delete',
	url: route.clients,
	handler(req, res, next) {
		return Client.remove({});
	}
}


module.exports = {
	//authorizeUser,
	getClients,
	getClientById,
	createClient,
	deleteClient,
	removeAll
}


