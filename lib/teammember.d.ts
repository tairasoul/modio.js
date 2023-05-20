import * as interfaces from './interfaces';
export declare class TeamMember {
    id: number;
    user: interfaces.submitter;
    level: number;
    date_added: number;
    position: string;
    invite_pending: number;
    constructor(tbl: any);
}
