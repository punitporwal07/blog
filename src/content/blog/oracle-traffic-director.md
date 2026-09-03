---
title: "ORACLE TRAFFIC DIRECTOR"
description: "creating an OTD server"
pubDate: 2014-11-25T22:18:00.000-08:00
updatedDate: 2014-11-25T22:18:08.824-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/oracle-traffic-director.html"
---

creating an OTD server

1\. goto /home/punit/Oracle/OTD/11.1.1.7.0/trafficdirector\_Home\_1/bin
2\. run `./tadm configure-server --user=admin --host=onix --port=9999 --instance-home=/home/punit/Oracle/traffic/`  (may change the parameter as per requirement)
3\. give admin password
4\. It will show message;

OTD-70214 The administration server has been configured successfully.
The server can be started by executing: /home/punit/Oracle/traffic/admin-server/bin/startserv
The Administration Console can be accessed at https://onix:9999 using user name 'admin'.

/home/punit/Oracle/OTD/Instance1/config/otdAdm/admin-server/bin

Br,
Punit
