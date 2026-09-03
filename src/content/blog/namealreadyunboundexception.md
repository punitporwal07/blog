---
title: "Some known Weblogic exceptions"
description: "java.lang.IllegalStateException"
pubDate: 2017-04-24T00:32:00.011-07:00
updatedDate: 2023-07-15T13:49:30.315-07:00
tags:
  - "weblogic"
originalUrl: "https://cloudnetes.blogspot.com/2017/04/namealreadyunboundexception.html"
---

**java.lang.IllegalStateException

![](/blog/blog-images/oracle-weblogic-347a972d7071.png)

**

If you fails to access em console ( http://localhost:port/em) and you see below error trace in your server logs while deploying em.war archive do not panic and try to implement below provided solution

\----------error---------------

`500 Internal Server Error`

`Servlet error: An exception occurred. The current application deployment descriptors do not allow`

`for including it in this response. Please consult the application log for details.`

`java.lang.IllegalStateException: Environment vairable ORACLE_HOME is null.`

`at oracle.sysman.emSDK.conf.ConfigManager.init(ConfigManager.java:159)at oracle.sysman.emSDK.svc.ServiceUtil.initService(ServiceUtil.java:73)`

\----------/error---------------

Solution:
\-------------------------------

modify your setDomainEnv.sh from you domain/bin to add **em.oracle.home setting**

`APPLICATIONS_DIRECTORY="/wls_domains/emdomain/applications/emdomain"`

`export APPLICATIONS_DIRECTORY`

`EXTRA_JAVA_PROPERTIES="${EXTRA_JAVA_PROPERTIES} -Dem.oracle.home=/software/bea/Middleware/wls/10.3.6/oracle_common -Djava.awt.headless=true"`

`export EXTRA_JAVA_PROPERTIES`

**NameAlreadyUnboundException**

if you see below error trace in you server logs, do not panic instead try to fix it using below provided solution

\----------error---------------
<\[ServletContext@628023324\[app:bea\_wls\_cluster\_internal module:bea\_wls\_cluster\_internal.war path:/bea\_wls\_cluster\_internal spec-version:null\]\] Servlet failed with IOException
**weblogic.jndi.internal.NameAlreadyUnboundException**: Object already partially unbound in cluster.
        at weblogic.rmi.cluster.ReplicaAwareRemoteObject.writeExternal(ReplicaAwareRemoteObject.java:179)
        at weblogic.rmi.cluster.ClusterableRemoteObject.writeExternal(ClusterableRemoteObject.java:307)
        at java.io.ObjectOutputStream.writeExternalData(ObjectOutputStream.java:1442)
        at java.io.ObjectOutputStream.writeOrdinaryObject(ObjectOutputStream.java:1411)
        at java.io.ObjectOutputStream.writeObject0(ObjectOutputStream.java:1159)
        Truncated. see log file for complete stacktrace
\----------/error---------------

Reason to the Problem:
\--------------------------------
public class NameAlreadyBoundException
extends NamingException https://docs.oracle.com/javase/7/docs/api/javax/naming/NamingException.html

This exception is thrown by methods to indicate that a binding cannot be added because the name is already bound to another object.
You have same interface in two jar files and also both these jars exists in this environment.Only one JNDI can exists. You have to remove one of them so that other one can work as expected.
If you can't do this please change the JNDI name in one of the jar and redeploy.

Solution:
\--------------------------------
change code from:
@Stateless(mappedName = "management.service")
to
@Stateless(name = "management.service")

**Issue: While activating the changes in the WebLogic admin console**

An error occurred during activation of changes, please see the log for details. \[Management:141191\]The prepare phase of the configuration update failed with an exception: Provider org.apache.xerces.jaxp.DocumentBuilderFactoryImpl not found

Solution:
\--------------------------------

1\. Stop the AdminServer & ManagedServers.

2\. On your AdminServer cd to %WEBLOGIC\_HOME%\\user\_projects\\domains\\base\_domain.

3\. Delete the files under pending and servers/domain\_bak directory.

4\. Repeat steps 2 & 3 one each ManagedServers in the domain.

5\. Start the AdminServer & ManagedServers.

6\. Login the AdminConsole and click on ReleaseConfiguration button.

7\. Perform the same changes now.
