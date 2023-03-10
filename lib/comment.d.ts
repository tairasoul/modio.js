export declare class Comment {
    id: number;
    game_id: number;
    mod_id: number;
    resource_id: number;
    user_id: number;
    user_name_id: string;
    username: string;
    user_avatar_filename: string;
    user_avatar_original: string;
    user_avatar_50x50: string;
    user_avatar_100x100: string;
    user_profile_url: string;
    date_added: number;
    reply_id: number;
    thread_position: string;
    karma: number;
    karma_guest: number;
    content: string;
    constructor(tbl: any);
}
