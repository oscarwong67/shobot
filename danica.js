var Discord = require("discord.js");
var configFile = require("./config.json");
var najax = $ = require('najax');
var danica = new Discord.Client();
var key = configFile["mashape-key"];

danica.on("ready", function () {
	danica.user.setStatus("online", "Whale Simulator");
	console.log("Danica Bot Online");
});

danica.on("message", function (message) {
	var channel = message.channel;
		var voiceChannel = message.member.voiceChannel;
		if (message.content.toUpperCase() === "!DANICA") {
		voiceChannel.join().then(function (connection) {
			var random = Math.floor(Math.random() * 3 + 1);
			//change this directory, obviously
			connection.playFile("E:\\Users\\Oscar\\Coding\\Github\\danica-bot\\audio\\whale" + random + ".wav").on('end', function () {
				connection.disconnect();
			});
		});
	}
	else if (message.content.toUpperCase() === "!HOOPLA") {
		voiceChannel.join().then(function (connection) {
			connection.playFile("E:\\Users\\Oscar\\Coding\\Github\\danica-bot\\audio\\hoopla.wav").on('end', function () {
				connection.disconnect();
			});
		});
	}
	else if (message.content.toUpperCase() === "!NO") {
		voiceChannel.join().then(function (connection) {
			connection.playFile("E:\\Users\\Oscar\\Coding\\Github\\danica-bot\\audio\\noway.wav").on('end', function () {
				connection.disconnect();
			});
		});
	}
	else if (message.content.toUpperCase() === "!COINTOSS" || message.content.toUpperCase() === "!COINFLIP") {
		var flip = Math.floor(Math.random() * 2 + 1);
		if (flip === 1) {
			console.log("Tails");
			message.reply("tails!");
		}
		else {
			console.log("Heads");
			message.reply("heads!");
		}
	}
	else if (message.content.toUpperCase() === "!TEAMS") {

		var players = message.member.voiceChannel.members;
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
		message.reply("Team One is: " + teamOne + " and Team Two is: " + teamTwo);
	}
	else if (message.content.toUpperCase().substring(0, 3) === "!UD") {
		var word = message.content.substring(4);

		$.get({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-Mashape-memberization", key);
			},
			url: 'https://mashape-community-urban-dictionary.p.mashape.com/define?term=' + word,
			dataType: 'json',
			success: function (data) {
				var response = data.list[0].word + ": " + data.list[0].definition;
				message.reply(response);
			},
			error: function (err) {
				message.reply("No results found.")
			}
		});
	}
	else if (message.content.toUpperCase() === "!QUOTE" || message.content.toUpperCase() === "!QUOTES") {
		$.get({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-Mashape-memberization", "dv3Bof2fUcmshEWEVIxDJt8sLwbvp1VsjLIjsnozZaFq1avizw");
			},
			url: "https://andruxnet-random-famous-quotes.p.mashape.com/",
			dataType: 'json',
			success: function (data) {
				var response = data.quote + " -" + data.member;
				message.reply(response);
			},
			error: function (err) {
				message.reply("error.");
			}
		});
	}
});

danica.login(configFile.token);