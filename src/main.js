const fs = require(`fs`);
const fetch = require(`node-fetch`);
const https = require('https');
const { Mod } = require('../lib/mod');
const { Modfile } = require('../lib/modfile');
const { Comment } = require('../lib/comment');
const { Game } = require('../lib/game');

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
        isUsingAPIKey = true;
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
            'Authorization': 'Bearer ' + oauthkey
        }
        if (isUsingAPIKey) isUsingAPIKey = false;
        isUsingOAuth = true;
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
    useOAuthkey();
}

/**
 * Returns true if OAuth is currently being used, else returns false.
 * @return boolean
 */

function usingOAuth() {
    if (isUsingOAuth) return true
    else return false;
}

/**
 * Checks if a key has been set.
 * @return boolean
 */

function hasKey() {
    if (isUsingOAuth || isUsingAPIKey) return true
    else return false;
}

/**
    * Get all games.
    *
    * @return Array
    * 
    * Returns an array containing Game objects.

*/

async function getGames() {
    // Send request to /v1/games endpoint to get all games.
    const req = await fetch(`https://api.mod.io/v1/games?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
    // Parse request into JSON object
    const games = await req.json();
    const gamearray = [];
    // Create a new Game class for each game.
    for (const game of games.data) {
        gamearray.push(new Game(game));
    }
    return gamearray
}

/**
 * Gets a specific game.
 * @param {string} id ID of the game.
 * @return Game
 * 
 * Returns a Game class.
 */

async function getGame(id) {
    // Send request to /v1/games endpoint with game ID, parse response and pass parsed response into a new Game class.
    return new Game(await (await fetch(`https://api.mod.io/v1/games/${id}?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })).json());
}

/**
 * Gets all the mods a game has.
 * @param {string} gameid ID of the game to get mods from.
 * @return Array
 * 
 * Returns an array containing Mod classes.
 */

async function getMods(gameid) {
    // Send request to v1/games/{gameid}/mods with game ID to get mods for that game.
    const req = await fetch(`https://api.mod.io/v1/games/${gameid}/mods?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    });
    // Parse request into JSON object
    const res = await req.json();
    const mods = []
    // Sort through all the resulting mods
    for (const mod of res) {
        // Check if they all have an ID property, thus checking if they returned a mod object or an error object.
        if (mod.id) {
            mods.push(new Mod(mod));
        }
    }
    return mods;
}

/**
 * Gets a mod from a specific game.
 * @param {string} gameid The gameID to get the mod from.
 * @param {string} modid The ID of the mod to get.
 * @return Mod
 * Returns a Mod class.
 */

async function getMod(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid} to get info about the mod.
    const req = await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    });
    // Turn request into JSON
    const res = await req.json();
    // Check if it actually was able to get the mod
    if (res.id) {
        return new Mod(res);
    }
    else {
        throw new Error('Failed to get mod.')
    }
}

/**
 * Subscribe to a mod. Needs OAuth key.
 * @param {string} gameid The game the mod is for.
 * @param {string} modid The mod you want to subscribe to.
 * @return Object
 * 
 * Subscribes to a mod.
 */

async function subscribeTo(gameid, modid) {
    if (!isUsingOAuth) throw new Error('susbcribeTo requires an OAuth key to function.')
    return new Mod(await (await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/subscribe`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${oauthkey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })).json())
}

/**
 * Unsubscribe from a mod. Needs OAuth key.
 * @param {string} gameid The game the mod is for.
 * @param {string} modid The mod you want to unsubscribe from.
 * @return Object
 * 
 * Unsubscribes from a mod.
 */

