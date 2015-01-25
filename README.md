# node-tts-speak

A standard Text To Speech generator with multiple providers support. Once file is generated, use 'aplay' or 'afplay' to play this sound.

```
var Speak = require('tts-speak');
var speak = new Speak({
	tts: {
		engine: {
			name: 'voicerss',
			key: 'XXXXXXXXXXXX',
		},
		lang: 'en-us',
		speed: 0
	},
	speak: {
		engine: 'default',
		volume: 100
	}
});
speak.say('Hello world !'); 
```

## Providers

At this early state of development, only 'api.voicerss.org' provider is supported.

### Voicerss.org

#### `lang` availables

<table cellpadding="4" cellspacing="0" width="100%">
    <tr>
        <td align="center" style="width: 150px" class="table_border">
            Language code
        </td>
        <td align="center" style="width: auto" class="table_border">
            Language name
        </td>
    </tr>
    <tr>
        <td class="table_border">ca-es</td>
        <td class="table_border">Catalan</td>
    </tr>
    <tr>
        <td class="table_border">zh-cn</td>
        <td class="table_border">Chinese (China)</td>
    </tr>
    <tr>
        <td class="table_border">zh-hk</td>
        <td class="table_border">Chinese (Hong Kong)</td>
    </tr>
    <tr>
        <td class="table_border">zh-tw</td>
        <td class="table_border">Chinese (Taiwan)</td>
    </tr>
    <tr>
        <td class="table_border">da-dk</td>
        <td class="table_border">Danish</td>
    </tr>
    <tr>
        <td class="table_border">nl-nl</td>
        <td class="table_border">Dutch</td>
    </tr>
    <tr>
        <td class="table_border">en-au</td>
        <td class="table_border">English (Australia)</td>
    </tr>
    <tr>
        <td class="table_border">en-ca</td>
        <td class="table_border">English (Canada)</td>
    </tr>
    <tr>
        <td class="table_border">en-gb</td>
        <td class="table_border">English (Great Britain)</td>
    </tr>
    <tr>
        <td class="table_border">en-in</td>
        <td class="table_border">English (India)</td>
    </tr>
    <tr>
        <td class="table_border">en-us</td>
        <td class="table_border">English (United States)</td>
    </tr>
    <tr>
        <td class="table_border">fi-fi</td>
        <td class="table_border">Finnish</td>
    </tr>
    <tr>
        <td class="table_border">fr-ca</td>
        <td class="table_border">French (Canada)</td>
    </tr>
    <tr>
        <td class="table_border">fr-fr</td>
        <td class="table_border">French (France)</td>
    </tr>
    <tr>
        <td class="table_border">de-de</td>
        <td class="table_border">German</td>
    </tr>
    <tr>
        <td class="table_border">it-it</td>
        <td class="table_border">Italian</td>
    </tr>
    <tr>
        <td class="table_border">ja-jp</td>
        <td class="table_border">Japanese</td>
    </tr>
    <tr>
        <td class="table_border">ko-kr</td>
        <td class="table_border">Korean</td>
    </tr>
    <tr>
        <td class="table_border">nb-no</td>
        <td class="table_border">Norwegian</td>
    </tr>
    <tr>
        <td class="table_border">pl-pl</td>
        <td class="table_border">Polish</td>
    </tr>
    <tr>
        <td class="table_border">pt-br</td>
        <td class="table_border">Portuguese (Brazil)</td>
    </tr>
    <tr>
        <td class="table_border">pt-pt</td>
        <td class="table_border">Portuguese (Portugal)</td>
    </tr>
    <tr>
        <td class="table_border">ru-ru</td>
        <td class="table_border">Russian</td>
    </tr>
    <tr>
        <td class="table_border">es-mx</td>
        <td class="table_border">Spanish (Mexico)</td>
    </tr>
    <tr>
        <td class="table_border">es-es</td>
        <td class="table_border">Spanish (Spain)</td>
    </tr>
    <tr>
        <td class="table_border">sv-se</td>
        <td class="table_border">Swedish (Sweden)</td>
    </tr>
</table>
