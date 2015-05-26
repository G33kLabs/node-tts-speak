'use strict';

// Create the wrapper with "google" provider with full options
var Speak = require('tts-speak');
var speak = new Speak({
    tts: {
        engine: 'google',               // The engine to use for tts
        lang: 'en-us',                  // The voice to use
        cache: __dirname + '/cache',    // The cache directory were audio files will be stored
        loglevel: 0,                    // TTS log level (0: trace -> 5: fatal)
        delayAfter: 500                 // Mark a delay (ms) after each message
    },
    speak: {
        loglevel: 0                     // Audio player log level
    },
    loglevel: 0                         // Wrapper log level
});

// When interface is ready
speak.once('ready', function() {

    // Chaining
    this
        .say("Hello and welcome here !")
        .wait(1000)
        .say({
            src: 'Parlez-vous français ?',
            lang: 'fr-fr'
        });

    // Catch when all queue is complete
    this.once('idle', function() {
        speak.say("Of course, with my new text to speech wrapper !");
    });

});
