---
title: "Clustering Message Type"
description: "Unicast:"
pubDate: 2014-11-25T22:50:00.001-08:00
updatedDate: 2014-11-26T01:15:01.000-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/clustering-message-type.html"
---

**Unicast:**

Say you have three servers (MS-1, MS-2, MS-3) in a cluster now if they have to communicate with each other they have to ping (i.e. heartbeats) the cluster master for informing him that he is alive.

If MS-1 is the master then MS-2 and MS-3 would send the ping to MS-1

**Multicast:**

Here there is no cluster master each server has to ping each other to inform everyone that I am alive.

So MS-1 would send the ping to MS-2 & MS-3 same way MS-2 would send the ping to MS-1 & MS-3 and MS-3 would ping MS-1 & MS-3.

Thus if you see in multicast the congestion in sending the pings are more compared to unicast which makes multicast much heavier, thus WLS recommends using Unicast of less congestion in the network.

Br,

Punit
