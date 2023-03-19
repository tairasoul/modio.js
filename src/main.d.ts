import { Mod } from '../lib/mod';
import { Modfile } from '../lib/modfile';
import { Comment } from '../lib/comment';
import { Game } from '../lib/game';
import { Message, AccessTokenObject } from '../lib/misc';
import { APIError } from '../lib/error';
import { Dependencies } from '../lib/dependency';

declare namespace modio {
    export function email_request(email: string): Message;
    export function email_exchange(code: string): AccessTokenObject;
    export function useOAuthKey(): void;
    export function useAPIKey(): void;
    export function setAPIKey(apikey: string): void;
    export function setOAuthKey(oauth: string): void;
    export function usingOAuth(): boolean;
    export function hasKey(): boolean;
    export function getGames(): Array<Game>;
    export function getGame(id: string): Game;
    export function getMods(gameid: string): Array<Mod>;
    export function getMod(gameid: string, modid: string):  Mod;
    export function getModfiles(gameid: string, modid: string, customErrorHandler: Function): Array<Modfile>;
    export function getModfile(gameid: string, modid: string, platform: string): Modfile;
    export function subscribeTo(gameid: string, modid: string): Mod | APIError;
    export function unsubscribeFrom(gameid: string, modid: string): void;
    export function addRating(gameid: string, modid: string, rating: "-1" | "0" | "1"): Message;
    export function getSubscriptions(): Array<Mod>;
    export function downloadMod(gameid: string, modid: string, platform: string, outputpath: string, useNameID: boolean): void;
    export function getModComments(gameid: string, modid: string): Array<Comment>;
    export function getModDependencies(gameid: string, modid: string): Dependencies;
    export var isUsingAPIKey: boolean;
    export var isUsingOAuthKey: boolean;
}

export = modio;
