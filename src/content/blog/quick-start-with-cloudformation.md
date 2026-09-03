---
title: "Deploying AWS resources with CloudFormation"
description: "CloudFormation is an infrastructure as a code provider in aws it is one of the major offerings from AWS, that helps you to set up a prototype of your managing resources. So that you worry less in sett"
pubDate: 2018-09-20T03:06:00.022-07:00
updatedDate: 2022-02-17T02:31:13.845-08:00
tags:
  - "AWS"
originalUrl: "https://cloudnetes.blogspot.com/2018/09/quick-start-with-cloudformation.html"
---

![](/blog/blog-images/cloudformation-logo-26c88d6ad8e3.png)

CloudFormation is an infrastructure as a code provider in aws it is one of the major offerings from AWS, that helps you to set up a prototype of your managing resources. So that you worry less in setting up those resources every time, instead you create a template defining all your required resources and let aws-cloudformation do the provisioning and configuring of your defined resources like other famous IaC tool called [Terraform](https://www.terraform.io/). It works in an incremental fashion, which means it always looks for what has changed since your last upload and only performs updates on things that have changed.
There are pre-defined templates available in AWS which you can use and customize according to your requirement.

AWS CloudFormation Template usually written in YAML or JSON format

```
 Its syntax includes
 AWSTemplateFormatVersion [usually 2010-09-09 as latest]
 Description [basic idea about your template]
 Metadata    [label your parameters]
 Parameters  [data about parameters]
 Mappings
 Resources  [define all your required aws resources here]
 Condtions
 Output     [can be your end result]

  A sample json resource for S3 may look like
{

    "Resources": {

        "democf": {

            "Type": "AWS::S3::Bucket",

            "Properties": {}

        }

    }

}
```

the moment you create a stack, it will store your stack into S3 generating a URL for it

ex:

```
 https://s3.ap-south-1.amazonaws.com/cf-templates-194b45c-ap-south-1/202118-demox5dr
```

The best sample template to start with cloudFormation is the LAMP stack (Linux Apache Mysql Php)

Navigate to: **services** \> **cloudFormation** \> **Create Stack** \> **use a sample template** > **LAMP stack**

at this stage, you do have an option to customize your stack, choose **View in Designer** to customize it and edit the json/yaml as per requirement and create a stack by clicking a small button 

![](/blog/blog-images/564e2793d4d5.png)a glimpse from designer

once you create the task it will show the status in events

![](/blog/blog-images/progress-759bfc684ada.png)

**Verification**

-   You should be able to see all the four resources in aws-gui
-   navigate to EC2 dashboard you will see a new instance created using the above stack
-   hit public IP of **EC2-Linux** instance you will be able to see a **PHP** page hosted by **Apache**
-   connect to EC2 and test your **Mysql** by running the below command.

```
 $ mysql -h localhost -P 3306 -u dbuser -p dbpass
   // if all goes well you should be able to connect to your sql db
```

and that's it. This is how you can start with your first cloudFormation template in AWS.
