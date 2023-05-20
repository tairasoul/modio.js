import { APIError } from "./error";
import { dependency } from "./interfaces";
import { Modfile } from "./modfile"

export class Dependencies {
    dependencies: Array<dependency> | undefined;
    isError: boolean;
    error: APIError | undefined;
    constructor(tbl) {
        if (!tbl.error) {
            this.dependencies = [];
            for (const dependency of tbl.data) {
                const depend = { mod_id: dependency.mod_id,
                    name: dependency.name,
                    date_added: dependency.date_added,
                    name_id: dependency.name_id,
                    dependency_depth: dependency.dependency_depth,
                    modfile: new Modfile(dependency.modfile)
                };
                this.dependencies.push(depend)
            }
            this.isError = false;
        }
        else {
            this.isError = true;
            this.error = new APIError(tbl);
        }
    }
}