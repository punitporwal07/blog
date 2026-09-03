---
title: "Provision of EKS cluster via terraform"
description: "Amazon service for Kubernetes a.k.a Amazon EKS makes it easy to deploy, manage,"
pubDate: 2022-08-13T07:47:00.088-07:00
updatedDate: 2024-01-15T04:40:10.763-08:00
tags:
  - "eks"
originalUrl: "https://cloudnetes.blogspot.com/2022/08/provision-of-eks-cluster-on-aws-via.html"
---

Amazon service for Kubernetes a.k.a Amazon EKS makes it easy to deploy, manage,

![](/blog/blog-images/aeks-d7dd6fb9e679.png)

and scale containerized applications using Kubernetes on AWS.
Amazon EKS runs the Kubernetes management infrastructure across multiple AWS Availability Zones, automatically detects and replaces unhealthy control plane nodes, and provides on-demand upgrades and patching when required.
You simply provision worker nodes and connect them to the provided Amazon EKS endpoint.

The architecture includes the following resources:

**EKS Cluster** - AWS managed Kubernetes control plane node + EC2-based worker nodes.
**AutoScaling Group**
Associated **VPC**, **Internet Gateway**, **Security Groups**, and **Subnets**
Associated **IAM Roles** and **Policies**

Once the cluster setup is complete install kubectl in your bastion host to control your EKS cluster.

```
 # Install kubectl

 $ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.23.6/bin/linux/amd64/kubectl
 
 $ chmod +x kubectl && sudo mv kubectl /usr/bin/kubectl
```

In this article, I will describe how my code containing **Jenkinsfile & Terraform-code** is housed on a local machine from which my code will be pushed to my **git repository**.

I then created a **Jenkins pipeline** job to pull the code from git and deploy it on **AWS**. Upon successful execution of the Terraform code, it will deploy an Amazon-managed **EKS cluster** with two worker nodes of Amazon EC2. (1 on-demand instance of the t2.micro size and 1 spot instance of the t2.medium size)

![](/blog/blog-images/avvxsei7-x7ydb8y8hmiaqyhf1nv0irk-1ymcaj7-50408101eb2f.png)

A _Jenkinsfile_ for this pipeline job can be found here replicate it as per your requirement and replace the repository name where needed 

