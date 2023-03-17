import { APIError } from './error';
export declare class Message {
    code: number;
    message: string;
    error: APIError | undefined;
    isError: boolean;
    constructor(tbl: any);
}
export declare class AccessTokenObject {
    code: number;
    access_token: number;
    date_expires: number;
    error: APIError | undefined;
    isError: boolean;
    constructor(tbl: any);
}
