---
title: "JENKINS: a continuous integration tool"
description: "\\- Install Jenkins"
pubDate: 2018-02-11T05:19:00.062-08:00
updatedDate: 2023-11-07T06:43:17.184-08:00
tags:
  - "jenkins"
originalUrl: "https://cloudnetes.blogspot.com/2018/02/jenkins.html"
---

![](/blog/blog-images/jkns-9a72b229c0ae.png)**Getting started with Jenkins is 3 step process:**
\- Install Jenkins
\- Download the required plugins
\- Configure the plugins & create a project

```
# Installing Jenkins in Ubuntu
$ wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key  | sudo apt-key add -
$ sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ \  > /etc/apt/sources.list.d/jenkins.list'
$ sudo apt-get update
$ sudo apt-get install jenkins
  //this will automatically start Jenkins
# Installing Jenkins in AWS-EC2$ sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo$ sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io.key
$ sudo yum install -y jenkins
$ sudo yum install java -y
$ sudo service jenkins start
$ chkconfig jenkins on

# If your /etc/init.d/jenkins file fails to start jenkins then,
edit the /etc/default/jenkins to replace the HTTP_PORT=8080 to HTTP_PORT=8081
or
$ cd /var/share/jenkins/
$ java -jar jenkins.war // this will setup a new jenkins from begining
# I prefer to use below, this will start old jenkins without any delay
$ service jenkins restart

# Running docker container of Jenkins
$ docker pull punitporwal07/jenkins
$ docker run -d -p 8081:8080 -v jenkins-data:/software/jenkins punitporwal07/jenkins:tag
  to understand this command in brief check here: Docker
# Depending on configs to system, jenkins file structure may vary -  /etc/sysconfig/jenkins
  /var/lib/jenkins/
  /etc/default/jenkins
```

**Useful Plugins**

you can push from manage plugins tab/ push from back-end into plugins dir

\- [Build pipeline](https://wiki.jenkins.io/display/JENKINS/Build+Pipeline+Plugin): to chain multiple jobs
\- [Delivery pipeline](https://wiki.jenkins.io/display/JENKINS/Delivery+Pipeline+Plugin): this will visualize deliver pipelines (upstream/downstream)
\- [Weblogic deployer](https://wiki.jenkins.io/display/JENKINS/WebLogic+Deployer+Plugin): this is used to deploy a jar/war/ear to any weblogic target
\- [Deploy to container](https://plugins.jenkins.io/deploy): to deploy war/ear to a tomcat/glassfish container
\- [Roles strategy](https://wiki.jenkins.io/display/JENKINS/Role+Strategy+Plugin): this plugin allows you to assign roles to the different user of jenkins

**Automate deployment on Tomcat** **using Jenkins pipeline**

([benefits.war](http://www.oracle.com/webfolder/technetwork/tutorials/obe/fmw/wls/10g/r3/appdeploy/deploy/deploy_apps/files/version1/benefits.zip) as an example on [tomcat 8.x](http://www-eu.apache.org/dist/tomcat/tomcat-8/v8.5.28/bin/apache-tomcat-8.5.28.tar.gz) for Linux)

\- install [Deploy to container](https://plugins.jenkins.io/deploy) plugin, restart Jenkins to reflect changes
\- create a new project/workspace & select post-build action as- Deploy war/ear to a container
\- add properties as below:-
   - war/ear files: \*\*/\*.war
   - context path: benefits.war (provided you need to push this war file into your workspace)
   - select container from the drop-down list: tomcat 8.x
   - Add credentials: tomcat/tomcat (provided you have added this user in conf/tomcat-user.xml with all the required roles)
   - Tomcat URL: http://localhost:8080/
\- apply/save your project and build it to validate the result.

**Automate deployment on Weblogic using Jenkins pipeline**

([benefits.war](http://www.oracle.com/webfolder/technetwork/tutorials/obe/fmw/wls/10g/r3/appdeploy/deploy/deploy_apps/files/version1/benefits.zip) as an example on Weblogic 10.3.6)

\- install [Weblogic deployer](https://wiki.jenkins.io/display/JENKINS/WebLogic+Deployer+Plugin) plugin, restart jenkins to reflect changes
\- configure the plugin,
\- create new project/workspace
\- Add post-build action as- Deploy the artefact to any weblogic environment (if no configuration has been set, the plugin will display an error message, else it will open up a new window)
\- add properties as below:-
   - Task Name: give any task name
   - Environment: from the drop-down list select your AdminServer ( provided you have created [configuration.xml](https://github.com/punitporwal07/jenkins/blob/master/configuration.xml) and added it to Weblogic deployer Plugin)
   - Name: The name used by the WebLogic server to display the deployed component
   - Base directory of deployment: give the path to your deployment.war or push it to your workspace and leave it blank
   - Built resource to deploy: give your deployment.war name
   - Targets: give target name
\- Apply/save your project and build it to validate the result.

**Possible failure of your Jenkins jobs**
Problem - Jenkins: java.lang.OutOfMemoryError: Java heap space

Solution - Navigate to your **Jenkins project**, click **configure**.

Scroll down to the **Build** section of the page to the **Build Step** with your plugin title:

Click **Advanced…**

In the **System/Java Options** field, add the following parameter

**JAVA\_ARGS="-Xmx2048m -XX:MaxPermSize=512m"**

This will assign 2Gi of memory to you build.

\--
