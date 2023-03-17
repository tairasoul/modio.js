"use strict";
exports.__esModule = true;
exports.AccessTokenObject = exports.Message = void 0;
var error_1 = require("./error");
var Message = /** @class */ (function () {
    function Message(tbl) {
        if (!tbl.error) {
            this.isError = false;
            this.code = tbl.code;
            this.message = tbl.message;
        }
        else {
            this.isError = true;
            this.error = new error_1.APIError(tbl);
        }
    }
    return Message;
}());
exports.Message = Message;
var AccessTokenObject = /** @class */ (function () {
    function AccessTokenObject(tbl) {
        if (!tbl.error) {
            this.code = tbl.code;
            this.access_token = tbl.access_token;
            this.date_expires = tbl.date_expires;
            this.isError = false;
        }
        else {
            this.isError = true;
            this.error = new error_1.APIError(tbl);
        }
    }
    return AccessTokenObject;
}());
exports.AccessTokenObject = AccessTokenObject;
