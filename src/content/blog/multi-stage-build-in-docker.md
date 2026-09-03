---
title: "Multi-stage build in Docker"
description: "Artifacts from intermediate stages can be copied using COPY --from='stageName' starting from 0 for the first base image. The artifacts not copied over are discarded. This keeps the final image light a"
pubDate: 2019-05-03T02:21:00.021-07:00
updatedDate: 2023-01-14T02:33:58.956-08:00
tags:
  - "Docker"
originalUrl: "https://cloudnetes.blogspot.com/2019/05/multi-stage-build-in-docker.html"
---

![](/blog/blog-images/multi-stage-586f16cf5624.jpg)Multi-stage build allows multiple **FROM** statements in a Dockerfile. The instructions follow each FROM statement until the next one & create an intermediate image. The final FROM statement is the absolute base image.

Artifacts from intermediate stages can be copied using **`COPY`** `--from='stageName'` starting from 0 for the first base image. The artifacts not copied over are discarded. This keeps the final image light and only includes the relevant artifacts.

FROM syntax is updated to specify stage name using 'as' 

This allows using the stage name instead of the number with --from option

let's take a look at a sample Dockerfile:

 ```
 # STAGE1
 FROM maven:3.5-jdk-8 as build COPY src /usr/src/myapp/src COPY pom.xml /usr/src/myapp
 RUN mvn -f /usr/src/myapp/pom.xml clean package

 # STAGE2 FROM jboss/wildfly:10.1.0 Final
 COPY --from=build /usr/src/myapp/target/people-1.0-SNAPSHOT.war \
     /opt/jboss/wildfly/standalone/deployments/people.war
```

In this Dockerfile:

There are two FROM instructions. This means it is a two-stage build.

maven:3.5-jdk-8 is the base image for the first build. This is used to build the WAR file for the application. The first stage is named as build.

jboss/wildfly:10.1.0.Final is the second and the final base image for the build. WAR file generated in the first stage is copied over to this stage using **COPY** **\--from** syntax. The file is directly copied in the WildFly deployments directory.

Br

Punit
