---
title: "How to setup Oracle Tuxedo Server"
description: "You need to have a working database to setup a tuxedo server."
pubDate: 2014-11-25T22:16:00.012-08:00
updatedDate: 2021-04-21T23:00:12.822-07:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/how-to-setup-oracle-tuxedo-server.html"
---

![](/blog/blog-images/tux-fa7c7dcb82f9.jpg)

You need to have a working database to setup a tuxedo server.

once you have the DB up and running give database details while installing monitoring agent:

like (jdbc:oracle:thin:@192.168.1.X:1521/<DBNAME>)

After successful Installation do the following:

1\. go to 

`/home/punit/Oracle/Tux/tuxedo12.1.3.0.0/lib   --> pwd`

   export the following variables

`export LD_LIBRARY_PATH=/home/punit/Oracle/Tux/tuxedo12.1.3.0.0/lib`
`export TUXDIR=/home/punit/Oracle/Tux/tuxedo12.1.3.0.0`
`export NLSPATH=$TUXDIR/locale/C`

2\. go to Tuxedo udataobj/ and check following files:

`udataobj/tuxwsvr.ini`
`webgui/webgui.ini`

3\. go to Tuxedo bin and execute the below commands to start the tuxedo admin console

`[punit@onix bin]$ ./tuxwsvr -l //192.168.1.150:1234 -i $TUXDIR/udataobj/tuxwsvr.ini`
`[punit@onix bin]$ ./wlisten -i $TUXDIR/udataobj/webgui/webgui.ini`

To start the Oracle Administration Console

`hit the URL: http://192.168.1.150:1234/webguitop.html`

NOTE: Select a different Oracle Home having all dependencies. Check [http://www.oracle.com/pls/topic/lookup?ctx=fmw121200&id=installhome](http://www.oracle.com/pls/topic/lookup?ctx=fmw121200&id=installhome) for details about compatible products and install types.

Br,
Punit
