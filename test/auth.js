const assert = require('assert');



describe('Service Request', () => {

});

// Authorization Code Grant
describe('Authorization Request', () => {


	describe('resource owner make a request from client', () => {
		context('GET /oauth/authorize', () => {

		});
	});

	describe('client make request to resource server', () => {

	});


	describe('client make request to authorization server', () => {})
	describe('authorization server request credentials from resource owner', () => {})
	describe('resource owner pass credentials to authorization server', () => {})
});

// Got credentials
// No credentials

// No credentials background
// Validated
// Not validated
describe('authorization server returns the credential to client', () => {})
describe('client make request to resource server', () => {})
describe('resource server make request to authorization server', () => {})
describe('authorization server validate the credentials and return the response', () => {})


describe('GET /oauth/authorize correct credentials', () => {
	it ('should check user status is valid')
	it ('should be registered first')
	it ('should be asked to log in if user is not logged in')
	it ('should be a sso')
	it ('should render the view to ask users permission')
});

describe('POST /oauth/authorize', () => {
	it ('should pass in the correct credentials');
	it ('should have the correct fields');
	it ('should throw error if the fields are incorrect');
});


