---
title: "How to register JDBC driver in WIN-32/WIN-64 for WLP-MSSqlServer"
description: "WebLogic Server provides the following XA DLL’s for MS SQL Server (DB Server)"
pubDate: 2014-11-25T21:34:00.004-08:00
updatedDate: 2021-04-10T04:34:04.834-07:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/how-to-register-jdb-driver-for-win.html"
---

![](/blog/blog-images/sql-52c1a304c7d8.png)

WebLogic Server provides the following XA DLL’s for MS SQL Server (DB Server)

·         `sqljdbc.dll`: for 32-bit Windows

·         `64sqljdbc.dll`: for 64-bit Windows

·         `X64sqljdbc.dll`: for the X64 processors

To install, do the following:

1.    cd to the _`WL_HOME`_`\wlserver_10.3\server\lib` directory

2.    For:

o    32-bit Windows systems, install the `sqljdbc.dll` file.

o    64-bit Windows systems, copy the `64sqljdbc.dll` file, rename as `sqljdbc.dll`, and then install the `sqljdbc.dll` file.

o    X64 processors, copy the `X64sqljdbc.dll` file, rename as `sqljdbc.dll`, and then install the `sqljdbc.dll` file.

3.    Along with `instjdbc.sql` file found under the same directory.

And place the DLL & SQL file under location

For 64-bit

`C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\Binn`

For 32-bit

`C:\Program Files (x86)\Microsoft SQL Server\MSSQL10_50.SQLEXPRESS\MSSQL\Binn`

4.    Then execute the `instjdbc.sql` in your database and restart the DTC server along with SQL server.

to restart the DTC server: go to start --> dcomcnfg --> <open exe>

open: Component Services-->Computers-->My Computer-->Distributed Transaction Coordinator(DTC)-->Local DTC

click Action-->properties-->Security & check all the security settings --> Apply/ok

Br,

Punit
