---
title: "Quick guide on AWS for beginners"
description: "Amazon, was the first company that comes up with the idea of bundling all the 7 layers of the OSI model in form of services aka web services which are built on compute capabilities. At the time of wri"
pubDate: 2018-08-29T00:09:00.123-07:00
updatedDate: 2023-12-15T05:29:18.514-08:00
tags:
  - "AWS"
originalUrl: "https://cloudnetes.blogspot.com/2018/08/learning-amazon-web-services.html"
---

![](/blog/blog-images/aws-7c480e8300b2.png)

Amazon, was the first company that comes up with the idea of bundling all the 7 layers of the OSI model in form of services aka web services which are built on compute capabilities. At the time of writing this article, there are more than 90 services in AWS.

AWS has got everything we need to start building a solid app that's scalable, reliable and highly available. 

Here's a brief overview:

**EC2** and **S3** for computing and storage - the real workhorses.
**RDS** and **DynamoDB** for all our database needs, whether it's SQL or NoSQL.
**Lambda** for running our code without managing servers - a real time-saver.
**VPC** to keep our network safe and sound.
**Elastic Load Balancing** and **CloudFront** for managing web traffic and speeding up content delivery.
**Route 53** for straightforward DNS management.

And there's more specialized stuff: **ECS** and **EKS** for managing containers, **Kinesis** for handling data streaming, and **Elasticache** for caching. For big data, there’s **Redshift** and **Athena**, and for data prep, there's **AWS Glue**.

Need to keep things secure and efficient? There’s **CloudFormation**, **Direct Connect,** **GuardDuty**, and **Key Management Service**. And for developers, AWS offers tools like **CodeDeploy**, **CodeCommit**, and **CodePipeline**.

also to list them down, there are 4 core foundation elements

-   **Compute -** EC2, Paas Elastic beanstalk, Faas Lambda, Auto Scaling
-   **Storage -** S3, Glacier(used to archive), Elastic object, block storage, Elastic file system
-   **Database -** DaaS, custom DB, MySQL
-   **Network -** VPC, CloudFront, Route53 for DNS, API gateway, Direct-connect

where auto-scaling is sufficiently great, due to its auto-provision property, it can help in increased demand, as well as reduced demand.

## **Here are some topics that may help you to start with AWS journey**

**What are the difference b/w EC2 and Elastic beanstalk?**

With EC2 instance, you are manually going to launch an instance and tell the system what kind of OS, memory, CPU and other resources you want to spin. With beanstalk you tell the system about your requirement and the system will spin up all suitable and eligible resources for you.

Ex: if you have a .net application you tell the system and it will launch all the app and DB instances required for a .net application to work.

key to remember - to retrieve the EC2 instance Metadata from within the instance you can use a special URL  "http://169.254.169.254/latest/meta-data/"

**what is Global Accelerator?**

Is a networking service that improves the performance of your local+Global users' traffic by up to 60% using Amazon Web Services' global network infrastructure.

![](/blog/blog-images/pgs-dd0d5dcfc075.png)

**Cluster Placement Groups** can only exist in one Availability Zone since they are focused on keeping instances together, which you cannot do across Availability Zones.

**Partition Placement Groups** can spread your instances across logical partitions such that groups of instances in one partition do not share the underlying hardware with groups of instances in different partitions.

**Spread Placement Groups** In this group each instance has its distinct underlying hardware, Launching
instances in a spread placement group reduce the risk of simultaneous failures, that might occur when instances share the same racks.

**How do you set up config Profile in AWS ?**

you can setup config profile by using was configure with --profile or if you have already ran aws configure providing secret and access key, try following way -

**Linux** 

$ vi `~/.aws/credentials`

`add your custom profile next to the previously added config like -`

`[dev]`

`aws_access_key_id = AKIAUJNNDEMOWNHXOU`

`aws_secret_access_key = EIAjod83jeE8fzhdemohrjrzj5NrGuNUT6`

`region = eu-west-2`

`output = text`

`$` `aws ec2 describe-instances --profile dev`

`$` `export AWS_PROFILE=dev`

**What is a GuardDuty?**

It is a threat detection service that continuously monitors for malicious activity and unauthorized behavior to protect your AWS accounts, workloads, and data stored in Amazon S3. 

**What is an EBS Volume?**

An **E**lastic **B**lock **S**tore Volume is a network drive you can attach to your instances while they are running. It allows your instances to persist data, even after their termination, they can only be mounted to one instance at a time & they are bound to a specific availability zone i.e. you cannot use EBS present in one zone to attach to an instance on another zone instead you used a method called snapshot.

Think of them as a "USB stick" but attached at a network level.

EBS snapshots are backed up to S3 in an incremental manner.

**Key to remember** - to enable encryption at rest using EC2 & EBS you must configure encryption when creating the EBS volume that will demonstrate your professionalism in any commercial situation.

