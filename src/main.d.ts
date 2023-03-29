import { Mod } from '../lib/mod';
import { Modfile } from '../lib/modfile';
import { Comment } from '../lib/comment';
import { Game } from '../lib/game';
import { Message, AccessTokenObject } from '../lib/misc';
import { APIError } from '../lib/error';
import { Dependencies } from '../lib/dependency';

declare namespace modio {
    export function emailRequest(email: string): Promise<Message>;
    export function emailExchange(code: string): Promise<AccessTokenObject>;
    export function setAPIKey(apikey: string): void;
    export function setOAuthKey(oauth: string): void;
    export function getGames(): Promise<Game[]>;
    export function getGame(id: string): Promise<Game>;
    export function getMods(gameid: string): Promise<Mod[]>;
    export function getMod(gameid: string, modid: string):  Promise<Mod>;
    export function getModfiles(gameid: string, modid: string, customErrorHandler: Function | void): Promise<Modfile[]>;
    export function getModfile(gameid: string, modid: string, platform: string): Promise<Modfile>;
    export function subscribeTo(gameid: string, modid: string): Promise<Mod | APIError>;
    export function unsubscribeFrom(gameid: string, modid: string): Promise<void>;
    export function addRating(gameid: string, modid: string, rating: "-1" | "0" | "1"): Promise<Message>;
    export function getSubscriptions(): Promise<Array<Mod>>;
    export function downloadMod(gameid: string, modid: string, platform: string, outputpath: string, useNameID: boolean): Promise<void>;
    export function getModComments(gameid: string, modid: string): Promise<Comment[]>;
    export function getModDependencies(gameid: string, modid: string): Promise<Dependencies>;
    export function parseUrl(url: string): {mod: string, game: string};
    export var exposedInfo: {
        hasKey: boolean,
        hasOAuth: boolean
    }
}

export = modio;
