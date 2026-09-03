---
title: "Installing WebLogic 12.1.3 without GUI"
description: "There are multiple ways to install and configure WebLogic, one of them is doing in Silent mode"
pubDate: 2015-09-03T23:16:00.020-07:00
updatedDate: 2021-05-01T04:07:42.539-07:00
tags:
  - "weblogic"
originalUrl: "https://cloudnetes.blogspot.com/2015/09/installing-weblogic-1213.html"
---

![](/blog/blog-images/oracle-weblogic-1641e68c0f61.png)

There are multiple ways to install and configure WebLogic, one of them is doing in Silent mode
Here I tried to document the steps with v12.1.3, but can be followed with any release of 12c by simply changing the product version.

    **STEP 1 - Download the generic jar and java**

-        fmw\_12.1.3.0.0\_wls.jar
-        jdk-7u45-linux-x64.tar.gz

    **STEP 2 - Create the response file as below**
    wls.rsp

```
[ENGINE]
#DO NOT CHANGE THIS.
Response File Version=1.0.0.0.0

[GENERIC]
#The oracle home location. This can be an existing Oracle Home or a new Oracle Home
ORACLE_HOME=/apps/weblogic/12.1.3

#Set this variable value to the Installation Type selected. e.g. WebLogic Server, Coherence, Complete with Examples.
INSTALL_TYPE=WebLogic Server

#Provide the My Oracle Support Username. If you wish to ignore Oracle Configuration Manager configuration provide empty string for user name.
MYORACLESUPPORT_USERNAME=

#Provide the My Oracle Support Password
MYORACLESUPPORT_PASSWORD=

#Set this to true if you wish to decline the security updates.
#Setting this to true and providing empty string for My Oracle Support username will ignore the Oracle Configuration Manager configuration
DECLINE_SECURITY_UPDATES=true

#Set this to true if My Oracle Support Password is specified
SECURITY_UPDATES_VIA_MYORACLESUPPORT=false

#Provide the Proxy Host
PROXY_HOST=

#Provide the Proxy Port
PROXY_PORT=

#Provide the Proxy Username
PROXY_USER=

#Provide the Proxy Password
PROXY_PWD=

#Type String (URL format) Indicates the OCM Repeater URL which should be of the format [scheme[Http/Https]]://[repeater host]:[repeater port]
COLLECTOR_SUPPORTHUB_URL=
```

**STEP 3 - Create ora Installation as below**

oraInst.loc

```
inventory_loc=/apps/weblogic/inst_group=inetsupp
```

**STEP 4 -  Execute the below command accordingly**

```
$ $JAVA_HOME/bin/java -jar fmw_12.1.3.0.0_wls.jar -silent -responseFile /apps/weblogic/wls.rsp -invPtrLoc /apps/weblogic/oraInst.loc -debugLauncher log file is /tmp/OraInstall2015-09-03_11-06-10PM/launcher2015-09-03_11-06-10PM.log.
Extracting files.............
Starting Oracle Universal Installer
.
.
Preparing to launch the Oracle Universal Installer from /tmp/OraInstall2015-09-03_11-06-10PM
Command line arguments:
Arg:0:/apps/java/jdk1.7.0_45/bin/java
.
.
Verifying data......
Copying Files...
You can find the log of this install session at:
/tmp/OraInstall2015-09-03_11-06-10PM/install2015-09-03_11-06-10PM.log
-----------20%----------40%----------60%----------80%--------100%
The installation of Oracle Fusion Middleware 12c WebLogic Server and Coherence 12.1.3.0.0 completed successfully.
Logs successfully copied to /apps/weblogic/logs.
you will get your weblogic installation in /apps/weblogic/12.1.3/..
```

**STEP 5 - Creating a domain using wlst script**

```
$ cd /apps/weblogic/12.1.3/oracle_common/common/bin/$ ./wlst.sh
wls:/offline>help()
wls:/offline>help('createDomain')
wls:/offline> createDomain('/apps/weblogic/12.1.3/wlserver/common/templates/wls/wls.jar','/apps/weblogic/domain/base_domain','punit','punit123')Br,
```

Punit
