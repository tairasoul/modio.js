"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Modfile = void 0;
var https_1 = require("https");
var fs_1 = require("fs");
var Modfile = /** @class */ (function () {
    function Modfile(tbl) {
        var _a, _b, _c, _d;
        this.id = tbl.id;
        this.mod_id = tbl.mod_id;
        this.date_added = tbl.date_added;
        this.date_scanned = tbl.date_scanned;
        this.virus_status = tbl.virus_status;
        this.virus_positive = tbl.virus_positive;
        this.virustotal_hash = tbl.virustotal_hash;
        this.filesize = tbl.filesize;
        this.md5 = tbl.filehash.md5;
        this.filename = tbl.filename;
        this.version = tbl.version;
        this.changelog = tbl.changelog;
        this.metadata_blob = tbl.metadata_blob;
        this.binary_url = tbl.download.binary_url;
        this.date_expires = tbl.download.date_expires;
        if (tbl.platforms.length > 0) {
            this.platforms = [];
            for (var i = 0; i < tbl.platforms.length; i++) {
                var tblplat = tbl.platforms[i];
                var tplat = {
                    label: (_a = tblplat.label) !== null && _a !== void 0 ? _a : '',
                    moderated: (_b = tblplat.moderated) !== null && _b !== void 0 ? _b : true,
                    platform: (_c = tblplat.platform) !== null && _c !== void 0 ? _c : '',
                    status: (_d = tblplat.status) !== null && _d !== void 0 ? _d : 0
                };
                this.platforms.push(tplat);
            }
        }
    }
    Modfile.prototype.downloadFile = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        (0, https_1.get)(_this.binary_url, function (incoming) {
                            var stream = (0, fs_1.createWriteStream)(path);
                            incoming.pipe(stream);
                            stream.on('finish', function () { return resolve; });
                            stream.on('error', function () { return reject; });
                        });
                    })];
            });
        });
    };
    return Modfile;
}());
exports.Modfile = Modfile;
