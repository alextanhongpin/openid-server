

module.exports = function (routes, cb) {
	return mapObjectToArrays(routes).map((route) => {
		mapObjectToArrays(route).map(cb);
	});
}


function mapObjectToArrays(obj) {
	return Object.keys(obj).map((key) => {
		return obj[key];
	});
}