import * as classes from "./classes";

export interface Avatar {
    /**
     * Avatar filename including extension.
     */
    filename: string;
    /**
     * 	URL to the full-sized avatar.
     */
    original: string;
    /**
     * URL to the small avatar thumbnail.
     */
    thumb_50x50: string;
    /**
     * URL to the medium avatar thumbnail.
     */
    thumb_100x100: string;
}

export interface Icon {
    /**
     * Icon filename including extension.
     */
    filename: string;
    /**
     * URL to the full-sized icon.
     */
    original: string;
    /**
     * URL to the small icon thumbnail.
     */
    thumb_64x64: string;
    /**
     * URL to the medium icon thumbnail.
     */
    thumb_128x128: string;
    /**
     * 	URL to the large icon thumbnail.
     */
    thumb_256x256: string;
}

export interface Image {
    /**
     * Image filename including extension.
     */
    filename: string;
    /**
     * 	URL to the full-sized image.
     */
    original: string;
    /**
     * URL to the image thumbnail.
     */
    thumb_320x180: string;
    /**
     * URL to the image thumbnail.
     */
    thumb_1280x720: string;
}

export interface Logo {
    /**
     * 	Logo filename including extension.
     */
    filename: string;
    /**
     * URL to the full-sized logo.
     */
    original: string;
    /**
     * URL to the small logo thumbnail.
     */
    thumb_320x180: string;
    /**
     * URL to the medium logo thumbnail.
     */
    thumb_640x360: string;
    /**
     * URL to the large logo thumbnail.
     */
    thumb_1280x720: string;
}

export interface Header {
    /**
     * Header image filename including extension.
     */
    filename: string;
    /**
     * URL to the full-sized header image.
     */
    original: string;
}

export interface TagOption {
    /**
     * Name of the tag group.
     */
    name: string;
    /**
     * Can multiple tags be selected via 'checkboxes' or should only a single tag be selected via a 'dropdown'.
     */
    type: string;
    /**
     * Array of tags in this group.
     */
    tags: string[];
    /**
     * 	List of tag names and the count of mods with these tags.
     */
    tag_count_map: { [tag_name: string]: number};
    /**
     * Groups of tags flagged as 'hidden' are intended to be used for filtering (eg. game version), but should not be displayed to users. Hidden tags will only be returned if show_hidden_tags is set to true.
     */
    hidden: boolean;
    /**
     * Groups of tags flagged as 'locked' are editable only if the authenticated user is a team member of the parent game. Useful for games to tag special functionality, which users can see and filter on (eg. competition winners).
     */
    locked: boolean;
}
export interface OtherUrl {
    /**
     * Label of the link you are sharing.
     */
    url: string;
    /**
     * The URL to be associated with the label.
     */
    label: string;
}

export interface Stats {
    /**
     * Unique game id.
     */
    game_id: number;
    /**
     * Available mod count for the game.
     */
    mods_count_total: number;
    /**
     * Mods downloaded today for the game.
     */
    mods_downloads_today: number;
    /**
     * Total Mods downloaded for the game.
     */
    mods_downloads_total: number;
    /**
     * Average mods downloaded on a daily basis.
     */
    mods_downloads_daily_average: number;
    /**
     * 	Number of total users who have subscribed to the mods for the game.
     */
    mods_subscribers_total: number;
    /**
     * Unix timestamp until this game's statistics are considered stale.
     */
    date_expires: number;
}

export interface Theme {
    /**
     * The primary hex color code.
     */
    primary: string;
    /**
     * 	The dark hex color code.
     */
    dark: string;
    /**
     * The light hex color code.
     */
    light: string;
    /**
     * The success hex color code.
     */
    success: string;
    /**
     * The warning hex color code.
     */
    warning: string;
    /**
     * The danger hex color code.
     */
    danger: string;
}

export interface GamePlatform  {
    /**
     * A [target platform](https://docs.mod.io/#targeting-a-platform).
     */
    platform: string;
    /**
     * A presentable label of the platform.
     */
    label: string;
    /**
     * 	Is this platform moderated by game admins? If false, then user submissions for the platform will be available immediately providing the game has mod curation disabled.
     */
    moderated: boolean;
    /**
     * Are users able to upload files to this platform? By default, users are able to upload to all supported platforms, platforms set to true may only be used by game admins only.
     */
    locked: boolean;
}

