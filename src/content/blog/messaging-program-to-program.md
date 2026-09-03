---
title: "Messaging Queue"
description: "Program-to-program communication by sending and receiving messages to and from the queue without having a logical connection between them."
pubDate: 2018-04-18T22:30:00.011-07:00
updatedDate: 2021-09-23T05:17:36.116-07:00
tags:
  - "MQ"
  - "queue manager"
originalUrl: "https://cloudnetes.blogspot.com/2020/04/messaging-program-to-program.html"
---

![](/blog/blog-images/ibmmq-7092efe13cb7.png)

Program-to-program communication by sending and receiving messages to and from the queue without having a logical connection between them.

**Queuing**

Programs communicate with each other through queues.

There are 2 types of messaging 

-   Asynchronous Messaging – the sending program proceeds with its own processing without waiting for  the reply of the message.
-   Synchronous Messaging 

**Note:** Programmer can’t specify the name of the target application to which the message is sent. Instead, they specifies the target Queue as each queue is associated with a program.

A Message has 2 part – Data & Message Header.

-   Message Header(Message Descriptor) identifies the message(message ID) and contains information(attributes)
-   Common attributes are message type, expiry time, correlation ID, priority and name of the queue for reply.

**Message Segmenting and Queuing** 

-   Segmenting a  large message if it does not fit the queue and receiver can get the message in one piece or as multiple segments based on the buffer size.
-   Programmer can even segment the messages and each segment is treated as a separate physical message. Thus several physical messages building one logical message.
-   To reduce network traffic, sometimes many small messages are grouped together and sent to destination.

**MQ Message Types**

1.  Datagram – Message containing information, but no response is expected.
2.  Request – Message for which a reply is requested.
3.  Reply – Reply to a request message
4.  Report – A message that describes an event such as occurrence of error or confirmation or arrival or delivery.

**Persistent vs Non-Persistent Messages**

Deliveries of persistent messages are assured. They are written into logs to survive system failures.

**Message Descriptor**

1.  Version – depends on MQ version and the platform in use.
2.  Message ID / Correlation ID –  these fields are used to identity a specific request or reply.
3.  Persistent/Non-Persistent
4.  Priority
5.  Date and time
6.  Expiration Date (when is date is reached, MQGET is called and the message is discarded)
7.  Return address – (reply-to-queue or reply-to-queue manager)
8.  Format – sender can specify a value which receiver can use to decide whether data conversion is done or not.
9.  Sender application and type.
10.  Report options and Feedback Code – used for request information like confirmation of delivery
11.  Back out Counter
12.  Message Segment and Grouping

**MQ Manager (MQM)**

-   Manages queues and message for the application
-   Provided Message Queuing Interface (MQI) for communication between programs.

Program A  ( via MQPUT) — > Remote Queue --> CHANNEL --> Local Queue --> Program B (via MQGET)

Program A  (via MQPUT) — > Shared Queue --> Program B (via MQGET)

**Queue Manager Clusters**

-   MQM’s are joined together in clusters which may run in the same machine or different machine.
-   They maintain a repository that contains the information about all the queue managers and queues in the cluster. (Full Repository)
-   The un-clustered MQM’s manage a repository that contains the information of the objects they are interested in (Partial Repository)
-   MQM uses special cluster channels to exchange information

**Queue Manager Objects**

1.  Queues
2.  Process Definitions
3.  Channels

**Queues**

Queues are classified as

1.  Local Queue                             – a real queue
2.  Remote Queue                          – structure describing a queue
3.  Transmission Queue                  – local queue with special purpose
4.  Initiation Queue                       – local queue with special purpose
5.  Dynamic Queue                         – local queue created on the fly to store intermediate results
6.  Alias Queue                              – not real queues but definitions in case you want alias names
7.  Dead-letter Queue                   – one for each queue manager to store the messages when handling situations like destination queue is full, dest queue doesn’t exist, message is too large, duplicate message sequence number etc.
8.  Reply-to Queue             – specified in request message
9.  Model Queue                            – model for local queues
10.  Repository Queue                     – holds the cluster information

**Process Definitions**

Defines an application to a queue manager

Eg: the name of the program (and its path) to be triggered when a message arrives for it.

**MQ Channels**

-   Channels are used to send and receive messages between queue managers.
-   Channels are classified into

**Message Channels**

-   connects 2 queue managers via Message Channel Agents (MCA or movers)
-   unidirectional
-   Comprises of 2 MCAs, a sender and a receiver and a communication protocol.
-   MCA is a program that transfers messages from transmission queue to communication link and vice versa

**MQI Channels**

-   Message Queue Interface channel
-   Connects MQ client to a MQM in the server machine.
-   Bi-directional.

**Listeners** 

Listeners are processes that accept network requests from other queue managers, or client applications, and start associated channels.

**Lab Work**

**Creating a queue manager called QM1**

1.      Create a queue manager with the name QM1 :

    `crtmqm QM1`

 (The queue manager is stopped. You must start the queue manager to administer it, and read and write messages from its queues.)

2.      Start the queue manager :

    `strmqm QM1`

 (when the queue manager started, you can now create the queues.) 

**create a queue called LQ1**

A queue is a WebSphere MQ queue manager object. There are three ways to create WebSphere MQ objects:

1.           Command-line.
2.          WebSphere MQ Explorer.
3.          Using a programmable interface.

1.      Start the scripting tool :

         `runmqsc QM1`

 (The tool is ready to accept MQSC commands.)

2.      Create a local queue called LQ1 by typing the following MQSC command:

    `define qlocal(LQ1)`

3.      Stop the scripting tool by typing the following MQSC command:

    `end`

**Displaying Queue Manager Status**

To check the queue manager is running or not:

`dspmq`

QMNAME(QM1)   STATUS(Running)

**Putting a message to the Queue LQ1**

1.    Use the amqsput sample application to put a message to queue LQ1 :

   `amqsput LQ1 QM1`

When the sample application starts, you see:

\# amqsput LQ1 QM1

Sample AMQSPUT0 start

target queue is LQ1

Type Hello World and press Enter. You placed a message that contains the text “Hello World” on the queue LQ1 managed by the queue manager called QM1. To end amqsput, press Enter.

You see the following output:

amqsput LQ1 QM1

Sample AMQSPUT0 start

target queue is LQ1

Hello World

Sample AMQSPUT0 end

**Getting messages from the Queue LQ1**

Use the amqsget sample application to read a message on the queue LQ1:

`amqsget LQ1 QM1`

When the sample application starts, you see:

\# amqsget LQ1 QM1

Sample AMQSGET0 start

message

no more messages

Sample AMQSGET0  end

The amqsget application ends 30 seconds after reading the message.

Thats how you test the functionality of messaging queue between two applications. 

**Some helpful commands to use in IBM-MQ**

```
 # Create a Queue Manager
 $ crtmqm QM1

 # start a queue manager
 $ strmqm QM1

 # connect to a Queue Manager
 $ runmqsc QM1

 # create a Queue in QM1
 $ define ql(LQ1)

 # start a Linstener, from runmqsc
 $ START LISTENER

 # check listener status
 $ DISPLAY LSSTATUS(*)

 # Create a server connection channel
 $ DEFINE CHANNEL(DEV.APP.SVRCONN) CHLTYPE(SVRCONN) TRPTYPE(TCP) DISCINT(3600) DESCR('Server-connection to Client')

 # check channel status
 $ DIS CHS( chanl_name)

 # refresh security
 $ REFRESH SECURITY TYPE(SSL)
```

Br,

Punit
