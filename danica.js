var Discord = require("discord.js");
var configFile = require("./config.json");
var najax = $ = require('najax');
var danica = new Discord.Client();
var key = configFile["mashape-key"];
var audioPath = configFile["audio-path"];
var noFortnite = configFile["user-that-cant-say-fortnite"]

danica.on("ready", function () {
	danica.user.setStatus("online", "Whale Simulator");
	console.log("Danica Bot Online");
});

//todo: update to es6 code, add a help command, add a define a word command
danica.on("message", function (message) {
	var channel = message.channel;
	var voiceChannel = message.member.voiceChannel;
	if (message.content.toUpperCase() === "!DANICA") {
		voiceChannel.join().then(function (connection) {
			var random = Math.floor(Math.random() * 3 + 1);
			//change this directory, obviously
			connection.playFile(audioPath + "whale" + random + ".wav").on('end', function () {
				connection.disconnect();
			});
		});
		voiceChannel.join().catch(function(error) {
			message.reply("oops, error");
			console.log(error);
		})
	}
	else if (message.content.toUpperCase() === "!HOOPLA") {
		voiceChannel.join().then(function (connection) {
			connection.playFile(audioPath + "hoopla.wav").on('end', function () {
				connection.disconnect();
			});
		});
		voiceChannel.join().catch(function(error) {
			message.reply("oops, error");
		})
	}
	else if (message.content.toUpperCase() === "!NO") {
		voiceChannel.join().then(function (connection) {
			connection.playFile(audioPath + "noway.wav").on('end', function () {
				connection.disconnect();
			});
		});
		voiceChannel.join().catch(function(error) {
			message.reply("oops, error");
		})
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
		var playerUsers = message.member.voiceChannel.members.array();
		var players = [];
		playerUsers = playerUsers.map(function (value, index) {
			players.push(value.user.username);
		});
		console.log(players);
		var teamOne = [];
		var teamTwo = [];

		if (playerUsers.length % 2 === 0) {
			teamSize = players.length / 2;
		}
		else {
			var temp = players.length + 1;
			teamSize = temp / 2;
		}

		var randomPlayerNumbers = [];
		//each player in list is assigned a random number
		while (randomPlayerNumbers.length < players.length) {
			//get randomNum
			var randomNum = Math.floor(Math.random() * (players.length));
			if (randomPlayerNumbers.indexOf(randomNum) === -1) {
				randomPlayerNumbers.push(randomNum);
			}
		}

		var teamOneCounter = 0;
		var teamTwoCounter = 1;
		//add players to team, using the array of random numbers as their indices, adding every second player two a team
		//randomPlayerNumbers[teamOneCounter] means using the first number in the list of randoms as the index, then the second for team two, etc.
		while (teamOne.length < (teamSize)) {
			teamOne.push(" " + players[randomPlayerNumbers[teamOneCounter]]); //push first player according to random number list, then third, etc,
			if (players[randomPlayerNumbers[teamTwoCounter]] !== undefined)
				teamTwo.push(" " + players[randomPlayerNumbers[teamTwoCounter]]); //push second player, fourth, etc
			else if (players[randomPlayerNumbers[teamTwoCounter]] === undefined)
				teamTwo.push(" one more person (teams aren't even)");	//if teams are uneven
			teamOneCounter += 2; //all players of even index, including zero
			teamTwoCounter += 2;	//all players of odd index
		}
		console.log(teamOne);
		message.reply("Team One is:" + teamOne + " and Team Two is:" + teamTwo);
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
				message.reply(response);
			},
			error: function (err) {
				message.reply("No results found, or an error. I dunno.")
				console.log(err);
			}
		});
	}
	else if (message.content.toUpperCase() === "!QUOTE" || message.content.toUpperCase() === "!QUOTES") {
		$.get({
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", key);
			},
			url: "https://andruxnet-random-famous-quotes.p.mashape.com/",
			dataType: 'json',
			success: function (data) {
				var response = data.quote + " -" + data.author;
				message.reply(response);
			},
			error: function (err) {
				message.reply("Sorry, there was an error.");
				console.log(err);
			}
		});
	}
	//feature put in to troll one of my friends	
	else if (message.content.toUpperCase().includes("FORTNITE") && message.author.tag == noFortnite) {
		message.delete();
	}
});

danica.login(configFile.token);