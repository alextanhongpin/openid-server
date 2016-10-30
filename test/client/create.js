
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const should = chai.should();

chai.use(chaiHttp);
// const Client = require('../../app/model/client.js');


// let sandbox = null;
// describe('Feature: Create a Client', () => {

// 	beforeEach((done) => {
// 	    //sandbox = sinon.sandbox.create();

// 	    //Client.remove({}).then(done);
// 	});

// 	afterEach(() => {
//    		//sandbox.restore();
// 	});

const apiUrl = 'http://localhost:4000';
describe('/GET api/clients', () => {
	it ('should get all clients', (done) => {

		chai.request(apiUrl)
		.get('/api/clients')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.an('object');
			res.body.should.have.property('success');
			res.body.success.should.be.true;
			res.body.should.have.property.results;
			res.body.results.should.be.an('array');
			done();
		});
	});
});

describe('/POST api/clients', () => {
	it ('should create a client', (done) => {
		done()
		// chai.request(apiUrl)
		// .post('/api/clients')
		// .end((err, res) => {

		// })
	})
})


// 	// context('Scenario: User create a new api client with valid credentials', () => {

// 	// 	it ('Given that there are no clients', () => {
// 	// 		sandbox.stub(Client, 'get').returns([]);
// 	// 		Client.get().should.have.length(0);
// 	// 	});

// 	// 	it ('When a new client is added', () => {
// 	// 		// Client.add(true);

// 	// 		sandbox.stub(Client, 'create').returns(true);
// 	// 		Client.create().should.be.true;
// 	// 	});

// 	// 	it ('Then there should be a new client added', () => {
// 	// 		sandbox.stub(Client, 'get').returns([0]);
// 	// 		Client.get().should.have.length(1);
// 	// 	});

// 	// 	it ('And the client should have the correct fields', () => {

// 	// 		sandbox.stub(Client, 'getById').returns({
// 	// 			client_secret: 'secret',
// 	// 			client_id: 'id',
// 	// 			created_at: new Date(2016, 0, 1),
// 	// 			updated_at: new Date(2016, 0, 1),
// 	// 			redirect_url: 'http://localhost:3000/callback',
// 	// 			auth_url: 'http://localhost:3000',
// 	// 			domain_url: 'http://localhost:3000',
// 	// 			scope: ['email', 'profile']
// 	// 		});

// 	// 		const model = Client.getById();

// 	// 		model.should.have.property('client_secret').equal('secret');
// 	// 		model.should.have.property('client_id').equal('id');
// 	// 		model.should.have.property('created_at');
// 	// 		model.should.have.property('updated_at');
// 	// 		model.should.have.property('redirect_url').equal('http://localhost:3000/callback');
// 	// 		model.should.have.property('auth_url').equal('http://localhost:3000');
// 	// 		model.should.have.property('domain_url').equal('http://localhost:3000');
// 	// 		model.should.have.property('scope').with.length(2);
// 	// 	});
// 	// });




// 	// context('Scenario: User miss a required fill', () => {

// 	// 	it ('Given that the user miss a fill when creating', () => {
// 	// 		return true;
// 	// 	});

// 	// 	it ('When the user submit the form', () => {
// 	// 		sandbox.stub(Client, 'create').returns(false);
// 	// 		Client.create().should.be.false;
// 	// 	});
		
// 	// 	it ('Then user will receive error message', () => {
// 	// 		sandbox.stub(Client, 'create').returns({
// 	// 			error: 'error',
// 	// 			error_description: 'error_description',
// 	// 			error_uri: 'error_uri',
// 	// 			state: 'state'
// 	// 		});
// 	// 		Client.create().should.have.property('error').and.not.empty;
// 	// 		Client.create().should.have.property('error_description').and.not.empty;
// 	// 		Client.create().should.have.property('error_uri').and.not.empty;
// 	// 		Client.create().should.have.property('state').and.not.empty;
// 	// 	});
// 	// });

// });
