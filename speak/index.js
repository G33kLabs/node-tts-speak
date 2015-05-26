'use strict';

var _ = require('lodash'),
    Logger = require('g33k-logger'),
    fs = require('fs-extra'),
    lame = require('lame'),
    Speaker = require('speaker'),
    mpg123Util = require('node-mpg123-util');

// Create a logger
var log = null;

// Instanciate Class
var speak = function(options) {
    var self = this;

    // Set defaults
    self.opts = _.extend({
        volume: 80,
        loglevel: 0
    }, options);

    // Extends core with logger
    log = Logger.builder('[tts-speak-speaker]', self.opts.loglevel);

    // Log message
    log.info('Instanciate speaker')

};

// Play an audio file throw mpg123
speak.prototype.exec = function(file, next) {
    var self = this;

    // Trace logs
    log.debug("Play", [file].join(' '));

    // Apply correct volume
    var volume = self.opts.volume || 0;
    volume = Math.min(100, Math.max(0, volume));
    if ( volume > 1 && volume <= 100 ) volume = (volume/100).toFixed(2);

    // Instanciate decoder
    var decoder = new lame.Decoder();

    // Create a read stream from the audio file
    var stream = fs.createReadStream(file);

    // Clean last speaker instance then Create a shared instance of speaker in order to be kill-able
    if (self.speakerInstance) self.kill();
    self.speakerInstance = new Speaker();
    self.speakerInstance.on('close', function() {
        self.speakerInstance = null;
        process.nextTick(function() {
            next();
        });
    });
    self.speakerInstance.on('error', function() {
        log.debug('Speaker error : has probably been killed by yourself')
    });

    // Intercept decode stream and apply volume changes
    decoder.on('format', function() {
        mpg123Util.setVolume(decoder.mh, volume);
    });

    // Stream the PCM audio to speaker
    stream.pipe(decoder).pipe(self.speakerInstance);
};

// Kill the current instance in order to stop audio
speak.prototype.kill = function() {
    var self = this;
    if (self.speakerInstance) {
        log.trace('Kill audio player');
        self.speakerInstance.close();
    }
};

module.exports = speak;
