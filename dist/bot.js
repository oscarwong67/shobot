"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
class Bot {
    constructor() {
        dotenv.config();
        this.client = new discord_js_1.Client();
    }
    start() {
        this.client.login(process.env.DISCORD_TOKEN);
        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}`);
            this.commandPrefix = `<@${this.client.user.id}>`;
            this.nicknameCommandPrefix = `<@!${this.client.user.id}>`;
            this.client.user.setPresence({
                activity: {
                    name: "@ me",
                    type: "PLAYING",
                    url: "https://oscarwong.me",
                },
            });
        });
        this.client.on("message", (message) => {
            this.handleMessage(message);
        });
        this.loadSoundBiteFilenames();
    }
    loadSoundBiteFilenames() {
        return __awaiter(this, void 0, void 0, function* () {
            const soundBiteFilenames = yield fs.promises.readdir(Bot.audioPath);
            this.soundBites = new Map();
            for (const filename of soundBiteFilenames) {
                this.soundBites.set(filename.split(".")[0], filename);
            }
            console.log(`Available soundbite files are: ${Array.from(this.soundBites.keys())}`);
        });
    }
    handleMessage(message) {
        const fullMessageContent = message.content.toLowerCase();
        // DEBUG
        // console.info(fullMessageContent, this.commandPrefix);
        //
        if (message.mentions.has(this.client.user) &&
            (fullMessageContent.startsWith(this.commandPrefix) ||
                fullMessageContent.startsWith(this.nicknameCommandPrefix))) {
            const messageContent = fullMessageContent.startsWith(this.commandPrefix) ?
                fullMessageContent.substring(this.commandPrefix.length) :
                fullMessageContent.substring(this.nicknameCommandPrefix.length);
            const soundBiteMatch = this.getSoundBiteMatch(messageContent);
            console.log(`Received Message: ${messageContent}`);
            if (soundBiteMatch) {
                try {
                    this.playAudioFile(message.member.voice.channel, soundBiteMatch);
                }
                catch (err) {
                    if (err.code === discord_js_1.Constants.APIErrors.MISSING_PERMISSIONS) {
                        message.reply('Please give me permissions to join voice channels and speak.');
                    }
                }
            }
            else {
                // TODO
            }
        }
    }
    getSoundBiteMatch(messageContent) {
        for (const soundBite of this.soundBites.keys()) {
            if (messageContent.includes(soundBite)) {
                return soundBite;
            }
        }
        return null;
    }
    playAudioFile(channel, soundbite) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!channel) {
                return;
            }
            try {
                const fullFilename = this.soundBites.get(soundbite);
                const connection = yield channel.join();
                const dispatcher = connection.play(fs.createReadStream(`${Bot.audioPath}/${fullFilename}`));
                dispatcher.on("finish", () => {
                    connection.disconnect();
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.Bot = Bot;
Bot.audioPath = path.join(__dirname, "../audio");
//# sourceMappingURL=bot.js.map