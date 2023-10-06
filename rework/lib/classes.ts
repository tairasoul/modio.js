import * as interfaces from './interfaces.js';
import { apiRequest } from './request.js';
import https from "https";

/**
 * The second half of an email exchange.
 */

export class emailRequest {
    private APIKey: string;
    message: string;
    code: number;
    private useTestEnv: boolean;

    constructor(message: string, code: number, key: string, testEnv: boolean = false) {
        this.APIKey = key;
        this.message = message;
        this.code = code;
        this.useTestEnv = testEnv
    }

    async finishExchange(securityCode: string) {
        const data: interfaces.AccessTokenObject | interfaces.Error = await apiRequest(`/oauth/emailexchange?api_key=${this.APIKey}&security_code=${securityCode}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }, this.useTestEnv)
        return data;
    }
}

/**
 * A mod, for a specific game.
 */

export class Mod {
    private OAuthKey: string;
    private useTestEnv: boolean;
    info: interfaces.ModInfo;
    
    constructor(data: {OAuth: string | undefined, testEnv: boolean}, ModInfo: interfaces.ModInfo) {
        if (data.OAuth) this.OAuthKey = data.OAuth;
        this.useTestEnv = data.testEnv;
        this.info = ModInfo;
    }

    /**
     * Get buffer for specified modfile platform.
     * Only works if the game doesn't require mod downloads to be initiated through API, as it doesn't handle hashes.
     * It is recommended to implement a custom download method instead of using this.
     */

    getDownloadBuffer(platform: string) {
        const modfile = this.info.modfile;
        if (modfile.platforms.find((val) => val.platform == platform) == undefined && platform != "ignore") throw new Error(`Mod ${this.info.name} does not have support for platform ${platform}!`);
        return new Promise<Buffer>((resolve, reject) => {
            https.get(modfile.download.binary_url, (res) => {
                const chunks: any[] = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("close", () => {
                    resolve(Buffer.from(chunks));
                })
                res.on("error", (err) => reject(err));
            })
        })
    }

    /**
     * Add a rating for this mod.
     */

    async addRating(rating: "positive" | "negative" | "none") {
        if (this.OAuthKey == undefined) throw new Error("Mod.addRating() requires an OAuth key.")
        const resolvedRating = rating == "positive" ? 1 : rating == "negative" ? -1 : 0;
        const response: interfaces.Message | interfaces.Error = await apiRequest(`/games/${this.info.game_id}/mods/${this.info.id}/ratings?rating=${resolvedRating}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${this.OAuthKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept": "application/json"
            }
        }, this.useTestEnv)
        return response;
    }
}

/**
 * A game.
 */

export class Game {
    private OAuthKey: string;
    private useTestEnv: boolean;
    private APIKey: string;
    info: interfaces.GameInfo;

    constructor(data: {OAuth: string | undefined, API: string | undefined, testEnv: boolean}, GameInfo: interfaces.GameInfo) {
        if (data.OAuth) this.OAuthKey = data.OAuth;
        if (data.API) this.APIKey = data.API;
        this.useTestEnv = data.testEnv;
        this.info = GameInfo;
    }

    async getMods(useOAuth: boolean = false) {
        if (this.APIKey == undefined && !useOAuth) throw new Error("Game.getMods() requires an API key.");
        if (this.OAuthKey == undefined && useOAuth) throw new Error("Game.getMods() requires an OAuth key when passing useOAuth as true.");
        let headers: RequestInit | undefined;
        if (useOAuth && this.OAuthKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuthKey}`
                }
            }
        }

        if (this.APIKey != undefined && !useOAuth) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        }
        const data = await apiRequest(`/games/${this.info.id}/mods${(!useOAuth && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers);
        if ('error' in data) {
            const returnval: interfaces.Error = data;
            return returnval;
        }
        const newData: interfaces.getMods = {
            data: [],
            result_count: data.result_count,
            result_offset: data.result_offset,
            result_limit: data.result_limit,
            result_total: data.result_total
        }
        for (const mod of data.data) {
            newData.data.push(new Mod({OAuth: this.OAuthKey,testEnv: this.useTestEnv}, mod));
        }
        return newData
    }

    async getMod(id: number, useOAuth: boolean = false) {
        if (this.APIKey == undefined && !useOAuth) throw new Error("Game.getMod() requires an API key.");
        if (this.OAuthKey == undefined && useOAuth) throw new Error("Game.getMod() requires an OAuth key when passing useOAuth as true.");
        let headers;
        if (useOAuth && this.OAuthKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuthKey}`
                }
            }
        }
        if ((!useOAuth) && this.APIKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        }
        const data = await apiRequest(`/games/${this.info.id}/mods/${id}${(!useOAuth && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers, this.useTestEnv);
        if ('error' in data) {
            const returnval: interfaces.Error = data;
            return returnval;
        }
        const newData: Mod = new Mod({OAuth: this.OAuthKey, testEnv: this.useTestEnv}, data);
        return newData
    }
}
