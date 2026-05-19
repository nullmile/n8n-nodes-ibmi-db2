"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSqlFields = void 0;
const operations_1 = require("../operations");
const parameterFields_description_1 = require("./parameterFields.description");
exports.executeSqlFields = [
    {
        displayName: 'SQL',
        name: 'sql',
        type: 'string',
        typeOptions: {
            editor: 'sqlEditor',
            sqlDialect: 'StandardSQL',
            rows: 5,
        },
        default: '',
        required: true,
        placeholder: 'SELECT * FROM MYLIB.CUSTOMERS WHERE ID = :customerID',
        description: 'The SQL statement to execute',
        hint: 'Prefer named placeholders like :customerID for readability. Positional ? placeholders are still supported.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.EXECUTE_SQL],
            },
        },
    },
    {
        ...(0, parameterFields_description_1.sqlParametersField)({
            show: {
                operation: [operations_1.OPERATIONS.EXECUTE_SQL],
            },
        }),
    },
];
//# sourceMappingURL=executeSql.description.js.map