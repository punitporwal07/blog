---
title: "CONFIGURATION OF NODE MANAGER"
description: "This post helps you to understand the configuration of nodemanager in a weblogic domain which is one of the commonly used utility provided by it."
pubDate: 2014-12-04T23:45:00.000-08:00
updatedDate: 2020-02-24T01:04:46.887-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/12/configuration-of-node-manager.html"
---

This post helps you to understand the configuration of nodemanager in a weblogic domain which is one of the commonly used utility provided by it.
This utility enables you to start & shutdown weblogic services including adminServer(only shutdown) from a remote location using weblogic console.

during the configuration you may endup facing one of the below issue:
Problem: Node manager to the associated machine is not reachable.

`Status: InActive`

`Problem Description : weblogic.nodemanager.NMConnectException`

`Version: (not Available)`

to overcome the above issue you need to follow below steps:

1.       Create a machine with properties as

type: Plain

Listen Address : localhost

listen Port: 5556

2.  Associate machine to target Managed server.

3. Open cmd and execute C:\\Oracle\\Middleware\\wlserver\_10.3\\server\\bin\\**setWLSEnv.cmd**

      4. Wright **java weblogic.WLST** it will connect you to WLST.

      5.       Enroll your node manager using WLST by executing below commands

ü  **connect(‘weblogic’,’weblogic1’,’t3://localhost:7001’)**

ü **nmEnroll(‘C:/Oracle/Middleware/user\_projects/domains/<yourdomain>’,’C:/Oracle/Middleware/wlserver\_10.3/common/nodemanager’)**

It will prompt you a message “successfully enrolled this machine with domain directory.”

      6.       Now go to **C:/Oracle/Middleware/wlserver\_10.3/common/nodemanager/**                           **nodemanager.properties** & edit the following entries.

StartScriptName=startWebLogic.cmd à StartScriptName=start**Managed**WebLogic.cmd

SecureListener=true à SecureListener=**false**

StartScriptEnabled=false à StartScriptEnabled=**True**

      7.       Restart your Admin Server.

      8.       Start Node Manager service from C:\\Oracle\\Middleware\\wlserver\_10.3\\server\\bin\\ **startNodeManager.cmd**

      9.       You are done, now check the status of node manager from Machine àMonitoring

      You will find as below

Status: Reachable

Version: 10.3.\* 

10.  Now start your Managed Server through Admin console.

**NOTE:** before starting managed server with node manager do create a boot.properties files for that server in server security directory.

In 12.2.1 onwards you need to create a separate folder & file under /Oracle\_Common/Common/**nodemanager/nodemanager.domains**
with domain entry as: base\_domain=C\\:\\\\Oracle\\\\Middleware\\\\Oracle\_Home\\\\user\_projects\\\\domains\\\\base\_domain

since in 12.2.1 onwards Oracle has removed default Nodemanager directory and wants user to create it manually and after creating this file launch the nodemanager that will create nodemanager.properties file under C:\\Oracle\\Middleware\\Oracle\_Home\\user\_projects\\domains\\base\_domain\\nodemanager

Br,

Punit
