"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectRowsFields = void 0;
const operations_1 = require("../operations");
const parameterFields_description_1 = require("./parameterFields.description");
exports.selectRowsFields = [
    {
        displayName: 'SELECT SQL',
        name: 'selectSql',
        type: 'string',
        typeOptions: {
            editor: 'sqlEditor',
            sqlDialect: 'StandardSQL',
            rows: 5,
        },
        default: '',
        required: true,
        placeholder: 'SELECT * FROM MYLIB.CUSTOMERS WHERE STATUS = :status',
        description: 'The SELECT statement to execute',
        hint: 'Prefer named placeholders like :status for readability. Positional ? placeholders are still supported.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.SELECT],
            },
        },
    },
    {
        ...(0, parameterFields_description_1.sqlParametersField)({
            show: {
                operation: [operations_1.OPERATIONS.SELECT],
            },
        }),
    },
];
//# sourceMappingURL=selectRows.description.js.map