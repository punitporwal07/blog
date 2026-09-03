---
title: "How to set default File Permissions at user level in Linux (Redhat)"
description: "Problem: In tomcat, file Permissions are getting change after every restart"
pubDate: 2015-11-30T23:34:00.002-08:00
updatedDate: 2022-06-17T09:26:54.032-07:00
tags:
  - "tomcat"
originalUrl: "https://cloudnetes.blogspot.com/2015/11/how-to-set-default-file-permissions-at.html"
---

**Problem**: In tomcat, file Permissions are getting change after every restart

**Reason**: The default **umask for the root user is 022** result into default directory permissions as **755** and default file permissions as **644**

When you see 022 as umask value in _/etc/profile_ or _/etc/basrc_ file that indicates that users who are going to create files will get 644 and for folders its 755 respectively.

Hence with the above statements we can conclude that whenever a tomcat instance is getting restarted it going to create some new files(temp or work in my case) with default directory & files permission as 755 & 644 respectively because of the default nature of umask

**Example**: If you check in the temp directory of any tomcat instance it creates anonymous files after every restart with default permissions:

\-rw-r--r-- 1 tomcat tcs 73241 Nov 23 20:01 ./temp/axis2-tmp-6893169617548157164.tmp/axis28326352280296420823spring-oxm-3.2.2.RELEASE.jar

\-rw-r--r-- 1 tomcat tcs 626187 Nov 23 20:01 ./temp/axis2-tmp-6893169617548157164.tmp/axis2512876555951092992spring-web-3.2.2.RELEASE.jar
\-rw-r--r-- 1 tomcat tcs 636334 Nov 23 20:01 ./temp/axis2-tmp-6893169617548157164.tmp/axis2824851651982984914spring-webmvc-3.2.2.RELEASE.jar
\-rw-r--r-- 1 tomcat tcs 501920 Nov 23 20:01 ./temp/axis2-tmp-6893169617548157164.tmp/axis2103120736532356950spring-ws-core-2.1.3.RELEASE.jar
drwxr-xr-x 2 tomcat tcs 96 Nov 20 23:59 ./work/Catalina/localhost/camel
drwxr-xr-x 4 tomcat tcs 96 Nov 21 00:00 ./work/Catalina/localhost/web
drwxr-xr-x 2 tomcat tcs 96 Nov 20 23:59 ./work/Catalina/localhost/web/\_axis2

**Solution**: So it’s clear that these files are getting created with default permission due to the default behavior of umask, which can be rectified if we modify the profile files of that particular user

Files, that needs to be modified are:

**.bash\_profile**

**.bashrc**

Steps to modify files:

\# cd (it will take you to user home directory)

or

\# cd /opt/home/tomcat (user home directory)

\# ls –la (list all hidden files)
\# vi .bashrc  (define umask value as required, in our case we need to define it as **027** in both files)
\# vi .bash\_profile (define umask value as required, in our case we need to define it as **027** in both files)
 
thats it we are good to go now,
&
the changes will get effect as soon the user logged-in

Br,
Punit
