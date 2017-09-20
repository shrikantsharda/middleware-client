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
 * List of Search cats
 */
exports.list = function (req, res) {
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
      var tagsSet = new Set();
      for (var i = 0; i < body.items.length; i++) {
        for (var j = 0; j < body.items[i].tags.length; j++) {
          tagsSet.add(body.items[i].tags[j]);
        }
      }
      var resArr = Array.from(tagsSet);
      res.send(resArr);
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
