
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();

chai.use(chaiHttp);


const Code = require('../../models/Code');

const username = process.env.ADMIN_USER;
const password = process.env.ADMIN_PW;

const createDate = (hours = 0) => {
	var date = new Date();
	date.setHours(date.getHours() + hours);
	return date.toJSON();
}

describe('Codes', function() {
	const activatesAt = createDate();
	const expiresAt = createDate();

	beforeEach(function(done) {
    	var newCode = new Code({
			'code':'12345',
			'activatesAt': activatesAt,
			'expiresAt': expiresAt
    	});

		newCode.save(function(err) {
  			done();
		});
	});

	afterEach(function(done) {
		Code.collection.drop();
		done();
	});


	it('requires authentication', function(done) {
		chai.request(server)
			.get('/codes')
			.end(function(err, res) {
				res.should.have.status(401);
				done();
			});
	});

	it('lists all codes on GET /codes', function(done) {
		chai.request(server)
			.get('/codes')
			.auth(username, password)
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('code');
				res.body[0].should.have.property('createdAt');
				res.body[0].should.have.property('activatesAt');
				res.body[0].should.have.property('expiresAt');
				res.body[0].code.should.equal('12345');
				res.body[0].activatesAt.should.equal(activatesAt);
				res.body[0].expiresAt.should.equal(expiresAt);
				done();				
			});
	});

	it('shows a single code on GET /codes/:id', function(done) {
		let newCode = new Code({
			'code': '4444',
			'activatesAt': activatesAt,
			'expiresAt': expiresAt
		});

		newCode.save(function(err, data) {
			chai.request(server)
				.get('/codes/' + data.id)
				.auth(username, password)
				.end(function(err, res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.have.property('_id');
					res.body.should.have.property('code');
					res.body.should.have.property('createdAt');
					res.body.should.have.property('activatesAt');
					res.body.should.have.property('expiresAt');
					res.body._id.should.equal(data.id);
					res.body.code.should.equal('4444');
					res.body.activatesAt.should.equal(activatesAt);
					res.body.expiresAt.should.equal(expiresAt);
					done();
				});
		});

	});


  	it('adds a single code on POST /codes/', function(done) {
		chai.request(server)
			.post('/codes')
			.auth(username, password)
			.send({ 'code':'12345', 'activatesAt':activatesAt, 'expiresAt':expiresAt })
			.end(function(err, res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('_id');
				res.body.should.have.property('code');
				res.body.should.have.property('createdAt');
				res.body.should.have.property('activatesAt');
				res.body.should.have.property('expiresAt');			
				res.body.code.should.equal('12345');
				res.body.activatesAt.should.equal(activatesAt);
				res.body.expiresAt.should.equal(expiresAt);
				done();
			});
	});

	it('updates a single code on PUT /codes/:id', function(done) {
		activatesAtPutValue = createDate(1);
		expiresAtPutValue = createDate(4);

		var valuesForPut = {
			'code': '55555',
			'activatesAt': activatesAtPutValue,
			'expiresAt': expiresAtPutValue
		};

		chai.request(server)
			.get('/codes')
			.auth(username, password)
			.end(function(err, res) {
				chai.request(server)
					.put('/codes/' + res.body[0]._id)
					.auth(username, password)
					.send(valuesForPut)
					.end(function(error, response) {
						response.should.have.status(204);						
					});

				// perform a get request to verify the put request was successful
				chai.request(server)
					.get('/codes/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');							
						response.body.should.have.property('_id');
						response.body.should.have.property('code');
						response.body.should.have.property('createdAt');
						response.body.should.have.property('activatesAt');
						response.body.should.have.property('expiresAt');			
						response.body.code.should.equal('55555');
						response.body.activatesAt.should.equal(activatesAtPutValue);
						response.body.expiresAt.should.equal(expiresAtPutValue);
					});
				
				// perform another put to verify idempotency
				chai.request(server)
					.put('/codes/' + res.body[0]._id)
					.auth(username, password)
					.send(valuesForPut)
					.end(function(error, response) {
						response.should.have.status(204);
					});

				// perform another get to verify idempotency
				chai.request(server)
					.get('/codes/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');
						response.body.should.have.property('_id');
						response.body.should.have.property('code');
						response.body.should.have.property('createdAt');
						response.body.should.have.property('activatesAt');
						response.body.should.have.property('expiresAt');			
						response.body.code.should.equal('55555');
						response.body.activatesAt.should.equal(activatesAtPutValue);
						response.body.expiresAt.should.equal(expiresAtPutValue);
						done();
					});
			});
	});

	it('deletes a single code on DELETE /codes/:id', function(done) {
		// get all codes
		chai.request(server)
			.get('/codes/')
			.auth(username, password)
			.end(function(err, res) {
				chai.request(server)
					.delete('/codes/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(204);
						response.body.should.be.empty;
					});

				// get code to verify deletion - should return 404
				chai.request(server)
					.get('/codes/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(404);
						response.should.be.json;
					});
				
				// delete code again to verify idempotency - should return 404		
				chai.request(server)
					.delete('/codes/' + res.body[0]._id)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(404);
						response.should.be.json;
						done();
					});
			});
	});
});


