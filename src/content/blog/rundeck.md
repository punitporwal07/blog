---
title: "Rundeck - Runbook Automation tool"
description: "Rundeck is an opensource tool that helps you automate & schedule your operational jobs. It provides number of features like scheduling jobs, automating execution of ansible playbooks, notifying about "
pubDate: 2020-08-18T01:45:00.000-07:00
updatedDate: 2023-09-09T07:57:57.203-07:00
tags:
  - "ansible"
  - "Rundeck"
originalUrl: "https://cloudnetes.blogspot.com/2020/08/rundeck.html"
---

![](/blog/blog-images/rundeck-82034deccbed.jpg)

Rundeck is an opensource tool that helps you automate & schedule your operational jobs. It provides number of features like scheduling jobs, automating execution of ansible playbooks, notifying about the status of your job in form of sending emails is my favourite.

Configuring rundeck is straight forward, you can install rundeck as a service in your linux host or use it as a docker image as well.

quick setup

```
$ vi /etc/yum.repos.d/rundeck.repo

[rundeck]
name=rundeck
baseurl=https://packages.rundeck.com/pagerduty/rundeck/rpm_any/rpm_any/$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.rundeck.com/pagerduty/rundeck/gpgkey,https://docs.rundeck.com/keys/BUILD-GPG-KEY-20230105.key
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

$ yum install rundeck java
$ service rundeckd start$ service rundeckd status
● rundeckd.service - SYSV: rundeckd, providing rundeckd
   Loaded: loaded (/etc/rc.d/init.d/rundeckd; bad; vendor preset: disabled)
   Active: active (running) since Mon 2020-08-17 13:23:14 BST; 20h ago

$ tail -f /var/log/rundeck/service.log
[2020-08-14T09:02:28,539] INFO  rundeckapp.BootStrap - Rundeck is ACTIVE: executions can be run.
[2020-08-14T09:02:28,635] WARN  rundeckapp.BootStrap - [Development Mode] Usage of H2 database is recommended only for development and testing
[2020-08-14T09:02:28,899] INFO  rundeckapp.BootStrap - Rundeck startup finished in 646ms
[2020-08-14T09:02:28,991] INFO  rundeckapp.Application - Started Application in 25.616 seconds (JVM running for 28.068)
Grails application running at http://localhost:4440 in environment: production
```

quick setup as a docker Image and config customization

```
$ docker pull rundeck/rundeck

# Update the default port if it is blocked (4440) & localhost to DNS, in below three files
$ vi /etc/rundeck/profile //only port
$ vi /etc/rundeck/framework.properties // IP & PORT
$ vi /etc/rundeck/rundeck-config.properties  // IP & PORT

# changing the default password of rundeck
$ cd /etc/rundeck/
  edit realm.properties and change the admin values to something new

# adding a new user
$ cd /etc/rundeck/
$ sudo vi realm.properties
  (add following lines next to admin:admin,user,admin line)
        user1: user1pass,user,admin,architect,deploy,build

   where user,admin,architect,deploy,build are different roles we can assign to user1
```

now login to rundeck console with admin access and navigate to 

**settings** \> **Access Control  > + Create ACL Policy**

add following two scopes in order to give read access as an example to user user1

```
# Project scope
description: user1 with read access to projects.
context:
  project: '.*'
for:
  resource:
    - equals:
        kind: job
      allow: [read] # allow to read jobs
    - equals:
        kind: node
      allow: [read] # allow to read node sources
    - equals:
        kind: event
      allow: [read]
  job:
    - allow: [read] # allow read of all jobs
  adhoc:
    - deny: [run] # don't allow adhoc execution
  node:
    - allow: [run] # allow run on nodes with the tag 'mytag'
    
by:
  group: admin

---
# Application scope
description: application level ACL.
context:
  application: 'rundeck'
for:
  resource:
    - equals:
        kind: project
      allow: [read]
    - equals:
        kind: system
      allow: [read]
    - equals:
        kind: system_acl
      allow: [read]
    - equals:
        kind: user
      allow: [admin]
  project:
    - match:
        name: '.*'
      allow: [read]

by:
  group: admin
```

`happy rundecking!`
