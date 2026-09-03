---
title: "Understanding JDBC Data Sources"
description: "In WebLogic Server, you can configure database connectivity by configuring JDBC data sources and multi data sources and then targeting or deploying the JDBC resources to servers or clusters in your We"
pubDate: 2014-11-25T22:51:00.002-08:00
updatedDate: 2014-11-25T22:51:47.004-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/understanding-jdbc-data-sources.html"
---

**I**n WebLogic Server, you can configure database connectivity by configuring JDBC data sources and multi data sources and then targeting or deploying the JDBC resources to servers or clusters in your WebLogic domain.

Oracle WebLogic Server provides three types of data sources:

1.      Generic Data Sources—Generic data sources and their connection pools provide connection management processes that help keep your system running efficiently. You can set options in the data source to suit your applications and your environment.

2.      Grid-Link Data Sources—an event-based data source that adaptively responds to state changes in an Oracle RAC instance.

3.      Multi data sources—an abstraction around a group of generic data sources that provides load balancing or failover processing.

_Understanding Generic Data Sources_

Generic data sources provide database access and database connection management. Each data source contains a pool of database connections that are created when the data source is created and at server startup. Applications reserve a database connection from the data source by looking up the data source on the JNDI tree or in the local application context and then calling _getConnection()._ When finished with the connection, the application should call _connection.close()_ as early as possible, which returns the database connection to the pool for other applications to use.

_Understanding GridLink Data Sources_

A single GridLink data source provides connectivity between WebLogic Server and an Oracle Database service, which may include multiple Oracle RAC clusters. It uses the Oracle Notification Service (ONS) to adaptively respond to state changes in an Oracle RAC instance. An Oracle Database service represents a workload with common attributes that enables administrators to manage the workload as a single entity. You scale the number of GridLink data sources as the number of services increases in the data base, independent of the number of nodes in the cluster.

A GridLink data source includes the features of generic data sources plus the following support for Oracle RAC:

·         [Fast Connection Failover](http://docs.oracle.com/middleware/1212/wls/JDBCA/gridlink_datasources.htm#JDBCA379)

·         [Runtime Connection Load Balancing](http://docs.oracle.com/middleware/1212/wls/JDBCA/gridlink_datasources.htm#JDBCA380)

·         [Graceful Handling for Oracle RAC Outages](http://docs.oracle.com/middleware/1212/wls/JDBCA/gridlink_datasources.htm#JDBCA501)

·         [GridLink Affinity](http://docs.oracle.com/middleware/1212/wls/JDBCA/gridlink_datasources.htm#JDBCA525)

·         [SCAN Addresses](http://docs.oracle.com/middleware/1212/wls/JDBCA/gridlink_datasources.htm#JDBCA382)

·         [Secure Communication using Oracle Wallet](http://docs.oracle.com/middleware/1212/wls/JDBCA/gridlink_datasources.htm#JDBCA383)

_Understanding JDBC Multi Data Sources_

A multi data source is a group of data sources that is bound to the JDNDI tree or local application context just like data sources are bound to the JNDI tree. Applications look up a multi data source on the JNDI tree or in the local application context (java:comp/env) just as they do for data sources, and then request a database connection. The multi data source determines which data source to use to satisfy the request depending on the algorithm selected in the multi data source configuration: load balancing or failover.

Br,

Punit
