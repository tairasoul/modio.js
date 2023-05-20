import * as interfaces from './interfaces';

export class KVPMetadata {
    metakey: string;
    metavalue: string;
    constructor(tbl) {
        this.metakey = tbl.metakey;
        this.metavalue = tbl.metavalue;
    }
}