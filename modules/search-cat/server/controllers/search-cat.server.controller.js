'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  request = require('request'),
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

exports.getTags = function(req, res) {
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
      // console.log(body.items.length);
      var tagsSet = new Set();
      for (var i = 0; i < body.items.length; i++) {
        for (var j = 0; j < body.items[i].tags.length; j++) {
          tagsSet.add(body.items[i].tags[j]);
        }
      }
      var resArr = Array.from(tagsSet);
      // console.log(resArr);
      res.send(resArr);
      // res.jsonp(body);
    } else {
      res.send(err);
    }
  });
};

exports.searchByTag = function(req, res) {
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
