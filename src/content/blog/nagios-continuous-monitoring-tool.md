---
title: "Nagios: Continuous Monitoring Tool"
description: "This tool works with the help of Nagios XI server to monitor resources in environment."
pubDate: 2018-02-24T09:52:00.002-08:00
updatedDate: 2020-05-03T02:59:38.401-07:00
tags:
  - "Nagios"
originalUrl: "https://cloudnetes.blogspot.com/2018/02/nagios-continuous-monitoring-tool.html"
---

![](/blog/blog-images/nag-1b2b1691e0cc.png)

This tool works with the help of [Nagios](https://www.nagios.com/videos/2017/07/nagios-xi-get-monitoring-xi-works/) XI server to monitor resources in environment.
Nagios XI server talks to resources using two ways:

1.  Agents (needs to be placed on to some machine)
2.  Native Protocol (using SNMP- widely used & WMI-solely used for windows env.)

\- when you install Agent XI talks to it and gets data about resources and visualize it & you can also generate alert of it.

\- when you enable SNMP on any n/w switch XI talks to it using protocol and get the data about its resources.

This is called as **active** monitoring. where nagios XI server ask the question about resources to the agent or can use a native protocol to get data back.

**Passive** monitoring: in passive nagios server never reaches to its agent, its only agent who sends data periodically or in case of any event occurs. then information goes to nagios server and you can further visualize it or trigger alerts.

![](/blog/blog-images/nagios-archi-5ace01228563.png)

Br,
Punit
