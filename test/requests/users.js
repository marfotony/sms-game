
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const should = chai.should();

chai.use(chaiHttp);


const User = require('../../models/User');

const username = process.env.ADMIN_USER;
const password = process.env.ADMIN_PW;

describe('Users', function() {
	beforeEach(function(done) {
    	var newUser = new User({
			'phoneNumber':'+4712345678',
			'username':'rocketman123'
    	});

		newUser.save(function(err) {
  			done();
		});
	});

	afterEach(function(done) {
		User.collection.drop();
		done();
	});
	

	it('requires authentication', function(done) {
		chai.request(server)
			.get('/users')
			.end(function(err, res) {
				res.should.have.status(401);
				done();
			});
	});

	it('lists all users on GET /users', function(done) {
		chai.request(server)
			.get('/users')
			.auth(username, password)
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('phoneNumber');
				res.body[0].should.have.property('username');
				res.body[0].should.have.property('score');
				res.body[0].should.have.property('isActive');
				res.body[0].should.have.property('createdAt');
				res.body[0].username.should.equal('rocketman123');
				res.body[0].phoneNumber.should.equal('+4712345678');
				done();
			});
	});

  	it('shows a single user on GET /users/:phoneNumber', function(done) {
  		let newUser = new User({
  			'phoneNumber':'+4712341234',
  			'username':'nintendo'
  		});

  		newUser.save(function(err, data) {
			chai.request(server)
				.get('/users/' + data.phoneNumber)
				.auth(username, password)
				.end(function(err, res) {
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.property('_id');
					res.body.should.have.property('phoneNumber');
					res.body.should.have.property('username');
					res.body.should.have.property('score');
					res.body.should.have.property('isActive');
					res.body.should.have.property('createdAt');
					res.body.username.should.equal('nintendo');
					res.body.phoneNumber.should.equal('+4712341234');
					res.body._id.should.equal(data.id);
					done();
				});
		});
	});

  	it('adds a single user on POST /users/', function(done) {
		chai.request(server)
			.post('/users')
			.auth(username, password)
			.send({ 'phoneNumber':'+4712341234', 'username':'nintendo' })
			.end(function(err, res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.have.property('_id');
				res.body.should.have.property('username');
				res.body.should.have.property('phoneNumber');
				res.body.should.have.property('score');
				res.body.should.have.property('isActive');
				res.body.should.have.property('createdAt');				
				res.body.username.should.equal('nintendo');
				res.body.phoneNumber.should.equal('+4712341234');
				done();
			});
	});

	it('updates a single user on PUT /users/:phoneNumber', function(done) {
		var valuesForPut = {
			'username': 'EltonJohn',
			'phoneNumber': '+4712341234'
		};

		chai.request(server)
			.get('/users')
			.auth(username, password)
			.end(function(err, res) {
				chai.request(server)
					.put('/users/' + res.body[0].phoneNumber)
					.auth(username, password)
					.send(valuesForPut)
					.end(function(error, response) {						
						response.should.have.status(204);

						// perform a get request to verify the put request was successful
						chai.request(server)
							.get('/users/' + valuesForPut.phoneNumber)
							.auth(username, password)
							.end(function(error, response) {
								response.should.have.status(200);
								response.should.be.json;
								response.body.should.be.a('object');
								response.body.should.have.property('_id');
								response.body.should.have.property('username');
								response.body.should.have.property('phoneNumber');
								response.body.should.have.property('score');
								response.body.should.have.property('isActive');
								response.body.should.have.property('createdAt');
								response.body.username.should.equal('EltonJohn');
								response.body.phoneNumber.should.equal('+4712341234');

								// perform another put to verify idempotency
								chai.request(server)
									.put('/users/' + valuesForPut.phoneNumber)
									.auth(username, password)
									.send(valuesForPut)
									.end(function(error, response) {
										response.should.have.status(204);

										// perform another get to verify idempotency
										chai.request(server)
											.get('/users/' + valuesForPut.phoneNumber)
											.auth(username, password)
											.end(function(error, response) {
												response.should.have.status(200);
												response.should.be.json;
												response.body.should.be.a('object');
												response.body.should.have.property('_id');
												response.body.should.have.property('username');
												response.body.should.have.property('phoneNumber');
												response.body.should.have.property('score');
												response.body.should.have.property('isActive');
												response.body.should.have.property('createdAt');
												response.body.username.should.equal('EltonJohn');
												response.body.phoneNumber.should.equal('+4712341234');
												done();
											});										
									});
							});	
					});
			});
	});

	it('deletes a single user on DELETE /users/:phoneNumber', function(done) {
		// get all users
		chai.request(server)
			.get('/users/')
			.auth(username, password)
			.end(function(err, res) {
				chai.request(server)
					.delete('/users/' + res.body[0].phoneNumber)
					.auth(username, password)
					.end(function(error, response) {
						response.should.have.status(204);
						response.body.should.be.empty;

						// get user to verify deletion - should return 404
						chai.request(server)
							.get('/users/' + res.body[0].phoneNumber)
							.auth(username, password)
							.end(function(error, response) {
								response.should.have.status(404);
								response.should.be.json;

								// delete user again to verify idempotency - should return 404		
								chai.request(server)
									.delete('/users/' + res.body[0].phoneNumber)
									.auth(username, password)
									.end(function(error, response) {
										response.should.have.status(404);
										response.should.be.json;
										done();
									});								
							});						
					});
			});
	});
});


