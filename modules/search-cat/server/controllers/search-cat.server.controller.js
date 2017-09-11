'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Search cat
 */
exports.create = function (req, res) {

};

/**
 * Show the current Search cat
 */
exports.read = function (req, res) {

};

/**
 * Update a Search cat
 */
exports.update = function (req, res) {

};

/**
 * Delete an Search cat
 */
exports.delete = function (req, res) {

};

/**
 * List of Search cats
 */
exports.list = function (req, res) {
  var request = require('request');
  // console.log(req.query);
  var options = {
    method: 'GET',
    uri: config.catServer.uri,
    qs: req.query,
    json: true,
    headers: {
      apikey : config.catServer.apikey,
      'Content-Type': 'application/json'
    }
  };
  request(options, function(err, response, body) {
    if (!err) {
      res.jsonp(body);
    } else {
      res.send(err);
    }
  });
};
