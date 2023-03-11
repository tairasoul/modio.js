"use strict";
exports.__esModule = true;
exports.Comment = void 0;
var Comment = /** @class */ (function () {
    function Comment(tbl) {
        this.id = tbl.id;
        this.game_id = tbl.game_id;
        this.mod_id = tbl.mod_id;
        this.resource_id = tbl.resource_id;
        this.user = {};
        this.user.id = tbl.user.id;
        this.user.name_id = tbl.user.name_id;
        this.user.username = tbl.user.username;
        this.user.avatar.filename = tbl.user.avatar.filename;
        this.user.avatar.original = tbl.user.avatar.original;
        this.user.avatar.thumb_50x50 = tbl.user.avatar.thumb_50x50;
        this.user.avatar.thumb_100x100 = tbl.user.avatar.thumb_50x50;
        this.date_added = tbl.date_added;
        this.reply_id = tbl.reply_id;
        this.thread_position = tbl.thread_position;
        this.karma = tbl.karma;
        this.karma_guest = tbl.karma_guest;
        this.content = tbl.content;
    }
    return Comment;
}());
exports.Comment = Comment;
