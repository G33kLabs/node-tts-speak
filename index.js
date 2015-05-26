'use strict';
/* globals _: true */
var fs = require('fs-extra'),
    Logger = require('g33k-logger'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    Speak = require('./speak'),
    _ = require('lodash');


var Core = function(options) {
    var self = this;

    // Bind as an EventEmitter
    EventEmitter.call(self);

    // Defaults
    this.opts = _.extend({
        tts: {
            engine: 'espeak',
            lang: 'en-us',
            speed: 0,
            cache: false
        },
        speak: {
            volume: 100
        },
        loglevel: 0
    }, options);

    // Extends core with logger
    _.extend(self, Logger.builder('[tts-speak]', self.opts.loglevel));

    // Init the queue
    self.queue = [];

    /////////////////////////////
    // Load TTS engine
    self.trace('Detect tts engine...');
    var tts_engine = self.opts.tts;
    var tts_engine_name = _.isObject(tts_engine.engine) ? tts_engine.engine.name : tts_engine.engine;
    var tts_engine_opts = _.isObject(tts_engine.engine) ? _.extend({}, _.omit(tts_engine, 'engine'), tts_engine.engine) : tts_engine;
    var tts_engine_path = __dirname + '/tts/' + tts_engine_name + '.js';
    if (_.isString(tts_engine_name) && fs.existsSync(tts_engine_path)) {
        self.tts = new(require(tts_engine_path))(tts_engine_opts);
        self.debug('TTS engine found : ' + self.tts.name);
    }

    /////////////////////////////
    // Load SPEAK engine
    self.speak = new Speak(self.opts.speak)

    ////////////////////////////
    // Emit ready event or error if something has failed
    process.nextTick(function() {
        if (self.tts) {
            self.emit('ready');
            self.ready = false;
        }
    });

};

/**
 * Inherits from EventEmitter.
 */
util.inherits(Core, EventEmitter);

// Say routine
Core.prototype.say = function(obj, opts) {
    var self = this;

    // Add to the queue
    var q = _.extend({}, opts, _.isString(obj) ? {
        src: obj
    } : obj);
    self.queue.push(q);

    // Trace queue push
    self.trace('Queue : ' + JSON.stringify(q));

    // Run the queue
    self.runStep();

    // Return instance for chainable
    return self;

};

// Run the queue
Core.prototype.runStep = function() {
    var self = this;

    // If no more items in the queue, exit
    if (!self.queue || !self.queue.length) {
        self.isRunning = false;
        self.emit('idle');
        return;
    }

    // Lock with isRunning flag
    if (self.isRunning) return;

    // Set as running
    self.isRunning = true;

    // Define onComplete
    var onComplete = function() {
        process.nextTick(function() {
            self.isRunning = false;
            self.runStep();
        });
    };

    // Get the obj
    var obj = self.queue.shift();

    // Start step with an optional delay
    setTimeout(function() {

        if (obj.src) {

            // Ask for tts sound file
            self.tts.exec(obj, function(err, file) {

                // Abort speak if flag is not running ('stop' was used)
                if (self.isRunning && !err) {
                    self.debug('Play : ', JSON.stringify(_.extend({
                        file: file
                    }, obj)));
                    self.emit('play', _.extend({
                        file: file
                    }, obj));
                    self.speak.exec(file, function(err, result) {
                        self.emit('complete', _.extend({
                            file: file
                        }, obj));
                        onComplete(err, result);
                    });
                } else {
                    onComplete(err);
                }
            });
        } else {
            self.emit('pause', obj);
            onComplete();
        }

    }, obj.wait || 0);

};

// Pause during time in ms
Core.prototype.wait = function(ms) {
    var self = this;
    self.say({
        wait: ms
    });
    return self;
};

// Abort the current queue
Core.prototype.stop = function() {
    var self = this;

    // Abort the queue
    self.debug('Abort current queue');
    self.queue = [];
    self.isRunning = false;
    self.speak.kill();

    // Emit a 'stop' event
    self.emit('stop');

    // Run to emit an 'idle' event
    self.runStep();

    // Return instance
    return self;
};


/**
 * Export module
 */
module.exports = Core;
