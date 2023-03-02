const fs = require(`fs`);
const fetch = require(`node-fetch`);
const https = require('https')

// No logins are included as of now, due to me not understanding them and lacking general knowledge of how to obtain the necessary tokens.
// OAuth is supported, however you cannot obtain an OAuth token through something like the Email Exchange method, or logging in through any other platforms.
// The user must supply the API key or OAuth token.

let key;
let oauthkey;
let isUsingOAuth = false;
let isUsingAPIKey = false;

let defaultHeaders = {
    'Accept': 'application/json'
}

// The OAuth and API key functions can probably still be improved.

/**
 * Start using API key.
 * @return void
 * 
 * Throws an error if the API key hasn't been set.
 */

function useAPIKey() {
    if (key) {
        defaultHeaders = {
            'Accept': 'application/json'
        }
        if (isUsingOAuth) isUsingOAuth = false;
    }
    else {
        throw new Error("API key hasn't been set.")
    }
}

/**
 * Start using OAuth key.
 * @return void
 * 
 * Throws an error if the Oauth key hasn't been set.
 */

function useOAuthkey() {
    if (oauthkey) {
        defaultHeaders = {
            'Accept': 'application/json',
            'Authentication': 'Bearer ' + oauthkey
        }
        if (isUsingAPIKey) isUsingAPIKey = false;
    }
    else {
        throw new Error("OAuth key hasn't been set.")
    }
}

/**
 * Set API key.
 * @param apikey The api key to use.
 * @return void
 * 
 * Sets the API key, and starts using it. (calls the useAPIKey() function)
 */

function setAPIKey(apikey) {
    key = apikey
    isUsingAPIKey = true;
    useAPIKey();
}

/**
 * Set OAuth key.
 * @param apikey The OAuth key to use.
 * @return void
 * 
 * Sets the OAuth key, and starts using it. (calls the useOAuthkey() function)
 */

function setOAuthKey(oauth) {
    oauthkey = oauth
    isUsingOAuth = true;
    useOAuthkey();
}

/**
 * Returns true if OAuth is currently being used, else returns false.
 * @returns boolean
 */

function usingOAuth() {
    if (isUsingOAuth) return true
    else return false;
}

/**
 * Checks if a key has been set.
 * @returns boolean
 */

function hasKey() {
    if (isUsingOAuth || isUsingAPIKey) return true
    else return false;
}

/**
    * Get all games.
    *
    * @return Promise
    * 
    * Returns an object containing an array called data.
    * Data contains objects, representing each game.
    * The objects contain something like shown in mod.io's official API docs: https://docs.mod.io/?javascript--nodejs#get-games-2

*/

function getGames() {
    // Send request to /v1/games endpoint to get all games.
    return fetch(`https://api.mod.io/v1/games?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
}

/**
 * Gets a specific game.
 * @param id ID of the game.
 * @returns Promise
 * 
 * Returns an object, containing multiple properties, including the game ID, status and others.
 * You can see an example of it here: https://docs.mod.io/?javascript--nodejs#game-object
 */

function getGame(id) {
    // Send request to /v1/games endpoint with game ID to get details about the game.
    return fetch(`https://api.mod.io/v1/games/${id}?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
}

/**
 * Gets all the mods a game has.
 * @param gameid ID of the game to get mods from.
 * @returns Promise
 * 
 * Contains an object, containing an array called data.
 * This array contains multiple objects representing each mod.
 * You can see an example here: https://docs.mod.io/?javascript--nodejs#get-mods-2
 */

function getMods(gameid) {
    // Send request to v1/games/{gameid}/mods with game ID to get mods for that game.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
}

/**
 * Gets a mod from a specific game.
 * @param gameid The gameID to get the mod from.
 * @param modid The ID of the mod to get.
 * @returns Promise
 * Contains an object which contains a lot of properties.
 * You can see an example here: https://docs.mod.io/?javascript--nodejs#mod-object
 */

function getMod(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid} to get info about the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
}

// This only contains basic mod functions, no uploading, adding, editing or deleting yet.

/**
 * Gets the files of a specific mod.
 * @param gameid Game to get files from.
 * @param modid Mod to get files from.
 * @returns Promise
 * Contains an object with an array.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-modfiles-2
 */

function getModfiles(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/files to get all files from the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/files?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
}

/**
 * Gets a specific modfile.
 * @param gameid Game to get mod from.
 * @param modid Mod to get file from.
 * @param platform Platform to get file for..
 * @returns Promise
 * Contains an object.
 * View example here: https://docs.mod.io/?javascript--nodejs#modfile-object
 * 
 */

 async function getModfile(gameid, modid, platform) {
    // This is supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from.
    const res = await getModfiles(gameid, modid);
    const data = await res.json();
    if (!data || !data.data) return;
    const games = data.data;
    for (const file of games) {
        for (const platformsupported of file.platforms) {
            if (platformsupported.platform == platform) {
                return file;
            }
        }
    }
}

/**
 * Downloads a mod.
 * @param gameid Game to download mod from.
 * @param modid Mod to download file from.
 * @param platform Platform to get file for.
 * @param outputpath Where to put the file.
 * @returns Promise
 * 
 * Downloads a mod from the website.
 */

 async function downloadMod(gameid, modid, platform, outputpath) {
    // This was supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from while minimizing requests.
    const data = await getModfile(gameid, modid, platform);
    if (!data || !data.download) return;
    const download = data.download.binary_url;
    //console.log(download);
    let newoutput;
    const name = data.filename
    if (!outputpath.endsWith('/') && !outputpath.endsWith('\\')) newoutput = outputpath + '/' + name;
    else newoutput = outputpath + name;
    // Compare sizes to see if one file is newer (determined by size, not effective but it'll work while I learn how to work with the mod.io API.)
    if (fs.existsSync(newoutput)) {
        const oldsize = fs.statSync(newoutput).size;
        const downloadsize = data.filesize;
        if (downloadsize <= oldsize) return;
    }
    const res = await fetch(download, {
        method: 'GET'
    });
    const newurl = res.url;
    //console.log(newurl);
    const downloading = https.get(newurl, (res) => {
        res.pipe(fs.createWriteStream(newoutput))
    });
    return new Promise((resolve, reject) => {
        downloading.on('close', () => resolve);
        downloading.on('error', () => reject);
    })
}

/**
 * Gets the comments from a mod.
 * @param gameid Game to get mod from.
 * @param modid Mod to get comments from.
 * @returns Promise
 * Object yet again contains an array called data.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-mod-comments-2
 */

function getModComments(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/comments to get comments from the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/comments?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
}

/**
 * Gets dependencies for a mod.
 * @param gameid Game to get mod from.
 * @param modid Mod to get dependencies for.
 * @returns Promise
 * Object yet again contains an array called data.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-mod-dependencies-2
 */

function getModDependencies(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/dependencies to get mod dependencies.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/dependencies?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
}

module.exports = {
    downloadMod,
    getGame,
    getGames,
    getMods,
    getMod,
    getModfiles,
    getModfile,
    getModComments,
    getModDependencies,
    setAPIKey,
    setOAuthKey,
    usingOAuth,
    useAPIKey,
    useOAuthkey,
    hasKey
}
