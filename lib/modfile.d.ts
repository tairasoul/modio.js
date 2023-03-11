import * as interfaces from './interfaces';
export declare class Modfile {
    filesize: number;
    id: number;
    mod_id: number;
    date_added: number;
    date_scanned: number;
    virus_status: number;
    virus_positive: number;
    virustotal_hash: string;
    md5: string;
    filename: string;
    version: string;
    changelog: string;
    metadata_blob: string;
    binary_url: string;
    date_expires: number;
    platforms: Array<interfaces.platform>;
    constructor(tbl: any);
    download(path: string): Promise<unknown>;
}
