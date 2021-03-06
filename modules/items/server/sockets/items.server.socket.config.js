'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  amqp = require('amqplib/callback_api'),
  Items = require('../controllers/items.server.controller');

var temp = {};
var tempConn, tempCh;

var emitToSockets = function(sockets, key, msg) {
  var i = 0;
  for (i = 0; i < sockets.length; i++) {
    sockets[i].emit(key, msg.content.toString());
    console.log(sockets[i].id);
  }
};

var removeObj = function(arr, obj) {
  var i = 0;
  for (i = 0; i < arr.length; i++) {
    if (arr[i].id === obj.id) {
      arr.splice(i, 1);
      console.log('socket removed from temp');
      break;
    }
  }
};

var removeSocketFromTemp = function(socket) {
  var arr = Object.keys(temp);
  var found = false;
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < temp[arr[i]].sockets.length; j++) {
      if (temp[arr[i]].sockets[j].id === socket.id) {
        temp[arr[i]].sockets.splice(j, 1);
        console.log('socket removed from temp');
        return arr[i];
      }
    }
  }
};

// Create the chat configuration
module.exports = function (io, socket) {

  socket.on('loadData', function (arg) {
    console.log(socket.id);
    var key = arg.itemId;
    if (tempConn && tempCh) {
      if (temp[key]) {
        temp[key].count++;
        temp[key].sockets.push(socket);
      } else {
        var ex = 'topic_logs';
        tempCh.assertQueue('', { exclusive: true }, function(err, q) {

          tempCh.bindQueue(q.queue, ex, key);
          temp[key] = {};
          temp[key].q = q;
          temp[key].sockets = [];
          temp[key].sockets.push(socket);
          temp[key].count = 1;

          tempCh.consume(q.queue, function(msg) {
            if (msg) {
              emitToSockets(temp[key].sockets, key, msg);
            }
          }, { noAck: true });
        });
      }
    } else if (tempConn && !tempCh) {
      tempConn.createChannel(function(err, ch) {
        tempCh = ch;
        var ex = 'topic_logs';

        ch.assertExchange(ex, 'topic', { durable: false });

        ch.assertQueue('', { exclusive: true }, function(err, q) {

          ch.bindQueue(q.queue, ex, key);
          temp[key] = {};
          temp[key].q = q;
          temp[key].sockets = [];
          temp[key].sockets.push(socket);
          temp[key].count = 1;

          ch.consume(q.queue, function(msg) {
            if (msg) {
              emitToSockets(temp[key].sockets, key, msg);
            }
          }, { noAck: true });
        });
      });
    } else {
      amqp.connect(config.broker.uri, function(err, conn) {
        console.log('broker connected');
        tempConn = conn;
        conn.createChannel(function(err, ch) {
          tempCh = ch;
          var ex = 'topic_logs';

          ch.assertExchange(ex, 'topic', { durable: false });

          ch.assertQueue('', { exclusive: true }, function(err, q) {

            ch.bindQueue(q.queue, ex, key);
            temp[key] = {};
            temp[key].q = q;
            temp[key].sockets = [];
            temp[key].sockets.push(socket);
            temp[key].count = 1;

            ch.consume(q.queue, function(msg) {
              if (msg) {
                emitToSockets(temp[key].sockets, key, msg);
              }
            }, { noAck: true });
          });
        });
      });
    }
  });

  socket.on('destroyConn', function(key) {
    console.log('comes here 1');
    if (temp[key]) {
      console.log('comes here 2');
      temp[key].count--;
      removeObj(temp[key].sockets, socket);
      if (temp[key].count > 0) {
        socket.disconnect(true);
        console.log('Client Count: ' + io.engine.clientsCount);
      } else {
        tempCh.deleteQueue(temp[key].q.queue, function(err, ok) {});
        console.log('queue deleted');
        delete temp[key];
        if (Object.keys(temp).length === 0) {
          tempConn.close();
          console.log('broker disconnected');
          tempCh = undefined;
          tempConn = undefined;
        }
        socket.disconnect(true);
        console.log('Client Count: ' + io.engine.clientsCount);
      }
    }
  });

  socket.on('debugEvent', function(arg) {
    console.log('Debug event fired');
    console.log(arg);
  });

  socket.on('disconnect', function () {
    console.log('In cb of disconnect event');
    var key = removeSocketFromTemp(socket);
    if (key) {
      console.log('comes here 1');
      if (temp[key]) {
        console.log('comes here 2');
        temp[key].count--;
        if (temp[key].count > 0) {
          console.log('Client Count: ' + io.engine.clientsCount);
        } else {
          tempCh.deleteQueue(temp[key].q.queue, function(err, ok) {});
          console.log('queue deleted');
          delete temp[key];
          console.log('Client Count: ' + io.engine.clientsCount);
        }
      }
    }
    console.log('Socket conn disconnected: ' + socket.id);
  });

  socket.on('ping', function() {
    setTimeout(function() {
      socket.emit('pong');
    }, 8000);
  });

  socket.on('reconnect', function () {
    console.log('Socket conn reconnected');
  });
};