"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbmiDb2Api = void 0;
class IbmiDb2Api {
    constructor() {
        this.name = 'ibmiDb2Api';
        this.displayName = 'DB2 for IBM i API';
        this.icon = 'file:../icons/ibmDb2.svg';
        this.properties = [
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: ''
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: ''
            }
        ];
    }
}
exports.IbmiDb2Api = IbmiDb2Api;
//# sourceMappingURL=IbmiDb2Api.credentials.js.map