var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));
//app.use(express.static('public/js'));

var server = http.Server(app);
var io = socket_io(server);

var userList = [];

io.on('connect', function(socket) {

	userList.push(socket.id);
	io.emit('setDrawer', userList[0]);
	console.log(userList);

	socket.on('disconnect', function() {
		console.log(socket.id, "disconnected from game.");
		for (var i = 0; i < userList.length; i++) {
			if (userList[i] == socket.id) {
				console.log('removing user', userList[i]);
				userList.splice(i, 1);
				console.log('removed user', userList);
			}
		}
		io.emit('setDrawer', userList[0]);
	});

	socket.on('draw', function(position) {
		socket.broadcast.emit('draw', position);
	});

	socket.on('guess', function(guessBox) {
		io.emit('guess', guessBox);
	});

	socket.on('solved', function(word) {
		io.emit('solved', word);
	});
	
});

/// - testing

server.listen(8080);
