---
title: "JAVA FLIGHT RECORDER"
description: "To run JAVA FLIGHT RECORDER for any java process do the following"
pubDate: 2014-06-18T06:20:00.003-07:00
updatedDate: 2022-10-30T14:15:43.406-07:00
tags:
  - "java"
originalUrl: "https://cloudnetes.blogspot.com/2018/06/java-flight-recorder.html"
---

![](/blog/blog-images/java-917cc8d3a8a3.jpg)

To run JAVA FLIGHT RECORDER for any java process do the following

```
# set Domain Env
$ /bin/./setDomainEnv.sh
$ jcmd PID JFR.start duration=60s filename=myrecording.jfr
```

ref: [how to use JFR](https://docs.oracle.com/javacomponents/jmc-5-4/jfr-runtime-guide/run.htm#JFRUH178)

remember after running the above steps it will unlock commercial features of weblogic, will not allow to run any new java instance on the same host, and gives a message like

`<"ResourceManagement" is not enabled in this JVM. Enable "ResourceManagement" to use the WebLogic Server "Resource Consumption Management" feature. To enable "ResourceManagement", you must specify the following JVM options in the WebLogic Server instance in which the JVM runs: -XX:+UnlockCommercialFeatures -XX:+ResourceManagement.>` 

so you need to disable this commercial feature by restarting the JVM for which you have used the above tool.

**jcmd unlock's commercial features of product at first use.**
**
\--**