export interface ModDependency {
    /**
     * 	Unique ID of the mod that serves as the dependency.
     */
    mod_id: number;
    /**
     * Name of the mod dependency.
     */
    name: string;
    /**
     * Path for the mod on mod.io. For example: https://mod.io/g/rogue-knight/m/rogue-knight-hd-pack
     */
    name_id: string;
    /**
     * Unix timestamp of date the dependency was added.
     */
    date_added: string;
    /**
     * 	When a dependency depth is greater than zero (0), it means that the dependencies themselves rely on additional dependencies. To ensure smooth installation, it is recommended dependencies be installed in descending order of depth, beginning with those with the highest depth. Please note only dependencies with a depth of up to 5 will be shown.
     */
    dependency_depth: number;
    /**
     * Contains media URL's to the logo for the mod.
     */
    logo: Logo;
    /**
     * The primary modfile for the mod.
     */
    modfile: Modfile;
}

/**
 * Contains error data.
 */

export interface Error {
    /**
     * The [HTTP code](https://docs.mod.io/#response-codes).
     */
    code: number;
    /**
     * The mod.io error code.
     */
    error_ref: number;
    /**
     * The server response to your request. Responses will vary depending on the endpoint, but the object structure will persist.
     */
    message: string;
    /**
     * Optional Validation errors object. This field is only supplied if the response is a validation error 422 Unprocessible Entity. See [errors documentation](https://docs.mod.io/#errors) for more information.
     */
    errors: { [key: string]: string } | undefined
}

export interface Message {
    /**
     * [HTTP status code](https://docs.mod.io/#response-codes) of response.
     */
    code: number;
    /**
     * 	The server response to your request. Responses will vary depending on the endpoint, but the object structure will persist.
     */
    message: string;
}

export interface WebMessageObject {
    /**
     * HTTP response code.
     */
    code: number;
    /**
     * Was the request completed successfully?
     */
    success: boolean;
    /**
     * Optional message to display to the user.
     */
    message: string;
}

export interface AccessTokenObject {
    /**
     * HTTP Response Code.
     */
    code: number;
    /**
     * 	The user's access token.
     */
    access_token: string;
    /**
     * 	Unix timestamp of the date this token will expire. Default is one year from issue date. See [Access Token Lifetime & Expiry](https://docs.mod.io/#making-requests).
     */
    date_expires: number;
}

export interface monetisation_team {
    /**
     * The ID of the monetisation team.
     */
    team_id: number;
}

