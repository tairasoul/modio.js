import { APIError } from './error';

export class Message {
    code: number;
    message: string;
    error: APIError | undefined;
    isError: boolean;
    constructor(tbl) {
        if (!tbl.error) {
            this.isError = false;
            this.code = tbl.code;
            this.message = tbl.message;
        }
        else {
            this.isError = true;
            this.error = new APIError(tbl);
        }
    }
}

export class AccessTokenObject {
    code: number;
    access_token: number;
    date_expires: number;
    error: APIError | undefined;
    isError: boolean;
    constructor(tbl) {
        if (!tbl.error) {
            this.code = tbl.code;
            this.access_token = tbl.access_token;
            this.date_expires = tbl.date_expires;
            this.isError = false;
        }
        else {
            this.isError = true;
            this.error = new APIError(tbl)
        }
    }
}
