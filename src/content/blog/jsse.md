---
title: "Fixing rpmdb issue: Thread died in Berkeley DB library"
description: "While running rpm for any package formation/installation if you encounter an rpmdb error (during yum/rpm operations), like given in red, it means that the rpm db got corrupted & broken"
pubDate: 2015-11-30T01:58:00.031-08:00
updatedDate: 2021-07-22T06:23:10.270-07:00
tags:
  - "rpm"
  - "rpmdb"
originalUrl: "https://cloudnetes.blogspot.com/2015/11/jsse.html"
---

![](/blog/blog-images/rpm-5afe3d61df31.png)

While running rpm for any package formation/installation if you encounter an rpmdb error (during yum/rpm operations), like given in red, it means that the rpm db got corrupted & broken

```
rpmdb: Thread/process 10135/140022683015072 failed: Thread died in Berkeley DB library
error: db3 error(-30974) from dbenv->failchk: DB_RUNRECOVERY: Fatal error, run database recovery
error: cannot open Packages index using db3 -  (-30974)
error: cannot open Packages database in /var/lib/rpm
rpmdb: Thread/process 10135/140022683015072 failed: Thread died in Berkeley DB library
error: db3 error(-30974) from dbenv->failchk: DB_RUNRECOVERY: Fatal error, run database recovery
error: cannot open Packages database in /var/lib/rp

# try the following steps to backup and rebuild rpmdb
$ cd /var/lib/rpm/
$ mkdir faileddb
$ cp -a __db* faileddb
$ rm -rf __db.[0-9][0-9]*
$ rpm --quiet -qa
$ rpm --rebuilddb
$ yum clean all
 # RPM CheatSheet

 Install - rpm -i rpmPackage
 Install verbose with a progress bar - rpm -ivh rpmPackage
 Debug the installation - rpm -ivvh rpmPackage
 Uninstall - rpm -e rpmPackage
 Uninstall verbose - rpm -ev rpmPackage
 Uninstall debug - rpm -evv rpmPackage
 Upgrade - rpm -Uvh rpmPackage
 List installed packages - rpm -qa
 List files in an rpm - rpm -qpl rpmPackage
 List files for an installed package - rpm -ql rpmPackage
 Getting help - rpm --help
 Verbose mode - -v
 Debug mode - -vv
 Progress bar with hash marks - -h
```

\--
