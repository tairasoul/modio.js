const fs = require(`fs`);
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

const internalInfo = {
    key: null,
    oauthkey: null
}

const exposedInfo = {
    hasKey: false,
    hasOAuth: false
}

/**
 * 
 * @param {string} endpoint Endpoint to make a request to.
 * @param {string} extraArgs Extra arguments to provide.
 * @param {*} fetchargs Args to send into fetch.
 */

function apiRequest(endpoint, extraArgs, fetchargs) {
    if (!endpoint.startsWith("/")) endpoint = `/${endpoint}`;
    if (fetchargs) {
        return fetch(`https://api.mod.io/v1${endpoint}?api_key=${internalInfo.key}&${extraArgs}`, fetchargs)
    }
    return fetch(`https://api.mod.io/v1${endpoint}?api_key=${internalInfo.key}&${extraArgs}`, {
        method: `GET`,
        headers: {
            "Accept": 'application/json',
            'Authorization': `Bearer ${internalInfo.oauthkey}`
        }
    })
}

// The OAuth and API key functions can probably still be improved.

/**
 * Send a request to the user's email for a security code.
 * @param {string} email Email to send to.
 */

async function emailRequest(email) {
    if (!mainInfo.key) throw new Error('email_request needs an API key.');
    const data = await apiRequest("/oauth/emailrequest", "email=" + email);
    const json = await data.json()
    return new Message(json);
}

/**
 * Finish email exchange.
 * @param {string} code Security code gotten from emailRequest.
 */

async function emailExchange(code) {
    if (!internalInfo.key) throw new Error('email_request needs an API key.')
    const data = await apiRequest('/oauth/emailexchange', `security_code=${code}`)
    const json = await data.json()
    return new AccessTokenObject(json)
}

/**
 * Set API key.
 * @param {string} apikey The api key to use.
 */

function setAPIKey(apikey) {
    internalInfo.key = apikey
    internalInfo.hasKey = true;
}

/**
 * Set OAuth key.
 * @param {string} oauth The OAuth key to use.
 */

function setOAuthKey(oauth) {
    internalInfo.oauthkey = oauth
    internalInfo.hasOAuth = true;
}

/**
    * Get all games.
    *
    * Returns an array containing Game objects.

*/

async function getGames() {
    // Send request to /v1/games endpoint to get all games.
    const req = await apiRequest('/games')
    // Parse request into JSON object
    const games = await req.json();
    const gamearray = [];
    // Create a new Game class for each game.
    for (const game of games.data) {
        gamearray.push(new Game(game));
    }
    // Return array
    return gamearray
}

/**
 * Gets a specific game.
 * @param {string} id ID of the game.
 */

async function getGame(id) {
    // Send request to /v1/games endpoint with game ID, parse response and pass parsed response into a new Game class.
    const data = await apiRequest(`/games/${id}`)
    // Turn data into json
    const json = await data.json()
    // Return game object
    return new Game(json);
}

/**
 * Gets all the mods a game has.
 * @param {string} gameid ID of the game to get mods from.
 * 
 */

