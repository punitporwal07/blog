---
title: "How to Install | Compile |  Configure Apache-http Server"
description: "Download the binnary from http://httpd.apache.org/download.cgi"
pubDate: 2015-05-31T23:14:00.023-07:00
updatedDate: 2021-05-29T06:56:31.142-07:00
tags:
  - "apache"
originalUrl: "https://cloudnetes.blogspot.com/2015/05/how-to-install-compile-configure-apache.html"
---

![](/blog/blog-images/fe7f817f5a94.jpg)

Download the binnary from [http://httpd.apache.org/download.cgi](http://httpd.apache.org/download.cgi)

at the time of writing this post 2.2.29 is most stable version of apache thus used in the example.

If you are using Linux dist. you should download one which is in format of tar.gz like : httpd-2.2.29.tar.gz

```
 # extract it
 $ tar -xzf httpd-2.2.29.tar.gz

 $ rpm -qa | grep gcc
      usually it will show this two packages
        libgcc-4.4.7-4.1.el6_5.i686
        libgcc-4.4.7-4.1.el6_5.x86_64

 # install gcc, a mandate package to run apache on Linux dis.
 $ sudo yum install gcc
    gcc-4.4.7-4.1.el6_5.x86_64

 # switch to installer directory and run following commands
 $ ./configure -prefix=/setups/apache/http-2.2.29 // defining
        the installaition Location
 $ make  // this command will compile the Apache
 $ make install // this command will configure the Apache
 $ cd /bin
 $ ./apachectl -k start
```

access the url
http://localhost:80/

if everything goes well it will display

**It works!**
