---
title: "Changing OPSS Password"
description: "3 step process to update OPSS password for any FUSION MIDDLEWARE PRODUCT"
pubDate: 2017-12-07T02:18:00.004-08:00
updatedDate: 2021-04-10T05:02:57.589-07:00
tags:
  - "OPSS"
  - "Password change"
originalUrl: "https://cloudnetes.blogspot.com/2017/12/opss-password-change.html"
---

![](/blog/blog-images/soa-a5e8b5afe64d.jpg)

3 step process to update OPSS password for any FUSION MIDDLEWARE PRODUCT

**STEP 1**

 Change the **PREFIX\_OPSS** user password in Oracle database first, using the following (recommend to change for all the relevant schemas to stay in sync)

ALTER USER  **PREFIX\_OPSS**  IDENTIFIED BY new\_password;

**STEP 2**

take backup of **opss-jdbc.xml** & **jps-config-jse.xml** file.

domain/config/jdbc/opss-jdbc.xml 

domain/config/fmwconfig/jps-config-jse.xml

shutdown the entire domain

update the **PREFIX\_OPSS** password using wlst

`$ cd /product/version/oracle_common/common/bin/`

`$ ./wlst.sh`

`$wlst_offline:modifyBootStrapCredential(jpsConfigFile='/wls_domains/domain/config/fmwconfig/jps-config-jse.xml',username='PREFIX_OPSS', password='Pa33word')`

**it will through a warning like**

**\*\**

**Nov 13, 2017 12:12:06 PM oracle.security.opss.internal.runtime.ServiceContextManagerImpl getContext**

**WARNING: Bootstrap services are used by OPSS internally and clients should never need to directly read/write bootstrap credentials. If required, use Wlst or configuration management interfaces.**

**\*\**

ignore this warning and re-run the same command & it will work

now start the admin server

**NOTE: if the domain includes manged servers spread across multiple host, STEP2 will be followed in each host.**

**STEP 3**

update the **PREFIX\_OPSS** password from console

**services > data sources > opss\_data\_source > connectionPool > password**

confirm user once from shown properties and update the same password

save changes

activate changes

restart any service if it ask for

test the connection it should say:

 ![Message icon - Success](https://10.52.213.113:61000/console/images/checkmark_status.gif)Test of opss-data-source on server xxxxx\_xxxxx was successful.

then start remaining servers provided you have updated password for all user first from database and then from console

Br,

Punit
