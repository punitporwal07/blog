---
title: "What are leaked connections in DataSource ?"
description: "A leaked connection is a connection that was not properly returned to the connection pool in the data source. To automatically recover leaked connections, you can specify a value for Inactive Connecti"
pubDate: 2017-05-08T04:53:00.000-07:00
updatedDate: 2017-12-13T22:38:32.560-08:00
tags:
  - "Datasource"
  - "leaked connections"
originalUrl: "https://cloudnetes.blogspot.com/2017/05/what-are-leaked-connections-in.html"
---

A leaked connection is a connection that was not properly returned to the connection pool in the data source. To automatically recover leaked connections, you can specify a value for Inactive Connection Timeout on the JDBC Data Source.

**Datasource–>configuration–>connection pool–>Inactive Connection**

When you set a value for Inactive Connection Timeout, WebLogic Server will forcibly return a connection to the data source when there is no activity on a reserved connection for the number of seconds that you specify. When set to 0 (the default value), this feature is turned off.

But even after setting the “Inactive Connection timeout” to some value if you are seeing the same behavior then please try to use the “Latest Jdbc Driver” and also contact your Database administrators because many times the Database do not close the open cursors properly. As i don’t think any further tuning is required from WebLogic side.

\\inactive-connection-timeout-seconds\\60\\/inactive-connection-timeout-seconds\\

You have set inactive connection timeout to 60 seconds, so if any connection to DB from datasource is idle for 60 seconds then webLogic will forcibly release it back to the pool.

If you don't want to see that error and if you are sure that connections are being closed properly by code then you can disable inactive connection timeout by setting it to 0.

Br,
Punit
