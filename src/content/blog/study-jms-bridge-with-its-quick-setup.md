---
title: "Study JMS Bridge with its quick setup in webLogic domain"
description: "It is a forwarding mechanism between any two messaging products. ie between two JMS's of WebLogic"
pubDate: 2017-12-14T10:27:00.006-08:00
updatedDate: 2021-05-11T05:25:11.704-07:00
tags:
  - "Bridges"
  - "JMS"
  - "Messaging"
originalUrl: "https://cloudnetes.blogspot.com/2017/12/study-jms-bridge-with-its-quick-setup.html"
---

![](/blog/blog-images/jms-c7613f3959bf.png)

It is a forwarding mechanism between any two messaging products. ie between two JMS's of WebLogic
or between Weblogic JMS and other messaging product.
Basically, this messaging bridge consists of two destinations ( Source & target) that are being bridged.

Here we use “jms-notran-adp” which is the default adapter created for JMS Messaging Bridge with default QOS selected as “Exactly-Once”.

Configure WebLogic domain with the following configuration:

-   One Admin Server
-   One Managed server
-   One JMS server targeted to Admin
-   another targeted to Managed server

Create a JMS Module targeted to the Admin Server.

              Inside this JMS module create the below resources.

-   JMS Connection Factory (default targeting)
-   JMS Sub Deployment targeted to JMS server which is targeted to Admin Server
-   JMS Queue targeted to Sub Deployment created in the above step.

Create a JMS Module targeted to the Managed Server.

              Inside this JMS module create the following resources:

-   JMS Connection Factory (default targeting)
-   JMS Sub Deployment targeted to JMS Server which is targeted to Managed Server
-   JMS Queue targeted to JMS Sub Deployment created in the above step

Create a JMS Bridge Destination for the Admin Server Queue with the following details.

              For creating a JMS Bridge Destination, 

              click on the left panel in the console and go to:

                                 Services -> Messaging -> Bridges.

1.  Leave Adapter JNDI default name as is to “eis.jms.WLSConnectionFactoryJNDINoTX”
2.  Initial Context Factory as default to “weblogic.jndi.WLInitialContextFactory”
3.  For connection URL specify the t3 listen address of the Admin server, e.g., t3://localhost:7001.
4.  For Connection Factory JNDI Name specify the Connection Factory JNDI Name which is part of the JMS Module targeted to Admin Server.
5.  For Destination, JNDI Name selects JMS Queue JNDI name which is part of JMS Module targeted to Admin Server.
6.  Select Destination Type as “Queue”.

Create the JMS Bridge Destination for the Managed Server Queue same as the above steps.

                 Below are the details.

1.  Leave Adapter JNDI name as is as default to “eis.jms.WLSConnectionFactoryJNDINoTX” 
2.  Initial Context Factory as default to “weblogic.jndi.WLInitialContextFactory”
3.  For connection URL specify the t3 listen address of the Managed server, e.g. t3://localhost:7002
4.  For connection Factory JNDI Name specify the Connection Factory JNDI Name which is part of JMS Module targeted to Managed Server
5.  For destination JNDI Name select JMS Queue JNDI name which is part of JMS Module targeted to Managed Server
6.  Select Destination Type as “Queue”

Now we will configure JMS Messaging Bridge which will pick up the messages from JMS Queue on Managed Server and will forward them to JMS Queue on Admin Server.

 For this we have to select: 

-    source destination of JMS Bridge as Managed server Queue
-    & target destination as Admin Server queue.

Now create JMS Messaging Bridge with below details:

            Select the “Started” checkbox when creating JMS Bridge

                      For “Existing Source Destination”

-   select the JMS Bridge Destination created for Managed server in the above step
-   Leave Messaging Provider as is to default as “WebLogic Server 7.0 or higher”

                      For “Existing Target Destination”

-   select the JMS Bridge Destination created for the Admin server in the above step
-   Target the Messaging Bridge to Managed server.
-   Once Messaging Bridge is created click on it and a select checkbox for “QOS Degradation Allowed” 
-   and save the changes.

After the above configuration, you will see a “jms-notran-adp” resource adapter deployed on the Managed Server which is used by JMS Messaging Bridge. Restart your Domain Admin and Managed Server after the above configuration.

Validating JMS Bridge Configuration:

Once the JMS Bridge Configuration is complete using the above steps and the servers are restarted, login to console to check the JMS Messaging Bridge Status.

From the Administration console, click on JMS Messaging Bridge and go to the Monitoring tab.
The state of Bridge should be reported as “Active” and Description as “Forwarding messages.”
This means that the JMS Bridge configuration is successful, up and active in forwarding messages.

In this sample use case, JMS Bridge targeted to Managed server is picking messages from Managed Server JMS Queue and forwarding them to Admin Server JMS Queue.

Br,
Punit
