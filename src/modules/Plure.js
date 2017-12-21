const ytdl = require('ytdl-core');

/**
 * Poltergeist Plure.
 * Playing music from YouTube.
 */

class Plure {
    constructor(botInstance) {
        this.father = botInstance;
        this.streamOptions = {
            seek: 0,
            volume: 0.1,
            bitrate: 64000
        };
        this.mainTrack = 'https://www.youtube.com/watch?v=tmq6u_hRIsU';
        this.currentTrack = 'https://www.youtube.com/watch?v=tmq6u_hRIsU';
        this.stream = null;
        this.dispatcher = null;
    }

    play(song) {
        if (ytdl.validateURL(song)) {
            this.currentTrack = song;
        } else {
            this.currentTrack = this.mainTrack;
        }
        
        if (this.currentTrack) {
            this.stream = ytdl(this.currentTrack, {filter: 'audio'});
            this.dispatcher = this.father.bot.voiceConnections.first().playStream(this.stream, this.streamOptions);
        }
    }

    /**
     * Pause music broadcasting.
     */
    pause() {
        if (this.dispatcher) {
            this.dispatcher.pause();
        }
    }

    time() {
        console.log('TIME: ');
        console.log(this.dispatcher.time);
    }

    /**
     * Resume music broadcasting.
     */
    resume() {
        if (this.dispatcher && this.dispatcher.paused) {
            this.dispatcher.resume();
        }
    }
}

module.exports.Plure = Plure;