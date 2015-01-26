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
    self.name = 'google';

    // Set defaults
    self.opts = _.extend({
        lang: 'en-us',
        cache: false,
        api: 'http://translate.google.com/translate_tts',
        format: 'mp3',
        loglevel: 0,
        delayAfter: 700
    }, options);

    // Extends core with logger
    _.extend(self, Logger.builder('[tts-speak-' + self.name + ']', self.opts.loglevel));

};

/**
 * Request API
 */
TTS.prototype.exec = function(obj, next) {
    var self = this;

    // Obj can bypass all default keys
    var opts = _.extend({}, _.pick(self.opts, 'lang'), _.isString(obj) ? {
        src: obj
    } : obj);

    // Build query strings
    var qs = {
        tl: opts.lang,
        q: opts.src
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
    self.info('Request sound file "' + opts.src + '"');
    request({
            url: self.opts.api,
            qs: qs,
            headers: {
                'user-agent': 'Mozilla/5.0'
            },
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

module.exports = TTS;
