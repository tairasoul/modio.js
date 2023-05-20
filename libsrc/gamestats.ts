import * as interfaces from "./interfaces"

export class GameStats {
    game_id: number;
    mods_count_total: number;
    mods_downloads_today: number;
    mods_downloads_total: number;
    mods_downloads_daily_average: number;
    mods_subscribers_total: number;
    date_expires: number;
    constructor(tbl) {
        this.game_id = tbl.game_id;
        this.mods_count_total = tbl.mods_count_total;
        this.mods_downloads_today = tbl.mods_downloads_today;
        this.mods_downloads_total = tbl.mods_downloads_total;
        this.mods_downloads_daily_average = tbl.mods_downloads_daily_average;
        this.mods_subscribers_total = tbl.mods_subscribers_total;
        this.date_expires = tbl.date_expires;
    }
}