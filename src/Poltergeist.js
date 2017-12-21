const discord = require("discord.js");
const command = require('./Command');
const IChat = require('./Chat');
const IPlure = require('./modules/Plure');

const chat = new IChat.Chat();
const plure = new IPlure.Plure();


class Poltergeist {
    constructor() {
        this.bot = new discord.Client();
        this.cmd = new command.Command(this);
        this.plure = new IPlure.Plure(this);

        this.bot.on('ready', () => {
            console.log(`Poltergeist bot logged in as ${this.bot.user.tag}!`);
        });
        this.bot.on('message', (msg) => {
            let processedMessage = chat.processMessage(msg.author.tag, msg.content);
            if (processedMessage.command) {
                let result = this.cmd.runCommand(processedMessage.author, processedMessage.command, msg, processedMessage.args);
                if (result) {
                    if (result.done) {
                        msg.reply(result.done);
                    }
                    if (result.error) {
                        msg.reply(":no_entry: " + result.error);
                    }
                }
            }
        });
        this.bot.login("MzE5OTAwODU1MDczNzY3NDI1.DRvRDg.XDOmro4656-2EFTUAHucV5d8XaA");
    }
}
new Poltergeist();

module.exports.Poltergeist = Poltergeist;