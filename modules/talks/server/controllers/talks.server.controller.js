'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Talk = mongoose.model('Talk'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Talk
 */
exports.create = function(req, res) {
  var talk = new Talk(req.body);
  talk.user = req.user;

  talk.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(talk);
    }
  });
};

/**
 * Show the current Talk
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var talk = req.talk ? req.talk.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  talk.isCurrentUserOwner = req.user && talk.user && talk.user._id.toString() === req.user._id.toString();

  res.jsonp(talk);
};

/**
 * Update a Talk
 */
exports.update = function(req, res) {
  var talk = req.talk;

  talk = _.extend(talk, req.body);

  talk.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(talk);
    }
  });
};

/**
 * Delete an Talk
 */
exports.delete = function(req, res) {
  var talk = req.talk;

  talk.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(talk);
    }
  });
};

/**
 * List of Talks
 */
exports.list = function(req, res) {
  Talk.find().sort('-created').populate('user', 'displayName').exec(function(err, talks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(talks);
    }
  });
};

/**
 * Talk middleware
 */
exports.talkByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Talk is invalid'
    });
  }

  Talk.findById(id).populate('user', 'displayName').exec(function (err, talk) {
    if (err) {
      return next(err);
    } else if (!talk) {
      return res.status(404).send({
        message: 'No Talk with that identifier has been found'
      });
    }
    req.talk = talk;
    next();
  });
};
