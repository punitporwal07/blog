---
title: "OutOfMemoryError issues"
description: "You can encounter the \"java.lang.OutOfMemoryError: Unable to create new native thread\""
pubDate: 2014-09-05T04:45:00.005-07:00
updatedDate: 2022-02-18T06:07:16.899-08:00
tags:
  - "weblogic"
originalUrl: "https://cloudnetes.blogspot.com/2018/09/what-is-causing-javalangoutofmemoryerro.html"
---

![](/blog/blog-images/d5a3419c3adb.png)

You can encounter the **"java.lang.OutOfMemoryError: Unable to create new native thread"**

-   whenever the JVM asks for a new thread from the OS
-   Whenever the underlying OS cannot allocate a new native thread
-   The exact limit for native threads is very platform-dependent.

It is recommended to find out those limits by running a test similar to the below.

In general, the situation causing java.lang.OutOfMemoryError: Unable to create new native thread goes through the following phases:

1.  A new Java thread is requested by an application running inside the JVM
2.  JVM native code proxies the request to create a new native thread to the OS
3.  The OS tries to create a new native thread that requires memory to be allocated to the thread
4.  The OS will refuse native memory allocation either because the 32-bit Java process size has depleted its memory address space – e.g. (2-4) GB process size limit has been hit – or the virtual memory of the OS has been fully exhausted.

 **Solution:**
1) Reduce the amount of memory allocated to each thread through the use of the -Xss JVM option
reducing the **stack size using -Xss** (e.g “-Xss64kb” ) start with 64k, try the application, then if it doesn’t work (it will fail with a Java.lang.StackOverFlowError), increase the stack to 128k, then 256k, and so on.
2) Determine the problem with the application that requires that so many threads be opened and redesigned to prevent so many threads from being spawned.
use "**ulimit -a**" to check the "max user processes" and "open files" and change the value to a bigger value.

Reference: Oracle Doc ID 2232666.1

**OOM due to -XXtlasize (Local Thread Area)**

**java.lang.OutOfMemoryError: getNewTla.**
**java.lang.OutOfMemoryError: getNewTla**
at com.sun.jmx.remote.internal.ArrayNotificationBuffer.fetchNotifications(ArrayNotificationBuffer.java:459)
at com.sun.jmx.remote.internal.ArrayNotificationBuffer$ShareBuffer.fetchNotifications(ArrayNotificationBuffer.java:209)
at com.sun.jmx.remote.internal.ServerNotifForwarder.fetchNotifs(ServerNotifForwarder.java:258)
at javax.management.remote.rmi.RMIConnectionImpl$2.run(RMIConnectionImpl.java:1227)
at javax.management.remote.rmi.RMIConnectionImpl$2.run(RMIConnectionImpl.java:1225)
Truncated. see log file for complete stacktrace
\>

\------------------------------

The standard approach I can suggest to this kind of problem is to configure the JVM to take a heap dump when it OOME's, and analyze it with jhat or some other tool.
OR
If you are totally stumped, back out the changes to the last known working version and reapply them one at a time in a lower environment first.

Reason for the Problem:
\------------------------------
The TLA is the space reserved on the heap for use exclusively by a thread. Running out of memory means that there is no more space to use in the heap. The solution is to increase the available heap space (with Xmx) and not just to play around with the XXtlaSize

\-XXtlaSize Sets the thread-local area size.

To increase performance JRockit JVM uses thread-local areas (TLA) for object allocation. This option can be used to tune the size of the thread-local areas, which may affect performance.

Use this option with caution, as changing the thread-local area size can have a severe impact on the performance.

The default value for the preferred size depends on the heap size

current settings you may be using:

 -Xms:512m -Xmx:784m -Xns:300m
 -XXtlaSize:min=16k,preferred=32k

When you set the minimum and/or the preferred TLA size, the large object limit (set with -XXlargeObjectLimit) and the minimum block size (set with -XXminBlockSize) may be adjusted automatically by JRockit JVM if necessary.
