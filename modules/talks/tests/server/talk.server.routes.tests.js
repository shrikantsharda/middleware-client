'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Talk = mongoose.model('Talk'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  talk;

/**
 * Talk routes tests
 */
describe('Talk CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Talk
    user.save(function () {
      talk = {
        name: 'Talk name'
      };

      done();
    });
  });

  it('should be able to save a Talk if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Talk
        agent.post('/api/talks')
          .send(talk)
          .expect(200)
          .end(function (talkSaveErr, talkSaveRes) {
            // Handle Talk save error
            if (talkSaveErr) {
              return done(talkSaveErr);
            }

            // Get a list of Talks
            agent.get('/api/talks')
              .end(function (talksGetErr, talksGetRes) {
                // Handle Talks save error
                if (talksGetErr) {
                  return done(talksGetErr);
                }

                // Get Talks list
                var talks = talksGetRes.body;

                // Set assertions
                (talks[0].user._id).should.equal(userId);
                (talks[0].name).should.match('Talk name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Talk if not logged in', function (done) {
    agent.post('/api/talks')
      .send(talk)
      .expect(403)
      .end(function (talkSaveErr, talkSaveRes) {
        // Call the assertion callback
        done(talkSaveErr);
      });
  });

  it('should not be able to save an Talk if no name is provided', function (done) {
    // Invalidate name field
    talk.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Talk
        agent.post('/api/talks')
          .send(talk)
          .expect(400)
          .end(function (talkSaveErr, talkSaveRes) {
            // Set message assertion
            (talkSaveRes.body.message).should.match('Please fill Talk name');

            // Handle Talk save error
            done(talkSaveErr);
          });
      });
  });

  it('should be able to update an Talk if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Talk
        agent.post('/api/talks')
          .send(talk)
          .expect(200)
          .end(function (talkSaveErr, talkSaveRes) {
            // Handle Talk save error
            if (talkSaveErr) {
              return done(talkSaveErr);
            }

            // Update Talk name
            talk.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Talk
            agent.put('/api/talks/' + talkSaveRes.body._id)
              .send(talk)
              .expect(200)
              .end(function (talkUpdateErr, talkUpdateRes) {
                // Handle Talk update error
                if (talkUpdateErr) {
                  return done(talkUpdateErr);
                }

                // Set assertions
                (talkUpdateRes.body._id).should.equal(talkSaveRes.body._id);
                (talkUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Talks if not signed in', function (done) {
    // Create new Talk model instance
    var talkObj = new Talk(talk);

    // Save the talk
    talkObj.save(function () {
      // Request Talks
      request(app).get('/api/talks')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Talk if not signed in', function (done) {
    // Create new Talk model instance
    var talkObj = new Talk(talk);

    // Save the Talk
    talkObj.save(function () {
      request(app).get('/api/talks/' + talkObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', talk.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Talk with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/talks/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Talk is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Talk which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Talk
    request(app).get('/api/talks/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Talk with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Talk if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Talk
        agent.post('/api/talks')
          .send(talk)
          .expect(200)
          .end(function (talkSaveErr, talkSaveRes) {
            // Handle Talk save error
            if (talkSaveErr) {
              return done(talkSaveErr);
            }

            // Delete an existing Talk
            agent.delete('/api/talks/' + talkSaveRes.body._id)
              .send(talk)
              .expect(200)
              .end(function (talkDeleteErr, talkDeleteRes) {
                // Handle talk error error
                if (talkDeleteErr) {
                  return done(talkDeleteErr);
                }

                // Set assertions
                (talkDeleteRes.body._id).should.equal(talkSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Talk if not signed in', function (done) {
    // Set Talk user
    talk.user = user;

    // Create new Talk model instance
    var talkObj = new Talk(talk);

    // Save the Talk
    talkObj.save(function () {
      // Try deleting Talk
      request(app).delete('/api/talks/' + talkObj._id)
        .expect(403)
        .end(function (talkDeleteErr, talkDeleteRes) {
          // Set message assertion
          (talkDeleteRes.body.message).should.match('User is not authorized');

          // Handle Talk error error
          done(talkDeleteErr);
        });

    });
  });

  it('should be able to get a single Talk that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Talk
          agent.post('/api/talks')
            .send(talk)
            .expect(200)
            .end(function (talkSaveErr, talkSaveRes) {
              // Handle Talk save error
              if (talkSaveErr) {
                return done(talkSaveErr);
              }

              // Set assertions on new Talk
              (talkSaveRes.body.name).should.equal(talk.name);
              should.exist(talkSaveRes.body.user);
              should.equal(talkSaveRes.body.user._id, orphanId);

              // force the Talk to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Talk
                    agent.get('/api/talks/' + talkSaveRes.body._id)
                      .expect(200)
                      .end(function (talkInfoErr, talkInfoRes) {
                        // Handle Talk error
                        if (talkInfoErr) {
                          return done(talkInfoErr);
                        }

                        // Set assertions
                        (talkInfoRes.body._id).should.equal(talkSaveRes.body._id);
                        (talkInfoRes.body.name).should.equal(talk.name);
                        should.equal(talkInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Talk.remove().exec(done);
    });
  });
});
