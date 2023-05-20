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
exports.Mod = void 0;
var main_1 = require("../src/main");
var Mod = /** @class */ (function () {
    function Mod(tbl) {
        var _a, _b, _c, _d, _e;
        this.id = tbl.id;
        this.game_id = tbl.game_id;
        this.status = tbl.status;
        this.visible = tbl.visible;
        if (tbl.submitter && ((_a = tbl.submitter) === null || _a === void 0 ? void 0 : _a.id)) {
            this.submitter.id = tbl.submitted_by.id;
            this.submitter.name_id = tbl.submitted_by.name_id;
            this.submitter.username = tbl.submitted_by.username;
            this.submitter.date_online = tbl.submitted_by.date_online;
            this.submitter.date_joined = tbl.submitted_by.date_joined;
            this.submitter.avatar.filename = tbl.submitted_by.avatar.filename;
            this.submitter.avatar.original = tbl.submitted_by.avatar.original;
            this.submitter.avatar.thumb_50x50 = tbl.submitted_by.avatar.thumb_50x50;
            this.submitter.avatar.thumb_100x100 = tbl.submitted_by.avatar.thumb_100x100;
            this.submitter.timezone = tbl.submitted_by.timezone;
            this.submitter.language = tbl.submitted_by.language;
            this.submitter.profile_url = tbl.submitted_by.profile_url;
        }
        this.date_added = tbl.date_added;
        this.date_updated = tbl.date_updated;
        this.date_live = tbl.date_live;
        this.maturity_option = tbl.maturity_option;
        this.community_options = tbl.community_options;
        this.monetisation_options = tbl.monetisation_options;
        this.price = tbl.price;
        this.tax = tbl.tax;
        if (this.logo) {
            this.logo.filename = tbl.logo.filename;
            this.logo.original = tbl.logo.original;
            this.logo.thumb_320x180 = tbl.logo.thumb_320x180;
            this.logo.thumb_640x360 = tbl.logo.thumb_640x360;
            this.logo.thumb_1280x720 = tbl.logo.thumb_1280x720;
        }
        this.homepage_url = tbl.homepage_url;
        this.name = tbl.name;
        this.name_id = tbl.name_id;
        this.summary = tbl.summary;
        this.description = tbl.description;
        this.description_plaintext = tbl.description_plaintext;
        this.metadata_blob = tbl.metadata_blob;
        this.mod_url = tbl.profile_url;
        if ((_b = tbl.media) === null || _b === void 0 ? void 0 : _b.youtube) {
            this.youtube_media = tbl.media.youtube;
        }
        if ((_c = tbl.media) === null || _c === void 0 ? void 0 : _c.sketchfab) {
            this.sketchfab_media = tbl.media.sketchfab;
        }
        if ((_d = tbl.media) === null || _d === void 0 ? void 0 : _d.images) {
            this.images = tbl.media.images;
        }
        if ((_e = tbl.modfile) === null || _e === void 0 ? void 0 : _e.downloads_today) {
            this.popularity_rank_position = tbl.modfile.popularity_rank_position;
            this.popularity_rank_total_mods = tbl.modfile.popularity_rank_total_mods;
            this.downloads_today = tbl.modfile.downloads_today;
            this.downloads_total = tbl.modfile.downloads_total;
            this.subscribers_total = tbl.modfile.subscribers_total;
            this.ratings_total = tbl.modfile.ratings_total;
            this.ratings_positive = tbl.modfile.ratings_positive;
            this.ratings_negative = tbl.modfile.ratings_negative;
            this.ratings_display_text = tbl.modfile.ratings_display_text;
        }
    }
    Mod.prototype.getModfiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, main_1.getModfiles)(this.mod_url.split('/g/')[1].split('/m/')[0], this.mod_url.split('/m/')[1])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Mod.prototype.download = function (outputDir, platform) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var modfiles, _loop_1, _i, modfiles_1, modfile;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.getModfiles()];
                                case 1:
                                    modfiles = _a.sent();
                                    _loop_1 = function (modfile) {
                                        modfile.platforms.filter(function (plat) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!(plat.platform == platform)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, modfile.downloadFile("".concat(outputDir, "/").concat(this.name_id, ".zip"))];
                                                    case 1:
                                                        _a.sent();
                                                        resolve("".concat(outputDir, "/").concat(this.name_id, ".zip"));
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    };
                                    for (_i = 0, modfiles_1 = modfiles; _i < modfiles_1.length; _i++) {
                                        modfile = modfiles_1[_i];
                                        _loop_1(modfile);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    return Mod;
}());
exports.Mod = Mod;
