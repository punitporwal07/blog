---
title: "Acheive CI/CD using AWS managed resources & with Jenkins"
description: "AWS provides the flexibility to set up pipelines using the below three services to achieve continuous integration and continuous deployment a.k.a CI/CD"
pubDate: 2021-01-19T03:54:00.020-08:00
updatedDate: 2023-10-20T08:01:32.876-07:00
tags:
  - "AWS"
  - "jenkins"
originalUrl: "https://cloudnetes.blogspot.com/2021/06/how-to-acheive-cicd-in-aws-with-jenkins.html"
---

![](/blog/blog-images/aws-pipeline-ccf37985c652.png)

**AWS** provides the flexibility to set up pipelines using the below three services to achieve continuous integration and continuous deployment a.k.a CI/CD

**a. CodeCommit/Git -**  store code in aws codeCommit or a private git repositories.
**b. CodeDeploy -** automate code deployments
**c. CodePipeline -** service that deploy, build & test your code

**a. Set up** **Codecommit:**  which will be used for version controlling and a useful tool during CI/CD

The first thing is to get the required permissions for the user, setup aws-credentials for your aws environments & then create a repository

**a1. Services** \> **IAM** \> **Users** \> **User** \> **Permission** \> **Attach existing policy** > **AWSCodeCommitPowerUser**
**a2. Services** > **IAM** \> **Users** \> **User** \> **Security credentials** > **HTTPS Git credentials for AWS CodeCommit** \> **Generate credentials**

a3. Services > codecommit > create a repo(MyRepo) > cloneURL via Https

```
 from any host having git installed, do the following $ git clone 'clone-https-url' // it will prompt for credentials here pass the same cred, that you have generated in step a2  $ cd repository-directory $ vi index.html
 $ vi appspec.yml
 $ git status
 $ git add index.html appspec.yaml
 $ git status
 $ git commit -m 'initial commit'
 $ git push origin master // it will connect via https url and push the file to MyRepo
 $ git log // validate push
```

this completes the repository setup with a simple source code

**b. Set up CodeDeploy to deploy an App:** to automate the deployments and adding new features continuously, first is to add 2 roles for codeDeploy for instance.

first setup roles for codeDeploy

create Role1

![](/blog/blog-images/aws-codedeploy-4dc8b6c6cdac.png)

**b1. Services** > **IAM** \> **Roles** \> **CreateRole** \> **EC2 >** **AmazonEC2RoleforAWSCodeDeploy**
create Role2
**b2. Services** \> **IAM** \> **Roles** \> **CreateRole** \> **codeDeploy** \> **AWSCodeDeployRole**
create an application
**b3. services** \> **codeDeploy** \> **createApp** on Ec2
**create appDeploymentGroup** > **name-myappgrp** > **servicerole-codedeploy-role2 >** D-type**\-In-place** \> **env-config-Amazon-EC2** \> **add-tag** > choose**\-target-group** > **createDeploymentGroup**

**c. Set up CodePipeline:** to deploy code from CodeCommit
**Services** \> **CodePipeline** \> **create** \> **name-pipeline arn:role**\> **source-CodeCommit** \> **connect/authorize** > select-**RepoCreatedInStep a3** > branch**\-Master** \> **Detection-aws-codePipeline** > buildProvider**\-**skipBuildStage > deploymentProvider**\-AWS CodeDeploy** \>  **App-myApp** > **D**\-**Group-myappgrp** > **createPipeline

**

once the pipeline is created it will connect to the source & start deploying the code present in codecommit, and apear as below -

![](/blog/blog-images/avvxseh01j6mbwlbuerj5cvzdthydav6auaou-gn-ed4620ea8762.png)

Similarly, you can use **[GitHub](https://github.com/punitporwal07/aws-CodePipeline-ec2)** also as a source provider 

**Set up CodePipeline:** to deploy code from GitHub
**Services** \> **CodePipeline** \> **create** \> **name-pipeline arn:role**\> **source-GitHub** \> **connect/authorize** > **Add Git-Repo** > **branch-Main** \> **detection-aws-codePipeline-ec2** > **buildProvider-** skip build stage \> deploymentProvider**\-AWS CodeDeploy** \>  **App-myApp** > **D**\-**Group-myappgrp** > **createPipeline**

once the pipeline is created it will connect to the source Git this time & start deploying the code present in Github, and apear as below -

**

![](/blog/blog-images/avvxsehgvwiy2upzbx2dmv3ovsy-14mdn9dyux6i-904ed6e72eec.png)

**Note:** On creating a deployment group you are required to choose your deployment & environment type that's where you will deploy your application, in this exercise I choose to deploy on Amazon EC2 instance using Tag value.

At this stage, you should be able to access your application deployed on the EC2 instance using aws **CodeCommit/Git** > **CodePipeline** > **S3** \> **CodeDeploy** > **EC2 instance**

## **In order to use Jenkins, connect to your Jenkins and do the following**

```
 Install the listed plugins from Manage Plugins section of Jenkins & Restart jenkins

 GitHub Integration
 AWS CodePipeline
 AWS CodeDeploy
 AWS CodeBuild
 Http Request
 File Operations
 Blue Ocean // for new Jenkins UI

```

**Time to create a Jenkins Job**

-   Create a new **Freestyle Project**
-   Add your **Source Code Management**
-   Choose **Git**, provide repository URL.
-   For **Build Trigger** select **Poll SCM** to add "H/2 \* \* \* \*" in Schedule.
-   Under **Build Environment**, select Delete workspace before build starts check box.
-   Under **Build** actions select **AWS CodeBuild**. On the **AWS Configurations,** choose Manually specify access and secret keys and provide the keys. 
-   **Project Configuration** - Provide Region, Project Name, choose Use Jenkins source & leave everything blank.
-   Add the second **Build step** and choose **File operation** (To make sure that all files cloned from the GitHub repository are deleted) Click Add and select **File Delete** and give '\*' under include file pattern.
-   Add the third **Build step** and choose Http request and give S3 URI till your zip file. ex: http://s3-us-east-1.amazonaws.com/s3-bucket-2021/code-artifact.zip
    **Ignore SSL error** \- yes
-   Under **HTTP Request**, choose **Advanced** and leave Authorization, Headers & Body to default values. 
-   Under **Response**, for Output response to file, enter the _code-artifact.zip_ file name.
-   Add fourth **Build step** as File **operation** with 2 substeps - **Unzip & File Delete** and provide code-artifact.zip to include as zip file & file pattern in file Delete.
-   On the **Post-build Actions,** choose Add post-build actions and select the **Deploy an application to AWS CodeDeploy** check box and provide values
    CodeDeploy App Name
    CodeDeploy AppGrp Name
    CodeDeployDefault.OneAtATime
    Your AWS Region
-   at last choose Deploy Revision
       - choose wait for deployment to finish?

you should be able to access your application deployed on the EC2 instance using CI/CD flow.

\--
