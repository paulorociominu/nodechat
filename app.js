//nodechat
//A simple chat app using express, angular and async.

var path = require('path');
var async = require('async');
var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Collections
var messages = [];
var sockets = [];

//Creates a complete router for static files on a folder
app.use(express.static(path.resolve(__dirname, 'client')));