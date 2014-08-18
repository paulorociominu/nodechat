//nodechat
//A simple chat app using express and angular

var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Creates a complete router for static files on a folder
app.use(express.static(path.resolve(__dirname, 'client')));

//Collections
var messages = [];
var sockets = [];

io.on('connection', function (socket) {
  console.log('new user conected...');

  //Add socket to collection
  sockets.push(socket);

  //Emit all previous messages to the socket
  messages.forEach(function (data) {
    socket.emit('message', data);
  });

  //Listen to new message event from socket
  socket.on('message', function (msg) {
    var text = String(msg || '');

    if (!text)
      return;

    var data = {
      name: socket.name,
      text: text
    };

    io.emit('message', data);
    messages.push(data);
  });

  //Listen to user name change
  socket.on('identify', function (name) {
    socket.name = name ? name : 'Anonymous';
    updateRoster();
  });

  //Listen to user disconnect
  socket.on('disconnect', function(){
    console.log('user disconnected...');
    var index = sockets.indexOf(socket);
    sockets.splice(index, 1);
    updateRoster();
  });
});

function updateRoster() {
  names = [];
  sockets.forEach(function(socket){
    names.push(socket.name);
  });
  io.emit('roster', names);
}

module.exports = http;
