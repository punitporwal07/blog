---
title: "DevOps"
description: "Set of practices that emphasize the collaboration and communication of both software DEVelopers and IT OPerationS professionals while automating the process of software delivery and infrastructure cha"
pubDate: 2017-02-24T02:07:00.004-08:00
updatedDate: 2023-03-07T06:20:25.553-08:00
tags:
  - "DevOps"
originalUrl: "https://cloudnetes.blogspot.com/2018/02/how-do-devops-tools-work-together.html"
---

Set of **practices** that emphasize the **collaboration** and **communication** of both software **DEV**elopers and IT **OP**eration**S** professionals while **automating** the process of software delivery and infrastructure changes, which aims at establishing a **culture** and environment where building, testing, and releasing software can happen **rapidly**, **frequently**, and more **reliably**.
**
"which ultimately means building digital pipelines that take code from a developer’s laptop all the way to revenue-generating prod awesomeness"**
some myths that should be addressed before deep dive into DevOps

![](/blog/blog-images/ic-devops-venn-diagram-95a481011f6b.jpg)

**Myth - DevOps replace Agile**
DevOps is the next step of agile
DevOps principles and practices are compatible with agile
agile is an enabler of DevOps
not a replacement, but is a logical continuation
a 'deployable piece' of code rather than a 'potentially ship-able piece' of code after each sprint

**Myth - it "All Dev & No Ops"**
the nature of IT Ops work may change.
ops collaborate far earlier in the software life cycle with Devs.
Devs continue to work with Ops long after the code is in prod.

**Myth - DevOps is just automation**
it requires automation for sure.. But that's not all.. it's much beyond that.

**Myth - DevOps is a Tool/Product**
it's rather a combination of tools
we don't buy DevOps.. instead, we do DevOps

In an organisation where everything gets automated for seamless delivery the generic logical flow will be:

1.  Developers develop the code and the source code is managed by a Version Control System tool like **[Git](https://git-scm.com/),** then developers send this code to the git repository and any changes made in the code is committed to this repository.
2.  Then **[Jenkins](http://www.cloudnetes.tech/2018/02/jenkins.html)** pull this code from the repository using the git plugin and build it using tools like Ant or Maven.
3.  Configuration management tool like **[Ansible](http://www.cloudnetes.tech/2017/07/ansible-for-infra-automation.html)/[Puppet](https://puppet.com/products/how-puppet-works)** deploys this code & provision testing env. and then Jenkins releases this code on the test environment on which testing is done using tools like **[selenium](http://executeautomation.com/blog/how-selenium-works/)**. 
4.  Once the code is tested, pipelines configured using **Jenkins** send it for deployment on the production server (even production server is provisioned & maintained by tools like **Ansible**/**Puppet**)
5.  After deployment, it is continuously monitored by tools like **[Nagios](https://cloudnetes.blogspot.com/2018/02/nagios-continuous-monitoring-tool.html).**
6.  **[Docker](http://www.cloudnetes.tech/2017/11/what-is-docker-containerisation-vs.html)** containers provide a quick environment to test the build features. 

![](/blog/blog-images/dev-ops-4be0e8ba9d63.png)

## here are some useful articles with respect to DevOps

[LEARNING ON AWS](https://cloudnetes.blogspot.com/2018/08/learning-amazon-web-services.html)

[IaC USING TERRAFORM](https://cloudnetes.blogspot.com/2020/04/deploying-iac-using-terraform.html)

[ANSIBLE A CONFIGURATION MANAGEMENT TOOL](https://cloudnetes.blogspot.com/2017/07/ansible-for-infra-automation.html)

[WHAT IS JENKINS](https://cloudnetes.blogspot.com/2018/02/jenkins.html)

[QUICK NOTE ON NAGIOS](https://cloudnetes.blogspot.com/2018/02/nagios-continuous-monitoring-tool.html)

[ALL ABOUT DOCKER](https://cloudnetes.blogspot.com/2017/11/what-is-docker-containerisation-vs.html)

[MULTI-STAGE BUILD IN DOCKER](https://cloudnetes.blogspot.com/2019/05/multi-stage-build-in-docker.html)

[WHAT IS DOCKER SWARM](https://cloudnetes.blogspot.com/2019/01/all-about-docker-swarm.html)

[DOCKER-COMPOSE A DOCKER TOOL](https://cloudnetes.blogspot.com/2019/01/docker-compose.html)

[ORCHESTRATION FRAMEWORK OF KUBERNETES](https://cloudnetes.blogspot.com/2018/02/kubernetes-orchestration-framework-for_24.html)

# **How as a service is evolving over time**

![](/blog/blog-images/avvxsej5hla3hcvuzuezzkah-lrhfy8ojp4ozdf5-505db5dd6320.png)