export interface GameInfo {
    /**
     * Unique id of the game.
     */
    id: number;
    /**
     * Status of the game (see [status and visibility](https://docs.mod.io/#status-amp-visibility) for details):
     * 
     * 0 = Not accepted
     * 
     * 1 = Accepted
     * 
     * 3 = Deleted
     */
    status: number;
    /**
     * Unix timestamp of date game was registered.
     */
    date_added: number;
    /**
     * Unix timestamp of date game was updated.
     */
    date_updated: number;
    /**
     * 	Unix timestamp of date game was set live.
     */
    date_live: number;
    /**
     * 	Name of the game.
     */
    name: string;
    /**
     * Path for the game on mod.io. For example: https://mod.io/g/rogue-knight
     */
    name_id: string;
    /**
     * Summary of the games mod support.
     */
    summary: string;
    /**
     * A guide about creating and uploading mods for this game to mod.io (applicable if submission_option = 0).
     */
    instructions: string;
    /**
     * Link to a mod.io guide, modding wiki or a page where modders can learn how to make and submit mods.
     */
    instructions_url: string;
    /**
     * Word used to describe user-generated content (mods, items, addons etc).
     */
    ugc_name: string;
    /**
     * Word used to describe the games token.
     */
    token_name: string;
    /**
     * The monetisation team for this resource.
     */
    monetisation_team: monetisation_team;
    /**
     * Presentation style used on the mod.io website:

     * 0 = Grid View: Displays mods in a grid

     * 1 = Table View: Displays mods in a table
     */
    presentation_option: 0 | 1
    /**
     * Submission process modders must follow:

     * 0 = Mod uploads must occur via the API using a tool created by the game developers

     * 1 = Mod uploads can occur from anywhere, including the website and API
     */
    submission_option: 0 | 1
    /**
     * Curation options enabled by this game to approve mods:
     * 
     * 0 = No curation: Mods are immediately available to play
     * 
     * 1 = Price change approval: Pricing changes for marketplace mods queued for acceptance
     * 
     * 2 = Full curation: All mods must be accepted by someone to be listed
     * 
     * ? = Combine to enable multiple features (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    curation_option: number;
    /**
     * 	Community features enabled for this game:
     * 
     * 0 = None
     * 
     * 1 = Enable comments
     * 
     * 2 = Enable guides
     * 
     * 4 = Pin on homepage
     * 
     * 8 = Show on homepage
     * 
     * 16 = Show more on homepage
     * 
     * 32 = Allow change status
     * 
     * 64 = Enable Previews (Game must be hidden)
     * 
     * 128 = Allow Preview Share-URL (Previews must be enabled)
     * 
     * ? = Combine to find games with multiple options enabled (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    community_options: number;
    /**
     * Monetisation features mods can enable:
     * 
     * 0 = None
     * 
     * 1 = Enabled
     * 
     * 2 = Allow mods to be sold (marketplace)
     * 
     * ? = Combine to find games with multiple options enabled (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    monetisation_options: number;
    /**
     * Level of API access allowed by this game:
     * 
     * 0 = None
     * 
     * 1 = Allow 3rd parties to access this games API endpoints
     * 
     * 2 = Allow mods to be downloaded directly (if disabled all download URLs will contain a frequently changing verification hash to stop unauthorized use)
     * 
     * ? = Combine to find games with multiple options enabled (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    api_access_options: number;
    /**
     * Mature content setup for this game:
     * 
     * 0 = Don't allow mature content in mods
     * 
     * 1 = Allow mature content in mods
     * 
     * 2 = This game is for mature audiences only
     * 
     * ? = Combine to find games with multiple options enabled (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    maturity_options: number
    /**
     * Contains media URL's to the icon for the game
     */
    icon: Icon;
    /**
     * Contains media URL's to the logo for the game.
     */
    logo: Logo;
    /**
     * Contains media URL's to the preview header for the game.
     */
    header: Header;
    /**
     * URL to the game.
     */
    profile_url: string;
    /**
     * Numerous aggregate stats for the game.
     */
    stats: Stats
    /**
     * Theme color values for the game.
     */
    theme: Theme
    /**
     * Creator defined URLs to share.
     */
    other_urls: OtherUrl[]
    /**
     * Groups of tags configured by the game developer, that mods can select. Hidden tags will only be returned if show_hidden_tags is set to true.
     */
    tag_options: TagOption[]
    /**
     * Platforms that are supported by this title.
     */
    platforms: GamePlatform[];
}

export interface getGames {
    /**
     * Array containing game objects.
     */
    data: classes.Game[];
    /**
     * Number of results returned in this request.
     */
    result_count: number;
    /**
     * Number of results skipped over. Defaults to 0 unless overridden by _offset filter.
     */
    result_offset: number;
    /**
     * Maximum number of results returned in the request. Defaults to 100 (max) unless overridden by _limit filter.
     */
    result_limit: number;
    /**
     * Total number of results found.
     */
    result_total: number;
}

export interface Filehash {
    /**
     * MD5 hash of the file.
     */
    md5: string;
}

export interface ModfilePlatform {
    /**
     * A target platform.
     */
    platform: string;
    /**
     * The status of the modfile for the corresponding platform. Possible values:
     * 
     * 0 = Pending
     * 
     * 1 = Approved
     * 
     * 2 = Denied
     * 
     * 3 = Targetted
     */
    status: 0 | 1 | 2 | 3
}

export interface DownloadObject {
    /**
     * URL to download the file from the mod.io CDN.
     * 
     * NOTE: If the game requires mod downloads to be initiated via the API, the binary_url returned will contain a verification hash. This hash must be supplied to get the modfile, and will expire after a certain period of time. Saving and reusing the binary_url won't work in this situation given it's dynamic nature.
     */
    binary_url: string
    /**
     * 	Unix timestamp of when the binary_url will expire.
     */
    date_expires: number;
}

