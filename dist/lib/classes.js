import { apiRequest } from './request.js';
import https from "https";
/**
 * The second half of an email exchange.
 */
export class emailRequest {
    constructor(message, code, key, testEnv = false) {
        this.APIKey = key;
        this.message = message;
        this.code = code;
        this.useTestEnv = testEnv;
    }
    async finishExchange(securityCode) {
        const data = await apiRequest(`/oauth/emailexchange?api_key=${this.APIKey}&security_code=${securityCode}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }, this.useTestEnv);
        return data;
    }
}
/**
 * A mod, for a specific game.
 */
export class Mod {
    constructor(data, ModInfo) {
        if (data.OAuth)
            this.OAuthKey = data.OAuth;
        this.useTestEnv = data.testEnv;
        this.info = ModInfo;
    }
    /**
     * Get buffer for specified modfile platform.
     * Only works if the game doesn't require mod downloads to be initiated through API, as it doesn't handle hashes.
     * It is recommended to implement a custom download method instead of using this.
     */
    getDownloadBuffer(platform) {
        const modfile = this.info.modfile;
        if (modfile.platforms.find((val) => val.platform == platform) == undefined && platform != "ignore")
            throw new Error(`Mod ${this.info.name} does not have support for platform ${platform}!`);
        return new Promise((resolve, reject) => {
            https.get(modfile.download.binary_url, (res) => {
                const chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("close", () => {
                    resolve(Buffer.from(chunks));
                });
                res.on("error", (err) => reject(err));
            });
        });
    }
    /**
     * Add a rating for this mod.
     */
    async addRating(rating) {
        if (this.OAuthKey == undefined)
            throw new Error("Mod.addRating() requires an OAuth key.");
        const resolvedRating = rating == "positive" ? 1 : rating == "negative" ? -1 : 0;
        const response = await apiRequest(`/games/${this.info.game_id}/mods/${this.info.id}/ratings?rating=${resolvedRating}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${this.OAuthKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept": "application/json"
            }
        }, this.useTestEnv);
        return response;
    }
}
/**
 * A game.
 */
export class Game {
    constructor(data, GameInfo) {
        if (data.OAuth)
            this.OAuthKey = data.OAuth;
        if (data.API)
            this.APIKey = data.API;
        this.useTestEnv = data.testEnv;
        this.info = GameInfo;
    }
    async getMods(useOAuth = false) {
        if (this.APIKey == undefined && !useOAuth)
            throw new Error("Game.getMods() requires an API key.");
        if (this.OAuthKey == undefined && useOAuth)
            throw new Error("Game.getMods() requires an OAuth key when passing useOAuth as true.");
        let headers;
        if (useOAuth && this.OAuthKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuthKey}`
                }
            };
        }
        if (this.APIKey != undefined && !useOAuth) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            };
        }
        const data = await apiRequest(`/games/${this.info.id}/mods${(!useOAuth && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers);
        if ('error' in data) {
            const returnval = data;
            return returnval;
        }
        const newData = {
            data: [],
            result_count: data.result_count,
            result_offset: data.result_offset,
            result_limit: data.result_limit,
            result_total: data.result_total
        };
        for (const mod of data.data) {
            newData.data.push(new Mod({ OAuth: this.OAuthKey, testEnv: this.useTestEnv }, mod));
        }
        return newData;
    }
    async getMod(id, useOAuth = false) {
        if (this.APIKey == undefined && !useOAuth)
            throw new Error("Game.getMod() requires an API key.");
        if (this.OAuthKey == undefined && useOAuth)
            throw new Error("Game.getMod() requires an OAuth key when passing useOAuth as true.");
        let headers;
        if (useOAuth && this.OAuthKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuthKey}`
                }
            };
        }
        if ((!useOAuth) && this.APIKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            };
        }
        const data = await apiRequest(`/games/${this.info.id}/mods/${id}${(!useOAuth && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers, this.useTestEnv);
        if ('error' in data) {
            const returnval = data;
            return returnval;
        }
        const newData = new Mod({ OAuth: this.OAuthKey, testEnv: this.useTestEnv }, data);
        return newData;
    }
}