async function unsubscribeFrom(gameid, modid) {
    if (!isUsingOAuth) throw new Error('unsubscribeFrom requires an OAuth key to function.')
    return await (await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/subscribe`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${oauthkey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })).json()
}

// This only contains basic mod functions, no uploading, adding, editing or deleting yet.

/**
 * Gets the files of a specific mod.
 * @param {string} gameid Game to get files from.
 * @param {string} modid Mod to get files from.
 * @param {function} customErrorHandler A custom error handler function, res and modfilesreq (res is request sent to v1/games/${gameid}/mods/${modid} and turned into json, modfilesreq is sent to /files and turned into json. Both will have an error property if the request fails. Order: customErrorHandler(gameid, modid, res, modfilesreq, firstCall). firstCall will be false.)
 * @param {boolean} firstCall This is for internal use. Setting this will very likely break the function if it has to retry.
 * @return Array
 * Array contains the mod's latest modfiles.
 */

async function getModfiles(gameid, modid, customErrorHandler, firstCall = true) {
    // Get the mod, in order to get the latest live modfiles.
    const req = await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })
    // Turn the request into a JSON object.
    const res = await req.json();
    const modfiles = [];
    const latest = [];
    // Make a request to the /files endpoint to get all files.
    const modfilesreq = await (await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/files?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })).json()
    // Check if either of them errored, and retry twice
    if (!customErrorHandler && firstCall && (res.error || modfilesreq.error)) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                getModfiles(gameid, modid, false).then(resolve).catch(() => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            getModfiles(gameid, modid, false).then(resolve).catch((error) => {
                                reject('Failed to get modfiles. Error returned: ' + error)
                            })
                        }, 5000)
                    })
                })
            }, 5000)
        })
    }
    if (customErrorHandler && firstCall) {
        customErrorHandler(gameid, modid, res, modfilesreq, false);
    }
    // Add both mod ID's to the latest array.
    if (!res.modfile || !res.modfile.id) { 
        for (const latestmodfile of res.platforms) {
            latest.push(latestmodfile.modfile_live);
        }
        for (const modfile of modfilesreq.data) {
            // If latest array contains the id, push it to the modfiles array.
            if (latest.includes(modfile.id)) modfiles.push(new Modfile(modfile));
        }
        return modfiles;
    }
    else {
        return new Modfile(res.modfile)
    }
}

/**
 * Gets a specific modfile.
 * @param {string} gameid Game to get mod from.
 * @param {string} modid Mod to get file from.
 * @param {string} platform Platform to get file for.
 * @return Modfile
 * Returns a Modfile class.
 * View example here: https://docs.mod.io/?javascript--nodejs#modfile-object
 * 
 */

 async function getModfile(gameid, modid, platform) {
    // This is supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from.
    const data = await getModfiles(gameid, modid);
    for (const modfile of data) {
        if (modfile.platform == platform) {
            return new Modfile(file);
        }
    }
}

/**
 * Get all mods the user is subscribed to.
 * 
 * @return Array
 * 
 * Returns an array of Mods.
 */

async function getSubscriptions() {
    if (!isUsingOAuth && !oauthkey) throw new Error("OAuth has to be set.")
    const req = await fetch('https://api.mod.io/v1/me/subscribed', {
        method: 'GET',
        headers: defaultHeaders
    })
    const res = await req.json();
    const mods = [];
    for (const mod of res.data) {
        mods.push(new Mod(mod));
    }
    return mods
}

/**
 * Downloads a mod.
 * @param {string} gameid Game to download mod from.
 * @param {string} modid Mod to download file from.
 * @param {string} platform Platform to get file for.
 * @param {string} outputpath Where to put the file.
 * @param {boolean} useNameID To use the name ID in the link. This is to prevent mods with files that have the same names from overwriting eachother.
 * @return Object
 * 
 * Downloads a mod from the website.
 */

 async function downloadMod(gameid, modid, platform, outputpath, useNameID) {
    // This was supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from while minimizing requests.
    const data = await getModfile(gameid, modid, platform);
    let name;
    if (useNameID) name = (await getMod(gameid, modid)).name_id + '.zip';
    if (!data || !data.binary_url) return;
    const download = data.binary_url;
    //console.log(download);
    let newoutput;
    if (!name) name = data.filename;
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
 * @return Object
 * Object yet again contains an array called data.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-mod-comments-2
 */

async function getModComments(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/comments to get comments from the mod.
    const req = await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/comments?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    });
    const res = await req.json();
    const comments = [];
    // Sort through resulting json to get all comments
    for (const comment of res.data) {
        if (comment.id) {
            comments.push(new Comment(comment));
        }
    }
    return comments;
}

/**
 * Gets dependencies for a mod.
 * @param gameid Game to get mod from.
 * @param modid Mod to get dependencies for.
 * @return Object
 * Object yet again contains an array called data.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-mod-dependencies-2
 */

async function getModDependencies(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/dependencies to get mod dependencies.
    return await (await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/dependencies?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })).json()
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
    hasKey,
    subscribeTo,
    unsubscribeFrom,
    getSubscriptions,
    isUsingAPIKey,
    isUsingOAuth
}
