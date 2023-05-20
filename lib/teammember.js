"use strict";
exports.__esModule = true;
exports.TeamMember = void 0;
var TeamMember = /** @class */ (function () {
    function TeamMember(tbl) {
        this.id = tbl.id;
        this.user.id = tbl.user.id;
        this.user.name_id = tbl.user.name_id;
        this.user.username = tbl.user.username;
        this.user.avatar.filename = tbl.user.avatar.filename;
        this.user.avatar.original = tbl.user.avatar.original;
        this.user.avatar.thumb_50x50 = tbl.user.avatar.thumb_50x50;
        this.user.avatar.thumb_100x100 = tbl.user.avatar.thumb_50x50;
        this.level = tbl.level;
        this.date_added = tbl.date_added;
        this.position = tbl.position;
        this.invite_pending = tbl.invite_pending;
    }
    return TeamMember;
}());
exports.TeamMember = TeamMember;
