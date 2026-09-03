---
title: "Why weblogic doesn't allows you to open Multiple console's hosted onto single machine"
description: "How To Open Multiple Weblogic consoles in same browser"
pubDate: 2016-12-20T22:42:00.001-08:00
updatedDate: 2016-12-20T22:42:14.015-08:00
originalUrl: "https://cloudnetes.blogspot.com/2016/12/why-weblogic-doesnt-allows-you-to-open.html"
---

How To Open Multiple Weblogic consoles in same browser

Have you ever wondered why you are unable to load more than one weblogic console running in same machine (even though port numbers are different)? in the same browser. If more than one admin console is opened in same browser, user is logged out.

This is working as designed.

Multiple weblogic consoles when opened in the same set of browser, user logs out.

If one console is opened in firefox and another in IE, it does not logout.

That is because the default Console Cookie Name is ADMINCONSOLESESSION, and when two cookies are created in browser with same cookie name, there is a conflict. This feature is working as designed in WLS.

However there is workaround for this.

Go to admin console –>domain –>configuration –> General –> advanced

Edit the Console Cookie Name of ADMINCONSOLESESSION to something else.

Save changes and restart.

Br,
Punit
