---
title: "JAVA_OPTIONS"
description: "different java options available to tweak your application or server to enable/disable any features which"
pubDate: 2016-02-01T21:37:00.038-08:00
updatedDate: 2023-09-10T06:51:49.729-07:00
tags:
  - "java"
originalUrl: "https://cloudnetes.blogspot.com/2016/02/djavaoptions.html"
---

different java options available to tweak your application or server to enable/disable any features which

![](/blog/blog-images/java-c53193411cd9.jpg)

one is not aware of, here I tried to collect and list for everyone

```
 # to set time zone at jvm level, define in env file
 $ -Duser.timezone=EST

 # to start WLS managed server with local ldap
 $ -Dweblogic.security.MSILocalLDAPOnly=true

 # to enable GC logs in WLS
 $ -Xverboselog:C:/Oracle/../base_domain/gclogs/gc.log

 # to enable heap dump at OOM condition
 $ -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=C:/Oracle/../base_domain/heapdumps"

 # SSL/TLSv1 related JAVA_OPTIONS

 # to enable JSSE
 -Dweblogic.ssl.JSSEEnabled=true"

 # to enable SSL debug
 $ -Dssl.debug=true -Dweblogic.StdoutDebugEnabled=true

 # to disable SSL in weblogic and enable TLS
 $ -Dweblogic.security.SSL.protocolVersion=TLS1

 # to allow all TLS protocols for the most common SSLSocket or SSLSocketFactory classes
 $ -Djdk.tls.client.protocols=TLSv1,TLSv1.1,TLSv1.2

 # Applications using the HttpsClient,
   HttpsURLConnection classes can use the https.protocols system property
 $ -Dhttps.protocols=TLSv1,TLSv1.1,TLSv1.2

 # to allow client/server to support a minimum protocol
 $ -Dweblogic.security.SSL.minimumProtocolVersion=TLSv1.1
```
