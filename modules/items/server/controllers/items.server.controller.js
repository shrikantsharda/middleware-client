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

exports.loadData = function (arg) {
  // var request = require('request');
  // var options = {
  //   method: 'GET',
  //   uri: config.broker.uri + '?name=' + config.broker.queue,
  //   // qs: {
  //   //   name: config.broker.queue
  //   // },
  //   //json: true,
  //   headers: {
  //     apikey : config.broker.apikey,
  //   }
  // };
  // console.log('body');
  // request(options, function(err, response, body) {
  //   if (!err) {
  //     res.send(body);
  //     console.log(body);
  //   } else {
  //     res.send(err);
  //   }
  // });

  // amqp.connect('amqp://localhost', function(err, conn) {
  //   conn.createChannel(function(err, ch) {
  //     var ex = 'topic_logs';

  //     ch.assertExchange(ex, 'topic', {durable: false});

  //     ch.on('HiThere', function() {
  //       console.log('It works!');
  //     });

  //     ch.assertQueue('', {exclusive: true}, function(err, q) {
  //       console.log(' [*] Waiting for logs. To exit press CTRL+C');

  //       ch.bindQueue(q.queue, ex, 'test.key');

  //       ch.consume(q.queue, function(msg) {
  //         ch.emit('HiThere');
  //         console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
  //       }, {noAck: true});
  //     });
  //   });
  // });

  console.log('Controller receives arg for ' + arg);
  return 'Controller receives arg for ' + arg;
  
};
