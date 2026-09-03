---
title: "What is Native OOM in Java Heap?"
description: "Native OutOfMemory is a scenario"
pubDate: 2016-01-19T02:54:00.003-08:00
updatedDate: 2022-10-28T05:14:40.813-07:00
tags:
  - "java"
  - "oom"
originalUrl: "https://cloudnetes.blogspot.com/2016/01/what-is-native-oom-in-java-heap.html"
---

Native OutOfMemory is a scenario
Native memory is a Process Area

\---------Native OutOfMemory---------

Native OutOfMemory is a scenario when the JVM is not able to allocate the required Native Libraries and JNI Codes in the memory.
Native Memory is an area that is usually used by the JVM for it’s internal operations and to execute the JNI codes. The JVM Uses Native Memory for Code Optimization and for loading the classes and libraries along with the intermediate code generation.
The Size of the Native Memory depends on the Architecture of the Operating System and the amount of memory that is already committed to the Java Heap. Native memory is a Process Area where the JNI codes get loaded or JVM Libraries get loaded or the native Performance packs and the Proxy Modules get loaded…
Native OutOfMemory can happen due to the following main reasons:

Point-1) Setting very small StackSize (-Xss). StackSize is a memory area that is allocated to individual threads where they can place their thread local objects/variables.

Point-2) Usually it may be seen because of Tuxedos incorrect setting. WebLogic Tuxedo Connectors allows the interoperability between the Java Applications deployed on WebLogic Server and the Native Services deployed on Tuxedo Servers. Because Tuxedos uses JNI code intensively.

Point-3) Less RAM or Swap Space.

Point-4) Usually it may occur if our Application is using a very large number of JSPs in our application. The JSPs need to be converted into the Java Code and then need to be compiled. Which requires DTD and Custom Tag Library resolution as well. Which usually consumes more native memory.

\---------What to do in case of Native OutOfMemory---------

Point-1) Usually Native OutOfMemory causes Server/JVM Crash. So it is always recommended to apply the following JAVA\_OPTIONS flags in the Server Start Script to instruct the JVM to generate the HeapDump ”-XX:+HeapDumpOnOutOfMemoryError“
By default the heap dump is created in a file called java\_pidpid.hprof in the working directory of the VM, as in the example above. You can specify an alternative file name or directory with the “-XX:HeapDumpPath=C:/someLocation/“
Note: Above Flags are also suitable to collect HeapDump in the case of JavaHeap OutOfMemory as well. But these flags never guarantee that the JVM will always generate the Heap Dump in case of any OutOfMemory Situation.

Point-2) Usually in case of Native OutOfMemory a “hs\_err\_pid.log” file is created in case of Sun JDK and “xxxx.dump” file is created in case of JRockit JDK. These log files are usually Text Files and tells about the Libraries which caused the Crash. These files need to be collected and analyzed to find out the root cause.

Point-3) Make Sure that the -XX:MaxHeapSize is not set to a Very Large Space…because it will cause a very less Native Space allocation. Because as soon as we increase the HeapSize, the Native Area decreases. 

Please see the Post:[http://middlewaremagic.com/weblogic/?p=4456](http://middlewaremagic.com/weblogic/?p=4456)

Point-4) Keep Monitoring the process’s memory using the Unix utility ‘ps’ like following:
ps -p \-o vsz
Here you need to pass the WebLogic Server’s PID (Process ID) to get it’s Threading Details with respect to the Virtual Memory Space.

Point-5) If the Heap Usages is less Or if you see that Your Application usages less Heap Memory then it is always better to reduls the MaxHeapSize so that the Native Area will automatically gets increased.

Point-6) Sometimes the JVMs code optimization causes Native OutOfMemory or the Crash…So in this case we can disable the Code Optimization feature of JVM.
(Note: disabling the Code Optimization of JVM will decrease the Performance of JVM)
For JRockit JVM Code Optimization can be disabled using JAVA\_OPTION -Xnoopt
For Sun JDK Code Optimization can be disabled using JAVA\_OPTION -Xint
