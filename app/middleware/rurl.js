const querystring = require('querystring');

function constructReturnUrl(hostname, query) {
	return `${hostname}?${querystring.stringify(query)}`;
}

module.exports = {
	construct: constructReturnUrl
}