/**
 * Command script
 * @constructor
 */
const readYaml = require('read-yaml');

class Command {
   constructor(botInstance) {
       this.father = botInstance;
       this.pemTags = {};
       this.pemList = {};
       readYaml('./pemtags.yml', (err, data) => {
           console.log('[Command] Loading pemtags.yml');
           this.pemTags = data;
           console.log(this.pemTags);
       });
       readYaml('./permissions.yml', (err, data) => {
          console.log('[Command] Loading permissions.yml');
          this.pemList = data;
          console.log(this.pemList);
       });
   }

   runCommand(initiator, command, msg, args) {
       if (!args) args = [];
       let group = this.getPermissions(initiator) || 'default';
       group = this.pemList[group];

       // Get permissions
       let groupPermissions = group.permissions;
       if (group.inheritance) {
           group.inheritance.forEach((parent) => {
               groupPermissions = groupPermissions.concat(this.pemList[parent].permissions);
           });
       }

       // Check this command for available
       if (!this[command]) {
           return {error: 'Can\'t find this command.'};
       }

       //Check this command for permissions
       if (groupPermissions.indexOf(command) < 0) {
           return {error: 'You don\'t have permission for this command.'};
       }

       if (this[command]) {
           args.unshift(initiator);
           args.unshift(msg);
           return this[command].apply(this, args);
       }

   }

   /* Command Handlers */

    /**
     * Tell bot to join your voice channel.
     * @param msg
     * @returns {Promise<"discord.js".VoiceConnection>}
     */
   join(msg, initiator) {
       let voiceChannel = msg.member.voiceChannel;
       if (voiceChannel) {
           voiceChannel.join();
           return {done: ':thumbsup: Joining your voice channel.'};
       } else {
           return {error: 'Can\'t join to Your voice channel.'};
       }
   }

    /**
     * Disconnect from voice channel.
     * @param msg
     */
   disconnect(msg) {
       if (this.father.bot.voiceConnections.first()) {
           this.father.plure.stop();
           this.father.bot.voiceConnections.first().disconnect();
       }
   }

    /**
     * Plure Commands.
     */
   play(msg, initiator, song) {
       let res = this.father.plure.play(song);
       if (res) {
           return {done: ':musical_note: Starting music broadcasting.'};
       } else {
           return {error: 'Can\'t start music broadcasting.'};
       }
   }

   pause(msg, initiator) {
       this.father.plure.pause();
   }

   resume(msg, initiator) {
       this.father.plure.resume();
   }

    volume(msg, initiator, volume) {
        this.father.plure.setVolume(volume);
    }

    /**
     * Handler to get user permissions.
     * @param tag
     * @returns {string}
     */
   getPermissions(tag) {
       for( let pem in this.pemTags ) {
           if (this.pemTags[pem].indexOf(tag) >= 0) {
               return pem;
           }
       }
   }
}

module.exports.Command = Command;