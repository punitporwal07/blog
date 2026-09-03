---
title: "what is docker-compose"
description: "When you wish to run services together and want to run them as single unit then docker-compose is the tool for you, which allows you to run multiple services as kind of microservice by defining them i"
pubDate: 2019-01-21T02:39:00.030-08:00
updatedDate: 2021-08-08T03:44:34.824-07:00
tags:
  - "Docker"
  - "docker-compose"
originalUrl: "https://cloudnetes.blogspot.com/2019/01/docker-compose.html"
---

_**When you wish to run services together and want to run them as single unit then docker-compose is the tool for you, which allows you to run multiple services as kind of microservice by defining them in a single configuration file.**_

![](/blog/blog-images/4ec2a91cf0e5.png)-   docker-compose is a docker tool for defining and running multi containers docker applications.
-   docker-compose allows us to define all the services in a configuration file and with one command it will spin up all the containers that we need.
-   it uses yaml files to configure application services ([docker-compose.yml](https://docs.docker.com/compose/compose-file/))
-   it uses a single command to start and stop all the services (docker-compose up & docker-compose down)
-   it can scale up services whenever required.

by default, this tool is automatically installed when you are on windows or mac with docker v1.12+

but if you are on Linux try this command given at GitHub for docker-compose

```
 $ curl -L https://github.com/docker/compose/releases/download/1.23.2/docker-compose \
   -`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
 $ chmod +x /usr/local/bin/docker-compose
```

alternatively you can find the latest version available here at [github](https://github.com/docker/compose/releases/)

docker-compose.yml prototype will look like:

**version:**
**services:**
  **image:**
**network:**
**volume:**

version: first thing first define version of the docker-compose that we are using, there is no restrictions of not to use latest version of compose so I have used '3' here

version: '3'

services: service definition contains configuration which will be applied to each container started for that service, much like passing a command-line parameter to docker run

```
---
version: ‘3’
services:
  webserver:
    image: punitporwal07/apache
    ports:
    - “9090:80”
  database:
    image: mysql
    ports:
    - “4041:3306”
    environment:
    - MYSQL_ROOT_PASSWORD=password
    - MYSQL_USER=user
    - MYSQL_PASSWORD=password
    - MYSQL_DATABASE=demodb

...
```

**so instead of defining items in the docker run command, now we can define it more easily in the configuration file here but with a little bit of syntax**

now launch the service using a simple command **docker-compose up** and it will spin up MySQL and apache in fractions of minutes for you.

\--
