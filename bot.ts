import {
  Client,
  Message,
  VoiceChannel,
  Constants
} from 'discord.js';
import * as fs from "fs";
import * as path from "path";
import * as dotenv from 'dotenv';

export class Bot {
  private static audioPath = path.join(__dirname, "../audio");
  private client: Client;
  private soundBites: Map<string, string>; // filename: filename with extension
  private commandPrefix: string;
  private nicknameCommandPrefix: string;

  constructor() {
    dotenv.config();
    this.client = new Client();
  }

  public start(): void {
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
    this.client.on("message", (message: Message) => {
      this.handleMessage(message);
    });
    this.loadSoundBiteFilenames();
  }

  private async loadSoundBiteFilenames(): Promise<void> {
    const soundBiteFilenames = await fs.promises.readdir(Bot.audioPath);
    this.soundBites = new Map<string, string>();
    for (const filename of soundBiteFilenames) {
      this.soundBites.set(filename.split(".")[0], filename);
    }
    console.log(
      `Available soundbite files are: ${Array.from(this.soundBites.keys())}`
    );
  }

  private handleMessage(message: Message): void {
    const fullMessageContent = message.content.toLowerCase();
    // DEBUG
    // console.info(fullMessageContent, this.commandPrefix);
    //
    if (
      message.mentions.has(this.client.user) &&
      (fullMessageContent.startsWith(this.commandPrefix) ||
        fullMessageContent.startsWith(this.nicknameCommandPrefix))
    ) {

      const messageContent = fullMessageContent.startsWith(this.commandPrefix) ?
                            fullMessageContent.substring(this.commandPrefix.length) :
                            fullMessageContent.substring(this.nicknameCommandPrefix.length);
      const soundBiteMatch = this.getSoundBiteMatch(messageContent);
      console.log(`Received Message: ${messageContent}`);
      if (soundBiteMatch) {
        try {
          this.playAudioFile(message.member.voice.channel, soundBiteMatch);
        } catch(err) {
          if (err.code === Constants.APIErrors.MISSING_PERMISSIONS) {
            message.reply('Please give me permissions to join voice channels and speak.');
          }
        }
      } else {
        // TODO
      }
    }
  }

  private getSoundBiteMatch(messageContent: string): string {    
    let matchingSoundBite = null;
    for (const soundBite of this.soundBites.keys()) {
      if (messageContent.includes(soundBite) && ((!matchingSoundBite) || soundBite.length > matchingSoundBite.length)) {
        matchingSoundBite = soundBite;
      }
    }
    return matchingSoundBite;
  }

  private async playAudioFile(
    channel: VoiceChannel,
    soundbite: string
  ): Promise<void> {
    if (!channel) {
      return;
    }
    try {
      const fullFilename = this.soundBites.get(soundbite);
      const connection = await channel.join();
      const dispatcher = connection.play(
        fs.createReadStream(`${Bot.audioPath}/${fullFilename}`)
      );

      dispatcher.on("finish", () => {
        connection.disconnect();
      });
    } catch(err) {
      throw err;
    }
  }
}