---
title: "Default Test Table Name by DBMS"
description: "| DBMS | Default Test Table Name (Query) |"
pubDate: 2014-04-19T23:45:00.000-07:00
updatedDate: 2021-06-26T02:14:40.010-07:00
originalUrl: "https://cloudnetes.blogspot.com/2017/04/default-test-table-name-by-dbms.html"
---

| DBMS | Default Test Table Name (Query) |
| --- | --- |
| Adabas for z/OS | SQL call shadow\_adabas('select \* from employees') |
| Cloudscape | SQL SELECT 1 |
| DB2 | SQL SELECT COUNT(\*) FROM SYSIBM.SYSTABLES |
| FirstSQL | SQL SELECT 1 |
| IMS/TM for z/OS | SQL call shadow\_ims('otm','/dis','cctl') |
| Informix | SQL SELECT COUNT(\*) FROM SYSTABLES |
| MS SQL Server | SQL SELECT 1 |
| MySQL | SQL SELECT 1 |
| Oracle | SQL SELECT 1 FROM DUAL |
| PostgreSQL | SQL SELECT 1 |
| Progress | SQL SELECT COUNT(\*) FROM SYSTABLES |
| Sybase | SQL SELECT 1 |

\--
