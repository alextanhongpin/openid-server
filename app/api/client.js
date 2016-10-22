const Client = require('../model/client.js');
const HttpStatus = require('http-status-codes');






// Apis

const getClients = {
	method: 'get',
	route: '/api/clients',
	command(req, res, next) {
		Client.get({
			limit: 10,
			offset: 0,
		}).then((results) => {

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
	route: '/api/clients',
	command(req, res, next) {
		Client.create(req.body)
		.then((results) => {
			res.status(HttpStatus.CREATED).json({
				success: true,
				results: results
			});
		}).catch((err) => {

			res.status(HttpStatus.BAD_REQUEST).json({
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
	route: '/api/clients/:id',
	command(req, res, next) {
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
	route: '/api/clients/:id',
	command(req, res, next) {
		Client.remove({
			id: req.params.id.toString()
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


module.exports = [
	getClients,
	getClientById,
	createClient,
	deleteClient
]


