---
title: "Configuring weblogic deployer plugin in Jenkins"
pubDate: 2018-02-16T00:26:00.005-08:00
updatedDate: 2022-02-20T10:45:55.627-08:00
tags:
  - "jenkins"
originalUrl: "https://cloudnetes.blogspot.com/2018/02/configurationxml-for-weblogic-deployer.html"
---

![](/blog/blog-images/avvxseh2a6xgoad4hxmapbboh9kln2tbrzjqulil-8b165a1411ff.png)

**

**Configure the WebLogic deployer plugin to Deploy an war/ear  on a weblogic managed server**

**

\- Install the plugin (from manage Jenkins > manage plugins > available > download & install)**\- restart the Jenkins for changes to take reflect**

\- go to manage Jenkins
\- go to configure systems
\- scroll down to WebLogic deployment plugins
\- give details as below:                                  

        - additional path: /software/bea/jenkins/wlfullclient.jar (path to you wlfullclient.jar file, weblogic.jar is deprecated now and Oracle recommends using wlfullclient.jar from 10.3 onwards, this jar can be created from $WL\_HOME/wl\_server10.3/servers/lib/java -jar wljarbuilder.jar for more check [Oracle Doc](https://docs.oracle.com/cd/E12840_01/wls/docs103/client/jarbuilder.html) on this.

        - configuration file: /software/bea/jenkins/configuration.xml (path to your configuation.xml file)

        - apply/save

\- sample [configuration.xml](https://github.com/punitporwal07/jenkins/blob/master/configuration.xml) file may look like -

![](/blog/blog-images/configuration-xml-f414e7fce6dc.png)

modify the highlighted tags as per your local configuration

and run the Jenkins job, it will deploy the application on WebLogic managed server defined in your config file.
