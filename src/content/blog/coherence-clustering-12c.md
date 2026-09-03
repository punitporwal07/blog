---
title: "What is Coherence Clustering (12c)"
description: "Coherence clusters consist of multiple managed Coherence server instances that work together to distribute data in-memory to increase application scalability, availability, and performance. A client i"
pubDate: 2014-11-25T22:39:00.005-08:00
updatedDate: 2022-02-17T07:46:14.824-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/coherence-clustering-12c.html"
---

Coherence clusters consist of multiple managed Coherence server instances that work together to distribute data in-memory to increase application scalability, availability, and performance. A client interacts with the data in a local cache and the distribution and backup of the data are automatically performed across cluster members.

 
Coherence clusters are different than WebLogic Server clusters. They use different clustering protocols and are configured separately. A WebLogic Server domain can contain a single Coherence cluster. Multiple WebLogic Server clusters can be associated with a Coherence cluster.

 
[Oracle Coherence](https://www.blogger.com/#) is an in-memory [data grid](https://www.blogger.com/#) and distributed caching solution. Coherence enables organizations to predictably scale mission-critical applications by providing fast access to frequently used data. It provides a robust data abstraction layer that brokers the supply and demand of data between applications and data sources. Coherence is composed of many individual nodes or JVMs which work together to provide highly reliable and high-speed virtual caching. The complexity of the cluster is completely hidden from the user of the virtual cache. By automatically and dynamically partitioning data, Coherence ensures continuous data availability and transactional integrity, even in the event of a server failure. 

Coherence provides several core services including
· caching,
· analytics,
· transactions
· Events.

 
· Caching - Reading from cache is almost always faster than querying back-end data sources. Applications cache data in the data grid to reduce the need for more expensive requests to back-end applications data sources. Coherence's shared data cache provides a single, [consistent view of cached data](https://www.blogger.com/#). Applications can query and analyze data in memory (cache), leveraging the massively parallel capabilities of the data grid.

· Analytics - When many people hear analytics, they may think of [Google Analytics](https://www.blogger.com/#). Coherence does the same thing (and more) for your applications. Coherence allows searching, aggregating, and sorting data, even including support for custom analytical functions. It [parallelizes operations](https://www.blogger.com/#) across the entire data grid, ensuring that server failures or slowdowns do not affect calculation results

· Transactions - With Coherence, applications are able to manage transactional data in memory inside the data grid. The combination of scalability and performance (see below) which Coherence provides makes it optimal for extreme transaction processing workloads. Its in-memory replication and guaranteed [data consistency](https://www.blogger.com/#) mean that it is suitable for managing transactions in memory until they are persisted to an external data source for archiving and reporting.

· Events - Every transaction that occurs can potentially trigger many events. Each of these events may need to be processed in very short order (often milliseconds). Coherence provides event-handling technologies capable of handling intense event rates, including server-side stream processing and interactive technologies such as a [continuous query](https://www.blogger.com/#) for real-time desktop applications. To test the HTTP session management get oracle Weblogic server 12.1.3 with coherence installed on your machine.

**Testing HTTP Session Management using coherence load balancer in 12c**

Latter after the installation switch to the directory as shown below:

`cd /home/punit/Oracle/Infra/coherence/lib`

`/usr/java/jdk1.7.0_67/bin/java -jar coherence-loadbalancer.jar 192.168.1.150:80 192.168.1.150:7003 192.168.1.150:7005`

hit the URL `--> 192.168.1.150:80/<application-name>`
