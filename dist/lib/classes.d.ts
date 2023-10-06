/// <reference types="node" />
import * as interfaces from './interfaces.js';
/**
 * The second half of an email exchange.
 */
export declare class emailRequest {
    private APIKey;
    message: string;
    code: number;
    private useTestEnv;
    constructor(message: string, code: number, key: string, testEnv?: boolean);
    finishExchange(securityCode: string): Promise<interfaces.Error | interfaces.AccessTokenObject>;
}
/**
 * A mod, for a specific game.
 */
export declare class Mod {
    private OAuthKey;
    private useTestEnv;
    info: interfaces.ModInfo;
    constructor(data: {
        OAuth: string | undefined;
        testEnv: boolean;
    }, ModInfo: interfaces.ModInfo);
    /**
     * Get buffer for specified modfile platform.
     * Only works if the game doesn't require mod downloads to be initiated through API, as it doesn't handle hashes.
     * It is recommended to implement a custom download method instead of using this.
     */
    getDownloadBuffer(platform: string): Promise<Buffer>;
    /**
     * Add a rating for this mod.
     */
    addRating(rating: "positive" | "negative" | "none"): Promise<interfaces.Error | interfaces.Message>;
}
/**
 * A game.
 */
export declare class Game {
    private OAuthKey;
    private useTestEnv;
    private APIKey;
    info: interfaces.GameInfo;
    constructor(data: {
        OAuth: string | undefined;
        API: string | undefined;
        testEnv: boolean;
    }, GameInfo: interfaces.GameInfo);
    getMods(useOAuth?: boolean): Promise<interfaces.Error | interfaces.getMods>;
    getMod(id: number, useOAuth?: boolean): Promise<interfaces.Error | Mod>;
}
