# n8n-nodes-ibmi-db2

This is an n8n community node for working with DB2 for IBM i through `node-jt400`.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Operations

- Select
- Execute SQL
- Update
- Insert and Get ID
- Insert List
- Upsert From Input
- Batch Update
- Get Tables
- Get Columns
- Get Primary Keys

## Credentials

Configure the IBM i host, user, password, and the IBM Toolbox JDBC options you need for the connection, including SSL, naming convention, libraries, database name, access mode, and date/time formatting.

The credentials also expose **Inquiry Message Reply** handling. The default uses IBM i default replies so unattended workflows do not sit in `MSGW`; advanced setups can switch to the system reply list or keep the server job default.

## SQL parameters

For readable queries, prefer named placeholders:

```sql
SELECT * FROM MYLIB.CUSTOMERS WHERE STATUS = :status AND ID = :customerID
```

```json
{ "status": "active", "customerID": 101 }
```

Positional `?` placeholders with JSON arrays are still supported for existing workflows.

## Upsert From Input

**Upsert From Input** uses each incoming item JSON object as the row data. Configure **Match Columns** with one or more comma-separated input columns; when a matching row exists, non-match columns are updated, otherwise the input row is inserted. Enable **Return Previous Rows** to include the rows as they were before the update.

## Transactions

Write operations expose a **Transaction Mode** option:

- **Disabled** keeps the current behavior.
- **Commit on Success** commits only if the operation completes successfully and rolls back on errors.
- **Always Roll Back (Test Run)** executes the statement but always rolls it back, which is useful for checking affected rows before letting a change persist.

Transactions are applied per operation and per input item.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [IBM i documentation](https://www.ibm.com/docs/en/i)
