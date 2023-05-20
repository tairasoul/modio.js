"use strict";
exports.__esModule = true;
exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game(tbl) {
        this.id = tbl.id;
        this.status = tbl.status;
        if (tbl.submitted_by != null && tbl.submitted_by.avatar) {
            this.submitted_by = {};
            this.submitted_by.avatar = {};
            this.submitted_by.avatar.filename = tbl.submitted_by.avatar.filename;
            this.submitted_by.avatar.original = tbl.submitted_by.avatar.original;
            this.submitted_by.avatar.thumb_50x50 = tbl.submitted_by.avatar.thumb_50x50;
            this.submitted_by.avatar.thumb_100x100 = tbl.submitted_by.avatar.thumb_100x100;
        }
        this.date_added = tbl.date_added;
        this.date_updated = tbl.date_updated;
        this.date_live = tbl.date_live;
        this.presentation_option = tbl.presentation_option;
        this.community_options = tbl.community_options;
        this.monetisation_options = tbl.monetisation_options;
        this.submission_option = tbl.submission_option;
        this.curation_option = tbl.curation_option;
        this.revenue_options = tbl.revenue_options;
        this.api_access_options = tbl.api_access_options;
        this.maturity_options = tbl.maturity_options;
        this.ugc_name = tbl.ugc_name;
        if (tbl.icon != null && tbl.icon.filename) {
            this.icon = {};
            this.icon.filename = tbl.icon.filename;
            this.icon.original = tbl.icon.original;
            this.icon.thumb_64x64 = tbl.icon.thumb_64x64;
            this.icon.thumb_128x128 = tbl.icon.thumb_128x128;
            this.icon.thumb_256x256 = tbl.icon.thumb_256x256;
        }
        if (tbl.logo != null && tbl.logo.filename) {
            this.logo = {};
            this.logo.filename = tbl.logo.filename;
            this.logo.original = tbl.logo.original;
            this.logo.thumb_320x180 = tbl.logo.thumb_320x180;
            this.logo.thumb_640x360 = tbl.logo.thumb_640x360;
            this.logo.thumb_1280x720 = tbl.logo.thumb_1280x720;
        }
        if (tbl.header != null && tbl.header.filename) {
            this.header = {};
            this.header.filename = tbl.header.filename;
            this.header.original = tbl.header.original;
        }
        this.name = tbl.name;
        this.name_id = tbl.name_id;
        this.summary = tbl.summary;
        this.instructions_url = tbl.instructions_url;
        this.profile_url = tbl.profile_url;
        if (tbl.other_urls != null && tbl.other_urls.length > 0) {
            this.other_urls = [];
            for (var _i = 0, _a = tbl.other_urls; _i < _a.length; _i++) {
                var other_url = _a[_i];
                for (var i = 0; i < tbl.other_urls.length; i++) {
                    this.other_urls[i] = {}
                    this.other_urls[i].label = other_url.label;
                    this.other_urls[i].url = other_url.url;
                }
            }
        }
        if (tbl.tag_options != null && tbl.tag_options.length > 0) {
            this.tag_options = [];
            for (var _b = 0, _c = tbl.tag_options; _b < _c.length; _b++) {
                var tag_option = _c[_b];
                for (var i = 0; i < tbl.tag_options.length; i++) {
                    this.tag_options[i] = {};
                    var tag = this.tag_options[i];
                    tag.hidden = tag_option.hidden;
                    tag.locked = tag_option.locked;
                    tag.name = tag_option.name;
                    tag.tag_count_map = tag_option.tag_count_map;
                    tag.tags = tag_option.tags;
                    tag.type = tag_option.type;
                }
            }
        }
        if (tbl.stats != null) {
            this.stats = {};
            var stats = this.stats;
            var tstat = tbl.stats;
            stats.date_expires = tstat.date_expires;
            stats.game_id = tstat.game_id;
            stats.mods_count_total = tstat.mods_count_total;
            stats.mods_downloads_daily_average = tstat.mods_downloads_daily_average;
            stats.mods_downloads_today = tstat.mods_downloads_today;
            stats.mods_downloads_total = tstat.mods_downloads_total;
            stats.mods_subscribers_total = tstat.mods_subscribers_total;
        }
        if (tbl.theme != null) {
            this.theme = {};
            var th = this.theme;
            var tth = tbl.theme;
            th.danger = tth.danger;
            th.dark = tth.dark;
            th.light = tth.light;
            th.primary = tth.primary;
            th.success = tth.success;
            th.warning = tth.warning;
        }
        if (tbl.platforms.length > 0) {
            this.platforms = [];
            for (var _d = 0, _e = tbl.platforms; _d < _e.length; _d++) {
                var platform = _e[_d];
                for (var i = 0; i > tbl.platforms.length; i++) {
                    var tplatform = this.platforms[i];
                    tplatform.label = platform.label;
                    tplatform.moderated = platform.moderated;
                    tplatform.platform = platform.platform;
                }
            }
        }
    }
    return Game;
}());
exports.Game = Game;