**What is ElasticCache in aws?**

Amazon EIastiCache is a web service that makes it easy to deploy and run Memcached or Redis protocol-compliant server nodes in the cloud. 

Amazon EIastiCache improves the performance of web applications by allowing you to retrieve information from a fast, managed, in-memory caching system, instead of relying entirely on slower disk-based databases. 

This service simplifies and offloads the management, monitoring and operation of in-memory cache environments, enabling your engineering resources to focus on developing applications.

**how do you upgrade or downgrade a system with near-zero downtime?**

\- Launch another system parallel maybe with a bigger EC2 capacity 

\- Install all the software/packages needed 

\- Launch the instance and test locally

\- If works, swap the IPs if using route 53, update the IPs and it gonna send traffic to new servers in **0** Downtime

**Databases in AWS?**

• **RDBMS** (SQL/OLTP): RDS,  Aurora - great for joins

• **NoSQL database**: DynamoDB (~JSON & key-value), ElastiCache (key / value pairs), Neptune (graphs) - no joins, no SQL

• **Object Store**: S3 (for big objects) / Glacier (for backups / archives)

• **Data Warehouse** (SQL Analytics / BI): Redshift (OLAP), Athena

• **Search**: ElasticSearch (ISON) - free text, unstructured searches

• **Graphs**: Neptune powers graph - displays relationships between data, Use cases such as - recommendation engines, fraud detection, knowledge graphs, drug discovery, and network security.

**What is the benefit of using the Lambda function?**
With AWS Lambda, you can run code without provisioning or managing servers. You pay only for the compute time that you consume—there’s no charge when your code isn’t running. You can run code for virtually any type of application or backend service—all with zero administration.

**What is the Amazon S3 bucket?**
An Amazon S3 bucket is a public cloud storage resource backed by AWS formally known as Simple Storage Service (S3), an object storage offering.
S3 buckets are similar to file folders, and store objects, which consist of data and its descriptive metadata.
An S3 user first creates a bucket in an AWS region of choice and gives it a globally unique name. AWS recommends that customers choose regions geographically close to them to reduce _latency_ and _costs_.
Once the bucket has been created, the user selects a tier for the data, with different S3 tiers having different levels of redundancy, prices, and accessibility. One bucket can store objects from different S3 storage tiers.
The user then specifies access privileges for the objects stored in a bucket, via IAM mechanisms, bucket policies, and access control lists.
Users can interact with an S3 bucket via the AWS Management Console, AWS CLI, or application programming interfaces (APIs).
There is no limit to the number of objects a user can store in a bucket, though buckets cannot exist inside of other buckets.
You can use Amazon S3 to host a static website, on the contrary, a dynamic website relies on server-side processing, including server-side scripts such as PHP, JSP, or ASP.NET. Amazon S3 does not support server-side scripting, but AWS has other resources for hosting dynamic websites.

Currently, the S3 Classes are

Standard

Standard-Infrequent Access

One Zone-Infrequent Access

Reduced Redundancy Storage 

and for archive -

Glacier

Glacier Deep Archive

However, only **Reduced Redundancy Storage** is the only S3 Class that does not offer **99.999999999%**

**What is Amazon CloudFront?**

CloudFront is a content delivery network (CDN) service that delivers static and dynamic web content, video streams, and APIs around the world, securely and at scale. By design, delivering data out of CloudFront can be more cost-effective than delivering it from S3 directly to your users.

**What is Geotargeting in the CloudFront?**

It works on the principle of caching and is handled globally, providing data to users from the nearest server. ( URL remains the same, you can modify the content and customize the content).

in Geotargeting cloud front detects the country code and forward it to the origin server, then the origin server sent the specific content to the cache server and will be stored forever and then the user will get specific content images defined specifically for their region/country.

**What is Amazon CloudWatch?** 

![](/blog/blog-images/5f876f4fc668.png)

Amazon CloudWatch allows you to monitor AWS cloud resources and the applications you run on AWS.

**What is Amazon CloudTrail?**
A service that enables governance, compliance, risk & operational auditing of  AWS account. 

With CloudTrail, you can continuously monitor, log and retain account activity related to actions across your AWS infrastructure. 

CloudTrail provides the event history of your AWS account activity, including actions taken through the AWS Management Console, AWS SDKs, command-line tools, and other AWS services.

**What is Amazon Athena?**

It is an interactive query service that makes it easy to analyze data in Amazon S3, using standard SQL commands. It will work with a number of data formats including "**JSON", "Apache Parquet", "Apache ORC**" amongst others, but "XML" is not a format that is supported.

**What if provisioned service is not available in the region/country?**

not all services available in all region, it all depends on the liking of the services, all depending on requirements. always find the nearest region to serve your customer, else you will face high latency.

Thanks

some diagrams & Images are not created by me - All credit for that goes to the creators.