export interface Modfile {
    /**
     * Unique modfile id.
    */
   id: number;
   /**
    * Unique mod id.
    */
   mod_id: number;
   /**
    * 	Unix timestamp of date file was added.
    */
   date_added: number;
   /**
    * Unix timestamp of date file was updated.
    */
   date_updated: number;
   /**
    * Unix timestamp of date file was virus scanned.
    */
   date_scanned: number;
   /**
    * 	Current virus scan status of the file. For newly added files that have yet to be scanned this field will change frequently until a scan is complete:
    * 
    * 0 = Not scanned
    * 
    * 1 = Scan complete
    * 
    * 2 = In progress
    * 
    * 3 = Too large to scan
    * 
    * 4 = File not found
    * 
    * 5 = Error Scanning
    */
   virus_status: 0 | 1 | 2 | 3 | 4 | 5
   /**
    * Was a virus detected:
    * 
    * 0 = No threats detected
    * 
    * 1 = Flagged as malicious
    * 
    * 2 = Flagged as containing potentially harmful files (i.e. EXEs)
    */
   virus_positive: 0 | 1 | 2
   /**
    * Size of the file in bytes.
    */
   filesize: number;
   /**
    * The uncompressed filesize of the zip archive.
    */
   filesize_uncompressed: number;
   /**
    * Contains a dictionary of filehashes for the contents of the download.
    */
   filehash: Filehash;
   /**
    * Filename including extension.
    */
   filename: string;
   /**
    * Release version this file represents.
    */
   version: string;
   /**
    * 	Changelog for the file.
    */
   changelog: string;
   /**
    * Metadata stored by the game developer for this file.
    */
   metadata_blob: string;
   /**
    * Contains download data for the modfile.
    */
   download: DownloadObject
   /**
    * Contains modfile platform data.
    */
   platforms: ModfilePlatform[];
}

export interface CommentObject {
    /**
     * Unique id of the comment.
     */
    id: number;
    /**
     * Unique game id (if applicable).
     */
    game_id: number;
    /**
     * Unique id of the parent resource.
     */
    resource_id: number;
    /**
     * The user who published the comment.
     */
    user: UserObject;
    /**
     * 	Unix timestamp of date the comment was posted.
     */
    date_added: number;
    /**
     * 	Id of the parent comment this comment is replying to (can be 0 if the comment is not a reply).
     */
    reply_id: number;
    /**
     * 	Levels of nesting in a comment thread. How it works:
     * 
     * - The first comment will have the position '01'.
     * 
     * - The second comment will have the position '02'.
     * 
     * - If someone responds to the second comment the position will be '02.01'.
     * 
     * - A maximum of 3 levels is supported.
     */
    thread_position: string;
    /**
     * 	Karma received for the comment (can be postive or negative).
     */
    karma: number;
    /**
     * 	Contents of the comment.
     */
    content: string;
}

export interface UserObject {
    /**
     * Unique id of the user.
     */
    id: number;
    /**
     * Path for the user on mod.io. For example: https://mod.io/u/name-id-here
     */
    name_id: string;
    /**
     * Username of the user.
     */
    username: string;
    /**
     * The users' display name for the targeted portal. Value will be null if no valid X-Modio-Portal portal header value is provided. For more information see [Targeting a Portal](https://docs.mod.io/#targeting-a-portal).
     */
    display_name_portal: string;
    /**
     * Unix timestamp of date the user was last online.
     */
    date_online: number;
    /**
     * Unix timestamp of date the user joined.
     */
    date_joined: number;
    /**
     * 	Contains media URL's to the users avatar.
     */
    avatar: Avatar;
    /**
     * 	URL to the users profile.
     */
    profile_url: string;
}

