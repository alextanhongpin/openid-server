
const HttpStatus = require('http-status-codes');


function handler(req, res) {
	return {
		success(results, payload={}) {
			const json = {
				success: true,
				results: results 
			}
			res.status(HttpStatus.OK).json(Object.assign(json, payload));
		},
		error(code, message, payload={}) {
			//console.log(code, message)
			const error = {
				success: false,
				error_code: HttpStatus[code],
				error_type: HttpStatus.getStatusText(HttpStatus[code]),
				error_message: message
			}
			res.status(HttpStatus[code])
			.json(Object.assign(error, payload));	
		}
	}
}
module.exports = handler;