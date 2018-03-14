
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();

chai.use(chaiHttp);


const Attempt = require('../../models/Attempt');

const username = 'admin';
const password = 'secret';

const createDate = (hours = 0) => {
	var date = new Date();
	date.setHours(date.getHours() + hours);
	return date.toJSON();
}

describe('Attempts', function() {
	const activatesAt = createDate();
	const expiresAt = createDate();

	beforeEach(function(done) {
    	var newAttempt = new Attempt({
			'code':'12345',
			'phoneNumber':'+4712345678'
    	});

		newAttempt.save(function(err) {
  			done();
		});
	});

	afterEach(function(done) {
		Attempt.collection.drop();
		done();
	});


	it('requires authentication', function(done) {
		chai.request(server)
			.get('/attempts')
			.end(function(err, res) {
				res.should.have.status(401);
				done();
			});
	});

	it('lists all attempts on GET /attempts', function(done) {
		chai.request(server)
			.get('/attempts')
			.auth(username, password)
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('code');
				res.body[0].should.have.property('phoneNumber');
				res.body[0].should.have.property('success');
				res.body[0].should.have.property('createdAt');
				res.body[0].code.should.equal('12345');
				res.body[0].phoneNumber.should.equal('+4712345678');				
				done();				
			});
	});

	it('shows a single attempt on GET /attempts/:id', function(done) {
		let newAttempt = new Attempt({
			'code': '4444',
			'phoneNumber':'+4712341234'
		});

		newAttempt.save(function(err, data) {
			chai.request(server)
				.get('/attempts/' + data.id)
				.auth(username, password)
				.end(function(err, res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('_id');
					res.body.should.have.property('code');
					res.body.should.have.property('phoneNumber');
					res.body.should.have.property('success');					
					res.body.should.have.property('createdAt');
					res.body._id.should.equal(data.id);
					res.body.code.should.equal('4444');
					res.body.phoneNumber.should.equal('+4712341234');
					done();
				});
		});

	});


  	it('adds a single attempt on POST /attempts/', function(done) {
		chai.request(server)
			.post('/attempts')
			.auth(username, password)
			.send({ 'code':'54321', 'phoneNumber':'+4712341234' })
			.end(function(err, res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('_id');
				res.body.should.have.property('code');
				res.body.should.have.property('phoneNumber');
				res.body.should.have.property('success');
				res.body.should.have.property('createdAt');
				res.body.code.should.equal('54321');
				res.body.phoneNumber.should.equal('+4712341234');				
				done();
			});
	});

	it('updates a single attempt on PUT /attempts/:id', function(done) {
		var valuesForPut = {
			'code': '55555',
			'phoneNumber': '+4712341234'
		};

		chai.request(server)
			.get('/attempts')
			.auth(username, password)
			.end(function(err, res) {
				chai.request(server)
					.put('/attempts/' + res.body[0]._id)
					.auth(username, password)
					.send(valuesForPut)
					.end(function(error, response) {
						response.should.have.status(204);						
					});

				// perform a get request to verify the put request was successful
				chai.request(server)
					.get('/attempts/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');							
						response.body.should.have.property('_id');
						response.body.should.have.property('code');
						response.body.should.have.property('phoneNumber');
						response.body.should.have.property('success');
						response.body.should.have.property('createdAt');			
						response.body.code.should.equal('55555');
						response.body.phoneNumber.should.equal('+4712341234');
					});
				
				// perform another put to verify idempotency
				chai.request(server)
					.put('/attempts/' + res.body[0]._id)
					.auth(username, password)
					.send(valuesForPut)
					.end(function(error, response) {
						response.should.have.status(204);
					});

				// perform another get to verify idempotency
				chai.request(server)
					.get('/attempts/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');
						response.body.should.have.property('_id');
						response.body.should.have.property('code');
						response.body.should.have.property('phoneNumber');
						response.body.should.have.property('success');
						response.body.should.have.property('createdAt');			
						response.body.code.should.equal('55555');
						response.body.phoneNumber.should.equal('+4712341234');
						done();
					});
			});
	});

	it('deletes a single attempt on DELETE /attempts/:id', function(done) {
		// get all attempts
		chai.request(server)
			.get('/attempts/')
			.auth(username, password)
			.end(function(err, res) {
				chai.request(server)
					.delete('/attempts/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(204);
						response.body.should.be.empty;
					});

				// get attempt to verify deletion - should return 404
				chai.request(server)
					.get('/attempts/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(404);
						response.should.be.json;
					});
				
				// delete attempt again to verify idempotency - should return 404		
				chai.request(server)
					.delete('/attempts/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(404);
						response.should.be.json;
						done();
					});
			});
	});
});






































