---
title: "How to achieve CI/CD in AWS"
description: "Setting up continuous integration and continuous deployment in AWS is as simple as three steps."
pubDate: 2021-02-09T05:39:00.000-08:00
updatedDate: 2024-01-06T08:09:13.271-08:00
tags:
  - "AWS"
originalUrl: "https://cloudnetes.blogspot.com/2021/06/how-to-achieve-cicd-is-aws.html"
---

![](/blog/blog-images/avvxsei-tcj0dt3baigajx5d7yebkqbfdirgb6vh-afeb35056e1f.png)

Setting up continuous integration and continuous deployment in AWS is as simple as three steps.

In this exercise, we will be using three managed services of aws and creating them using aws-CLI. 

**CodeCommit** - that will be used as code repository
**Simple storage service S3** - that will host static data of our website
**CodePipeline** - that will do the CI/CD part for our website.

**STEP 1**

```
 Creating a CodeCommit a.k.a source repository of your code

 $ aws codecommit create-repository --repository-name s3-static
 {
    "repositoryMetadata": {
        "accountId": "282795344735",
        "repositoryId": "73cde608-6602-4022-a5b7-3358db9fed4d",
        "repositoryName": "s3-static",
        "lastModifiedDate": "2021-06-09T12:00:38.560000+00:00",
        "creationDate": "2021-06-09T12:00:38.560000+00:00",
        "cloneUrlHttp": "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/s3-static",
        "cloneUrlSsh": "ssh://git-codecommit.us-east-1.amazonaws.com/v1/repos/s3-static",
        "Arn": "arn:aws:codecommit:us-east-1:282795344735:s3-static"
     }
 }

 Adding your files to your repository
 $ aws codecommit put-file --repository-name s3-static --branch-name main
   --file-content fileb://index.html --file-path index.html
 {
    "commitId": "c2cca6e2c2338b8464a5182558ffabbe7aaf61a4",
    "blobId": "9a10b78d6e76725d27697165ca4b2a93069784de",
    "treeId": "c0a0fec37d59c41e507754c52330dcd000312915"
 }
```

**STEP 2**

```
 Creating a S3 bucket where your static data of website will be stored
 $ aws s3 mb s3://static-website-bucket-2
 make_bucket: static-website-bucket-2
    // By default, Block all public access is set to off
```

**STEP 3**

Creating a CodePipeline - Unlike the console, running the create-pipeline command in the AWS CLI does not have the option to create the CodePipeline service role for you.
So we have to stick with AWS-GUI in this section

**Services** \> **CodePipeline** \> **create** \> name**\-pipeline** arn:**role** \> select-**aws-code-commit** > select-**Your-Repo** > branch-**main** > buildProvider-**skip** > deploymentProvider-**Amazon S3** > give-**region** > select-**bucket** \> check-**Extract file before deploy** > **createPipeline**

The moment you create the pipeline, codePipeline picks up the data from the source(codeCommit) and deploys it to Amazon S3 from where you can access your static site.

which you can check by navigating into your S3 bucket you will be able to see the website objects that will provide you object URL 
ex - https://static-website-bucket-2.s3.amazonaws.com/index.html 

next time you commit a change in CodeCommit, CodePipeline will detect the change and take a copy of your new code from CodeCommit, pushes to S3's codePipeline bucket _codepipeline-us-east-1-47777091653_ and updates your website code in your own S3 bucket.

```
 You can use aws-cli to update-commit your code as well
 $ aws codecommit put-file --repository-name s3-static --branch-name main
   --file-content fileb://index.html --file-path index.html
   --parent-commit-id 14de6fc0d6cb3ecefa840b04e98f56ccfcb55788
   --name "punit" --email "punitporwal@gmail.com"
   --commit-message "I added a new file."

 {
    "commitId": "e76b6f98cfc0a60c1089654c560858361e7fb7df",
    "blobId": "24e39e8b94c620aedfd8f9e9cd3a39f76d25d92f",
    "treeId": "9f68a7142b705516a6226e007acd40501fcdaeae"
 }
 // where --parent-commit-id is your last commit-ID
    --name, --email & --commit-message are optional fields.
```

Alternatively in STEP 1 if we wish to change the code repository to **[GIT](https://github.com/)** in place of CodeCommit, we can follow a similar approach, replacing codeCommit with GITHUB in the Source provider while creating a pipeline.

**Services** \> **CodePipeline** \> **create** \> name**\-pipeline** arn:**role** \> Source provider select-**Github** > click-**Connect-to-Github** > choose-you-repository > branch-**master** > buildProvider-**skip** > deploymentProvider-**Amazon S3** > give-**region** > select-**bucket** \> check-**Extract file before deploy** > **createPipeline**

**Detection mode**
GitHub webhooks/AWS codePipeline automatically start your pipeline when a change occurs in the source code.

Deleting the resources to avoid any billing in aws using CLI

```
 Deleting file in repository
 $ aws codecommit delete-file --repository-name s3-static --branch-name main
   --file-path index.html
   --parent-commit-id 0c7d16793dbe7c54b9eaff06bf4f9ca7aa593ed1
 Deleting repository
 $ aws codecommit delete-repository --repository-name s3-static
 Deleting bucket and all its data
 $ aws s3 rb --force s3://static-website-bucket-2
 Deleting codePipeline
 $ aws codepipeline delete-pipeline --name static-website
```

\--
