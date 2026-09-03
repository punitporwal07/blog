---
title: "SAF agent in Weblogic"
description: "Store and Forward mechanism of JMS between weblogic domains only"
pubDate: 2018-02-13T23:49:00.012-08:00
updatedDate: 2021-06-04T06:52:22.828-07:00
tags:
  - "JMS"
  - "Messaging"
  - "SAF"
originalUrl: "https://cloudnetes.blogspot.com/2018/02/saf-agent-in-weblogic.html"
---

![](/blog/blog-images/jms-b8cb2867aa9a.png)

**S**tore **a**nd **F**orward mechanism of JMS between weblogic domains only
Key components include SAF agent with JMS-Module with resources:

-   SAF Error Handling
-   SAF Remote Context (when setting this resource we don't need to give remote domain credentials if we have already established trust between the two)
-   SAF Imported Destinations

In case of any issue, troubleshooting will include:
**trust issue between domains:** "serverIdentity failed Validation. Downgrading to Anonymous"
**Firewalls:** make sure necessary ports are open to communicate, checking by telnet
**Patch Level:** SAF will not support sending messages to the downgraded level of WLS
JMS resources not targeted properly

**Debug Logs for SAF**

```
 Sending side
 DebugSAFSendingAgent
 DebugJMSSAF
 DebugSAFMessagePath
 DebugSAFManager
 Receiving side
 DebugJMSSAF
 DebugSAFReceivingAgent
 DebugSAFVerbose
 if no receiving SAF then:
 DebugJMSBackEnd
 DebugJMSFrontEnd
 DebugJMSMessagePath
```

"change log severity to **debug** on both sides & disable all existing debugs"

**SAF or Bridge**
**Advantages over Bridge**
– SAF is faster and more scalable b/w WLS-WLS connectivity.
– clusterable.
– Bridges still supported and useful for non-WLS connectivity or pre-WLS10.0 destinations.
**Disadvantage (When not to use the SAF service)**
– SAF can’t be used with other products like Jboss, Glassfish, IBM MQ server, etc., for sending the messages.
– Forwarding messages to prior releases of WebLogic Server. (no backward compatibility)
– When using temporary destinations with the JMSReplyTo field to return a response to a request.

Thus I do not encourage using SAF over Bridges, rather I discourage using SAF over Bridge due to its buggy behaviour and its restricted behaviour since you cannot integrate it with other messaging technologies but bridges will allow you to do so.

For more reasons to avoid SAF agent within FMW please look onto [Oracle Blog](https://blogs.oracle.com/emeapartnerweblogic/5-reasons-to-avoid-wls-saf-agents-within-your-fmw-architecture-by-arturo-viveros)

\--
Punit
