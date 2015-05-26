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
        player: '/usr/bin/mpg321',
        playerOptions: {
            'mplayer': {
                stdin: true,
                volume: '-v'
            }
        },
        loglevel: 0
    }, options);


    // Find a player if no one defined explicitely
    if (self.opts.player) self.name = self.opts.player;

    // Extends core with logger
    _.extend(self, Logger.builder('[tts-speak-' + self.name + ']', self.opts.loglevel));

};

speak.prototype.exec = function(file, next) {
    var self = this;

    if (!self.opts.player) {
        return next('No suitable audio player could be found - exiting.');
    }

    self.trace(self.opts.player, [file].join(' '));

    fs.createReadStream(file)
        .pipe(new lame.Decoder())
        .on('format', function(format) {
            this.pipe(new Speaker(format));
        })
        .on('close', function() {
            console.error('done!');
        });

};

speak.prototype.kill = function() {
    var self = this;
    if (self.proc && (self.proc.exitCode === null)) {
        self.trace('Kill audio player');
        self.proc.kill('SIGTERM');
    }
};

module.exports = speak;
