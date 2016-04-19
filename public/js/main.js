var socket = io();
var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people",
    "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
    "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
    "land", "home", "hand", "house", "picture", "animal", "mother", "father",
    "brother", "sister", "world", "head", "page", "country", "question",
    "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
    "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
    "west", "child", "children", "example", "paper", "music", "river", "car",
    "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
    "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
    "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
    "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
    "space"
];
var word = '';

var pictionary = function() {
	var canvas, context;
	var drawing, guessBox, drawer;

	// Receive user's id from server and then
	// check to see if they are first to connect.
	// If they are, they are the drawer.
	var setDrawer = function(user) {
		var sockID = '/#' + socket.id;
		if (user == sockID) {
			drawer = true;
			if (word == '') {
				word = WORDS[Math.floor(Math.random()*WORDS.length)];
				addWord(word);
			}
			console.log('drawer is: ', drawer);
			console.log('word is:', word);
		}
	};

	// If user is first in they are the drawer
	socket.on('setDrawer', setDrawer);

	// Check for enter key, then send guess to server
	// and clear the guessBox
	var onKeyDown = function(event) {
		if (event.keyCode != 13) {
			return;
		}
		socket.emit('guess', guessBox.val());
		guessBox.val('');
	};

	// Add the guesses to the UI of each user
	var addGuess = function(guess) {
		$('#guesses').text(guess);
		if (guess == word) {
			console.log("RIGHT!!");
			socket.emit('solved', word);
		}
	};

	var showSolved = function(word) {
		$('#guesses').addClass('winner');
	};

	// Add the word to be guessed to the drawer's UI
	var addWord = function(word) {
		$('#word').text(word);
	};

	guessBox = $('#guess input');
	guessBox.on('keydown', onKeyDown);

	socket.on('guess', addGuess);
	socket.on('solved', showSolved);

	// Actual drawing functionality for the canvas
	var draw = function(position) {
		context.beginPath();
		context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
		context.fill();
	};

	canvas = $('canvas');
	context = canvas[0].getContext('2d');
	canvas[0].width = canvas[0].offsetWidth;
	canvas[0].height = canvas[0].offsetHeight;

	canvas.on('mousedown', function() {
		drawing = true;
	});

	canvas.on('mouseup', function() {
		drawing = false;
	});

	canvas.on('mousemove', function(event) {
		var offset = canvas.offset();
		var position = {
			x: event.pageX - offset.left,
			y: event.pageY - offset.top
		};

		if (drawing && drawer) {
			draw(position);

			socket.emit('draw', position);
		}
		socket.on('draw', draw);
	});

};

$(document).ready(function() {
	
	pictionary();

});