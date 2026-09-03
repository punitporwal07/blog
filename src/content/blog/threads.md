---
title: "Threads"
description: "What is Thread?"
pubDate: 2014-06-15T00:25:00.001-07:00
updatedDate: 2023-11-24T07:28:09.913-08:00
tags:
  - "java"
  - "threads"
originalUrl: "https://cloudnetes.blogspot.com/2018/06/threads.html"
---

**What is Thread?

![](/blog/blog-images/avvxsegnmfkofamscwhyiio5c0xpipjbcfs1z6qt-5b5cf67b576d.png)

**A thread is a single sequential flow of control within a program.

**What is Stuck Thread?**
A Stuck Thread is a thread which is processing a request for more than maximum time that you
configured in admin console.

**How to deal with Stuck Thread?**
Take multiple thread dumps immediately.
Review thread dumps or from console (managed server > monitoring > threads).
See how many threads got stuck?
If the stuck thread count is increasing or constant?
If constant then if got stuck on same area (application code etc ) or at different places ?
If getting increase then there would be some serious problem and you have to do a quick health check of you application server, database and other integrated technologies wherever your application reaching like ldap server for authentication, some other API’s or web services etc, and in parallel review thread dumps for stuck threads and share same with your developers to analyze quickly.
If you have one, two or few constant stuck  threads and it’s not increasing then you can monitor it for some more time to check if they get clear or not, if not then to clear them you have only option to restart your managed server(s), and its better to restart and clear them before they make further any impact.

**What is Hogging Thread?** 
 A hogging thread is a thread which is taking more than usual time to complete the request and can be declared as Stuck .

**How Weblogic determine a thread to declare as hogging?**
A thread declared as Stuck if it runs over 600 secs (default configuration which you can increase or decrease from admin console).
There is an internal WebLogic polar which runs every 2 secs (by default 2 secs and can be alter)
It checks for the number of requests completed in last two minutes
Then it check how much times each took to complete
Then it takes the average time of all completed request (completed in last 2 sec)
Then multiply average time with 7, and the value came consider as “usual time to complete the request”
Now weblogic check each current executed thread in last 2 secs and compare with above average time, if for any of the thread it’s above this value then that thread will declare as Hogged thread.
For example –
At a particular moment, total number of completed requests in last two seconds – 4
Total time took by all 4 requests – 16 secs
Req1 took – 5 secs, Req2 took – 3 secs, Req3 took – 7 secs, Req4 took – 1 sec
Average time = 16/4 = 4 secs
7\*4 = 28 secs
Now weblogic check all executed threads to see which taking more than 28 secs, if any then that thread(s) declared as Hogged Thread.
Only the thing you can change with respect to hogging threads configuration is Polar time (Stuck Thread Timer Interval parameter)which is 2 secs by default. You can change this polar value to some different value like 4 secs if you want polar to run in every 4 secs instead of 2 secs.
