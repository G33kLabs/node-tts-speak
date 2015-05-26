# tts-speak

A standard Text To Speech wrapper with multiple providers support.

Once the sound file is generated, find an installed audio player and play the sound.

## Features

- One wrapper for all tts providers (ideal for testing)
- Multiplatform Audio Playing (use package ['speaker'](https://github.com/TooTallNate/node-speaker) for that) 
- Thanks to ['jkeylu/node-mpg123-util'](https://github.com/jkeylu/node-mpg123-util) for the speaker volume !
- Cache generated audio files (and protect your ratio against limitation for online providers)
- Multilingual

## Installation

```
npm install --save tts-speak
```

## TTS Providers

You can use one of those providers to generate audio files from your text :

- tts.js : A local tts engine, that is not perfect but which support many languages
- api.voicerss.org : An API required service with beautiful voices and a large language support
- google : Use the well known translate_tts service from google


Example code :

```
// Create the wrapper with "tts.js" provider with full options
var Speak = require('tts-speak');
var speak = new Speak({
    tts: {
        engine: 'tts',                  // The engine to use for tts
        lang: 'en-us',                  // The voice to use
        amplitude: 100,                 // Amplitude from 0 to 200
        wordgap: 0,                     // Gap between each word
        pitch: 50,                      // Voice pitch
        speed: 60,                      // Speed in %
        cache: __dirname + '/cache',    // The cache directory were audio files will be stored
        loglevel: 0,                    // TTS log level (0: trace -> 5: fatal)
        delayAfter: 700                 // Mark a delay (ms) after each message
    },
    speak: {
        volume: 80,                     // Audio player volume
        loglevel: 0                     // Audio player log level
    },
    loglevel: 0                         // Wrapper log level
});
```

### api.voicerss.org

To use this provider, you have to request an API key by registering on [http://www.voicerss.org/api/demo.aspx](http://www.voicerss.org/api/demo.aspx)

Example code :

```
// Create the wrapper with "voicerss" provider with full options
var Speak = require('tts-speak');
var speak = new Speak({
    tts: {  
        engine: {                       // The engine to use for tts
            name: 'voicerss',           
            key: 'XXXXXXXXXXXXXXX',     // The API key to use
        },
        lang: 'en-us',                  // The voice to use
        speed: 60,                      // Speed in %
        format: 'mp3',                  // Output audio format
        quality: '44khz_16bit_stereo',  // Output quality
        cache: __dirname + '/cache',    // The cache directory were audio files will be stored
        loglevel: 0,                    // TTS log level (0: trace -> 5: fatal)
        delayAfter: 0                   // Mark a delay (ms) after each message
    },
    speak: {
        volume: 80,                     // Audio player volume
        loglevel: 0                     // Audio player log level
    },
    loglevel: 0                         // Wrapper log level
});
```

### Google

```
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
        volume: 80,                     // Audio player volume
        loglevel: 0                     // Audio player log level
    },
    loglevel: 0                         // Wrapper log level
});
```


## Usage

Once the speak instance is ready, you can generate and play tts.

```
speak.once('ready', function() {

    // Chaining
    speak
        .say("Hello and welcome here !")
        .wait(1000)
        .say({
            src: 'Parlez-vous français ?',
            lang: 'fr-fr',
            speed: 30
        });

    // Catch when all queue is complete
    speak.once('idle', function() {
        speak.say("Of course, with my new text to speech wrapper !");
    });

    // Will stop and clean all the queue
    setTimeout(function() {
        speak.stop();
        speak.say('Ok, abort the last queue !')
    }, 1000);

});
```

## Chainable Methods

### `speak.say(obj)`

`obj` can be a string or an object that is able to override default config.

### `speak.wait(ms)`

`ms` indicates the time in milliseconds to wait before continue.

### `speak.stop()`

Clean the queue and kill audio player if playing.


## Events (`on` or `once`)

### `speak.on('ready', fn)`

When all interfaces are ready.

### `speak.on('idle', fn)`

When queue is complete after a job.

### `speak.on('play', fn)`

When a sound file is played.

### `speak.on('pause', fn)`

When a pause is marked.

### `speak.on('stop', fn)`

When all jobs are canceled.



