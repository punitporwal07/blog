---
title: "Networking in docker"
description: "Docker works on the principle of running containers as a service, when you run a container it has its own attributes like namespace ip-address port etc. These attributes are allocated to containers by"
pubDate: 2018-01-24T10:43:00.038-08:00
updatedDate: 2023-09-10T06:43:38.082-07:00
tags:
  - "Docker"
  - "networking"
originalUrl: "https://cloudnetes.blogspot.com/2020/01/docker-and-its-networking.html"
---

![](/blog/blog-images/1610490961915-jpeg-8c136dc14fc9.jpg)

Docker works on the principle of running containers as a service, when you run a container it has its own attributes like namespace ip-address port etc. These attributes are allocated to containers by docker daemon at run time. There are ways to control this behaviour like creating namespaces of your choice at the time of launching them.

Same way when it comes to IP addresses you can create your own docker network which can give a static ip to your container or its underline service. 

docker comes with 5 kinds of networking drivers:

**bridge**: when you want to communicate between standalone containers.

**overlay**: to connect multiple Docker daemons together and enable swarm services to communicate with each other.

**host**: For standalone containers, remove network isolation between the container and the Docker host. 

**macvlan**: Allow you to assign a MAC address to container, making it appear as a physical device on your network.

**none**: disables all networking.

by default, the bridge is the default driver that got created when you launch any of the containers as a service.

How one can create its own docker network as per requirement 

the syntax to create a network is : 

**$ docker network create --options networkname**

few widely used options are:

_\--driver drivername_

_\--subnet=subnetrange/x_

_\--gateway=anIPfromdefinedsubnet_

for example, assigning static IP out of your CIDR block

```
 $ docker network create --driver overlay --subnet=192.168.0.0/26 --gateway=192.168.0.1 my-network
```

additionally you can use this created network for your container at the time of its launch

for example:

```
 $ docker run --publish 61000:1414 --publish 61001:9443 --net my-network --ip 192.168.0.3 --detach --env
  MY_APP_PASSWORD=password punitporwal07/apache:2.2.29
```

this way your container will be allocated with a static IP within your defined subnet range.

**HOW DO YOU USE PORT MAPPING**

```
 when you expose a port from Dockerfile that means
 you are mapping a port defined in your image to your newly launched container, use:
 $ docker run -d -p 5001:80 --name=contaniername imagename

 when you want to change the protocol from default i.e TCP to UDP, use:
 $ docker run -d -p 5001:80/udp --name=continername imagename

 let's say when you want to expose your image port to any specific IP address from your host, use:
 $ docker run -d -p 192.168.0.100:5002:80 --name=contaniername myimagename

 when you want to map multiple ports exposed in your Dockerfile to high random available ports, use:
 $ docker run -d -P --name=contaniername imagename

 to expose a port range, use:
 $ docker run -it -p 51000-51006:51000-51006 imagename:tag
        also you can use EXPOSE 51000-51006 in your Dockerfile

 to check port mapping, use:
 $ docker port imagename
```
