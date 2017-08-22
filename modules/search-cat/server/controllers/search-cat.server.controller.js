'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
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
  var url = 'http://10.156.14.5:8001/cat';
  // console.log(req.query);
  var options = {
    method: 'GET',
    uri: 'http://10.156.14.5:8001/cat',
    qs: req.query,
    json: true,
    headers: {
      apikey : 'c70d6aabe879471985c0d06f04b7ae3a',
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
