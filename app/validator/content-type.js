



function isJSON(req, res, next) {
	const contentType =	req.headers['content-type'];

	if (contentType !== 'application/json') {
		return next({
			error: 'Invalid content-type',
			error_description: 'The provided content-type does not match the desired content-type'
		});
	}

	next();
}
function isForm(req, res, next) {
	const contentType =	req.headers['content-type'];

	if (contentType !== 'application/x-www-form-urlencoded') {
		return next({
			error: 'Invalid content-type',
			error_description: 'The provided content-type does not match the desired content-type'
		});
	}

	next();
}


module.exports = { form:isForm, json:isJSON }