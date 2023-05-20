"use strict";
exports.__esModule = true;
exports.Dependencies = void 0;
var error_1 = require("./error");
var modfile_1 = require("./modfile");
var Dependencies = /** @class */ (function () {
    function Dependencies(tbl) {
        if (!tbl.error) {
            this.dependencies = [];
            for (var _i = 0, _a = tbl.data; _i < _a.length; _i++) {
                var dependency = _a[_i];
                var depend = { mod_id: dependency.mod_id,
                    name: dependency.name,
                    date_added: dependency.date_added,
                    name_id: dependency.name_id,
                    dependency_depth: dependency.dependency_depth,
                    modfile: new modfile_1.Modfile(dependency.modfile)
                };
                this.dependencies.push(depend);
            }
            this.isError = false;
        }
        else {
            this.isError = true;
            this.error = new error_1.APIError(tbl);
        }
    }
    return Dependencies;
}());
exports.Dependencies = Dependencies;
