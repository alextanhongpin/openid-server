const Client = require('../model/client.js');
const User = require('../model/user.js');
const Token = require('../model/token.js');
const cookie = require('cookie');

const domainUrl = require('../middleware/url.js');


const Promise = require('bluebird')
function wrap (genFn) { // 1
    var cr = Promise.coroutine(genFn) // 2
    return function (req, res, next) { // 3
        cr(req, res, next).catch(next) // 4
    }
}


	// Views

	const getRegistrationView = {
		method: 'get',
		route: '/register',
		command(req, res, next) {

				// console.log('req.cookies', req.cookies);
				// console.log('req.headers', req.headers);
		
			// pass the referrer payload to the registration post
			const referrer = req.query.referrer;
		
			res.locals.referrer = referrer;
			res.render('register.ejs');
		}
	}


	const postRegistration = {
		method: 'post',
		route: '/register',
		command: wrap(function *(req, res, next) {

			// use jwt to verify the referrer
		// check if referrer exists (application that wants to connect to the provider)

			const referrer = req.body.referrer;
			console.log('referrer:post-register', referrer)
			const redirect = referrer != null && referrer != undefined;
			// 1. Check if Email exist (should be an array...)
			const user = yield User.checkIfEmailExist(req.body);

			if (user) {

				const jwtPayload = {
					payload_device: {
						user_agent: req.headers['user-agent']
					},
					payload_user: {
						user_id: user._id
					},
					options: {
					audience: referrer || domainUrl(req),
						issuer: domainUrl(req),
						subject: user.name || user.given_name || user.local.email.split('@')[0]				
					}
				};

				if (referrer) {
					// redirect back to the referrer with the data
				} else {
					// redirect the user back to the home page
				}
				// check if token exist
				Token.create(jwtPayload).then((data) => {

					const { access_token, refresh_token } = data;
					const accessTokenCookie = cookie.serialize('access_token', String(access_token), {
				      httpOnly: true,
				      maxAge: 60 * 60 * 24 * 7 // 1 week
				    });
				    const refreshTokenCookie = cookie.serialize('refresh_token', String(refresh_token), {
				      httpOnly: true,
				      maxAge: 60 * 60 * 24 * 7 // 1 week
				    });
					res.setHeader('Set-Cookie', accessTokenCookie);
					res.append('Set-Cookie', refreshTokenCookie);
					res.status(200).json({
						success: true,
						results: {
							access_token: access_token,
							refresh_token: refresh_token,
							redirect: redirect,
							redirect_url: referrer
						}
					});

				});
		
				
				// Email exist
				// Log user in
			} else {
				// Not a registered user yet
				const newUser = yield User.create(req.body)


				res.status(200).json(newUser)
		
			}
		})

	}

	var serializeCookie = function(key, value, hrs) {
	 // This is res.cookie’s code without the array management and also ignores signed cookies.
	 if ('number' == typeof value) value = val.toString();
	 if ('object' == typeof value) value = JSON.stringify(val);
	 return cookie.serialize(key, value, { expires: new Date(Date.now() + 1000 * 60 * hrs), httpOnly: true });
	}; 


	

	module.exports = [
		getRegistrationView,
		postRegistration
	]

