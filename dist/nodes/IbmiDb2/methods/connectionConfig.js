"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConnectionConfig = buildConnectionConfig;
const TRIMMED_PROPERTIES = [
    'host',
    'user',
    'secure',
    'naming',
    'libraries',
    'database name',
    'access',
    'date format',
    'date separator',
    'time format',
    'time separator',
    'decimal separator',
    'translate binary',
];
function buildConnectionConfig(credentials) {
    const config = {
        prompt: 'false',
    };
    for (const property of TRIMMED_PROPERTIES) {
        const value = credentials[property];
        if (typeof value === 'string' && value.trim() !== '') {
            config[property] = value.trim();
        }
    }
    const password = credentials.password;
    if (typeof password === 'string' && password !== '') {
        config.password = password;
    }
    addLegacyLibraryList(config, credentials);
    return config;
}
function addLegacyLibraryList(config, credentials) {
    if (config.libraries !== undefined) {
        return;
    }
    const legacyLibraryList = credentials.libraryList;
    if (typeof legacyLibraryList === 'string' && legacyLibraryList.trim() !== '') {
        config.libraries = legacyLibraryList.trim();
    }
}
//# sourceMappingURL=connectionConfig.js.map