export interface GuideObject {
    /**
     * Unique id of the guide.
     */
    id: number;
    /**
     * Unique id of the parent game.
     */
    game_id: number;
    /**	
     * Name of the parent game. 
     */
    game_name: string;
    logo: Logo;
    user: UserObject;
    /**
     * Unix timestamp of the date the guide was made. 
     */
    date_added: number;
    /**
     * Unix timestamp of the date the guide was updated.
     */
    date_updated: number;
    /**
     * Unix timestamp of the date the guide was set live.
     */
    date_live: number;
    /**
     * 	Status of the guide:
     * 
     * 0 = Not Accepted
     * 
     * 1 = Accepted
     * 
     * 3 = Deleted
     */
    status: number;
    /**
     * 	URL to the guide.
     */
    url: string;
    /**
     * The name of the guide.
     */
    name: string;
    /**
     * Path for the guide on mod.io. For example: https://mod.io/g/rogue-knight/r/getting-started
     */
    name_id: string;
    /**
     * The summary of the guide
     */
    summary: string;
    /**
     * Detailed description of the guide (the contents) which allows HTML.
     */
    description: string;
    /**
     * Contains guide tag data.
     */
    tags: GuideTagObject[];
    /**
     * Contains stats data.
     */
    stats: GuideStatsObject[];
}

export interface GuideTagObject {
    /**
     * Tag name.
     */
    name: string;
    /**
     * Unix timestamp of date tag was applied.
     */
    date_added: number;
    /**
     * 	The amount of times this tag has been applied to guides. This value will only be returned for the Get Guide Tags endpoint.
     */
    count: number | undefined
}

export interface GuideStatsObject {
    /**
     * 	Unique guide id.
     */
    guide_id: number;
    /**
     * Total number of visits for this guide
     */
    visits_total: number;
    /**
     * Total number of comments for this guide.
     */
    comments_total: number;
}

export interface KeyValuePairObject {
    /**
     * Key of the key-value pair.
     */
    key: string;
    /**
     * Value of the key-value pair. Will always be a string, even if numeric.
     */
    value: string;
}

export interface MetadataKVPObject {
    /**
     * Key of the key-value pair.
     */
    metakey: string;
    /**
     * Value of the key-value pair. Will always be a string, even if numeric.
     */
    metavalue: string;
}

type ModEventType = "MODFILE_CHANGED" | "MOD_AVAILABLE" | "MOD_UNAVAILABLE" | "MOD_EDITED" | "MOD_DELETED" | "MOD_TEAM_CHANGED"

export interface ModEventObject {
    /**
     * Unique id of the event object.
     */
    id: number;
    /**
     * 	Unique id of the parent mod.
     */
    mod_id: number;
    /**
     * Unique id of the user who performed the action.
     */
    user_id: number;
    /**
     * Unix timestamp of date the event occurred.
     */
    date_added: number;
    /**
     * Type of event that was triggered.
     */
    event_type: ModEventType;
}

export interface ModMediaObject {
    /**
     * Array of YouTube links.
     */
    youtube: string[];
    /**
     * 	Array of SketchFab links.
     */
    sketchfab: string[];
    /**
     * Array of image objects (a gallery).
     */
    images: Image[];
}

export interface ModPlatformObject {
    /**
     * A target platform.
     */
    platform: string;
    /**
     * The unique id of the modfile that is currently live on the platform specified in the platform field.
     */
    modfile_live: number;
}

export interface ModTagObject {
    /**
     * Tag name.
     */
    name: string;
    /**
     * Unix timestamp of date tag was applied.
     */
    date_added: number;
}

type RatingsDisplayText = "Overwhelmingly Positive" | "Very Positive" | "Positive" | "Mostly Positive" | "Mixed" | "Negative" | "Mostly Negative" | "Very Negative" | "Overwhelmingly Negative" | "Unrated"

export interface ModStatsObject {
    /**
     * Unique mod id.
     */
    mod_id: number;
    /**
     * Current rank of the mod.
     */
    popularity_rank_position: number;
    /**
     * Number of ranking spots the current rank is measured against.
     */
    popularity_rank_total_mods: number;
    /**
     * Number of total mod downloads. Count resets around 11:00 UTC+11 daily.
     */
    downloads_today: number;
    /**
     * Number of total mod downloads.
     */
    downloads_total: number;
    /**
     * Number of total users who have subscribed to the mod.
     */
    subscribers_total: number;
    /**
     * Number of times this mod has been rated.
     */
    ratings_total: number;
    /**
     * 	Number of positive ratings.
     */
    ratings_positive: number;
    /**
     * Number of negative ratings.
     */
    ratings_negative: number;
    /**
     * 	Number of positive ratings, divided by the total ratings to determine it’s percentage score.
     */
    ratings_percentage_positive: number;
    /**
     * 	Overall rating of this item calculated using the [Wilson score confidence interval.](https://www.evanmiller.org/how-not-to-sort-by-average-rating.html) This column is good to sort on, as it will order items based on number of ratings and will place items with many positive ratings above those with a higher score but fewer ratings.
     */
    ratings_weighted_aggregate: number;
    /**
     * Textual representation of the rating.
     */
    ratings_display_text: RatingsDisplayText
    /**
     * Unix timestamp until this mods's statistics are considered stale.
     */
    date_expires: number;
}

