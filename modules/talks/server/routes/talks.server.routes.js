'use strict';

/**
 * Module dependencies
 */
var talksPolicy = require('../policies/talks.server.policy'),
  talks = require('../controllers/talks.server.controller');

module.exports = function(app) {
  // Talks Routes
  app.route('/api/talks').all(talksPolicy.isAllowed)
    .get(talks.list)
    .post(talks.create);

  app.route('/api/talks/:talkId').all(talksPolicy.isAllowed)
    .get(talks.read)
    .put(talks.update)
    .delete(talks.delete);

  // Finish by binding the Talk middleware
  app.param('talkId', talks.talkByID);
};
