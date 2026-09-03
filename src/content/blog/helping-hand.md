---
title: "Linux Cheatsheet"
description: "|  | Command | Purpose |"
pubDate: 2015-03-10T20:34:00.046-07:00
updatedDate: 2026-09-02T01:30:22.211-07:00
tags:
  - "command"
originalUrl: "https://cloudnetes.blogspot.com/2015/03/helping-hand.html"
---

![](/blog/blog-images/bash-5ab22d5e5b14.png)

| # | Command | Purpose |
| --- | --- | --- |
| 1 | journalctl | Show all logs |
| 2 | journalctl --no-pager | Show all logs without paging (less) |
| 3 | journalctl -b | Show logs from current boot |
| 4 | journalctl -b -1 | Show logs from previous boot |
| 5 | journalctl -f | Follow logs in real time (similar to tail -f) |
| 6 | journalctl -u <service> | Show logs for a specific service |
| 7 | journalctl -u <service> -f | Follow a service's logs in real time |
| 8 | journalctl -p err | Show only error logs |
| 9 | journalctl -p warning..emerg | Show warnings, errors, critical, and emergency logs |
| 10 | journalctl --since "1 hour ago" | Show logs from the last hour |
| 11 | journalctl --since "YYYY-MM-DD HH:MM" --until "YYYY-MM-DD HH:MM" | Show logs within a time range |
| 12 | journalctl -k | Show kernel logs only |
| 13 | journalctl \_PID=1234 | Show logs for a specific process ID |
| 14 | journalctl \_COMM=sshd | Show logs for a specific command/process |
| 15 | journalctl -n 50 | Show last 50 log entries |
| 16 | journalctl --disk-usage | Show journal log disk usage |
| 17 | sudo journalctl --vacuum-time=7d | Delete logs older than 7 days |
| 18 | sudo journalctl --vacuum-size=500M | Reduce journal size to 500 MB |

| Scenario | Command |
| --- | --- |
| Check failed service | journalctl -u myservice -p err --since today |
| Monitor service live | journalctl -u myservice -f |
| Investigate reboot issues | journalctl -b -1 |
| Check kernel warnings | journalctl -k -p warning |
| View logs for last 30 minutes | journalctl --since "30 min ago" |
| Check SSH issues | journalctl -u sshd |
| Check Docker service logs | journalctl -u docker -f |
| View logs between timestamps | journalctl --since "2026-09-02 10:00" --until "2026-09-02 11:00" |
| View logs without pager | journalctl --no-pager |
| Find log storage usage | journalctl --disk-usage |

```
# Find or remove files older than 30 days
$ find . -mtime +30 | xargs rm
$ find . -type f -mtime +30 -delete
$ find /logs/ -mtime +30 -exec rm {} \;

# Finding the files of specific size
$ find . -xdev -size +100000000c -exec ls -lrt {} \; // 100MB
$ find . -xdev -size +10000000c -exec ls -lrt {} \;   //10 MB
$ find . -xdev -size +1000000c -exec ls -lrt {} \; 
$ find . -size +100000000c
$ du -sk * | sort -n

# Removing specific files
$ rm `ls -rtl |grep Aug |awk '{print $9}'`
$ rm `ls -rtl |grep 2009 |awk '{print $9}'`

# Check file permissions
$ find . \! -perm 750 -exec ls -ldb {} \;

# Check file ownership
$ cat /etc/passwd grep 533

# Find string into a FS
$ grep -rnw . -e "searchString"

# Replace string in vi-editor
$ %s/string1/string2/g

# Replace a string in nested FS
$ find . -type f xargs perl -pi -e 's;abc;xyz;g'
$ find . -name '*.xml' -o -name '*.conf' -o -name '*.properties' -o -name '*.sh' | xargs perl -pi -e 's?abc?xyz?g'

# Clear cache of server
$ sync;sync echo3 >/proc/sys/vm/drop_cache

# Check last login details
$ last | grep Mon | awk '{print $1}' | sort -u

# Temporarily increasing the mount size
$ mount -o remount,size=2G /tmp/

# Add user in Linux
$ useradd -u 920 -g usrgrp -d /home/punit -m -s /bin/ksh punit ;echo "password" | /usr/bin/passwd --stdin punit

# Add password-less user in Linux
$ useradd punit -g usrgrp -s /usr/sbin/nologin -f -1 -c "App user for APP-TESTING" -K PASS_MAX_DAYS=-1

# Add user as sudo user
$ vi /etc/sudoers 
$ username ALL=(ALL) NOPASSWD:ALL

# Fetch IP to put in a shell script
$ `ip addr list|grep "inet " |cut -d' ' -f6|cut -d/ -f1|grep -v "127.0.0.1"`
$ `/sbin/ifconfig -a | grep "inet addr" | awk '{print $2}' | grep -v "127.0.0.1"
 
```

**PRODUCT-SPECIFIC COMMANDS**

CHECK PRODUCTS INSTALLED ON A UNIX SERVER

```
UNIX/LINUX/AIX/HP-UX
$ df -P 2>/dev/null | grep "^/" | grep -v "/proc" | awk '{if ($1!~/:/){print "find " $NF " -xdev -name versionInfo.sh -o -name weblogic.jar -o -name catalina.jar -o -name webservd -o -name httpd -o -name jboss-management.jar -o -name domian.xml -o -name standalone.xml -o -name Agent.jar -o -name LLAWP -o -name server.cnf"}}' | sh | grep -v "^/var/tmp" | grep -v "^/tmp"

SOLARIS
$ df -l | grep "^/" | grep -v "/proc" | nawk -F "(" '{print "find " $1 " -xdev -name versionInfo.sh -o -name weblogic.jar -o -name catalina.jar -o -name webservd -o -name httpd -o -name jboss-management.jar -o -name domian.xml -o -name standalone.xml -o -name Agent.jar -o -name LLAWP -o -name server.cnf"}' | sh | grep -v
"^/var/tmp" | grep -v "^/tmp"
```
