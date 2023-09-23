import fs from "fs";
import https from "https";
import { apiRequest } from "./lib/request";
import * as classes from "./lib/classes";
import * as interfaces from "./lib/interfaces"

export class ModioClient {
    private OAuth: string;
    private APIKey: string;
    private useTestEnvironment: boolean;
    // preferOauth
    private pOAuth: boolean = false;
    // preferAPI
    private pAPI: boolean = true;
    private noPreferences: boolean = false;
    private apiPath: string;

    constructor(apiPath: string, testEnv: boolean = false) {
        this.useTestEnvironment = testEnv;
        this.apiPath = apiPath;
    }

    /**
     * Should ModioClient prefer OAuth for requests that can be done by an API key?
     */

    preferOAuth() {
        this.enablePreferences();
        if (this.pAPI) this.pAPI = false;
        this.pOAuth = true;
    }

    /**
     * Should ModioClient prefer the API key for non-OAuth requests?
     */

    preferAPI() {
        this.enablePreferences();
        if (this.pOAuth) this.pOAuth = false;
        this.pAPI = true;
    }

    /** 
     * Disable key preferences.
     */

    disablePreferences() {
        this.noPreferences = true;
    }

    /**
     * Enable preferring OAuth/API key.
     */

    enablePreferences() {
        this.noPreferences = false;
    }

    /**
     * Make a request to get an OAuth token through email.
     */

    async emailRequest(email: string) {
        if (this.APIKey == undefined) throw new Error("ModioClient does not have an API key!")
        const data = await apiRequest(this.apiPath, `/oauth/emailrequest?api_key=${this.APIKey}&email=${email}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }, this.useTestEnvironment);
        if (data.error) {
            const error: interfaces.Error = data;
            return error;
        }
        return new classes.emailRequest(data.message, data.code, this.APIKey, this.apiPath, this.useTestEnvironment);
    }

    /**
     * Log out of the current session (only applicable if an OAuth key is available.)
     */

    async logout() {
        if (this.OAuth == undefined) throw new Error("ModioClient does not have an OAuth key!");
        const data: interfaces.Message | interfaces.Error = await apiRequest(this.apiPath, `/oauth/logout`, {
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

    async getGames() {
        if (this.OAuth == undefined && this.APIKey == undefined) throw new Error("ModioClient does not have an OAuth or API key!");
        let headers;
        if (this.pOAuth && this.OAuth != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuth}`
                }
            }
        }

        if ((this.pAPI || this.noPreferences) && this.APIKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        }

        const data = await apiRequest(this.apiPath, `/games${((this.pAPI || this.noPreferences) && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers, this.useTestEnvironment);
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
            newData.data.push(new classes.Game({OAuth: this.OAuth, API: this.APIKey, testEnv: this.useTestEnvironment, apiPath: this.apiPath}, game));
        }
        return newData;
    }
    
    /**
     * Get a specific game. Must use an ID returned within a game object.
     */

    async getGame(id: number) {
        if (this.OAuth == undefined && this.APIKey == undefined) throw new Error("ModioClient does not have an OAuth or API key!");
        let headers;
        if (this.pOAuth && this.OAuth != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${this.OAuth}`
                }
            }
        }

        if ((this.pAPI || this.noPreferences) && this.APIKey != undefined) {
            headers = {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        }
        const data = await apiRequest(this.apiPath, `/games/${id}${((this.pAPI || this.noPreferences) && this.APIKey != undefined) ? `?api_key=${this.APIKey}` : ""}`, headers, this.useTestEnvironment);
        if ('error' in data) {
            const error: interfaces.Error = data;
            return error;
        }
        const parsed = new classes.Game({OAuth: this.OAuth, API: this.APIKey, testEnv: this.useTestEnvironment, apiPath: this.apiPath}, data);
        return parsed;    
    }
}
