---
title: "Capture threshold"
description: "There are ways to capture the threshold in different versions of Limux, one way is to setup some shell"
pubDate: 2015-01-27T01:49:00.011-08:00
updatedDate: 2021-04-19T06:24:51.821-07:00
originalUrl: "https://cloudnetes.blogspot.com/2015/01/diskissue.html"
---

![](/blog/blog-images/bash-a9e9b5464951.png)

There are ways to capture the threshold in different versions of Limux, one way is to setup some shell
script and set it as a cronentry in your server, which will eventually captures the high disk when it reaches threshold. 

Below are two sample scripts which you can refer and set them as a cron job in your respected server and it will trigger an alert to your mail box whenver it reaches the defined threshold value (provided you have SMT protocol enabled in your server)

**@SUSE**

```
DATE=`date '+%d-%h-%y %H:%M'`
MAILID="pporwal@mail.com"
ServerName=`uname -n`
>/tmp/logs2
>/tmp/logs1
DISK_THRESHOLD=85;
check_disk ()
{
df -k >> /tmp/logs1
sed -i.ORIG 's/%//' /tmp/logs1
awk '{if ($6 >= '$DISK_THRESHOLD')  print $0 }'  /tmp/logs1 >> /tmp/logs2
echo "                   " >>/tmp/logs2
echo "Regards" >>/tmp/logs2
echo "Punit" >>/tmp/logs2
mailx -s "Filesystem Utilization on $ServerName at $DATE is above THRESHOLD"  $MAILID  </tmp/logs2
}
check_disk;
> /dev/null 2>&1
```

**@SOLARIS**

```
DATE=`date '+%d­%h­%y %H:%M'`
MAILID="pporwal@mail.com"
ServerName=`uname ­n`
>/tmp/logs2
>/tmp/logs1
DISK_THRESHOLD=85;
check_disk ()
{
df ­hTP >> /tmp/logs1
sed '$ s/%//g' /tmp/logs1 > /tmp/logs1.tmp && mv /tmp/logs1.tmp /tmp/logs1
awk '{if ($5 >= '$DISK_THRESHOLD') print $0 }' /tmp/logs1 >> /tmp/logs2
echo " " >>/tmp/logs2
echo "Regards" >>/tmp/logs2
echo "Punit" >>/tmp/logs2
mailx ­s "Filesystem Utilization on $ServerName at $DATE is above THRESHOLD" $MAILID </tmp/logs2
}
check_disk;
```

k/r

P
