---
title: "iisproxy.ini (Sample)"
description: "\\ This file contains initialization name/value pairs"
pubDate: 2014-11-25T22:28:00.001-08:00
updatedDate: 2014-11-25T22:28:33.704-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/iisproxyini-sample.html"
---

#Here is a sample iisproxy.ini file with clustered WebLogic Servers. Comment lines are denoted with the “#” character.

\# This file contains initialization name/value pairs
\# for the IIS/WebLogic plug-in.

`WebLogicCluster=192.168.1.144:7003,192.168.1.145:7005`
`ConnectTimeoutSecs=20`
`ConnectRetrySecs=2`
`#WlForwardPath=/examplesWebApp`
`Debug=ALL`
`DebugConfigInfo=ON`

`Br,`
`Punit`
