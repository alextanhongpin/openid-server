(function () {


	function isAuthenticated() {
		// check localstorage for tokens first
		const accessToken = window.localStorage.access_token;
		const refreshToken = window.localStorage.refresh_token;

		if (accessToken && refreshToken) {
			
		} else {
			if (window.location.pathname !== '/register') {
				if (window.redirect_url) {
					// There is a redirection triggered
					// User is not logged in, go to registration page first
					// After that carry authorization
					let url = '/register?referrer=' + encodeURIComponent(document.referrer);
					if (window.token) {
						url += '&token=' + window.token;
					}
					window.location.href = url;
				} else {

					window.location.href = '/register';
				}
			}
		}




		// compare with server's access token 
		validateToken(accessToken, refreshToken).then((data) => {
			console.log('validateToken', data)
	
			// if token expire, check refresh token's user agent
			// if both matches only grant new access token
			if (data && data.success) {
				// 1. Access token has been refreshed
				if (data.grant_type === 'refreshed') {
					// refresh the access token first
					window.localStorage.access_token = data.access_token;

					// then carry redirect
					const referrer = window.referrer;
					alert(referrer)
					if (referrer) {
						if (referrer.indexOf(window.location.hostname)) {
							// the referrer cannot be from the same domain
						} else {
							window.location.href = referrer;

						}
					} else {
						// else just go back to the home page
						// window.location.href = '/';
					}
				} else if (data.grant_type === 'validated') {
					// Redirect back to the original page that you come from
					const referrer = window.referrer;
				
					if (referrer) {
						if (referrer.indexOf(window.location.hostname)) {
							// the referrer cannot be from the same domain
						} else {
							window.location.href = referrer;

						}
					} else {
						// if user is already on the same page, stay there
						// if (window.location.pathname !== '/') {
						// // else just go back to the home page
						// 	window.location.href = '/';
						// }
						// User is already registered, kick them out of the page
						if (window.location.pathname === '/register') {
							window.location.href = '/';
						}
					}
				} else if (data.grant_type === 'register') {
					// Stay on the same page
				}
		
			} else {
				console.log(data)
				// Not register
				if (data && data.error_description === 'jwt expired') {
					refreshTokenService(refreshToken).then((data) => {
						console.log(data, 'refresh Token')
						if (data.success && data.results) {
							window.localStorage.access_token = data.results.access_token;
							window.localStorage.refresh_token = data.results.refresh_token;

						}
					});
				} else if ((data && data.redirect_url) && data.redirect_url !== window.location.href) {
					window.location.href = data.redirect_url;
				}
			}
		});
	}

	/*
	 * Post a request to check if the token is valid
	**/
	function validateToken(accessToken, refreshToken) {
		const serviceUrl = '/instrospect';

		return fetch(serviceUrl, {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + accessToken, 
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `refreshToken=${ refreshToken }`
		}).then((response) => {
			return response.json();
		}).catch((err) => {
			// Error :(
			console.log(JSON.stringify(err));
		});
	}

	function BaseService(options={}) {
		const accessToken = window.localStorage.access_token;
		if (!accessToken) {
			throw new Error('You are not authorized to access the service');
		}
		const headers = Object.assign({
			'Authorization': `Bearer ${ accessToken }`,
			'Content-Type': 'application/json;charset=UTF-8'
		}, options.headers || {});
		const method = options.method || 'get';
		const body = options.data || {};
		const url = options.url;
		return fetch(url, {
			method,
			headers,
			body
		}).then((data) => {
			return data.json();
		})
	}

	const dispatcher = {
		_events: [],
		on(action, fn) {
			if (!this._events[action]) this._events[action] = [];
			this._events[action].push(fn); 
		},
		trigger(action, data) {
			if (!this._events[action]) return null;
			this._events[action].forEach((act) => {
				act(data);
			});
		}
	}


	const ObservableFetch = {
		_calls: {},
		_expired: false,
		push(id, call) {
			if (!this._calls[id]) this._calls[id] = call;
			//this._calls[id].push(call);
		},
		pop(id) {
			if (this._calls[id]) {
				delete this._calls[id];
				//const index = this._calls.indexOf(id);
				//this._calls.slice(index, 1);
			}
		},

		triggerCalls(id, call) {
			this.push(id, call);
				console.log('expiry', this._expired)
			if (this._expired) {
	

				//setTimeout(() => {
					
					return this._calls[id]().then((data) => {
						if (!data.error) {
							this._expired = false;
							dispatcher.trigger(id, data);
							this.pop(id);
						}
					});
				//}, 2500);
					
			} else {
				this._expired = false;
				
				return this._calls[id]().then((data) => {

					if (data.error) {
						this._expired = true;
						setTimeout(() => {
							return Object.keys(this._calls).map((key, index) => {
								return this.triggerCalls(key, this._calls[key]);
							})
						}, 2500);
					} else {

						dispatcher.trigger(id, data);
						this.pop(id);

					}
				});

			}

		},

	}

	function factory() {
		return BaseService({
			url: '/apps',
			method: 'get',
		})
	}

	function factoryCars() {
		return BaseService({
			url: '/cars',
			method: 'get',
		})
	}
	ObservableFetch.triggerCalls('hello', factory)
	// .then((data) => {
	// 	console.log('hello', data)
	// })

	dispatcher.on('hello', function(data)  {
		console.log('hello data', data)
	})

	

	ObservableFetch.triggerCalls('another one', factory)
	ObservableFetch.triggerCalls('cars', factoryCars)
	ObservableFetch.triggerCalls('another cars', factoryCars)
	// .then((data) => {
	// 	console.log('another one', data)
	// })

	dispatcher.on('another one', function(data) {
		console.log('another data', data)
	})
	dispatcher.on('cars', function(data) {
		console.log('cars', data)
	})
	dispatcher.on('another cars', function(data) {
		console.log('another cars', data)
	})

	// route to refresh the access token
	function refreshTokenService(refreshToken) {
		const formData = new FormData();
		formData.append('refresh_token', refreshToken);
		formData.append('grant_type', 'refresh_token');
		return fetch('/token', {
			method: 'POST',
			headers: {
				'Authorization': window.credentials, 
				//'Content-Type': 'application/x-www-form-urlencoded'
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
			},
			//body: formData
			// body: {
			// 	refresh_token: refreshToken,
			// 	grant_type: 'refresh_token'
			// }
			body: `refresh_token=${encodeURIComponent(refreshToken)}&grant_type=${encodeURIComponent('refresh_token')}`
		}).then(function(response) {
			if (!response) return null;
			console.log(response, 'RESA')
			return response.json()
		}).catch(function(err) {
			console.log(err)
		});
	}

	isAuthenticated()





})()