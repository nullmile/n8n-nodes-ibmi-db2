"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbmiDb2 = void 0;
const description_1 = require("./description");
const router_1 = require("./router");
class IbmiDb2 {
    constructor() {
        this.description = description_1.description;
    }
    async execute(response) {
        return await (0, router_1.router)(this, response);
    }
    ;
}
exports.IbmiDb2 = IbmiDb2;
//# sourceMappingURL=IbmiDb2.node.js.map