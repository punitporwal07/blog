---
title: "WLS domain extension to include JRF template"
description: "Extend a domain (/wls\\domains/base\\domain ) by including JRF restricted template & it works fine"
pubDate: 2017-11-12T21:45:00.008-08:00
updatedDate: 2022-02-20T10:25:32.485-08:00
tags:
  - "JRF"
  - "weblogic"
originalUrl: "https://cloudnetes.blogspot.com/2017/11/wls-domain-extension-to-include-jrf.html"
---

![](/blog/blog-images/jrf-992031db769a.png)

Extend a domain (/wls\_domains/**base\_domain** ) by including JRF restricted template & it works fine
without the use of any database. (in order to have JRF features in plain WLS domain)

Template to use:(/MW\_HOME/oracle\_common/common/template/wls/Oracle\_jrf\_restricted.jar)

Alternatively, you can use the following JAVA\_argument to include in config.sh which allows you to create a compact domain and will use Embedded Database (JAVADB)

```
CONFIG_JVM_ARGS  to -Dcom.oracle.cie.config.showProfile=true
```

But when OIM 11.1.1.9 is being configured on top of it, it is overwriting the configuration files from MW\_HOME and not allowing the domain to come up

(compatibility challenge here)

\*\*

Exception in thread "main" java.lang.NoSuchMethodError: weblogic.i18n.logging.CatalogMessage.(Ljava/lang/String;I\[Ljava/lang/Object;Lweblogic/i18n/Localizer;)V

        at weblogic.security.SecurityLogger.logDisallowingCryptoJDefaultJCEVerification(SecurityLogger.java:15099)

        at weblogic.security.utils.SecurityUtils.turnOffCryptoJDefaultJCEVerification(SecurityUtils.java:98)

\*\*

Also when we try to set up OVD using 11g installer it is expecting to have wlserver10.3, but we have /12.2.1.2/wlserver, so not allowed to proceed further.

The only possible way is to have 2 WLS domains running on 11g & 12c to serve their functionality respectively.

What Oracle has to say on this - 

There is no exception from the certification matrix. OVD is not (and I do not have information that will be in the future) certified with Weblogic 12c.
However, please note that you can have Weblogic 12c and Weblogic 11g (10.3.6) on the same server running on different ports.
So you may create a OVD domain in Weblogic 11g (10.3.6) and keep weblogic 12c for your current purposes.
