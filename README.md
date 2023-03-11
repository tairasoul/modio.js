# modio.js

This is currently a very unfinished library.
Docs are still very basic, and most API features you'll get using libraries for other languages (python, cli) are not here.
Made this because there were no other libraries for using the mod.io API for nodejs, and I decided to publish it because other people might be looking for a module to use mod.io API too.

## Examples


##### Setting API key

```js
const modio = require('modio.js');

modio.setAPIKey('your-api-key'); // Get an API key at mod.io/apikey
```

##### Setting OAuth key

```js
const modio = require('modio.js');

modio.setOAuthKey('your-oauth-key'); // Get an OAuth key at mod.io/apikey
```

##### Downloading a mod

```js
await modio.downloadMod('@game', '@mod', 'platform', 'outputpath'); //  Uses ID's like'@bonelab', '@m60'. File id's are not supported yet, but will be in a future update.
```

##### Getting all games

```js
const games = await modio.getGames();
```

##### Getting a specific game

```js
const game = await modio.getGame(id); // ID is same as shown in the mod download example ('@bonelab')
```

##### Getting all mods for a game

```js
const mods = await modio.getMods(game); // Game is just @game, ex. '@bonelab'
```

##### Getting a specific mod

```js
const mod = await modio.getMod(game, mod); // Game: @game (ex. '@bonelab'), mod: @mod (ex. '@m60')
```

##### Getting a mod's files

```js
const modfiles = await modio.getModfiles(game, mod);
```

##### Getting a specific platform's mod files

```js
const modfile = await modio.getModfile(game, mod, platform); // Game: @game (ex. '@bonelab'), mod: @mod (ex. '@m60'), platform: 'platform', ex. 'windows'
```

##### Getting comments on a mod

```js
const comments = await modio.getModComments(game ,mod);
```

##### Getting a mod's dependencies

```js
const dependencies = await modio.getModDependencies(game, mod);
```
## OAuth is needed for the following functions.

##### Getting all subscribed mods

```js
const mods = await modio.getSubscriptions();
```

##### Subscribing and unsubscribing from a mod

```js
const subscribed = await modio.subscribeTo('@game', '@mod');
const unsubscribed = await modio.unsubscribeFrom('@game', '@mod');
```

## Extra info

All functions, other than getModDependencies, return a class.
