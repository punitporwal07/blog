---
title: "Error: Commit events are not broadcast because no JMS Transport is available"
description: "<Error <Security <BEA-000000 <Commit events are not broadcast because no JMS Transport is available. Remote L2 caches will be out sync."
pubDate: 2014-11-25T03:40:00.004-08:00
updatedDate: 2021-07-15T05:41:29.051-07:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/this-is-issue-which-is-observed-due-to.html"
---

**<Error> <Security> <BEA-000000> <Commit events are not broadcast because no JMS Transport is available. Remote L2 caches will be out sync.>**

This is an issue which is observed due to the RDBMS security store configuration issue. In order to sync the data in RDBMS security store, WLS uses JMS topic for transport, which is not being observed in this case and thus this error. The solution is to configure the JMS topic as per the documentation reference provided above. However this message is ideally not an error message but a mere warning message. Thus as part of code Oracle has delivered a patch for WLS, to change the severity of this message from "ERROR" to "WARNING". This patch can be downloaded using My Oracle Support portal using:
Bug number : 13459424
Patch ID : NF9G
