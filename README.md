# Shobot

A Discord Bot

Installation:
* Make sure you have node.js and ffmpeg installed and added to the PATH if you're on Windows.
* Install all dependencies by running
`npm install` while inside the project root.
* To start the bot, run `npm run start` while in the project root.

Note: Config.json is not included, but there is an example. 
* Get a token from http://discordapp.com/developers!
* You'll need to put this in .env
* This will let you generate a redirect URI, which lets you add the bot to servers.
* Include the directory where your audio files are
* You'll need to install FFMPEG and add it to the PATH (on windows)

Right now, Shobot just plays soundbites. @ (tag) Shobot, and then type in the name of a soundbite, like "@shobot consequences".
