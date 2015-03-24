'use strict';
/* globals _: true */

var _ = require('lodash'),
    Logger = require('g33k-logger'),
    exec = require('child_process').execFile;

var speak = function(options) {
    var self = this;

    // Expose engine name
    self.name = 'default';

    // Set defaults
    self.opts = _.extend({
        playerList: [
            'mplayer',
            'afplay',
            'mpg123',
            'mpg321',
            'play'
        ],
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
    _.extend(self, Logger.builder('[tts-speak-'+self.name+']', self.opts.loglevel));

};

speak.prototype.exec = function(file, next) {
    var self = this;

    if (!self.opts.player) {
        return next('No suitable audio player could be found - exiting.');
    }
    
    console.log(self.opts.player, ['-af', 'volume=0', file].join(' ')); 

    self.proc = exec(self.opts.player, ['-af', 'volume=0', file], function(err) {
        if (_.isFunction(next)) next(err);
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
