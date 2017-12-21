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
       if (this[command]) {
           args.unshift(initiator);
           args.unshift(msg);
           return this[command].apply(this, args);
       } else {
           return {error: 'Can\'t find this command.'};
       }

       //Check this command for permissions
       if (groupPermissions.indexOf(command) < 0) {
           return {error: 'You don\'t have permission for this command.'};
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
           return voiceChannel.join();
       }
       return false;
   }

   play(msg, initiator, song) {
       this.father.plure.play(song);
   }

   pause(msg, initiator) {
       this.father.plure.pause();
   }

   resume(msg, initiator) {
       this.father.plure.resume();
   }

   time(msg, initiator) {
       this.father.plure.time();
   }

   getPermissions(tag) {
       for( let pem in this.pemTags ) {
           if (this.pemTags[pem].indexOf(tag) >= 0) {
               return pem;
           }
       }
   }
}

module.exports.Command = Command;