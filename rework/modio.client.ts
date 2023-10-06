import fs from "fs";
import https from "https";
import { apiRequest } from "./lib/request.js";
import * as classes from "./lib/classes.js";
import * as interfaces from "./lib/interfaces.js"

export class ModioClient {
    private OAuth: string;
    private APIKey: string;
    private useTestEnvironment: boolean;

    constructor(testEnv: boolean = false) {
        this.useTestEnvironment = testEnv;
    }

    /**
     * Set API key for this instance.
     */

    setApiAuth(auth: string) {
        this.APIKey = auth;
    }

    /**
     * Set OAuth token for this instance.
     */

    setOAuthToken(token: string) {
        this.OAuth = token;
    }

    /**
     * Make a request to get an OAuth token through email.
     */

    async emailRequest(email: string) {
        if (this.APIKey == undefined) throw new Error("client.emailRequest() requires an API key.")
        const data = await apiRequest(`/oauth/emailrequest?api_key=${this.APIKey}&email=${email}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }, this.useTestEnvironment);
        if (data.error) {
            const error: interfaces.Error = data;
            return error;
        }
        return new classes.emailRequest(data.message, data.code, this.APIKey, this.useTestEnvironment);
    }

    /**
     * Log out of the current session (only applicable if an OAuth key is available.)
     */

    async logout() {
        if (this.OAuth == undefined) throw new Error("client.logout() requires an OAuth key.");
        const data: interfaces.Message | interfaces.Error = await apiRequest(`/oauth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.OAuth}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }, this.useTestEnvironment)
        return data;
    }

    /**
     * Get all games on mod.io.
     */

    async getGames(useOAuth: boolean = false) {
        if (this.OAuth == undefined && this.APIKey == undefined) throw new Error("client.getGames() requires an API key or an OAuth key.");
        let headers: RequestInit | undefined;
        if (useOAuth && this.OAuth != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuth}`
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

        const data = await apiRequest(`/games${(!useOAuth && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers, this.useTestEnvironment);
        if ('error' in data) {
            const error: interfaces.Error = data;
            return error;
        }
        const newData: interfaces.getGames = {
            data: [],
            result_count: data.result_count,
            result_offset: data.result_offset,
            result_limit: data.result_limit,
            result_total: data.result_total
        }
        for (const game of data.data) {
            newData.data.push(new classes.Game({OAuth: this.OAuth, API: this.APIKey, testEnv: this.useTestEnvironment}, game));
        }
        return newData;
    }
    
    /**
     * Get a specific game. Must use an ID returned within a game object.
     */

    async getGame(id: number, useOAuth: boolean = false) {
        if (this.OAuth == undefined && this.APIKey == undefined) throw new Error("client.getGame() requires an API key or an OAuth key.");
        let headers;
        if (useOAuth && this.OAuth != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuth}`
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
        const data = await apiRequest(`/games/${id}${(!useOAuth && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers, this.useTestEnvironment);
        if ('error' in data) {
            const error: interfaces.Error = data;
            return error;
        }
        const parsed = new classes.Game({OAuth: this.OAuth, API: this.APIKey, testEnv: this.useTestEnvironment}, data);
        return parsed;    
    }
}
