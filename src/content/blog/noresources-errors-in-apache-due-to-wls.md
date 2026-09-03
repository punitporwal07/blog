---
title: "NO_RESOURCES Errors in APACHE when WLS at Backend"
description: "At times you will see, apache throws no resources error when you have weblogic in backend."
pubDate: 2014-06-08T00:50:00.006-07:00
updatedDate: 2020-06-07T07:11:44.786-07:00
tags:
  - "apache"
  - "Connect"
  - "plug-in"
  - "SocketTimeout"
originalUrl: "https://cloudnetes.blogspot.com/2018/06/noresources-errors-in-apache-due-to-wls.html"
---

At times you will see, apache throws no resources error when you have weblogic in backend.

![](/blog/blog-images/98671972d13f.jpg)

    

a snippet of error as below:   

`weblogic: **Exception type [NO_RESOURCES] (apr_socket_connect call failed with error=70007, host=xx.xx.xx.xx, port=xxxx) raised at line xxxx of URL.cpp`

ex:
`[DATE TIME] [error] [client X.X.X.X] ap_proxy: trying POST /xxx/xxxx/xx at backend host 'X.X.X.X/xxxx; got exception 'NO_RESOURCES: [os error=115, line 1602 of URL.cpp]: apr_socket_connect call failed with error=70007, host=X.X.X.X, port=xxxx ', referer: http://xxxx.x.xxx/xx.html#`

This usually occurs when WLS server is too busy to respond to the connect request from the WebLogic Proxy Plug-In.
This can be resolved by setting **WLSocketTimeoutSecs** to a higher value where the default value is 2. This allows the WebLogic Proxy Plug-In to wait longer for the connect request to be responded by the WLS server.

try adding below configuration in http.conf under the location tab of Virtual host:

`DEBUG OFF`
**`ConnectTimeoutSecs 50 (default is 10)`**
**`ConnectRetrySecs 5 (default is 2)`**
**`WLSocketTimeoutSecs 10 (default is 2)`**
**`WLIOTimeoutSecs 1800 (default is 300)`**
**`Idempotent OFF (default is ON)`**

In weblogic nodes

**domain** \--> **environment** \--> **servers** \--> **click on the required server** --> **tuning**\--> **Accept Backlog**:  --> default value is **300**. Made it **375**.
 
restart weblogic nodes and apache , this should fix your no resource issue.

Br

Punit
