const fs = require(`fs`);
const fetch = require(`node-fetch`);
const https = require('https');
const { Mod } = require('../lib/mod');
const { Modfile } = require('../lib/modfile');
const { Comment } = require('../lib/comment');
const { Game } = require('../lib/game');
const { Message, AccessTokenObject } = require('../lib/misc');
const { APIError } = require('../lib/error');
const { Dependencies } = require('../lib/dependency');
const crypto = require('crypto');

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
 * Send a request to the user's email for a security code.
 * @param {string} email Email to send to.
 * @returns {Promise<Message>}
 */

async function emailRequest(email) {
    if (!key) throw new Error('email_request needs an API key.');
    return new Message(await (await fetch(`https://api.mod.io/v1/oauth/emailrequest?api_key=${key}&email=${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })).json())
}

/**
 * Finish email exchange.
 * @param {string} code 
 * @returns {Promise<AccessTokenObject>}
 * 
 * Access token is in property access_token.
 */

async function emailExchange(code) {
    if (!key) throw new Error('email_request needs an API key.')
    return new AccessTokenObject(await (await fetch(`https://api.mod.io/v1/oauth/emailexchange?api_key=${key}&security_code=${code}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })).json())
}

/**
 * Start using API key.
 * @returns {void}
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
 * @returns {void}
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
 * @returns {void}
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
 * @returns {void}
 * 
 * Sets the OAuth key, and starts using it. (calls the useOAuthkey() function)
 */

function setOAuthKey(oauth) {
    oauthkey = oauth
    useOAuthkey();
}

/**
 * Returns true if OAuth is currently being used, else returns false.
 * @returns {boolean}
 */

function usingOAuth() {
    if (isUsingOAuth) return true
    else return false;
}

/**
 * Checks if a key has been set.
 * @returns {boolean}
 */

function hasKey() {
    if (isUsingOAuth || isUsingAPIKey) return true
    else return false;
}

/**
    * Get all games.
    *
    * @returns {Promise<Array<Game>>}
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
 * @returns {Promise<Game>}
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
 * @returns {Promise<Array<Mod>>}
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
 * @returns {Promise<Mod | APIError>}
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
    else if (res.error) {
        return new APIError(res)
    }
    else {
        throw new Error('Failed to get mod.')
    }
}

/**
 * Subscribe to a mod. Needs OAuth key.
 * @param {string} gameid The game the mod is for.
 * @param {string} modid The mod you want to subscribe to.
 * @returns {Promise<Mod> | Promise<APIError>}
 * 
 * Subscribes to a mod.
 */

async function subscribeTo(gameid, modid) {
    if (!oauthkey) throw new Error('susbcribeTo requires an OAuth key to function.')
    const json = await (await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/subscribe`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${oauthkey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })).json()
    if (!json.error) return new Mod(json);
    else return new APIError(json);
}

/**
 * 
 * @param {string} gameid 
 * @param {string} modid 
 * @param {string} rating 
 * @returns {Promise<Message>}
 */

async function addRating(gameid, modid, rating) {
    if (!oauthkey) throw new Error('addRating requires an OAuth key to function.')
    return new Message(await (await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/ratings?rating=${rating}`, {
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
 * @returns {Promise<Mod>}
 * 
 * Unsubscribes from a mod.
 */

async function unsubscribeFrom(gameid, modid) {
    if (!oauthkey) throw new Error('unsubscribeFrom requires an OAuth key to function.')
    return await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/subscribe`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${oauthkey}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })
}

// This only contains basic mod functions, no uploading, adding, editing or deleting yet.

/**
 * Gets the files of a specific mod.
 * @param {string} gameid Game to get files from.
 * @param {string} modid Mod to get files from.
 * @param {function} customErrorHandler A custom error handler function, res and modfilesreq (res is request sent to v1/games/${gameid}/mods/${modid} and turned into json, modfilesreq is sent to /files and turned into json. Both will have an error property if the request fails. Order: customErrorHandler(gameid, modid, res, modfilesreq, firstCall). firstCall will be false.)
 * @param {boolean} firstCall This is for internal use. Setting this will very likely break the function if it has to retry.
 * @returns {Promise<Array<Modfile>>}
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
        return [new Modfile(res.modfile)]
    }
}

/**
 * Gets a specific modfile.
 * @param {string} gameid Game to get mod from.
 * @param {string} modid Mod to get file from.
 * @param {string} platform Platform to get file for.
 * @returns {Promise<Modfile>}
 * Returns a Modfile class.
 * View example here: https://docs.mod.io/?javascript--nodejs#modfile-object
 * 
 */

 async function getModfile(gameid, modid, platform) {
    // This is supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from.
    const data = await getModfiles(gameid, modid);
    for (const modfile of data) {
        if (modfile.platforms) {
            for (const plat of modfile.platforms) {
                if (plat.platform == platform) {
                    return modfile;
                }
            }
        }
        else {
            if (modfile.platforms && modfile.platforms.length > 0) for (const platform of modfile.platforms) {
                if (platform.platform = platform) return modfile
            }
            else if (!modfile.platforms || modfile.platforms.length == 1) {
                return modfile
            }
        }
    }
}

/**
 * Get all mods the user is subscribed to.
 * 
 * @returns {Promise<Array<Mod>>}
 * 
 * Returns an array of Mods.
 */

async function getSubscriptions() {
    if (!oauthkey) throw new Error("OAuth has to be set.")
    useOAuthkey();
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
 * @return {Promise<void>}
 * 
 * Downloads a mod.
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
    async function dl() {
        const res = await fetch(download, {
            method: 'GET'
        });
        const newurl = res.url;
        return new Promise((resolve, reject) => {
            https.get(newurl, (res) => {
                const stream = fs.createWriteStream(newoutput);
                const pipe = res.pipe(stream);
                stream.on('close', () => {
                    if (pipe.closed && stream.closed) resolve()
                });
                stream.on('error', () => reject);
            });
        })
    }
    if (fs.existsSync(newoutput)) {
        // create md5 hash
        const hash = crypto.createHash('md5', {encoding: 'binary'});
        // create read stream of existing file
        const stream = fs.createReadStream(newoutput);
        // update hash when stream emits data
        stream.on('data', (data) => hash.update(data));
        stream.on('end', async () => {
            const modfilehash = data.md5;
            const newhash = hash.digest('hex');
            if (modfilehash == newhash) return;
            else {
                return await dl();
            }
        })
    }
    else await dl();
}

/**
 * Gets the comments from a mod.
 * @param gameid Game to get mod from.
 * @param modid Mod to get comments from.
 * @returns {Promise<Array<Comment>>}
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
 * @returns {Promise<Dependencies>}
 * Object contains an array called data.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-mod-dependencies-2
 */

async function getModDependencies(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/dependencies to get mod dependencies.
    return new Dependencies(await (await fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/dependencies?api_key=${key}`, {
        method: `GET`,
        headers: defaultHeaders
    })).json());
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
    emailRequest,
    emailExchange,
    addRating,
    isUsingAPIKey,
    isUsingOAuth
}
