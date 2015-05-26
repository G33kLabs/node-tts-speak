'use strict';
/* globals _: true */

var _ = require('lodash'),
    Logger = require('g33k-logger'),
    spawn = require('child_process').spawn;

var fs = require('fs-extra');
var lame = require('lame');
var Speaker = require('speaker');

var speak = function(options) {
    var self = this;

    // Expose engine name
    self.name = 'default';

    // Set defaults
    self.opts = _.extend({
        loglevel: 0
    }, options);

    // Extends core with logger
    _.extend(self, Logger.builder('[tts-speak-' + self.name + ']', self.opts.loglevel));

};

speak.prototype.exec = function(file, next) {
    var self = this;

    // Trace logs
    self.trace("Play", [file].join(' '));

    // Decode to PCM then read with Speaker
    fs.createReadStream(file)
        .pipe(new lame.Decoder())
        .on('format', function(format) {
            self.speakInstance = new Speaker(format);
            self.speakInstance.on('close', function() {
                self.speakInstance = null;
                next();
            });
            self.speakInstance.on('error', function(e) {

            });
            this.pipe(self.speakInstance);
        })
        .on('error', function(e) {
            console.log("Lame error :", e)
        });

};

speak.prototype.kill = function() {
    var self = this;
    if (self.speakInstance) {
        self.trace('Kill audio player');
        self.speakInstance.close();
    }
};

module.exports = speak;
