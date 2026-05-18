import type { ICredentialDataDecryptedObject } from 'n8n-workflow';

type Jt400Config = Record<string, string>;

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
] as const;

export function buildConnectionConfig(
	credentials: ICredentialDataDecryptedObject,
): Jt400Config {
	const config: Jt400Config = {
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

function addLegacyLibraryList(
	config: Jt400Config,
	credentials: ICredentialDataDecryptedObject,
): void {
	if (config.libraries !== undefined) {
		return;
	}

	const legacyLibraryList = credentials.libraryList;

	if (typeof legacyLibraryList === 'string' && legacyLibraryList.trim() !== '') {
		config.libraries = legacyLibraryList.trim();
	}
}
