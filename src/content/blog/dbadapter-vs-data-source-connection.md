---
title: "DBAdapter  vs Data Source connection pool parameters"
description: "Oracle database adapter is a JCA connector, which is a DBAdapter.jar file deployed to the WebLogic server during the installation of FMW. The DB adapter enables the Oracle SOA Suite application (ex: a"
pubDate: 2014-10-16T00:21:00.000-07:00
updatedDate: 2021-06-26T02:04:54.354-07:00
tags:
  - "connection pool"
originalUrl: "https://cloudnetes.blogspot.com/2018/10/dbadapter-vs-data-source-connection.html"
---

Oracle database adapter is a JCA connector, which is a DBAdapter.jar file deployed to the WebLogic server during the installation of FMW. The DB adapter enables the Oracle SOA Suite application (ex: a BPEL process) communicate to the Oracle database via a JNDI data source. The DB adapter relies on the JDBC driver to establish communication. The interaction between the SOA application to the Oracle database via the DB adapter is XML message. The DB adapter received XML message from SOA apps and response back XML message to SOA apps, so it is loosely modeled and it easily plugs into SOA application.

DB adapter can consist of multiple instances, Each instance (example: eis/DB/HR ) points to a single database and the instance must map with a JNDI data source to connect to Database.

![052016\_0257\_DatabaseAda1 Database Adapter configuration in WebLogic server](https://i1.wp.com/www.catgovind.com/wp-content/uploads/2016/05/052016_0257_DatabaseAda1.png?w=1100)

The JCA connection factory settings and data source settings are totally different settings.

JCA connection pools are to connect to JCA Adapters (such as the DbAdapter, JmsAdapter, etc.). Data Source connection pools are to connect to the database.

When the "Max Capacity" setting under the connection factory's connection pool is set to 1000, this means that you have 1000 available connections to connect to the JCA adapters. This means that your SOA or OSB code has up to 1000 connections to the JCA adapter (not the database).

When the data source's connection pool is set to a maximum value of 20, this means that you have a maximum of 20 connections to connect to the Database.

Generally, the default settings of the JCA connection factory should be sufficient. However, you may need to adjust your Data Source connection pool settings depending on your needs.

ref: http://www.catgovind.com/weblogic/dbadapter-configuration-in-weblogic-server/
      http://blog.raastech.com/2015/08/difference-between-weblogic-dbadapter.html

Br
