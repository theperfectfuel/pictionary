var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));
//app.use(express.static('public/js'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connect', function(socket) {

	socket.on('draw', function(position) {
		socket.broadcast.emit('draw', position);
	});

	socket.on('guess', function(guessBox) {
		io.emit('guess', guessBox);
	});
	
});

/// - testing

server.listen(8080);
