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
modio.downloadMod('@game', '@mod', 'platform', 'outputpath'); // Does not use ID's for game and mod, ex. '@bonelab', '@m60'. File id's are not supported yet, but will be in a future update.
```

##### Getting all games

```js
const games = modio.getGames();
```

##### Getting a specific game

```js
const game = modio.getGame(id); // ID is same as shown in the mod download example ('@bonelab')
```

##### Getting all mods for a game

```js
const mods = modio.getMods(game); // Game is just @game, ex. '@bonelab'
```

##### Getting a specific mod

```js
const mod = modio.getMod(game, mod); // Game: @game (ex. '@bonelab'), mod: @mod (ex. '@m60')
```

##### Getting a mod's files

```js
const modfiles = modio.getModfiles(game, mod);
```

##### Getting a specific platform's mod files

```js
const modfile = modio.getModfile(game, mod, platform); // Game: @game (ex. '@bonelab'), mod: @mod (ex. '@m60'), platform: 'platform', ex 'windows'
```

##### Getting comments on a mod

```js
const comments = modio.getModComments(game ,mod);
```

##### Getting a mod's dependencies

```js
const dependencies = modio.getModDependencies(game, mod);
```

## Extra info

Most of these functions, if not all, return a Promise.
This promise contains an object, with an array called data.
This is structured like: 
{
    data: [
        ...
    ]
}
You can see what these return here: https://docs.mod.io/#response-schemas
