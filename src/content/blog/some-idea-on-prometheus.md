---
title: "Some idea on Prometheus"
description: "Prometheus is a monitoring tool used to monitor the infrastructure devices, that can monitor CPU, RAM, disk utilization, network bandwidth, etc of remote servers."
pubDate: 2021-12-17T14:39:00.016-08:00
updatedDate: 2022-12-18T12:58:26.767-08:00
tags:
  - "prometheus"
originalUrl: "https://cloudnetes.blogspot.com/2021/12/some-idea-on-prometheus.html"
---

**Prometheus** is a monitoring tool used to monitor the infrastructure devices, that can monitor CPU, RAM, disk utilization, network bandwidth, etc of remote servers.

**Node Exporter** -  is a Prometheus agent that needs to be installed in all target servers to collect the metrics which is not required to install in the Prometheus server. 

**SNMP Exporter** - is another Prometheus agent that collects network statistics.

**Basic infra of Prometheus**

![](/blog/blog-images/avvxsejtigztl15hmgaktla2wk3yqkc2g9fv4psf-a1f2bbd7c636.png)

The main component of Prometheus is the **Prometheus server** which is where all the configuration needs to be done in a _Prometheus file._

Prometheus has its web user interface where we can see the metrics and agent details.

**Detailed infra of Prometheus**

**

![](/blog/blog-images/avvxseietea6me9p0ej6sr-rsvn-nttqq-xfzjgv-de905b2dbd38.png)

**

There are 3 major components of the Prometheus server.

**TSDB** ( Time series database)
It is different than traditional databases which is quite efficient & update the metric data over time. It is a local DB available in the server that stores the data in key ~ value format.

**Retrieval**
It connects to the agent running in the target servers and pulls/retrieves the metrics and stores them in TSDB.

**HTTP Server**
The Prometheus web user interface is deployed and runs on this HTTP Server.

**Service discovery** help in identifying the target nodes from the inventory at runtime to collect the metrics, additionally, one can hard-code the target nodes but that is not advisable.
