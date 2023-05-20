import * as interfaces from './interfaces';
import { getModfiles } from '../src/main';
import { Modfile } from './modfile';

export class Mod {
    id: number;
    game_id: number;
    status: number;
    visible: number;
    submitter: interfaces.submitter
    date_added: number;
    date_updated: number;
    date_live: number;
    maturity_option: number;
    community_options: number;
    monetisation_options: number;
    price: number;
    tax: number;
    logo: interfaces.logo;
    homepage_url: string;
    name: string;
    name_id: string;
    summary: string;
    description: string;
    description_plaintext: string;
    metadata_blob: string;
    mod_url: string;
    youtube_media: Array<string>;
    sketchfab_media: Array<string>;
    images: Array<object>;
    tags: Array<object>;
    popularity_rank_position: number;
    popularity_rank_total_mods: number;
    downloads_today: number;
    downloads_total: number;
    subscribers_total: number;
    ratings_total: number;
    ratings_positive: number;
    ratings_negative: number;
    ratings_display_text: string;
    constructor(tbl) {
        this.id = tbl.id;
        this.game_id = tbl.game_id;
        this.status = tbl.status;
        this.visible = tbl.visible;
        if (tbl.submitter && tbl.submitter?.id) {
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
        if (tbl.media?.youtube) {
            this.youtube_media = tbl.media.youtube;
        }
        if (tbl.media?.sketchfab) {
            this.sketchfab_media = tbl.media.sketchfab;
        }
        if (tbl.media?.images) {
            this.images = tbl.media.images;
        }
        if (tbl.modfile?.downloads_today) {
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
    async getModfiles() {
        return await getModfiles(this.mod_url.split('/g/')[1].split('/m/')[0], this.mod_url.split('/m/')[1])
    }
    async download(outputDir: string, platform: string | 'windows' | 'android') {
        return new Promise(async (resolve) => {
            const modfiles = await this.getModfiles();
            for (const modfile of modfiles) {   
                modfile.platforms.filter(async (plat) => {
                    if (plat.platform == platform) {
                        await modfile.downloadFile(`${outputDir}/${this.name_id}.zip`);
                        resolve(`${outputDir}/${this.name_id}.zip`);
                    }
                })
            }
        })

    }
}