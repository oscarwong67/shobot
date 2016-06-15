var Discord = require("discord.js");
var configFile = require("./config.json");

var danica = new Discord.Client();

danica.on("ready", function() {
	danica.setStatus("online", "Whale Simulator");
});

danica.on("message", function(message) {

	var random = Math.floor(Math.random() * 3 + 1);

	if (message.content === "!danica") {
		danica.joinVoiceChannel(message.sender.voiceChannel, function(error, connection) {
			//change this directory, obviously
			connection.playFile("E:\\Users\\Oscar\\Coding\\Github\\danica-bot\\audio\\whale" + random + ".wav", function(error, intent) {
				intent.on("end", function() {
					danica.leaveVoiceChannel(message.sender.voiceChannel);
				});
			});
		});
	}
});

danica.loginWithToken(configFile.token);