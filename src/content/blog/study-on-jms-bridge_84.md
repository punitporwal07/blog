---
title: "Study on JMS Bridge"
description: "The WebLogic JMS adapter is being used for JMS bridge configuration. When the JMS"
pubDate: 2016-08-30T00:48:00.012-07:00
updatedDate: 2021-07-15T05:40:43.373-07:00
tags:
  - "JMS"
originalUrl: "https://cloudnetes.blogspot.com/2016/08/study-on-jms-bridge_84.html"
---

![](/blog/blog-images/bridge-fcf59fbb1998.gif)

The WebLogic JMS adapter is being used for JMS bridge configuration. When the JMS
source/destination is restarted, the adapter is not able to reconnect to the restarted instance.
Only a redeployment of the JMS resource adapter resolves the problem.
We suspect that the connections in the resource adapter connection pool are never being refreshed since WebLogic is not able to detect the invalid connections.
In order to make the resource adapter detect invalid connections, we need to make the resource adapter connections testable.
For this to happen, the JMS adapter's ManagedConnectionFactory should implement the javax.resource.spi.ValidatingManagedConnectionFactory.

The JMS bridge is failing to refresh the consumer connections after a DB failover.
The JMS adapter is not responsible for the failover activities. It is the JMS bridge which is responsible for refreshing the connections.

The problem can be resolved by changing the JMS Connection Factory configuration. Change the client reconnect policy to be "all" (the default is producer). See the following XML example:

|reconnect-policy|all|/reconnect-policy|

When the destination domain is restarted, the source bridge was failing to connect with the following exception:
 
com.mslv.oms.automation.AutomationException: com.mslv.oms.automation.AutomationException: Destination not found

The Messaging Bridge stops processing messaging and a server thread dump reveals the bridge is stuck waiting on ConnectionWrapper.invoke(). This issue is addressed by BUG 8066979

On the destination domain, disable Server Affinity on the Target Connection Factory to allow proper load balancing on both Distributed Queue members. To do this, go to JMS Modules -> ConnectionFactory ->Configuration ->Load Balance.
On the Source domain, apply the patch for BUG 8066979 as specified below to the Bridge host domain and retest.

Br
