'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  amqp = require('amqplib/callback_api');

exports.searchItem = function(req, res) {
  var request = require('request');
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
      if (body.items && body.items.length === 1) {
        res.jsonp(body.items[0]);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.send(err);
    }
  });
};
