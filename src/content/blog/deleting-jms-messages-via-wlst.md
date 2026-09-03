---
title: "play with WLST"
description: "Deleting JMS messages using WLST"
pubDate: 2018-12-04T22:58:00.015-08:00
updatedDate: 2022-02-17T10:41:04.619-08:00
tags:
  - "JMS"
  - "weblogic"
  - "WLST"
originalUrl: "https://cloudnetes.blogspot.com/2018/12/deleting-jms-messages-via-wlst.html"
---

![](/blog/blog-images/jython-wlst-8cdcd823f350.jpg)

**Deleting JMS messages using WLST**

At time you will see that your environment ends up with n numbers of messages getting piled up, and it is not always a good option to remove the Filestore, instead another option is to purge/delete the messages from queues.

do the following to achieve this

```
# set WLS environment
$ ORACLE_HOME/wlserver/server/bin/./setWLSenv.sh
# launch WLST
$ ORACLE_HOME/oracle_common/common/bin/./wlst.sh

$ java weblogic.WLST

wls:/offline>connect('weblogic','weblogic1','t3://192.0.0.123:7001')
wls:/domain/serverConfig>serverRuntime()
wls:/domain/serverRuntime>cd('JMSRuntime')
wls:/domain/serverRuntime/JMSRuntime>:ls()
wls:/domain/serverRuntime/JMSRuntime>:cd('server.jms')
wls:/domain/serverRuntime/JMSRuntime/server.jms> cd ('JMSServers')
wls:/domain/serverRuntime/JMSRuntime/server.jms/JMSServers>cd (JMSServer-1')

**
wls:/WLST_domain/serverRuntime>cd('JMSRuntime/managed1_wls.jms/JMSServers/JMSServer-1/Destinations/SystemModule-0!com/fixstream/benifits/dr/out/dq')
wls:/WLST_domain/serverRuntime/JMSRuntime/managed1_wls.jms/JMSServers/JMSServer-0/Destinations/SystemModule-0!Queue-0> ls()
wls:/WLST_domain/serverRuntime/JMSRuntime/managed1_wls.jms/JMSServers/JMSServer4/Destinations/SystemModule-0!Queue-0> cmo.deleteMessages('')
**
```

do the necessary changes and that's it.

**App Un-deployment using WLST**

```
# set WLS environment
$ ORACLE_HOME/wlserver/server/bin/./setWLSenv.sh
# launch WLST
$ ORACLE_HOME/oracle_common/common/bin/./wlst.sh

$ java weblogic.WLST

wls:/offline>connect('weblogic','weblogic1','t3://192.0.0.123:7001')
wls:/domain/serverConfig>listApplications()
wls:/domain/serverConfig>edit()
wls:/domain/serverConfig/startEdit()
wls:/domain/serverConfig/stopApplication('myapp')
wls:/domain/serverConfig/undeploy('myapp')
wls:/domain/serverConfig/save()
wls:/domain/serverConfig/activate()wls:/domain/serverConfig/exit()
# use below command to Deploy applicationdeploy('myapp','/app/deliv/myapp.war',targets='managed1_mydom01')
```

\--
