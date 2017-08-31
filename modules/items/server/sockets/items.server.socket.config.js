'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  amqp = require('amqplib/callback_api'),
  Items = require('../controllers/items.server.controller');

var temp = {};

// Create the chat configuration
module.exports = function (io, socket) {
  // Emit the status event when a new socket client is connected
  // io.emit('chatMessage', {
  //   type: 'status',
  //   text: 'Is now connected',
  //   created: Date.now(),
  //   profileImageURL: socket.request.user.profileImageURL,
  //   username: socket.request.user.username
  // });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('loadData', function (arg) {
    console.log(socket.request.user);
    var key = arg.itemId;
    var tempUser = socket.request.user.username;
    var eventName = key + ':' + tempUser;
    temp[tempUser] = {};
    amqp.connect(config.broker.uri, function(err, conn) {
      console.log('broker connected');
      temp[tempUser].conn = conn;
      conn.createChannel(function(err, ch) {
        var ex = 'topic_logs';

        ch.assertExchange(ex, 'topic', { durable: false });

        ch.assertQueue('', { exclusive: true }, function(err, q) {
          // console.log(' [*] Waiting for logs. To exit press CTRL+C');

          ch.bindQueue(q.queue, ex, key);

          ch.consume(q.queue, function(msg) {
            io.emit(eventName, msg.content.toString());
            // console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          }, { noAck: true });
        });
      });
    });
    // var temp = Items.loadData(arg);
  });

  socket.on('destroyConn', function(username) {
    if (temp[username] && temp[username].conn) {
      temp[username].conn.close();
      delete temp[username];
      console.log('broker disconnected');
    }
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    // console.log('Socket conn closed');
  });
};