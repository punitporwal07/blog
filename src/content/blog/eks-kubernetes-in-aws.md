---
title: "Launch EKS using eksctl in AWS"
description: "There are ways to exploit kubernetes to deploy the application. Perhaps when you are running out of resources to manage the kubernetes cluster you have an option to use the kubernetes service backed b"
pubDate: 2021-01-31T03:17:00.005-08:00
updatedDate: 2023-09-10T14:17:52.153-07:00
tags:
  - "AWS"
  - "K8S"
originalUrl: "https://cloudnetes.blogspot.com/2021/05/eks-kubernetes-in-aws.html"
---

![](/blog/blog-images/weave-6badb70c71e4.png)

There are ways to exploit kubernetes to deploy the application. Perhaps when you are running out of resources to manage the kubernetes cluster you have an option to use the kubernetes service backed by a cloud provider that will take all the burden of managing the cluster on your behalf known as managed kubernetes service and when deployed on AWS called as Elastic Kubernetes Service.

In this article, I will call kubernetes+cluster=Kluster

1\. To start with EKS you need to fulfil the following prerequisites.

    a. Own an AWS account (free tier will work)
    b. Create a VPC (virtual private space that will not affect other components in your acc) 
    c. Create an IAM role with the security group. ( AWS user with a list of permissions to setup EKS)

2\. To create a Kluster Control Plane you should have the following in place

    a. Kluster name, kubernetes version
    b. Region & VPC for kluster
    c. Security for kluster

3\. Create worker nodes for your kluster ( set of EC2 instances)

    a. Create as a Node Group ( autoscaling enabled)
    b. Choose kluster it will attach to
    c. Define security group, select instance type, resources
    d. Define max & min number of nodes.

Then we use _kubectl_ from our local to access kluster and deploy resources on it

Alternatively, we can use [eksctl](https://eksctl.io/#:~:text=eksctl%20is%20a%20simple%20CLI,welcomes%20contributions%20from%20the%20community.) an official CLI tool for creating & managing kluster on EKS that is written in go & uses cloudFormation to set up EKS fast & effectively.

```
  # below command will do all the job mentioned above at
    runtime and will be using default values
  $ eksctl create cluster
```

Let's demonstrate how this will be done

first, install _eksctl_ to use this utility follow the instruction [here](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) 

**NOTE**: Before creating a cluster using eksctl util it is important to connect and authenticate to your AWS account, follow the instructions to connect

```
 $ aws configure // that will prompt you to provide
   AWS Access Key ID [**SIXH]: AKIAUYDUMMY73NXMF
   AWS Secret Access Key [**6oB6]: mbJBDUMMYfm09oqONa
   Default region name [ap-south-1]:
   Default output format [None]: json
   // this user will be able to access the cluster
```

once this is done start creating your cluster using eksctl

```
 $ eksctl create cluster \
   --name first-kluster \
   --version 1.20 \
   --region ap-south-1 \
   --nodegroup-name linux-worker-nodes \
   --node-type t2.micro \
   --nodes 2
```

Alternatively, you can create a node group by running the following command

```
 # create public node group
 $ eksctl create nodegroup –cluster=first-kluster \
   --region=ap-south-1 \
   --name=node-group-name \
   --node-type=t2.micro \
   -–nodes=2 \
   -–nodes-min=2 \
   -–nodes-max=4 \
   -–node-volume-size=20 \
   -–ssh-access \
   -–ssh-public-key=ssh-key-pair-name \
   -–managed \
   -–asg-access \
   -–external-dns-access \
   -–full-ecr-access \
   -–appmesh-access \
   -–alb-ingress-access
 # List NodeGroups
 $ eksctl get nodegroup –cluster=<clusterName>

 # List Nodes
 $ kubectl get nodes -o wide

 # if fails to list nodes -
   export KUBECONFIG=$LOCATIONofKUBECONFIG/kubeconfig_myEKSCluster
   export AWS_DEFAULT_REGION=eu-west-2
   export AWS_DEFAULT_PROFILE=dev
 $ aws eks update-kubeconfig --name myEKSCluster --region=eu-west-2
 Added new context arn:aws:eks:eu-west-2:295XXXX62576:cluster/myEKSCluster to $PWD/kubeconfig_myEKSCluster
```

eksctl does provide an option to create a customized cluster using a yaml file

```
 apiVersion: eksctl.io/v1alpha5
 kind: ClusterConfig

 metadata:
   name: first-kluster
   region: ap-south-1

 nodeGroups:
   - name: linux-worker-nodes-1
     instanceType: t2.micro
     desiredCapacity: 5
   - name: linux-worker-nodes-2
     instanceType: m5.large
     desiredCapacity: 2
 $ eksctl create cluster -f cluster.yaml    
```

this will automatically create and assign VPC/subnet

![](/blog/blog-images/net-f46bbc93a48d.png)

once this is done you will be able to see your cluster in AWS console and same time can see its nodes in CLI using kubectl get nodes

![](/blog/blog-images/klus-86c04a727eff.png)

![](/blog/blog-images/nodes-8c46d2f00df1.png)

once the cluster is created you will be able to find its credential file under `~/.kube/config` which further can be used with different tools and products for integration and monitoring purpose of your kluster

```
  # In-order to delete a cluster
  $ eksctl delete cluster --name first-kluster
```

\--
