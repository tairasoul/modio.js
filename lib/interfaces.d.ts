export interface avatar {
    filename: string;
    original: string;
    thumb_50x50: string;
    thumb_100x100: string;
}
export interface submitter {
    id: number;
    name_id: string;
    username: string;
    date_online: number;
    date_joined: number;
    avatar: avatar;
    timezone: string;
    language: string;
    profile_url: string;
}
export interface icon {
    filename: string;
    original: string;
    thumb_64x64: string;
    thumb_128x128: string;
    thumb_256x256: string;
}
export interface logo {
    filename: string;
    original: string;
    thumb_320x180: string;
    thumb_640x360: string;
    thumb_1280x720: string;
}
export interface header {
    filename: string;
    original: string;
}
export interface tag_option {
    name: string;
    type: string;
    tags: Array<string>;
    tag_count_map: object;
    hidden: boolean;
    locked: boolean;
}
export interface other_url {
    url: string;
    label: string;
}
export interface stats {
    game_id: number;
    mods_count_total: number;
    mods_downloads_today: number;
    mods_downloads_total: number;
    mods_downloads_daily_average: number;
    mods_subscribers_total: number;
    date_expires: number;
}
export interface theme {
    primary: string;
    dark: string;
    light: string;
    success: string;
    warning: string;
    danger: string;
}
export interface platform {
    platform: string;
    label: string;
    moderated: boolean;
    status: number;
}
