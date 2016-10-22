module.exports = function extractHeaderAuth(header) {

	if (!header) return null;
	const hasValidGrantType = header.indexOf('Authorization') !== -1;
	if (!hasValidGrantType) {
		return null;
	}

	const grantType = header.split(' ')[0];
	const accessToken = header.split(' ')[1];
	return { accessToken, grantType };
}

