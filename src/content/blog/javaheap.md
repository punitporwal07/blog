---
title: "Study on JAVA_HEAP"
description: "1). Just for Example we can see that the process Size is 2048 MB (2GB)"
pubDate: 2015-07-21T00:01:00.013-07:00
updatedDate: 2022-02-17T10:25:30.786-08:00
tags:
  - "java"
originalUrl: "https://cloudnetes.blogspot.com/2015/07/javaheap.html"
---

![](/blog/blog-images/java-heap-diagram-12-3d12360a672f.jpg)

1). Just for Example we can see that the process Size is 2048 MB (2GB)

2). The Java Heap Size is 1024MB (means 1GB) -Xmx1024m

3). Native Space = ( ProcessSize – MaxHeapSize – MaxPermSize) It means around 768 MB of Native Space.

4). MaxPermSpace is around -XX:MaxPermSize=256m

5). Young Generation Space is around 40% of the Maximum Java Heap.

**What Are these Different Parts?**

**Eden Space**

Eden Space is a Part of Java Heap where the JVM initially creates any objects, where most objects die

and quickly are cleaned up by the minor Garbage Collectors (Note: Full Garbage Collection is different

from Minor Garbage Collection). Usually, any new objects created inside a Java Method go into Eden

space and the objects space is reclaimed once the method execution completes. Whereas the Instance

Variables of a Class usually live longer until the Object-based on that class gets destroyed. When Eden

fills up it causes a minor collection, in which some surviving objects are moved to an older generation.

**Survivor Spaces**

Eden Space has two Survivor spaces. One survivor space is empty at any given time. This Survivor

Spaces serve as the destination of the next copying collection of any living objects in eden and the other

survivor space.

The parameter SurvivorRatio can be used to tune the size of the survivor spaces.

\-XX:SurvivorRatio=6 sets the ratio between each survivor space and eden to be 1:6

If survivor spaces are too small copying collection overflows directly into the tenured generation.

**Young Generation: (-XX:MaxNewSize)**

Till JDK1.3 and 1.4 we used to set the Young Generation Size using -XX:MaxNewSize. But from

JDK1.4 onwards we set the YoungGeneration size using (-Xmn) JVM option.

Young Generation size is controlled by NewRatio. It means setting -XX:NewRatio=3 means that the ratio

between the Old Generation and the Young Generation is 1:3

.

Similarly -XX:NewRatio=8 means that 8:1 ratio of the tenured and young generation.

**NewRatio**

NewRatio is actually the ratio between the (YoungGenaration/Old Generations) has default

values of 2 on Sparc , 12 on client Intel, and 8 everywhere else.

**NOTE:** After JDK 1.4 The Young Generation Size can be set using (-Xmn) as well.

**Virtual Space-1: (MaxNewSize – NewSize)**

The First Virtual Space is actually shows the difference between the -XX:NewSize and -

XX:MaxNewSize. Or we can say that it is basically a difference between the Initial Young Size and the

Maximum Young Size.

**Java Heap Area: (-Xmx and -Xms)**

Java Heap is a Memory area inside the Java Process which holds the java objects. Java

Heap is a combination of Young Generation Heap and Old Generation Heap. We can set

the Initial Java Heap Size using -Xms JVM parameter similarly if we want to set the

Maximum Heap Size then we can use -Xmx JVM parameter to define it.

Example:

\-Xmx1024m —> Means Setting the Maximum limit of Heap as 1 GB

\-Xms512m —> Means setting Java Heap Initial Size as 512m

.

**NOTE-1):** It is always recommended to set the Initial and the Maximum Heap size values as same for

better performance.

**NOTE-2):** The Theoretical limitation of Maximum Heap size for a 32 bit JVM is upto 4GB. Because of

the Memory Fragmentation, Kernel Space Addressing, Swap memory usages and the Virtual Machine

Overheads are some factors JVM does not allow us to allocate whole 4GB memory for Heap in a 32 bit

JVM. So usually on 32-bit Windows Operating Systems the Maximum can be from 1.4 GB to 1.6 GB.

.

If we want a Larger memory allocation according to our application requirement then we must choose the

64-bit operating systems with 64 bit JVM. 64-bit JVM provides us a larger address space. So we can have

much larger Java Heap with the increased number of Threads allocation area. Based on the Nature of

your Operating system in a 64 bit JVM you can even set the Maximum Heap size upto 32GB.

Example: -Xms32g -Xmx32g -Xmn4g

**Virtual Space-2: (MaxHeapSize – InitialHeapSize)**

The Second Virtual Space is actually the Difference between the Maximum Heap size (-Xmx)and the

Initial Heap Size(-Xms). This is called as virtual space because initially the JVM will allocate the Initial

Heap Size and then according to the requirement the Heap size can grow till the MaxHeapSize.

.

**PermGen Space: (-XX:MaxPermSize)**

PermGen is a non-heap memory area where the Class Loading happens and the JVM allocates spaces for

classes, class meta data, java methods and the reference Objects here. The PermGen is independent from

the Heap Area. It can be resized according to the requirement using -XX:MaxPermSize and -

XX:PermSize JVM Options. The Garbage collection happens in this area of JVM Memory as well. The

Garbage collection in this area is called as “Class GC”. We can disable the Class Garbage Collection

using the JVM Option -noclassgc. if ”-noclassgc” Java Option is added while starting the Server. In that

case the Classes instances which are not required will not be Garbage collected.

**Native Area**

Native Memory is an area which is usually used by the JVM for its internal operations and to execute the

JNI codes. The JVM Uses Native Memory for Code Optimization and for loading the classes and libraries

along with the intermediate code generation.

The Size of the Native Memory depends on the Architecture of the Operating System and the amount of

memory which is already committed to the Java Heap. Native memory is a Process Area where the JNI

codes gets loaded or JVM Libraries gets loaded or the native Performance packs and the Proxy Modules

gets loaded.

There is no JVM Option available to size the Native Area. But we can calculate it approximately using

the following formula:

**NativeMemory = (ProcessSize – MaxHeapSize – MaxPermSize)**

**HEAP DUMP**

How do you analyze heap dump?

$ /apps/java/jdk1.6\_25-64/bin/jmap -dump:format=b, file=/apps/heapJmap.bin (PID)

it will say heap dumped into the location

$ /jhat -J-mx1024m /apps/heapJmap.bin

it will start the HTTP client stating - started HTTP server on port 7000 server is ready
then hit the URL http://localhost:7000

**NOTE**: due to JDK-6614052 : jhat fails to read heap dump >2GB

\--
