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
    console.log(socket.id);
    var key = arg.itemId;
    temp[socket.id] = {};
    amqp.connect(config.broker.uri, function(err, conn) {
      console.log('broker connected');
      temp[socket.id].conn = conn;
      conn.createChannel(function(err, ch) {
        var ex = 'topic_logs';

        ch.assertExchange(ex, 'topic', { durable: false });

        ch.assertQueue('', { exclusive: true }, function(err, q) {
          // console.log(' [*] Waiting for logs. To exit press CTRL+C');

          ch.bindQueue(q.queue, ex, key);

          ch.consume(q.queue, function(msg) {
            socket.emit(key, msg.content.toString());
            console.log(socket.id);
            // console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
          }, { noAck: true });
        });
      });
    });
  });

  socket.on('destroyConn', function(arg) {
    if (temp[socket.id] && temp[socket.id].conn) {
      temp[socket.id].conn.close();
      delete temp[socket.id];
      console.log('broker disconnected');
    }
  });

  socket.on('debugEvent', function(arg) {
    console.log('Debug event fired');
    console.log(arg);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    console.log('Socket conn disconnected' + socket.id);
    if (temp[socket.id] && temp[socket.id].conn) {
      temp[socket.id].conn.close();
      delete temp[socket.id];
      console.log('broker disconnected');
    }
    socket.emit('SocketClosed');
  });

  socket.on('reconnect', function () {
    console.log('Socket conn reconnected');
  });

  socket.on('connect', function () {
    console.log('Socket conn connected' + socket.id);
  });
};