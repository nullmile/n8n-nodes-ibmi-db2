import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class IbmiDb2Api implements ICredentialType {
	name = 'ibmiDb2Api';

	displayName = 'DB2 for IBM I API';

	documentationUrl =
		'https://www.ibm.com/docs/ssw_ibm_i_74/rzahh/javadoc/com/ibm/as400/access/doc-files/JDBCProperties.html';

	icon: Icon = 'file:../icons/ibmDb2.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: 'localhost',
			placeholder: 'ibmi.example.com',
		},
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: '',
			placeholder: 'MYUSER',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Use SSL',
			name: 'secure',
			type: 'options',
			options: [
				{
					name: 'No',
					value: 'false',
					description: 'Encrypt only the password',
				},
				{
					name: 'Yes',
					value: 'true',
					description: 'Encrypt all client/server communication',
				},
			],
			default: 'false',
			description: 'Whether to use an SSL connection to the IBM i system',
		},
		{
			displayName: 'Naming Convention',
			name: 'naming',
			type: 'options',
			options: [
				{
					name: 'System',
					value: 'system',
					description: 'Use IBM i system naming, for example LIBRARY/FILE',
				},
				{
					name: 'SQL',
					value: 'sql',
					description: 'Use SQL naming, for example SCHEMA.TABLE',
				},
			],
			default: 'system',
			description: 'Naming convention used when referring to database objects',
		},
		{
			displayName: 'Libraries',
			name: 'libraries',
			type: 'string',
			default: '',
			placeholder: '*LIBL APPDEVLIB QGPL',
			description:
				'Optional comma- or space-separated library list. Prefix with *LIBL to append to the current job library list instead of replacing it.',
		},
		{
			displayName: 'Database Name',
			name: 'database name',
			type: 'string',
			default: '',
			placeholder: '*SYSBAS',
			description:
				'Optional relational database name, typically used when connecting to an independent ASP',
		},
		{
			displayName: 'Access',
			name: 'access',
			type: 'options',
			options: [
				{
					name: 'All',
					value: 'all',
					description: 'Allow all SQL statements',
				},
				{
					name: 'Read and Call',
					value: 'read call',
					description: 'Allow SELECT and CALL statements',
				},
				{
					name: 'Read Only',
					value: 'read only',
					description: 'Allow only SELECT statements',
				},
			],
			default: 'all',
			description: 'Maximum database access level allowed for the connection',
		},
		{
			displayName: 'Inquiry Message Reply',
			name: 'inquiryMessageReply',
			type: 'options',
			options: [
				{
					name: 'Use Default Reply',
					value: '*DFT',
					description: 'Automatically answer inquiry messages with their default reply',
				},
				{
					name: 'Use System Reply List',
					value: '*SYSRPYL',
					description: 'Use matching entries from the IBM i system reply list',
				},
				{
					name: 'Require Manual Reply',
					value: '*RQD',
					description: 'Wait for an operator reply; this can leave jobs in MSGW',
				},
				{
					name: 'Use Server Job Default',
					value: '',
					description: 'Do not override the server job setting',
				},
			],
			default: '*DFT',
			description:
				'How IBM i should answer inquiry messages for this database job. Default replies avoid MSGW hangs for unattended workflows.',
		},
		{
			displayName: 'Date Format',
			name: 'date format',
			type: 'options',
			options: [
				{
					name: 'Use Server Job Default',
					value: '',
				},
				{
					name: 'MDY',
					value: 'mdy',
				},
				{
					name: 'DMY',
					value: 'dmy',
				},
				{
					name: 'YMD',
					value: 'ymd',
				},
				{
					name: 'USA',
					value: 'usa',
				},
				{
					name: 'ISO',
					value: 'iso',
				},
				{
					name: 'EUR',
					value: 'eur',
				},
				{
					name: 'JIS',
					value: 'jis',
				},
				{
					name: 'Julian',
					value: 'julian',
				},
			],
			default: '',
			description: 'Date format used in SQL date literals',
		},
		{
			displayName: 'Date Separator',
			name: 'date separator',
			type: 'options',
			options: [
				{
					name: 'Use Server Job Default',
					value: '',
				},
				{
					name: '/ Slash',
					value: '/',
				},
				{
					name: '- Dash',
					value: '-',
				},
				{
					name: '. Period',
					value: '.',
				},
				{
					name: ', Comma',
					value: ',',
				},
				{
					name: 'Space',
					value: 'b',
				},
			],
			default: '',
			description: 'Separator used with MDY, DMY, YMD, or Julian date formats',
			displayOptions: {
				show: {
					'date format': ['mdy', 'dmy', 'ymd', 'julian'],
				},
			},
		},
		{
			displayName: 'Time Format',
			name: 'time format',
			type: 'options',
			options: [
				{
					name: 'Use Server Job Default',
					value: '',
				},
				{
					name: 'HMS',
					value: 'hms',
				},
				{
					name: 'USA',
					value: 'usa',
				},
				{
					name: 'ISO',
					value: 'iso',
				},
				{
					name: 'EUR',
					value: 'eur',
				},
				{
					name: 'JIS',
					value: 'jis',
				},
			],
			default: '',
			description: 'Time format used in SQL time literals',
		},
		{
			displayName: 'Time Separator',
			name: 'time separator',
			type: 'options',
			options: [
				{
					name: 'Use Server Job Default',
					value: '',
				},
				{
					name: ': Colon',
					value: ':',
				},
				{
					name: '. Period',
					value: '.',
				},
				{
					name: ', Comma',
					value: ',',
				},
				{
					name: 'Space',
					value: 'b',
				},
			],
			default: '',
			description: 'Separator used with HMS time format',
			displayOptions: {
				show: {
					'time format': ['hms'],
				},
			},
		},
		{
			displayName: 'Decimal Separator',
			name: 'decimal separator',
			type: 'options',
			options: [
				{
					name: 'Use Server Job Default',
					value: '',
				},
				{
					name: '. Period',
					value: '.',
				},
				{
					name: ', Comma',
					value: ',',
				},
			],
			default: '',
			description: 'Separator used in SQL numeric literals',
		},
		{
			displayName: 'Translate Binary',
			name: 'translate binary',
			type: 'options',
			options: [
				{
					name: 'No',
					value: 'false',
					description: 'Keep BINARY and VARBINARY fields binary',
				},
				{
					name: 'Yes',
					value: 'true',
					description: 'Treat BINARY and VARBINARY fields as CHAR and VARCHAR',
				},
			],
			default: 'false',
			description: 'Whether binary fields should be translated as text',
		},
	];
}
