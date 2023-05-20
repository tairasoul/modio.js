import { APIError } from "./error";
import { dependency } from "./interfaces";
export declare class Dependencies {
    dependencies: Array<dependency> | undefined;
    isError: boolean;
    error: APIError | undefined;
    constructor(tbl: any);
}
