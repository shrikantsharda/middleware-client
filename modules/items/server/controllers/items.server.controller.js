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
 * Create a Item
 */
exports.create = function (req, res) {

};

/**
 * Show the current Item
 */
exports.read = function (req, res) {

};

/**
 * Update a Item
 */
exports.update = function (req, res) {

};

/**
 * Delete an Item
 */
exports.delete = function (req, res) {

};

/**
 * List of Items
 */
exports.list = function (req, res) {

};

exports.loadData = function (req, res) {
  var request = require('request');
  var options = {
    method: 'GET',
    uri: config.broker.uri + '?name=' + config.broker.queue,
    // qs: {
    //   name: config.broker.queue
    // },
    //json: true,
    headers: {
      apikey : config.broker.apikey,
    }
  };
  request(options, function(err, response, body) {
    if (!err) {
      res.send(body);
      console.log(body);
    } else {
      res.send(err);
    }
  });
};
