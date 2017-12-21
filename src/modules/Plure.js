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
        this.volumeUpdaterTime = null;
        this.playing = false;
    }

    play(song) {

        if (!this.father.bot.voiceConnections.first()) {
            return false;
        }

        if (song && ytdl.validateURL(song)) {
            this.currentTrack = song;
        } else {
            this.currentTrack = this.mainTrack;
        }
        // If stream already playing, just update composition
        if (this.stream && this.currentTrack) {
            this.volumeUpdaterTime = setInterval(() => { this.volumeDown(() => {this.updateStream();}); }, 200);
        }
        // Create new stream.
        if (this.currentTrack && !this.stream) {
            this.stream = ytdl(this.currentTrack);
            this.dispatcher = this.father.bot.voiceConnections.first().playStream(this.stream, this.streamOptions);
        }
        this.playing = true;

        return this.playing;
    }

    /**
     * Slow volume down to 0.
     */
    volumeDown(callback) {
        this.dispatcher.setVolume(this.dispatcher.volume - 0.02);
        if (this.dispatcher.volume <= 0) {
            clearInterval(this.volumeUpdaterTime);
            callback();
        }
    }

    /**
     * Update streaming song.
     */
    updateStream() {
        this.stream.destroy();
        this.dispatcher.end();
        setTimeout(() => {
            this.stream = ytdl(this.currentTrack);
            this.dispatcher = this.father.bot.voiceConnections.first().playStream(this.stream, this.streamOptions);
        }, 500);
    }

    /**
     * Pause music broadcasting.
     */
    pause() {
        this.volumeUpdaterTime = setInterval(() => {
            this.volumeDown(() => {
                if (this.dispatcher) {
                    this.dispatcher.pause();
                }
            });
        }, 200);
    }

    /**
     * Resume music broadcasting.
     */
    resume() {
        if (this.dispatcher && this.dispatcher.paused) {
            this.dispatcher.setVolume(this.streamOptions.volume);
            this.dispatcher.resume();
        }
    }

    /**
     * Stop music broadcasting.
     */
    stop() {
        this.stream.destroy();
        this.dispatcher.end();
    }

    /**
     * Set Plure volume
     * @param vol
     */
    setVolume(vol) {
        if (vol !== undefined) {
            if (vol < 0) {
                vol = 0;
            }
            if (vol > 1) {
                vol = 1;
            }
            this.dispatcher.setVolume(vol);
        }
    }
}

module.exports.Plure = Plure;