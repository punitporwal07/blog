---
title: "What is Persistence Store"
description: "Each server instance, including the administration server, has a default persistent store that requires no"
pubDate: 2014-12-08T04:04:00.008-08:00
updatedDate: 2021-07-15T05:41:10.135-07:00
tags:
  - "JMS"
originalUrl: "https://cloudnetes.blogspot.com/2014/12/persistence-store.html"
---

![](/blog/blog-images/3347f5dbc563.gif)

**E**ach server instance, including the administration server, has a default persistent store that requires no
configuration. The default store is a file-based store that maintains its data in a group of files in a server instance's `**data\store\default**` directory. A directory for the default store is automatically created if one does not already exist.

In addition to using the default file store, you can also configure a custom **file** store or JDBC store to suit your specific needs.

You can, however, specify another location for the default store by directly manipulating the [DefaultFileStoreMBean](https://docs.oracle.com/cd/E13222_01/wls/docs90//wlsmbeanref/mbeans/DefaultFileStoreMBean.html) parameters or by using the Administration Console.

## When to Use a Custom Persistent Store

WebLogic Server provides configuration options for creating a custom file store or JDBC store. For example, you may want to:

-   Place a file store's files on a particular device.
-   Use a JDBC store rather than a file store for a particular server instance.
-   Allow all physical stores in a cluster to share the same logical name.
-   Logically separate different services to use different files or tables.

## Methods of Creating a Persistent Store

A customized persistent store can be configured in the following ways:

-   Use the Administration Console to configure a custom file store or JDBC store.
-   Directly edit the configuration file (`config.xml`) of the server instance that is hosting the default persistent store.

## Main Steps for Configuring a Custom File Store

The main steps for creating a custom file store are as follows:

-   Create a directory where the file store's data will be persisted.

-   Create a custom file store and specify the directory location that you created.

-   Associate the custom file store with the subsystem(s) that will be using it, such as:

-   For JMS servers, select the custom file store on the General Configuration page.

## How to read JMS file store .DAT file

The JMS file store created will be with .DAT extension and is not in human readable format.

You will have to use the **weblogic.store.Admin** utility to extract the content of file store into an XML file to read it.

Follow below steps to read the DAT file:

Run the ./**setDomainEnv.sh** script:

Go to the directory of the JMS File Store location and type this command to display the store admin prompt.

**java weblogic.store.Admin**

Once logged into the WebLogic store admin prompt, use this command to open the JMS File store.

**openfile -store <JMSFileStoreName>**

Once file store is open use the next command to dump the content of the file store. This command will dump the output of file store into specified <filename>.xml file in location from where you launched store admin utility.

**dump -store <JMSFileStoreName> -out <filename> -conn -deep**

Close the file store.

**close -store <JMSFileStoreName>**

Run the quit command to exit from store admin utility.

**quit**

\--
