const fs = require(`fs`);
const fetch = require(`node-fetch`);
const https = require('https')

// No logins are included as of now, due to me not understanding them and lacking general knowledge of how to obtain the necessary tokens.

let key;

function setAPIKey(apikey) {
    key = apikey
}

/**
    * Get all games.
    *
    * @return Promise<Object>
    * 
    * Returns an object containing an array called data.
    * Data contains objects, representing each game.
    * The objects contain something like shown in mod.io's official API docs: https://docs.mod.io/?javascript--nodejs#get-games-2

*/

function getGames() {
    // Send request to /v1/games endpoint to get all games.
    return fetch(`https://api.mod.io/v1/games?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

/**
 * Gets a specific game.
 * @param id ID of the game.
 * @returns {*} Promise<Object>
 * 
 * Returns an object, containing multiple properties, including the game ID, status and others.
 * You can see an example of it here: https://docs.mod.io/?javascript--nodejs#game-object
 */

function getGame(id) {
    // Send request to /v1/games endpoint with game ID to get details about the game.
    return fetch(`https://api.mod.io/v1/games/${id}?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

/**
 * Gets all the mods a game has.
 * @param gameid ID of the game to get mods from.
 * @returns {*} Promise<Object>
 * 
 * Contains an object, containing an array called data.
 * This array contains multiple objects representing each mod.
 * You can see an example here: https://docs.mod.io/?javascript--nodejs#get-mods-2
 */

function getMods(gameid) {
    // Send request to v1/games/{gameid}/mods with game ID to get mods for that game.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

/**
 * Gets a mod from a specific game.
 * @param gameid The gameID to get the mod from.
 * @param modid The ID of the mod to get.
 * @returns {*} Promise<Object>
 * Contains an object which contains a lot of properties.
 * You can see an example here: https://docs.mod.io/?javascript--nodejs#mod-object
 */

function getMod(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid} to get info about the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

// This only contains basic mod functions, no uploading, adding, editing or deleting yet.

/**
 * Gets the files of a specific mod.
 * @param gameid Game to get files from.
 * @param modid Mod to get files from.
 * @returns {*} Promise<Object>
 * Contains an object with an array.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-modfiles-2
 */

function getModfiles(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/files to get all files from the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/files?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

/**
 * Gets a specific modfile.
 * @param gameid Game to get mod from.
 * @param modid Mod to get file from.
 * @param platform Platform to get file for.
 * @returns {*} Promise<Object>
 * Contains an object.
 * View example here: https://docs.mod.io/?javascript--nodejs#modfile-object
 * Side note, I am not sure how to get the file id, meaning if there's more than one file for your platform, it will likely only download the first one it gets.
 * If anyone knows how to get the file id, please do create a pull request.
 */

async function getModfile(gameid, modid, platform) {
    // This is supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from.
    const res = await getModfiles(gameid, modid);
    const data = await res.json();
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
 * @param platform Platform to download file for.
 * @param outputpath Where to put the file.
 * @returns {*} Promise
 * 
 * Downloads a mod based on it's platform ,because I don't know where to get the mod's fileid from.
 */

async function downloadMod(gameid, modid, platform, outputpath) {
    // This was supposed to send a request to v1/games/{gameid}/mods/{modid}/files/{fileid} to get a specific file from the mod, but I don't know where to get the fileid from.
    const data = await getModfile(gameid, modid, platform);
    const download = data.download.binary_url;
    const name = data.filename
    const res = await fetch(download, {
        method: 'GET'
    });
    let newoutput;
    if (!outputpath.endsWith('/') && !outputpath.endsWith('\\')) newoutput = outputpath + '/' + name;
    else newoutput = outputpath + name;
    const newurl = res.url;
    const downloading = https.get(newurl, (res) => {
        res.pipe(fs.createWriteStream(newoutput))
    });
    return new Promise(resolve => {downloading.on('finish', resolve)}, reject => {downloading.on('error', (error) => reject(error))})
}

/**
 * Gets the comments from a mod.
 * @param gameid Game to get mod from.
 * @param modid Mod to get comments from.
 * @returns {*} Promise<Object>
 * Object yet again contains an array called data.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-mod-comments-2
 */

function getModComments(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/comments to get comments from the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/comments?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

/**
 * Gets dependencies for a mod.
 * @param gameid Game to get mod from.
 * @param modid Mod to get dependencies for.
 * @returns {*} Promise<Object>
 * Object yet again contains an array called data.
 * View example here: https://docs.mod.io/?javascript--nodejs#get-mod-dependencies-2
 */

function getModDependencies(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/dependencies to get mod dependencies.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/dependencies?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
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
    setAPIKey
}
