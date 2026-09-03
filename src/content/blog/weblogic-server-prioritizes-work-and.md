---
title: "How to define WorkManager in Weblogic"
description: "WebLogic Server prioritizes work and allocates threads based on an execution model that takes into account administrator-defined parameters actual run-time performance throughput."
pubDate: 2018-12-06T22:58:00.005-08:00
updatedDate: 2021-08-21T10:25:01.817-07:00
tags:
  - "weblogic"
  - "workmanager"
originalUrl: "https://cloudnetes.blogspot.com/2018/12/weblogic-server-prioritizes-work-and.html"
---

![](/blog/blog-images/oracle-weblogic-50f0517a5228.png)

WebLogic Server prioritizes work and allocates threads based on an execution model that takes into account administrator-defined parameters actual run-time performance throughput.

Administrators can configure a set of scheduling guidelines and associate them with one or more applications, or with particular application components.
**For example**, you can associate one set of scheduling guidelines for one application, and another set of guidelines for other applications. At run time, WebLogic Server uses these guidelines to assign pending work and enqueued requests to execution threads.

To manage work in your applications, you define one or more of the following Work Manager components:

-   Fair Share Request Class

-   Response Time Request Class

-   Min Threads Constraint

-   Max Threads Constraint

-   Capacity Constraint

-   Context Request Class

You can use any of these Work Manager components to control the performance of your application by referencing the name of the component in the application deployment descriptor

In addition, you may define a Work Manager that encapsulates all of the above components (except Context Request Class and reference the name of the Work Manager in your application's deployment descriptor

You can configure Work Managers at the domain level, application level, and module level in one of the following configuration files, or by using the WebLogic Server Administration Console:

-   `config.xml`—Work Managers specified in `config.xml` can be assigned to any application, or application component, in the domain.

-   `weblogic-application.xml`—Work Managers specified at the application level can be assigned to that application, or any component of that application.

-   `weblogic-ejb-jar.xml` or `weblogic.xml`—Work Managers specified at the component level can be assigned to that component.

-   `weblogic.xml`—Work Managers specified for a Web application.

**Work Manager Stanza**

![](/blog/blog-images/stanza-d9ed333cbcc6.png)

**Referencing the Work Manager in a Web Application**

![](/blog/blog-images/ref-22712290d970.png)

Br
