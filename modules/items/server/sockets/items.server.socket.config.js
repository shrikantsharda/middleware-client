'use strict';

var Items = require('../controllers/items.server.controller');

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
  socket.on('testEventSend', function (arg) {
    // console.log(arg);
    var temp = Items.loadData(arg);

    // Emit the 'chatMessage' event
    io.emit(arg, temp);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function () {
    // io.emit('chatMessage', {
    //   type: 'status',
    //   text: 'disconnected',
    //   created: Date.now(),
    //   profileImageURL: socket.request.user.profileImageURL,
    //   username: socket.request.user.username
    // });
  });
};