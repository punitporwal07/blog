---
title: "WLSDM Monitoring Agent"
description: "To add monitoring agent into your weblogic domain follow below steps:"
pubDate: 2016-12-20T22:36:00.000-08:00
updatedDate: 2016-12-20T22:38:29.278-08:00
originalUrl: "https://cloudnetes.blogspot.com/2016/12/wlsdm-monitoring-agent.html"
---

To add monitoring agent into your weblogic domain follow below steps:

1\. create folder into your domain
    wlsdm\_agent > place file > wlsdm\_agent.jar
2\. place file > under console-ext > wlsdm.war
3\. add below argument to hosted server:
    -javaagent:C:/setups/wlsdm/wlsdm.v2.5.2/jar/wlsdm\_agent.jar -Dwlsdm.agent.logger.level=INFO -XX:+UnlockCommercialFeatures -XX:+FlightRecorder

4\. restart your domain

[Download WLSDM](http://www.wlsdm.com/download)

after successful configuration WLSDM will be visible in you weblogic console as:

![](/blog/blog-images/wlsdm-24b13e4c6c55.png)

Br,
Punit
