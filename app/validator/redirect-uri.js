function redirectUri(req, res, next) {
	if (!req.query.redirectUri) {
		return next('err')
	}
	next();
}