import * as interfaces from './interfaces';

export class Comment {
    id: number;
    game_id: number;
    mod_id: number;
    resource_id: number;
    user: interfaces.submitter;
    date_added: number;
    reply_id: number;
    thread_position: string;
    karma: number;
    karma_guest: number;
    content: string;
    constructor(tbl) {
        this.id = tbl.id;
        this.game_id = tbl.game_id;
        this.mod_id = tbl.mod_id;
        this.resource_id = tbl.resource_id;
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
}
