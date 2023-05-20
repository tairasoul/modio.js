"use strict";
exports.__esModule = true;
exports.APIError = void 0;
var APIError = /** @class */ (function () {
    function APIError(tbl) {
        if (tbl.error) {
            this.code = tbl.error.code;
            this.error_ref = tbl.error.error_ref;
            this.message = tbl.error.message;
            this.errors = tbl.error.errors;
        }
    }
    return APIError;
}());
exports.APIError = APIError;
