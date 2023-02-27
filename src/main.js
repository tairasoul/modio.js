const fs = require(`fs`);
const fetch = require(`../../node_modules/node-fetch`);
const https = require('https')

// No logins are included as of now, due to me not understanding them.

let key;

function setAPIKey(apikey) {
    key = apikey
}

function getGames() {
    // Send request to /v1/games endpoint to get all games.
    return fetch(`https://api.mod.io/v1/games?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

function getGame(id) {
    // Send request to /v1/games endpoint with game ID to get details about the game.
    return fetch(`https://api.mod.io/v1/games/${id}?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

function getMods(gameid) {
    // Send request to v1/games/{gameid}/mods with game ID to get mods for that game.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

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

function getModfiles(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/files to get all files from the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/files?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

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

function getModComments(gameid, modid) {
    // Send request to v1/games/{gameid}/mods/{modid}/comments to get comments from the mod.
    return fetch(`https://api.mod.io/v1/games/${gameid}/mods/${modid}/comments?api_key=${key}`, {
        method: `GET`,
        headers: {
            'Accept': 'application/json'
        }
    })
}

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