export interface ModInfo {
    /**
     * Unique mod id.
     */
    id: number;
    /**
     * 	Unique game id.
     */
    game_id: number;
    /**
     * Status of the mod (see [status and visibility](https://docs.mod.io/#status-amp-visibility) for details):

        0 = Not Accepted

        1 = Accepted

        3 = Deleted
     */
    status: 0 | 1 | 3;
    /**
     * Visibility of the mod (see [status and visibility](https://docs.mod.io/#status-amp-visibility) for details):

        0 = Hidden

        1 = Public
     */
    visible: 0 | 1;
    /**
     * 	The user who published the mod.
     */
    submitted_by: UserObject;
    /**
     * Unix timestamp of date mod was registered.
     */
    date_added: number;
    /**
     * Unix timestamp of date mod was updated.
     */
    date_updated: number;
    /**
     * 	Unix timestamp of date mod was set live.
     */
    date_live: number;
    /**
     * 	Maturity options flagged by the mod developer, this is only relevant if the parent game allows mods to be labelled as mature:

        0 = None

        1 = Alcohol

        2 = Drugs

        4 = Violence

        8 = Explicit
        
        ? = Add the options you want together, to enable multiple filters (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    maturity_option: number;
    /**
     * 	Community features enabled for this mod:

        0 = All of the options below are disabled

        1 = Enable comments

        ? = Add the options you want together, to enable multiple features (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    community_options: number;
    /**
     * Monetization features enabled for this mod:

        0 = All of the options below are disabled

        1 = Enabled

        2 = Marketplace On

        ? = Add the options you want together, to enable multiple features (see [BITWISE fields](https://docs.mod.io/#bitwise-and-bitwise-and))
     */
    monetization_options: number;
    /**
     * 	The price of the mod.
     */
    price: number;
    /**
     * The tax of the mod.
     */
    tax: number;
    /**
     * 	Contains media URL's to the logo for the mod.
     */
    logo: Logo;
    /**
     * 	Official homepage of the mod.
     */
    homepage_url: string;
    /**
     * Name of the mod.
     */
    name: string;
    /**
     * 	Path for the mod on mod.io. For example: https://mod.io/g/rogue-knight/m/rogue-knight-hd-pack
     */
    name_id: string;
    /**
     * 	Summary of the mod.
     */
    summary: string;
    /**
     * Detailed description of the mod which allows HTML.
     */
    description: string;
    /**
     * 	Description field converted into plaintext.
     */
    description_plaintext: string;
    /**
     * 	Metadata stored by the game developer. Metadata can also be stored as searchable [key value pairs](https://docs.mod.io/#metadata), and to individual [mod files](https://docs.mod.io/#get-modfiles).
     */
    metadata_blob: string;
    /**
     * 	URL to the mod.
     */
    profile_url: string;
    /**
     * Contains YouTube & Sketchfab links, aswell as media URL's of images for the mod.
     */
    media: ModMediaObject;
    /**
     * The primary modfile for the mod.
     */
    modfile: Modfile;
    /**
     * If the mod has any dependencies, this value will be set to true.
     */
    dependencies: boolean;
    /**
     * Numerous aggregate stats for the mod.
     */
    stats: ModStatsObject;
    /**
     * Contains mod platform data.
     */
    platforms: ModPlatformObject[];
    /**
     * Contains key-value metadata.
     */
    metadata_kvp: MetadataKVPObject[];
    /**
     * Contains mod tag data.
     */
    tags: ModTagObject[];
}
