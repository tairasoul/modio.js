import * as interfaces from './interfaces';
import { apiRequest } from './request';
import https from "https";

/**
 * The second half of an email exchange.
 */

export class emailRequest {
    private APIKey: string;
    message: string;
    code: number;
    private useTestEnv: boolean;
    private apiPath: string;

    constructor(message: string, code: number, key: string, apiPath: string, testEnv: boolean = false) {
        this.APIKey = key;
        this.message = message;
        this.code = code;
        this.useTestEnv = testEnv
        this.apiPath = apiPath;
    }

    async finishExchange(securityCode: string) {
        const data: interfaces.AccessTokenObject | interfaces.Error = await apiRequest(this.apiPath, `/oauth/emailexchange?api_key=${this.APIKey}&security_code=${securityCode}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }, this.useTestEnv)
        return data;
    }
}

export class Mod {
    private OAuthKey: string;
    private useTestEnv: boolean;
    private apiPath: string;
    info: interfaces.ModInfo;
    
    constructor(data: {OAuth: string | undefined, testEnv: boolean, apiPath: string}) {
        if (data.OAuth) this.OAuthKey = data.OAuth;
        this.useTestEnv = data.testEnv;
        this.apiPath = data.apiPath
    }

    getDownloadBuffer(platform: string) {
        const modfile = this.info.modfile;
        if (modfile.platforms.find((val) => val.platform == platform) == undefined) throw new Error(`Mod ${this.info.name} does not have support for platform ${platform}!`);
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

    async addRating(rating: "positive" | "negative" | "none") {
        if (this.OAuthKey == undefined) throw new Error("Mod.addRating() requires an OAuth key.")
        const resolvedRating = rating == "positive" ? 1 : rating == "negative" ? -1 : 0;
        const response: interfaces.Message | interfaces.Error = await apiRequest(this.apiPath, `/games/${this.info.game_id}/mods/${this.info.id}/ratings?rating=${resolvedRating}`, {
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

export class Game {
    private OAuthKey: string;
    private useTestEnv: boolean;
    private apiPath: string;
    private APIKey: string;
    info: interfaces.GameInfo;

    constructor(data: {OAuth: string | undefined, API: string | undefined, testEnv: boolean, apiPath: string}, GameInfo: interfaces.GameInfo) {
        if (data.OAuth) this.OAuthKey = data.OAuth;
        if (data.API) this.APIKey = data.API;
        this.useTestEnv = data.testEnv;
        this.apiPath = data.apiPath;
        this.info = GameInfo;
    }
}
