var Discord = require("discord.js");
var configFile = require("./config.json");
var najax = $ = require('najax');
var danica = new Discord.Client();
var key = configFile["mashape-key"];

danica.on("ready", function () {
	danica.setStatus("online", "Whale Simulator");
});

danica.on("message", function (message) {

	if (message.content.toUpperCase() === "!DANICA") {
		danica.joinVoiceChannel(message.sender.voiceChannel, function (error, connection) {
			var random = Math.floor(Math.random() * 3 + 1);

			//change this directory, obviously
			connection.playFile("E:\\Users\\Oscar\\Coding\\Github\\danica-bot\\audio\\whale" + random + ".wav", function (error, intent) {
				intent.on("end", function () {
					danica.leaveVoiceChannel(message.sender.voiceChannel);
				});
			});
		});
	}
	else if (message.content.toUpperCase() === "!COINTOSS" || message.content.toUpperCase() === "!COINFLIP") {
		var flip = Math.floor(Math.random() * 2 + 1);
		if (flip === 1)
			danica.reply(message, "tails!");
		else
			danica.reply(message, "heads!");
	}
	else if (message.content.toUpperCase() === "!TEAMS") {
		var players = message.sender.voiceChannel.members;
		var teamOne = [];
		var teamTwo = [];
		var teamOneSize = (players.length / 2) - 1;
		var teamTwoPlayerOne = teamOneSize + 1;
		var numbers = [];
		var i = 0;
		var x = 1;

		while (numbers.length < players.length) {
			var randomNum = Math.floor(Math.random() * (players.length));
			if (numbers.indexOf(randomNum) === -1) {
				numbers.push(randomNum);
			}
		}
		while (teamOne.length < (players.length / 2)) {
			teamOne.push(" " + players[numbers[i]].username);
			if (players[numbers[x]] !== undefined)
				teamTwo.push(" " + players[numbers[x]].username);
			i += 2;
			x += 2;
		}
		danica.reply(message, "Team One is: " + teamOne + " and Team Two is: " + teamTwo);
	}
	else if (message.content.toUpperCase() === "!HOOPLA") {
		danica.joinVoiceChannel(message.sender.voiceChannel, function (error, connection) {
			connection.playFile("E:\\Users\\Oscar\\Coding\\Github\\danica-bot\\audio\\hoopla.wav", function (error, intent) {
				intent.on("end", function () {
					danica.leaveVoiceChannel(message.sender.voiceChannel);
				});
			});
		});
	}
	else if (message.content.toUpperCase() === "!NO") {
  	danica.joinVoiceChannel(message.sender.voiceChannel, function (error, connection) {
			connection.playFile("E:\\Users\\Oscar\\Coding\\Github\\danica-bot\\audio\\noway.wav", function (error, intent) {
				intent.on("end", function () {
					danica.leaveVoiceChannel(message.sender.voiceChannel);
				});
			});
		});
	}
	else if (message.content.toUpperCase().substring(0, 3) === "!UD") {
		var word = message.content.substring(4);

		$.get({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", key);
			},
			url: 'https://mashape-community-urban-dictionary.p.mashape.com/define?term=' + word,
			dataType: 'json',
			success: function (data) {
				var response = data.list[0].word + ": " + data.list[0].definition;
				danica.reply(message, response);
			},
			error: function (err) {
				danica.reply(message, "No results found.")
			}
		});
	}
	else if (message.content.toUpperCase() === "!QUOTE" || message.content.toUpperCase() === "!QUOTES") {
		$.get({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "dv3Bof2fUcmshEWEVIxDJt8sLwbvp1VsjLIjsnozZaFq1avizw");
			},
			url: "https://andruxnet-random-famous-quotes.p.mashape.com/",
			dataType: 'json',
			success: function (data) {
				var response = data.quote + " -" + data.author;
				danica.reply(message, response);
			},
			error: function(err) {
				danica.reply(message, "error.");
			}
		});
	}
});

danica.loginWithToken(configFile.token);