# tts-speak

A standard Text To Speech wrapper with multiple providers support.

Once the sound file is generated, find an installed audio player and play the sound.

## Features

- One wrapper for all tts providers (ideal for testing)
- Multiplatform Audio Playing (mplayer, afplay, mpg123, mpg321, play)
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

### TTS.js

First you have to add the [tts.js](https://www.npmjs.com/package/tts.js) module to your project.

```
npm install --save tts.js
```

Example code :

```
// Create the wrapper with "tts.js" provider
var Speak = require('tts-speak');
var speak = new Speak({
    tts: {
        engine: 'tts',
        lang: 'en-us',
        speed: 60,
        cache: __dirname + '/cache',
        loglevel: 0
    },
    speak: {
        engine: 'auto',
        volume: 100,
        loglevel: 0
    },
    loglevel: 0
});
```

### api.voicerss.org

To use this provider, you have to request an API key by registering on [http://www.voicerss.org/api/demo.aspx](http://www.voicerss.org/api/demo.aspx)

Example code :

```
// Create the wrapper with "voicerss" provider
var Speak = require('tts-speak');
var speak = new Speak({
    tts: {
        engine: {
            name: 'voicerss',
            key: 'XXXXXXXXXXXXXXX',
        },
        lang: 'en-us',
        speed: 60,
        cache: __dirname + '/cache',
        loglevel: 0
    },
    speak: {
        engine: 'auto',
        volume: 100,
        loglevel: 0
    },
    loglevel: 0
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
        speak.say("Et je t'en merdeux...");
    });

});
```

## Chainable Methods

### `speak.say(obj)`

`obj` can be a string or an object that is able to override default config.

### `speak.wait(ms)`

`ms` indicates the time in milliseconds to wait before continue.

### `speak.stop()`

Clean the queue and kill audio player if playing.


## Events

### `speak.on('ready', fn)`

When all interfaces are ready.

### `speak.on('idle', fn)`

When queue is complete after a job.

### `speak.on('play', fn)`

When a sound file is played

### `speak.on('pause', fn)`

When a pause is marked

### `speak.on('stop', fn)`

When all jobs are canceled.



