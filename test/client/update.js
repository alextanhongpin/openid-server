
const chai = require('chai');
const sinon = require('sinon');
const should = chai.should();



const Client = require('../../app/model/client.js');
let sandbox = null;

describe('Feature: Update a Client', () => {

	beforeEach(() => {
	    sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
   		sandbox.restore();
	});

	describe('Scenario: User update a Client', () => {

		it ('Given that the user update a client', () => {
			sandbox.stub(Client, 'updateById').returns(true)
			Client.updateById();
		});
		it ('When the user submit the changes');
		it ('Then the changes will be reflected');
	});

	
});	