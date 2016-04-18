var socket = io();

var pictionary = function() {
	var canvas, context;
	var drawing, guessBox;

	var onKeyDown = function(event) {
		if (event.keyCode != 13) {
			return;
		}

		socket.emit('guess', guessBox.val());
		//console.log(guessBox.val());
		guessBox.val('');
	};

	var addGuess = function(guess) {
		$('#guesses').html("<p>" + guess + "</p>");
		console.log(guess);
	};

	guessBox = $('#guess input');
	guessBox.on('keydown', onKeyDown);

	socket.on('guess', addGuess);

	var draw = function(position) {
		context.beginPath();
		context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
		context.fill();
	};

	canvas = $('canvas');
	context = canvas[0].getContext('2d');
	canvas[0].width = canvas[0].offsetWidth;
	canvas[0].height = canvas[0].offsetHeight;

	// If mouse is held down run the mousemove code

	canvas.on('mousedown', function() {
		drawing = true;
		//console.log(drawing);
	});

	canvas.on('mouseup', function() {
		drawing = false;
		//console.log(drawing);
	});

	canvas.on('mousemove', function(event) {
		var offset = canvas.offset();
		var position = {
			x: event.pageX - offset.left,
			y: event.pageY - offset.top
		};

		if (drawing) {
			draw(position);

			socket.emit('draw', position);
			socket.on('draw', draw);
		}
	});

};

$(document).ready(function() {
	
	pictionary();

});