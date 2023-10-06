import * as classes from "./lib/classes.js";
import * as interfaces from "./lib/interfaces.js";
export declare class ModioClient {
    private OAuth;
    private APIKey;
    private useTestEnvironment;
    constructor(testEnv?: boolean);
    /**
     * Set API key for this instance.
     */
    setApiAuth(auth: string): void;
    /**
     * Set OAuth token for this instance.
     */
    setOAuthToken(token: string): void;
    /**
     * Make a request to get an OAuth token through email.
     */
    emailRequest(email: string): Promise<interfaces.Error | classes.emailRequest>;
    /**
     * Log out of the current session (only applicable if an OAuth key is available.)
     */
    logout(): Promise<interfaces.Error | interfaces.Message>;
    /**
     * Get all games on mod.io.
     */
    getGames(useOAuth?: boolean): Promise<interfaces.Error | interfaces.getGames>;
    /**
     * Get a specific game. Must use an ID returned within a game object.
     */
    getGame(id: number, useOAuth?: boolean): Promise<interfaces.Error | classes.Game>;
}
