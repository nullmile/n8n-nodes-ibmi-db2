# n8n-nodes-ibmi-db2

`n8n-nodes-ibmi-db2` is an n8n community node for connecting self-hosted n8n workflows to DB2 for IBM i through [`node-jt400`](https://www.npmjs.com/package/node-jt400), IBM Toolbox for Java, and JDBC.

Use it when your n8n instance needs to read from, write to, or inspect tables on IBM i / AS/400 systems.

## Compatibility

This package is intended for **self-hosted n8n** installations.

It is not eligible for n8n Cloud verification because it depends on `node-jt400`, which uses Java and native Node.js bindings. That is expected for this kind of IBM i integration.

## What It Can Do

- Run `SELECT` queries and return DB2 rows as n8n items
- Execute custom SQL statements with named or positional parameters
- Insert one or many rows
- Insert a row and return its generated ID
- Run updates, deletes, and batch updates
- Upsert incoming n8n items into a target table
- Retrieve table, column, and primary-key metadata
- Control write operations with explicit commit or rollback modes
- Configure IBM Toolbox JDBC properties from n8n credentials

## Requirements

The npm package installs the JavaScript dependencies automatically, including `node-jt400`. The machine or container running n8n must still provide the runtime pieces needed by `node-jt400`.

Required:

- A self-hosted n8n installation
- Network access from n8n to the IBM i host
- A Java runtime available to the n8n process
- A JDK and build tools when npm needs to compile native modules
- Valid IBM i credentials with authority to the target libraries, tables, and SQL operations

Recommended Linux packages for Debian/Ubuntu based systems:

```bash
apt-get update
apt-get install -y openjdk-17-jdk python3 make g++
```

Recommended Linux packages for Alpine based containers:

```bash
apk add --no-cache openjdk17 python3 make g++
```

If Java is installed but the node cannot start, check that `JAVA_HOME` is set and that `java -version` works for the same user that runs n8n.

## Installation

### Option 1: Install From the n8n UI

Use this when your self-hosted n8n instance can install community nodes and already has Java available.

1. Open n8n.
2. Go to **Settings** -> **Community Nodes**.
3. Select **Install a community node**.
4. Enter this package name:

```text
n8n-nodes-ibmi-db2
```

5. Restart n8n if your deployment requires it.

### Option 2: Install With npm

Use this when you manage n8n from the command line.

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-ibmi-db2
```

Then restart n8n.

### Option 3: Custom Docker Image

Use this when n8n runs in Docker. The official n8n image may not include Java or build tools, so install them in a custom image.

Example for Alpine based n8n images:

```dockerfile
FROM n8nio/n8n:latest

USER root
RUN apk add --no-cache openjdk17 python3 make g++

USER node
RUN mkdir -p /home/node/.n8n/nodes \
	&& cd /home/node/.n8n/nodes \
	&& npm install n8n-nodes-ibmi-db2

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

Build and run your image using the same environment variables and volumes you normally use for n8n.

## Credentials

Create a credential of type **DB2 for IBM I API**.

Core fields:

| Field | Description |
| --- | --- |
| Host | IBM i host name or IP address |
| User | IBM i user profile |
| Password | IBM i password |
| Use SSL | Encrypts all client/server communication when enabled |
| Naming Convention | `System` for `LIBRARY/FILE`, or `SQL` for `SCHEMA.TABLE` |
| Libraries | Optional library list, separated by spaces or commas |
| Database Name | Optional relational database name, often used with an independent ASP |
| Access | Limits the connection to all SQL, read/call, or read-only access |
| Inquiry Message Reply | Controls how IBM i inquiry messages are answered |

Additional JDBC options are exposed for date, time, decimal, and binary handling:

- Date format and separator
- Time format and separator
- Decimal separator
- Translate binary

The default **Inquiry Message Reply** value is **Use Default Reply**. This helps unattended workflows avoid server jobs waiting in `MSGW`. Use **Require Manual Reply** only when an operator is expected to handle messages manually.

## Operations

### Select

Runs a `SELECT` statement and returns each row as an n8n item.

Example:

```sql
SELECT *
FROM MYLIB.CUSTOMERS
WHERE STATUS = :status
```

Parameter:

```json
{
  "status": "active"
}
```

### Execute SQL

Runs a custom SQL statement. Use it for statements that do not fit the more specific operations.

Example:

```sql
CALL MYLIB.REFRESH_CUSTOMER(:customerId)
```

### Update

Runs write statements such as `UPDATE`, `DELETE`, or DB2 statements that return an affected-row count.

Example:

```sql
UPDATE MYLIB.CUSTOMERS
SET STATUS = :status
WHERE CUSTOMER_ID = :customerId
```

### Batch Update

Runs one statement multiple times with grouped parameter sets. Use **Set Number** to group parameters into each execution.

Example SQL:

```sql
UPDATE MYLIB.CUSTOMERS
SET STATUS = :status
WHERE CUSTOMER_ID = :customerId
```

Example sets:

| Set Number | Name | Value |
| --- | --- | --- |
| 1 | `status` | `active` |
| 1 | `customerId` | `1001` |
| 2 | `status` | `inactive` |
| 2 | `customerId` | `1002` |

### Insert and Get ID

Inserts one row and returns the generated ID column value.

Use this when the target table has an identity/generated key and the workflow needs that value for later steps.

### Insert List

Inserts multiple rows. Use **Row Number** to group column values into each inserted row.

### Upsert From Input

Uses each incoming n8n item JSON object as row data.

Configure:

- **Table Name**: target table, for example `MYLIB.CUSTOMERS`
- **Match Columns**: comma-separated columns used to find existing rows
- **Columns to Exclude**: input fields that should not be inserted or updated
- **Return Previous Rows**: include matched rows before they are updated
- **Allow Multiple Matches**: update all matching rows instead of failing when more than one row matches

Example input item:

```json
{
  "CUSTOMER_ID": 1001,
  "EMAIL": "ada@example.com",
  "STATUS": "active"
}
```

Example configuration:

```text
Table Name: MYLIB.CUSTOMERS
Match Columns: CUSTOMER_ID
```

If a row exists with `CUSTOMER_ID = 1001`, the non-match columns are updated. If no row exists, a new row is inserted.

### Metadata Operations

Use these to inspect DB2 metadata from workflows:

- **Get Tables**
- **Get Columns**
- **Get Primary Keys**

## SQL Parameters

Named placeholders are recommended because they are easier to read and maintain.

```sql
SELECT *
FROM MYLIB.CUSTOMERS
WHERE STATUS = :status
  AND CUSTOMER_ID = :customerId
```

In the node parameter UI, use the name without the leading colon:

| Name | Value |
| --- | --- |
| `status` | `active` |
| `customerId` | `1001` |

Positional `?` placeholders are also supported. Leave the parameter name empty and order the values as they appear in the SQL statement.

```sql
SELECT *
FROM MYLIB.CUSTOMERS
WHERE STATUS = ?
  AND CUSTOMER_ID = ?
```

Parameter values can be entered as:

- String
- Number
- Null
- Object or array JSON

## Transactions

Write operations expose **Transaction Mode**.

| Mode | Behavior |
| --- | --- |
| Disabled | Executes without an explicit transaction |
| Commit on Success | Commits only if the operation completes successfully; rolls back on failure |
| Always Roll Back (Test Run) | Executes the operation, then always rolls it back |

Use **Always Roll Back (Test Run)** when you want to test a write operation safely before allowing it to persist.

## IBM i Notes

- With SQL naming, use `SCHEMA.TABLE`.
- With system naming, use `LIBRARY/FILE` where supported by the JDBC naming setting.
- Make sure the configured user profile can access the library list, schemas, tables, and programs used by the workflow.
- If SSL is enabled, the n8n runtime must trust the IBM i certificate chain.
- Firewall and routing must allow the n8n host/container to reach the IBM i database services.

## Troubleshooting

### Install Fails While Building `java`

Install a JDK and native build tools, then reinstall the node.

Debian/Ubuntu:

```bash
apt-get install -y openjdk-17-jdk python3 make g++
```

Alpine:

```bash
apk add --no-cache openjdk17 python3 make g++
```

### Java Cannot Be Found

Check Java from the same environment that runs n8n:

```bash
java -version
echo $JAVA_HOME
```

Set `JAVA_HOME` if needed and restart n8n.

### The Workflow Hangs or IBM i Shows MSGW

Review **Inquiry Message Reply** in the credentials. The default reply mode is usually best for unattended workflows. If you choose manual replies, an IBM i operator may need to answer messages on the server.

### SQL Object Not Found

Check:

- Naming convention: SQL vs System
- Library list
- Schema/table spelling
- User authority
- Whether the object is in an independent ASP and requires **Database Name**

### SSL Connection Fails

Confirm that IBM i is configured for SSL and that the n8n runtime trusts the certificate authority used by the IBM i server certificate.

## Development

Install dependencies:

```bash
npm install
```

Run lint:

```bash
npm run lint
```

Build the node:

```bash
npm run build
```

Create a local package for testing:

```bash
npm pack
```

Start a packaged test environment when configured for your machine:

```bash
npm run dev:packaged
```

## Release

Maintainers can publish through the GitHub Actions workflow in `.github/workflows/publish.yml`.

Before releasing, run:

```bash
npm run lint
npm run build
npm pack --dry-run
```

Then create a new version and push the tag:

```bash
npm version patch
git push
git push --tags
```

Use `minor` or `major` instead of `patch` when the release requires it.

The publish workflow runs when a version tag such as `0.1.1` is pushed. Configure npm Trusted Publishing for this repository, or provide an `NPM_TOKEN` GitHub Actions secret as a fallback.

## Security

- Store IBM i credentials only in n8n credentials.
- Prefer least-privilege IBM i user profiles for automation.
- Use read-only or read/call access when workflows do not need writes.
- Enable SSL when traffic crosses untrusted networks.
- Review workflows carefully before enabling write operations.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [IBM i documentation](https://www.ibm.com/docs/en/i)
- [IBM Toolbox for Java JDBC properties](https://www.ibm.com/docs/ssw_ibm_i_74/rzahh/javadoc/com/ibm/as400/access/doc-files/JDBCProperties.html)
- [node-jt400 on npm](https://www.npmjs.com/package/node-jt400)
