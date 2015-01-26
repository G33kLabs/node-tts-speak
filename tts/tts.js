'use strict';
/* globals _: true */
var fs = require('fs-extra'),
    _ = require('lodash'),
    Logger = require('g33k-logger'),
    slugify = require("underscore.string/slugify"),
    md5 = require('MD5');

var TTS = function(options) {
    var self = this;

    // Expose engine name
    self.name = 'tts.js';

    // A list of supported languages
    self.supported = {
        'fr-fr': 'fr',
        'fr-ca': 'fr',
        'en': 'en/en-us',
        'en-gb': 'en/en',
        'en-us': 'en/en-us',
        'es-es': 'es',
        'es-mx': 'es-la',
        'it-it': 'it',
        'pt-pt': 'pt-pt',
        'pt-br': 'pt',
        'nl-nl': 'nl',
        'fi-fi': 'fi'
    };

    // Set defaults
    self.opts = _.extend({
        lang: 'en-us',
        amplitude: 100,
        wordgap: 0,
        pitch: 50,
        speed: 100,
        cache: false,
        format: 'wav',
        loglevel: 0,
        cwd: process.cwd() + '/node_modules/' + self.name,
        delayAfter: 700
    }, options);

    // Extends core with logger
    _.extend(self, Logger.builder('[tts-' + self.name + ']', self.opts.loglevel));

    // Test if module is installed for the project
    try {
        self.engine = require(self.name);
        self.engine.loadConfig(process.cwd() + '/node_modules/' + self.name + '/tts_config.json');
    } catch (e) {
        self.error('Module "' + self.name + '" is not installed.');
        self.error('Please run `npm install --save ' + self.name + '` ');
        process.exit(e.code);
    }

};

/**
 * Request API
 */
TTS.prototype.exec = function(obj, next) {
    var self = this;

    // Obj can bypass all default keys
    var opts = _.extend({}, _.pick(self.opts, 'amplitude', 'wordgap', 'pitch', 'speed', 'lang'), _.isString(obj) ? {
        src: obj
    } : obj);

    // Build query strings
    var qs = {
        amplitude: opts.amplitude,
        voice: opts.lang,
        speed: self.getRawSpeed(opts.speed),
        pitch: opts.pitch,
        wordgap: opts.wordgap,
        src: opts.src
    };

    // Get the file signature
    var signature = md5(_.values(_.omit(qs, 'key')).join('-'));
    var cachePath = self.opts.cache + '/' + self.name + '/' + opts.lang + '/' + signature.substr(0, 2) + '/' + slugify(opts.src) + '-' + signature + '.' + self.opts.format;

    // When complete
    var onComplete = function(err, result) {
        setTimeout(function() {
            if (_.isFunction(next)) next(err, result);
        }, self.opts.delayAfter ||  0);
    };

    // Returns cache if already exists
    if (fs.existsSync(cachePath)) {
        self.trace('Read file "' + opts.src + '" from cache');
        return onComplete(null, cachePath);
    }

    // Exec the request
    self.debug('Create sound file : ' + JSON.stringify(qs));

    // self.log(self.engine); 
    self.loadVoice(opts.lang, function() {
        var body = self.engine.speak(obj.src, _.pick(qs, 'amplitude', 'speed', 'pitch', 'wordgap'));
        if (body && body.length) {
            fs.outputFileSync(cachePath, body);
            self.debug('Store cache file at "' + cachePath + '"');
        }
        onComplete(null, cachePath);
    });


};

// Load a voice
TTS.prototype.loadVoice = function(voice, next) {
    var self = this;

    // Check if voice is supported
    var voiceFile = _.find(self.supported, function(v, code) {
        return (voice.toLowerCase() === v) || (voice.toLowerCase() === code);
    });

    // Error if voice is not supported
    if (!voiceFile) {
        self.error("Voice '" + voice + "' is not supported.");
        if (_.isFunction(next)) next(new Error("Voice '" + voice + "' is not supported."));
        return;
    }

    // If all is good, load the voice
    var voicePath = self.opts.cwd + '/voices/' + voiceFile + '.json';
    self.trace('Load the voice "' + voicePath + '"');
    self.engine.loadVoice(voicePath, function() {
        self.trace('Voice "' + voiceFile + '" is loaded');
        if (_.isFunction(next)) next();
    });
};

// Scale for speed
function scale(x, fromLow, fromHigh, toLow, toHigh) {
    return (x - fromLow) * (toHigh - toLow) /
        (fromHigh - fromLow) + toLow;
}

// Adjust percent speed into raw speed
TTS.prototype.getRawSpeed = function(speed) {
    return scale(speed, 0, 100, 1, 250); 
};

module.exports = TTS;
