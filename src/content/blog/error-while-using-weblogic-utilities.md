---
title: "DBPING - a java-weblogic utility"
description: "There are ways to test DB connection from an application server, one of the most successful ways is to test as a java utility."
pubDate: 2014-11-25T03:46:00.005-08:00
updatedDate: 2021-08-21T10:27:32.774-07:00
tags:
  - "dbping"
  - "java"
originalUrl: "https://cloudnetes.blogspot.com/2014/11/error-while-using-weblogic-utilities.html"
---

![](/blog/blog-images/bash-a51aa62846fb.png)

There are ways to test DB connection from an application server, one of the most successful ways is to test as a java utility.

For running such utilities you need the proper environment to be set, You need to source the `ssetWLSEnv.sh` script in order to execute the script in the context of the running shell, and have the actual environment of the shell be set.

You have to execute as "`. setWLSEnv.sh`" and then you can check that the CLASSPATH is set with the "env" command.

**and then you can begin dbping utility to check DB connectivity from the weblogic server**

set domain environment as explained above & then initialize utility as:

```
 Usage:
 java utils.dbping DB2B [-d dynamicSections] USER PASS HOST:PORT/DBNAME
 or     java utils.dbping DERBY        USER PASS HOST:PORT/DBNAME
 or     java utils.dbping JCONN2       USER PASS HOST:PORT/DBNAME
 or     java utils.dbping JCONN3       USER PASS HOST:PORT/DBNAME
 or     java utils.dbping JCONNECT     USER PASS HOST:PORT/DBNAME
 or     java utils.dbping INFORMIXB    USER PASS HOST:PORT/DBNAME/INFORMIXSERVER
 or     java utils.dbping MSSQLSERVERB USER PASS HOST:PORT/[DBNAME]
 or     java utils.dbping MYSQL        USER PASS [HOST][:PORT]/[DBNAME]
 or     java utils.dbping ORACLEB      USER PASS HOST:PORT/DBNAME
 or     java utils.dbping ORACLE_THIN  USER PASS HOST:PORT:DBNAME
 or     java utils.dbping POINTBASE    USER PASS HOST[:PORT]/DBNAME
 or     java utils.dbping SYBASEB      USER PASS HOST:PORT/DBNAME

```

\--
