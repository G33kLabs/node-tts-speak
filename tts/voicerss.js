'use strict';
/* globals _: true, request: true */
var fs = require('fs-extra'),
    _ = require('lodash'),
    request = require('request'),
    Logger = require('g33k-logger'),
    slugify = require("underscore.string/slugify"),
    md5 = require('MD5');

var TTS = function(options) {
    var self = this;

    // Expose engine name
    self.name = 'voicerss';

    // Set defaults
    self.opts = _.extend({
        key: null,
        lang: 'en-us',
        speed: 50,
        cache: false,
        api: 'http://api.voicerss.org',
        format: 'mp3',
        quality: '44khz_16bit_stereo',
        loglevel: 0,
        delayAfter: 0
    }, options);

    // Extends core with logger
    _.extend(self, Logger.builder('[tts-'+self.name+']', self.opts.loglevel));

    // Verify that API key is set
    if ( ! self.opts.key ) {
    	self.error('Please specify a "key" to allow API access.');
        self.error('Got to http://www.voicerss.org/api/demo.aspx and create your account');
        process.exit(0); 
    }

};

/**
 * Request API
 */
TTS.prototype.exec = function(obj, next) {
    var self = this;

    // Obj can bypass all default keys
    var opts = _.extend({}, _.pick(self.opts, 'key', 'lang', 'speed', 'format', 'quality'), _.isString(obj) ? {
        src: obj
    } : obj);

    // Build query strings
    var qs = {
        key: opts.key,
        hl: opts.lang,
        r: self.getRawSpeed(opts.speed),
        c: opts.format,
        f: opts.quality,
        src: opts.src
    };

    // Get the file signature
    var signature = md5(_.values(_.omit(qs, 'key')).join('-'));
    var cachePath = self.opts.cache + '/' + self.name + '/' + opts.lang + '/' + signature.substr(0, 2) + '/' + slugify(opts.src) + '-' + signature + '.' + self.opts.format;

    // When complete
    var onComplete = function(err, result) {
        setTimeout(function() {
            if (_.isFunction(next)) next(err, result);
        }, self.opts.delayAfter || 0); 
    };

    // Returns cache if already exists
    if (fs.existsSync(cachePath)) {
        self.trace('Read file "' + opts.src + '" from cache');
        return onComplete(null, cachePath);
    }

    // Exec the request
    self.info('Request sound file "' + opts.src + '"');
    request({
            url: self.opts.api,
            qs: qs,
            encoding: null
        },

        // Receive 
        function(err, res, body) {
            if (!err && body.length) {
                fs.outputFileSync(cachePath, body);
                self.success('Store cache file at "' + cachePath + '"');
            }
            onComplete(err, cachePath);

        }
    );
};


// Scale for speed
function scale(x, fromLow, fromHigh, toLow, toHigh) {
    return (x - fromLow) * (toHigh - toLow) /
        (fromHigh - fromLow) + toLow;
}

// Adjust percent speed into raw speed
TTS.prototype.getRawSpeed = function(speed) {
    return scale(speed, 0, 100, -10, 10); 
};

module.exports = TTS;
