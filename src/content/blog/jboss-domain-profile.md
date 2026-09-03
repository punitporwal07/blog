---
title: "JBOSS- Domain Profile"
description: "Domain Profile in Jboss AS"
pubDate: 2015-07-13T03:14:00.013-07:00
updatedDate: 2023-09-07T16:09:55.726-07:00
tags:
  - "jboss"
originalUrl: "https://cloudnetes.blogspot.com/2015/07/jboss-domain-profile.html"
---

![](/blog/blog-images/4ae17baed77e.png)

﻿

![jboss as 7 domain configuration jboss as 7 domain configuration jboss as 7 domain configuration](http://www.mastertheboss.com/images/stories/jbossas7domain.png)

**Domain Profile in Jboss AS
**
As you can see, we have two server groups: main-server-group(On-left) and other-server-group(on-right). You can in turn associate each server group with a different profile.

The default configuration includes four preconfigured profiles:

default - Support of Java EE Web-Profile plus some extensions like RESTFul Web Services or support for EJB3 remote invocationsfull - Support of Java EE Full-Profile and all server capabilities without clusteringha - default profile with clustering capabilitiesfull-ha - full profile with clustering capabilitiesA profile contains the configuration of the supported subsystems that is added by an extension. We choose the full profile which contains all JBoss AS capabilities, except for clustering which will be covered later in this book.

The referenced profile will be assigned by the server group to one socket-binding group. A socket-binding group references to logical interface names instead direct to the interfaces of a host. These logical interfaces are defined in the section of the domain.xml configuration file.

The exact binding of the interfaces with the IP address is done into the host.xml file, however we will leave it with the default values and use start up properties to override these values.

Configuring the host.xml of the Domain controller

The first thing we need to check, is that the host controller acts as domain controller. This is stated by the following domain-controller stanza:

Next, since we won't add any server on this host, we need to state it, using an empty servers element:

Now we can start the domain controller with the following command. We will set the physical network bind address to the host configuration with the jboss.bind.address.management property. The management interface must be reachable for all hosts in the domain in order to establish a connection with the domain controller.

domain.sh -b 192.168.1.1 -Djboss.bind.address.management=192.168.1.1

(Please note the -b parameter is an alias for the -Djboss.bind.address parameter)

Host configurations (domain.xml)

After the domain controller is configured and started, the next step is to setup the two hosts. On each host we also need an installation of JBoss AS 7.

On each host, we need to configure the host.xml file (as an alternative you can name the host file as you like and start the domain with the --host-config parameter.

Example ./domain.sh --host-config=host-slave.xml ).

The first thing is to choose a unique name for each host in our domain to avoid name conflicts. Otherwise, the default is the hostname of the server.

And for the other host...
