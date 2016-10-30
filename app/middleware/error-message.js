
// TODO: Unify all error messages


const AuthenticationErrors = {

	ACCESS_DENIED: 'access_denied',

	INVALID_CLIENT: 'invalid_client',
	INVALID_GRANT: 'invalid_grant',
	INVALID_REQUEST: 'invalid_request',
	INVALID_SCOPE: 'invalid_scope',

	SERVER_ERROR: 'server_error',

	TEMPORARILY_UNAVAILABLE: 'temporarily_unavailable',

	UNAUTHORIZED_CLIENT: 'unauthorized_client',
	
	UNSUPPORTED_GRANT_TYPE: 'unsupported_grant_type',
	UNSUPPORTED_RESPONSE_TYPE: 'unsupported_response_type',
	getErrorDescriptionFrom(errorType) {
		switch(errorType) {
			case 'access_denied': return 'The user has denied the request';
			
			case 'invalid_client': return 'Client authentication failed';
			case 'invalid_grant': return 'The provided grant was invalid';
			case 'invalid_request': return 'The request is malformed and could not be processed';
			case 'invalid_scope': return 'The scope passed in is invalid';
			
			case 'server_error': return 'An error happened on the server that prevented a successful response from being generated';
			
			case 'temporarily_unavailable': return 'The authorization server is temporarily unavailable';

			case 'unsupported_grant_type': return 'The authorization grant type is not supported';
			case 'unauthorized_client': return 'The client application isn\'t authorized to make such request';
			case 'unsupported_response_type': return 'An invalid response type was used';

			default: return 'The error type provided is not valid';
		}
	}
}


const RefreshTokenErrors = {

	INVALID_REQUEST: 'invalid_request',
	INVALID_CLIENT: 'invalid_client',
	INVALID_GRANT: 'invalid_grant',
	UNAUTHORIZED_CLIENT: 'unauthorized_client',
	UNSUPPORTED_GRANT_TYPE: 'unsupported_grant_type',
	INVALID_SCOPE: 'invalid_scope',

	getErrorDescriptionFrom(errorType) {
		switch(errorType) {
			case 'invalid_request': return 'The request is malformed and could not be processed';
			case 'invalid_client': return 'Client authentication failed';
			case 'invalid_grant': return 'The provided grant was invalid';
			case 'unauthorized_client': return 'The client application isn\'t authorized to make such request';
			case 'unsupported_grant_type': return 'The authorization grant type is not supported';
			case 'invalid_scope': return 'The scope passed in is invalid';
			default: return 'The error type provided is not valid';
		}
	}
}
const AccessTokenErrors = RefreshTokenErrors;

const AuthorizeTokenErrors = {

	INVALID_REQUEST: 'invalid_request',
	UNAUTHORIZED_CLIENT: 'unauthorized_client',
	ACCESS_DENIED: 'access_denied',
	UNSUPPORTED_RESPONSE_TYPE: 'unsupported_response_type',
	INVALID_SCOPE: 'invalid_scope',
	SERVER_ERROR: 'server_error',
	TEMPORARILY_UNAVAILABLE: 'temporarily_unavailable',

	getErrorDescriptionFrom(errorType) {
		switch(errorType) {
			case 'invalid_request': return 'The request is malformed and could not be processed';
			case 'unauthorized_client': return 'The client application isn\'t authorized to make such request';
			case 'access_denied': return 'The user has denied the request';
			case 'unsupported_response_type': return 'An invalid response type was used';
			case 'invalid_scope': return 'The scope passed in is invalid';
			case 'server_error': return 'An error happened on the server that prevented a successful response from being generated';
			case 'temporarily_unavailable': return 'The authorization server is temporarily unavailable';
			default: return 'The error type provided is not valid';
		}	
	}
}

module.exports = {
	// A unified error
	AuthenticationErrors,


	RefreshTokenErrors,
	AuthorizeTokenErrors,
	AccessTokenErrors
}