import * as interfaces from "./interfaces"

export class ModStats {
    mod_id: number;
    popularity_rank_position: number;
    popularity_rank_total_mods: number;
    downloads_today: number;
    downloads_total: number;
    subscribers_total: number;
    ratings_total: number;
    ratings_positive: number;
    ratings_negative: number;
    ratings_percentage_positive: number;
    ratings_weighted_aggregate: number;
    ratings_display_text: string;
    date_expires: number;
    constructor(tbl) {
        this.mod_id = tbl.mod_id;
        this.popularity_rank_position = tbl.popularity_rank_position;
        this.popularity_rank_total_mods = tbl.popularity_rank_total_mods;
        this.downloads_today = tbl.downloads_today;
        this.downloads_total = tbl.downloads_total;
        this.subscribers_total = tbl.subscribers_total;
        this.ratings_total = tbl.ratings_total;
        this.ratings_positive = tbl.ratings_positive;
        this.ratings_negative = tbl.ratings_negative;
        this.ratings_percentage_positive = tbl.ratings_percentage_positive;
        this.ratings_weighted_aggregate = tbl.ratings_weighted_aggregate;
        this.ratings_display_text = tbl.ratings_display_text;
        this.date_expires = tbl.date_expires;
    }
}