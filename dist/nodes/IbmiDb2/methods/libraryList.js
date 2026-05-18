"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyLibraryList = applyLibraryList;
const LIBRARY_NAME_PATTERN = /^[A-Z#$@][A-Z0-9_$#@]{0,9}$/;
async function applyLibraryList(db, credentials) {
    const libraryList = getLibraryList(credentials.libraryList);
    if (libraryList.length === 0) {
        return;
    }
    const statement = await db.execute('CALL QSYS2.QCMDEXC(?)', [
        `CHGLIBL LIBL(${libraryList.join(' ')})`,
    ]);
    closeStatement(statement);
}
function getLibraryList(value) {
    if (typeof value !== 'string' || value.trim() === '') {
        return [];
    }
    const libraries = value
        .trim()
        .split(/\s+/)
        .map((library) => library.toUpperCase());
    const invalidLibrary = libraries.find((library) => !LIBRARY_NAME_PATTERN.test(library));
    if (invalidLibrary !== undefined) {
        throw new Error(`Invalid library name "${invalidLibrary}". Use IBM i library names with up to 10 characters.`);
    }
    return libraries;
}
function closeStatement(statement) {
    statement.close();
}
//# sourceMappingURL=libraryList.js.map