async function getMods(gameid) {
    // Send request to v1/games/{gameid}/mods with game ID to get mods for that game.
    const req = await apiRequest(`/games/${gameid}/mods`)
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
 * 
 */

async function getMod(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid} to get info about the mod.
    const req = await apiRequest(`/games/${gameid}/mods/${modid}`);
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
 * 
 * Subscribes to a mod.
 */

async function subscribeTo(gameid, modid) {
    if (!internalInfo.oauthkey) throw new Error('susbcribeTo requires an OAuth key to function.')
    // make request to /subscribe endpoint
    const data = await apiRequest(`/games/${gameid}/mods/${modid}/subscribe`)
    // turn result into json
    const json = await data.json()
    // check for error, if there is no error return a mod, else return an APIError object (i'm not sure how to make a class that extends the normal error)
    if (!json.error) return new Mod(json);
    else return new APIError(json);
}

/**
 * Add a rating to a mod.
 * @param {string} gameid Game for the mod.
 * @param {string} modid Mod to add rating to.
 * @param {string} rating Rating you want to give, -1, 0 or 1 (0 removes rating)
 */

async function addRating(gameid, modid, rating) {
    if (!internalInfo.oauthkey) throw new Error('addRating requires an OAuth key to function.')
    // make request to /ratings with the input rating as a param
    const data = await apiRequest(`/games/${gameid}/mods/${modid}/ratings?rating=${rating}`)
    // turn result into json
    const json = await data.json()
    // return the message
    return new Message(json)
}

/**
 * Unsubscribe from a mod. Needs OAuth key.
 * @param {string} gameid The game the mod is for.
 * @param {string} modid The mod you want to unsubscribe from.
 */

async function unsubscribeFrom(gameid, modid) {
    if (internalInfo.oauthkey) throw new Error('unsubscribeFrom requires an OAuth key to function.')
    return await apiRequest(`/games/${gameid}/mods/${modid}/subscribe`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${internalInfo.oauthkey}`,
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
 */

async function getModfiles(gameid, modid, customErrorHandler, firstCall = true) {
    // Get the mod, in order to get the latest live modfiles.
    const req = await apiRequest(`/games/${gameid}/mods/${modid}`)
    // Turn the request into a JSON object.
    const res = await req.json();
    const modfiles = [];
    const latest = [];
    // Make a request to the /files endpoint to get all files.
    const mreq = await apiRequest(`/games/${gameid}/mods/${modid}/files`)
    const modfilesreq = await mreq.json()

    // Check if either of them errored, and retry twice if there is no custom error handler.
    if (!customErrorHandler && firstCall && (res.error || modfilesreq.error)) {
        console.log('hi5');
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
    // If there is a custom error handler, call it.
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
 * 
 */

 async function getModfile(gameid, modid, platform) {
    // This is supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from.
    const data = await getModfiles(gameid, modid);
    for (const modfile of data) {
        // check if modfile.platforms exists
        if (modfile.platforms) {
            for (const plat of modfile.platforms) {
                if (plat.platform == platform) {
                    return modfile;
                }
            }
        }
        else {
            // if modfile.platforms doesn't exist, return the modfile returned by getModfiles
            return modfile
        }
    }
}

/**
 * Get all mods the user is subscribed to.
 * 
 * Returns an array of Mods.
 */

async function getSubscriptions() {
    if (!internalInfo.oauthkey) throw new Error("OAuth has to be set.")
    // make request to /me/subscribed
    const req = await apiRequest('/me/subscribed')
    // turn request into json
    const res = await req.json();
    // make empty array
    const mods = [];
    // go through each mod
    for (const mod of res.data) {
        mods.push(new Mod(mod));
    }
    // return the array
    return mods
}

/**
 * Downloads a mod.
 * @param {string} gameid Game to download mod from.
 * @param {string} modid Mod to download file from.
 * @param {string} platform Platform to get file for.
 * @param {string} outputpath Where to put the file.
 * @param {boolean} useNameID To use the name ID in the link. This is to prevent mods with files that have the same names from overwriting eachother.
 */

 async function downloadMod(gameid, modid, platform, outputpath, useNameID) {
    // This was supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from while minimizing requests.
    const data = await getModfile(gameid, modid, platform);
    let name;
    // if useNameID is true, set name to what's displayed after /m/ in the url. makes an extra request, and i'm not entirely sure how to make the Modfile object contain the binary_url aswell.
    if (useNameID) name = (await getMod(gameid, modid)).name_id + '.zip';
    // if data doesn't contain the binary_url, return
    if (!data || !data.binary_url) return;
    const download = data.binary_url;
    let newoutput;
    // if name hasn't been set to something, set it to the filename
    if (!name) name = data.filename;
    // if outputpath does not with / or \\, add / and the name, else just add the name
    if (!outputpath.endsWith('/') && !outputpath.endsWith('\\')) newoutput = outputpath + '/' + name;
    else newoutput = outputpath + name;
    // declare dl for internal use
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
                    if (pipe.closed) resolve()
                    else pipe.on('close', resolve)
                });
                stream.on('error', () => reject);
            });
        })
    }
    // if the output exists, compare md5 hashes to see if the one we're trying to download is newer, else just run dl()
    if (fs.existsSync(newoutput)) {
        // create md5 hash
        const hash = crypto.createHash('md5', {encoding: 'binary'});
        // create read stream of existing file
        const stream = fs.createReadStream(newoutput);
        // update hash when stream emits data
        stream.on('data', (data) => hash.update(data));
        stream.on('end', async () => {
            // get the hash of the modfile
            const modfilehash = data.md5;
            // get the newly created hash
            const newhash = hash.digest('hex');
            // compare the hashes, if they're the same don't run dl()
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
 */

async function getModComments(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/comments to get comments from the mod.
    const req = await apiRequest(`/games/${gameid}/mods/${modid}/comments`);
    // Turn request into json
    const res = await req.json();
    const comments = [];
    // Sort through resulting json to get all comments
    for (const comment of res.data) {
        if (comment.id) {
            comments.push(new Comment(comment));
        }
    }
    // Return comments array
    return comments;
}

/**
 * Gets dependencies for a mod.
 * @param gameid Game to get mod from.
 * @param modid Mod to get dependencies for.
 * @param recursive Get sub-dependencies.
 */

async function getModDependencies(gameid, modid, recursive = false) {
    // Send request to v1/games/{gameid}/mods/{modid}/dependencies to get mod dependencies.
    const data = await apiRequest(`/games/${gameid}/mods/${modid}/dependencies`, `recursive=${recursive}`)
    // Turn result into json
    const json = await data.json()
    // Return dependencies class
    return new Dependencies(json);
}

/**
 * Parse a URL into it's mod and game.
 * @param {string} url The URL to parse, ex. https://mod.io/g/bonelab/m/m60. Gets resolved into {game: 'game', mod: 'mod'}.
 */

function parseUrl(url) {
    const mod = url.split('/m/')[1];
    const game = url.split('/g/')[1].split('/m/')[0];
    return {
        mod: mod,
        game: game
    }
}

/**
 * Get comments on a guide.
 * @param {string} gameid Game id the guide is on.
 * @param {string} guideid The guide id.
 */

async function getGuideComments(gameid, guideid) {
    const data = await apiRequest(`/games/${gameid}/guides/${guideid}/comments`);
    const json = await data.json();
    const comments = [];
    for (const comment of json.data) {
        comments.push(new Comment(comment));
    }
    return comments
}
// export everything and expose the mainInfo var

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
    subscribeTo,
    unsubscribeFrom,
    getSubscriptions,
    emailRequest,
    emailExchange,
    addRating,
    parseUrl,
    getGuideComments,
    exposedInfo
}