[https://github.com/punitporwal07/git-jenkins-tf-aws/blob/main/Jenkinsfile](https://github.com/punitporwal07/git-jenkins-tf-aws/blob/main/Jenkinsfile)

_Terraform-code_ to provision the EKS cluster can be found here
[https://github.com/punitporwal07/git-jenkins-tf-aws/blob/main/eks-by-tf-on-aws.tf](<https://github.com/punitporwal07/git-jenkins-tf-aws/blob/main/eks-by-tf-on-aws.tf >) 

once the code is ready push it to your git repository as below -

```
 # Pushing code from local to github repository
 $ git init
 $ git add .
 $ git commit -m "sending Jenkinsfile & terraform code"
 $ git push origin master
```

**Setup Jenkins Pipeline**

Login to your Jenkins dashboard and create a Pipeline Job or a readymade config.xml for this job can be found here copy it and push it under /var/lib/jenkins/jobs/ directory and restart Jenkins, this will add a new pipeline job in your Jenkins.

[https://github.com/punitporwal07/git-jenkins-tf-aws/tree/main/jenkins-pipeline-job/config.xml](https://github.com/punitporwal07/git-jenkins-tf-aws/tree/main/jenkins-pipeline-job/config.xml)

If you are using a bastion host to test this journey make sure you have AWS profile set for the user which has all the required role attached to it.

my profile for this job looks like the below -

```
 # cat ~/.aws/credentials
 [dev]
 aws_access_key_id = AKIAUJSAMPLEWNHXOU
 aws_secret_access_key = EIAjod83jeE8fzhx1samplerjrzj5NrGuNUT6
 region = eu-west-2
```

Policies attached to my user to provision this EKS cluster -

![](/blog/blog-images/avvxseiqnwo2dz3a5llae0umk22iaevesj2te-xr-c1343929ef17.png)

Plus an inline policy for EKS-administrator access

```
 {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "eksadministrator",
            "Effect": "Allow",
            "Action": "eks:*",
            "Resource": "*"
        }
    ]
 }
```

Now you have all the required things in place to run the pipeline job from **Jenkins** which will pick the code from **GitHub** and deploy an aws-managed **EKS** cluster on **AWS** provisioned by **Terraform** code.

A successful job will look like the below upon completion.

![](/blog/blog-images/avvxsegi9o3to5gf4vvojzospvvrluein1nhd1-3-06f6c7df35df.png)

Finally, the EKS cluster is created now, which can be verified from the AWS console

![](/blog/blog-images/avvxseh91huwhwdeihssvlpzigmpnhg7zjqftnlh-e997f8ff157b.png)

## **Accessing  your cluster**

1\. from the Bastion host by doing the following -

```
 # export necessary varibles as below & set cluster context

 $ export KUBECONFIG=$LOCATIONofKUBECONFIG/kubeconfig_myEKSCluster $ export AWS_DEFAULT_REGION=eu-west-2
 $ export AWS_DEFAULT_PROFILE=dev

 $ aws eks update-kubeconfig --name myEKSCluster --region=eu-west-2 Added new context arn:aws:eks:eu-west-2:295XXXX62576:cluster/myEKSCluster to $PWD/kubeconfig_myEKSCluster
```

![](/blog/blog-images/eks-ed447d02d248.png)

2\. Alternatively, you can view cluster resources from aws-console however, you might see the following error when you access them.

![](/blog/blog-images/avvxseipcld37hoin-ssiyhhwpg9madmaiq7hayp-2a893c33dc49.png)

_**(OPTIONAL, not every user will see this message it will varies from roles to roles)**_ 

EKS manages user and role permissions through a ConfigMap called **aws-auth** that resides in the kube-system namespace. So despite being logged in with an AWS user with full administrator access to all services, EKS will still limit your access in the console as it can't find the user or role in its authentication configuration.
which can be fixed by updating the Roles and Users of  aws-auth configmap of your EKS-cluster 

```
 # from your bastion host
 $ kubectl edit configmap aws-auth -n kube-system
 apiVersion: v1
 data:
   mapAccounts: |
     []
   mapRoles: |
     - rolearn: arn:aws:iam::2951XXXX2576:role/TF-EKS-Cluster-Role
       username: punit
       groups:
         - system:masters
         - system:bootstrappers
         - system:nodes
   mapUsers: |
     - userarn: arn:aws:iam::2951XXXX2576:user/punit
       username: punit
       groups:
       - system:masters
```

your TF-EKS-Cluster-Role should have the following policies attached to it

![](/blog/blog-images/eks-roles-e14f9acaacaa.png)

from your custom user in this case **punit**, access the console with this user as we have granted permission to this user to view the EKS-cluster resources.

![](/blog/blog-images/avvxseh456f0rfvg2q9m9f-v69oi-spjoxwx8s3q-979d6d81e24b.png)

## **Known Issues -**

Error while running pipeline stage when it tries to clone the repository to the workspace by running usual `'sh git clone'` command and gives following error

![](/blog/blog-images/avvxseihgyl8thsv4ktzoakmivwzmn-qrvwvqvrh-deab38c9aad3.png)

generate pipeline script by navigating to

**Pipeline Syntax > Sample Step as git:Git > give your repository details > Generate Pipeline Script**

it will generate a command for you to use in the pipeline state -

Ex -
`git branch: 'main', credentialsId: 'fbd18e1b-sample-43cd-805b-16e480a8c273', url: 'https://github.com/punitporwal07/git-jenkins-tf-aws-destroy.git'`

add it in your pipeline stage and rerun it.
