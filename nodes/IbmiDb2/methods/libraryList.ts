import type { ICredentialDataDecryptedObject } from 'n8n-workflow';

const LIBRARY_NAME_PATTERN = /^[A-Z#$@][A-Z0-9_$#@]{0,9}$/;

interface SessionConnection {
	execute(sql: string, params?: unknown[]): Promise<ClosableStatement>;
}

interface ClosableStatement {
	close(): void;
}

export async function applyLibraryList(
	db: SessionConnection,
	credentials: ICredentialDataDecryptedObject,
): Promise<void> {
	const libraryList = getLibraryList(credentials.libraryList);

	if (libraryList.length === 0) {
		return;
	}

	const statement = await db.execute('CALL QSYS2.QCMDEXC(?)', [
		`CHGLIBL LIBL(${libraryList.join(' ')})`,
	]);

	closeStatement(statement);
}

function getLibraryList(value: unknown): string[] {
	if (typeof value !== 'string' || value.trim() === '') {
		return [];
	}

	const libraries = value
		.trim()
		.split(/\s+/)
		.map((library) => library.toUpperCase());

	const invalidLibrary = libraries.find((library) => !LIBRARY_NAME_PATTERN.test(library));

	if (invalidLibrary !== undefined) {
		throw new Error(
			`Invalid library name "${invalidLibrary}". Use IBM i library names with up to 10 characters.`,
		);
	}

	return libraries;
}

function closeStatement(statement: ClosableStatement): void {
	statement.close();
}
