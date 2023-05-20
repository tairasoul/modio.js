"use strict";
exports.__esModule = true;
exports.GameStats = void 0;
var GameStats = /** @class */ (function () {
    function GameStats(tbl) {
        this.game_id = tbl.game_id;
        this.mods_count_total = tbl.mods_count_total;
        this.mods_downloads_today = tbl.mods_downloads_today;
        this.mods_downloads_total = tbl.mods_downloads_total;
        this.mods_downloads_daily_average = tbl.mods_downloads_daily_average;
        this.mods_subscribers_total = tbl.mods_subscribers_total;
        this.date_expires = tbl.date_expires;
    }
    return GameStats;
}());
exports.GameStats = GameStats;
