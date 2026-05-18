"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeSqlFields = void 0;
const operations_1 = require("../operations");
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
        displayName: 'Parameters',
        name: 'parameters',
        type: 'json',
        default: '[]',
        placeholder: '{"customerID": 101}',
        description: 'Optional SQL parameters as JSON',
        hint: 'Use {"customerID": 101} with :customerID placeholders, or [101] with positional ? placeholders.',
        displayOptions: {
            show: {
                operation: [operations_1.OPERATIONS.EXECUTE_SQL],
            },
        },
    },
];
//# sourceMappingURL=executeSql.description.js.map