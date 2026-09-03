---
title: "weblogic cheatsheet"
pubDate: 2014-01-03T09:25:00.000-08:00
updatedDate: 2024-01-03T09:48:09.813-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/01/weblogic-cheatsheet.html"
---

![](/blog/blog-images/avvxsehsefi2xuvpt2ig2byc1u28bpmpj32ao9qs-5dec9c771b1e.png)**TAKE BACKUP OF WEBLOGIC DOMAIN IN ONE COMMAND

**

```
$ find /apps -name "config.xml" | grep "/config/config.xml" | awk '{gsub(/config.xml/,"",$0); \
  fileName=$0; gsub(/\//,"_",fileName);print "mkdir /var/tmp/backup; \
  tar -cvzf /var/tmp/backup/"fileName".tar.gz " $0}' | sh
```

**WEBLOGIC PATCHING THRU BSU**

```
$ ./bsu.sh param1 -patch_download_dir param2 option -prod_dir option

# to install patch
$ ./bsu.sh -patch_download_dir=/apps/wlserver/10.3.6/utils/bsu/cache_dir -patchlist=FSR2 -prod_dir=/apps/wlserver/10.3.6/wlserver_10.3/ -verbose –install

# to remove patch
$ ./bsu.sh -remove -patchlist=T5F1 -prod_dir=/apps/wlserver/10.3.6/wlserver_10.3/ (to remove patch)

# to check status of patch
$ ./bsu.sh -view -patch_download_dir=/apps/wlserver/11g/utils/bsu/cache_dir -status=applied -verbose -prod_dir=/apps/wlserver/11g/wlserver_10.3 
```
