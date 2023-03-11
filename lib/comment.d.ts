import * as interfaces from './interfaces';
export declare class Comment {
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
    constructor(tbl: any);
}
