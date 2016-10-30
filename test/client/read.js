
// const chai = require('chai');
// const sinon = require('sinon');
// const should = chai.should();



// const Client = require('../../app/model/client.js');

// let sandbox = null;

// describe('Feature: Get Clients', () => {

// 	beforeEach(() => {
// 	    sandbox = sinon.sandbox.create();
// 	});

// 	afterEach(() => {
//    		sandbox.restore();
// 	});

// 	describe('Scenario: User request client list', () => {

// 		it ('Given that user request a client list', () => {
// 			return true;
// 		});
// 		it ('Then the user should get the paginated list', () => {
// 			sandbox.stub(Client, 'get').returns([1,2,3,4]);
// 			Client.get().should.not.be.empty;
// 		});
// 	});

// 	describe('Scenario: List is empty', () => {
// 		it ('Given that user request the client list', () => {
// 			return true;
// 		});
// 		it ('Then the user will see no results', () => {
			
// 			sandbox.stub(Client, 'get').returns([]);
// 			Client.get().should.be.empty;
// 		});
// 	});

// 	describe('Scenario: User view a detail', () => {
// 		it ('Given that user view the client list');
// 		it ('Then the user will see the detail for the client');
// 	});
	
// });
