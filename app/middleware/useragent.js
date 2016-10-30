
/*
 * Curried utlitiy to get the user agent from the header and validate it
**/

function parseUserAgent(req, res) {
	const userAgent = req.headers['user-agent'];
	return function validate(ua) {
		return userAgent === ua;
	}
}

module.exports = parseUserAgent;