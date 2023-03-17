export class APIError {
    code: number;
    error_ref: number;
    message: string;
    errors: object;
    constructor(tbl) {
        if (tbl.error) {
            this.code = tbl.error.code;
            this.error_ref = tbl.error.error_ref;
            this.message = tbl.error.message;
            this.errors = tbl.error.errors;
        }
    }
}
