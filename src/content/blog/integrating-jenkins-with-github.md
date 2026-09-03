---
title: "Integrating Jenkins with GitHub"
description: "In this exercise, we are going to integrate Github with Jenkins using webhook that triggers an event"
pubDate: 2018-06-10T06:59:00.019-07:00
updatedDate: 2021-06-18T00:16:47.662-07:00
tags:
  - "git"
  - "jenkins"
originalUrl: "https://cloudnetes.blogspot.com/2018/06/integrating-jenkins-with-github.html"
---

![](/blog/blog-images/webhookj-a59b1e9bb423.png)

In this exercise, we are going to integrate Github with Jenkins using webhook that triggers an event
every time you commit a change in your code residing in your GitHub repository to invoke a job in your Jenkins.

To start with, you should be having the following in place.

a. A [Github](http://www.cloudnetes.tech/2019/05/uploading-project-on-git.html) account with a code repository 
b. [Jenkins](http://www.cloudnetes.tech/2018/02/jenkins.html) up and running
c. Github [plugin](https://plugins.jenkins.io/github/) for integration with Jenkins

First, we going to create a webhook from our code repository by navigating

**GitHub** \> **your-code-repository** > **settings** \> **webhooks** \> **Add webhook** 

add **Payload URL** - https://jenkinsUrl:8080/github-webhook/
**Content type** - choose application/json
**Secret** \- you can leave this field blank
Which events would you like to trigger this webhook? - Select - **Just the push event**
Check the **Active** box - this will deliver the first payload to test the provided URL
**Add webhook**

Now come to Jenkins are create a freestyle project by navigating

**Jenkins** \> **new Item** \> **item name** > **Freestyle project** > **OK**

select **Github project**, and give **project URL** \- https://github.com/punitporwal07/aws-codedeploy-linux/
for **Source code management**, select **git** and give **repository URL** \- https://github.com/punitporwal07/aws-codedeploy-linux.git
Keep **Branch Specifier** as - \*/master
Under Build Triggers - check GitHub hook trigger for GITScm polling
**Save**

that's it. Now make a code commit in your git repo, the webhook associated with your repository detects the change and trigger a payload to your Jenkins job which you created in the above step.

you will be able to see the console output of your build as below

![](/blog/blog-images/webhook-033e6ed0f081.png)

\--
