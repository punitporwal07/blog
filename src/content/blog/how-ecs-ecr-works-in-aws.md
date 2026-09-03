---
title: "How ECS & ECR works in AWS"
description: "Elastic Container Service is a container orchestration service provided by AWS that will provision and manage your cluster of containers on your behalf. It comprises all the services that you need to "
pubDate: 2021-02-03T01:25:00.013-08:00
updatedDate: 2022-12-10T14:33:41.952-08:00
tags:
  - "AWS"
  - "ecr"
originalUrl: "https://cloudnetes.blogspot.com/2021/06/how-ecs-ecr-works-in-aws.html"
---

![](/blog/blog-images/stack-e990c9980f28.png)

Elastic Container Service is a container orchestration service provided by AWS that will provision and manage your cluster of containers on your behalf. It comprises all the services that you need to manage services. Control Plane is one of them that allows you to schedule and orchestrate your containers.

Secondly, you have worker nodes where your application containers actually run and these worker nodes are nothing but your EC2 or Fargate instances which has Docker/container runtime & ECS agent installed in it which is connected to ECS.

So in ECS, you are deligating the complex task of managing and orchestrating containers to a service that will take care of your cluster but you do need to do the following task in order to use it

-   Create EC2 instances for worker nodes to host containers
-   Connect EC2 instances to ECS cluster
-   Check whether you have enough resources like CPU/ram in EC2-I's to host new containers
-   You are required to manage the operating system
-   Each worker nodes should have a container runtime & ECS agent installed

this way you are deligating all the complex task of managing containers to an AWS service however you are still required to manage your infrastructure used during it.

**EC2 & Fargate**

what if you want to delegate your infrastructure of AWS as well used during ECS

i.e. management of container orchestration by AWS using ECS

&   management of hosting infrastructure also by AWS using **FARGATE**

Basically, it is an alternative of creating any EC2 instances and connecting them to the ECS cluster instead, you use the fargate interface that will spin up all the required VM to host our containers.

Fargate is a serverless way to launch containers, here we feed AWS fargate about our container and then its fargete job to spin up the most suitable VM after analyzing our container at various aspects like network, storage, RAM & other resource requirements, and provision a server to host this container and do the same every time you introduce it with a new container.
By using the fargate in place of launching EC2-I's manually you have the advantage of not worrying about creating separate EC2 instances and managing their lifecycle that way you will have the exact infrastructure resources needed to run your containers i.e. _pay_ only for _what you use._

ECS or fargate both have the capability to connect to other AWS resources like

-   cloudwatch for monitoring.
-   ELB for load balancing. 
-   IAM for users and permissions.
-   VPC for networking etc.

AWS does provide the flexibility to use a combination of both EC2 & fargate at the same time.

**What is ECR**

ECR stands for Elastic Container Registry, which is similar to any other container repository that stores and manages docker images like dockerHub, Nexus, Harbor, etc.

**start setting up with your EC2 instance along with the Docker image**

```
 launch an EC2 instance and do the following
 $ sudo yum update -y
 $ sudo amazon-linux-extras install docker
 $ sudo service docker start
 $ sudo usermod -a -G docker ec2-user
 $ docker info
 if it gives an error :
 Server:ERROR: Cannot connect to the Docker daemon at unix:///var/run/docker.sock.
 Is the docker daemon running?

 try rebooting your instance

 if the error continues, check the status
 $ sudo systemctl status docker // if the status is inactive dead
 $ sudo systemctl start docker

 if still persist, do the following
 $ sudo gpasswd -a ec2-user docker
 // or manually add ec2-user to docker group in /etc/group file
 and restart session error will go away and you are good to run docker commands

 Pick any Dockerfile of your choice and start creating an image out of it
 $ vi Dockerfile
 $ docker build -t ecrtest:1.0 .   // this will create an image from your Dockerfile
 $ docker run -d 80:80 ecrtest:1.0 // make sure your security group is updated with port 80
```

**getting started with ECR** ([aws-doc](https://docs.aws.amazon.com/AmazonECR/latest/userguide/getting-started-cli.html))

```
 Now login to ECR by following the below command
 $ aws ecr get-login-password --region ap-south-1 \
 | docker login --username AWS --password-stdin 2827**735.dkr.ecr.ap-south-1.aws.com
 // here highlighted in green is your ECR-repository URL

 if you get an error you need to configure your AWS credentials by running
 $ aws configure
 once you able to connect successfully using the above command
 create a repository and try pushing the image we just created
 $ aws ecr create-repository \
    --repository-name myrepo \
    --image-scanning-configuration scanOnPush=true \
    --region ap-south-1
 $ docker tag <imagetag> ecr-repositoryURL/apache:1.0
 $ docker push repositoryURL/apache:1.0
```

you should be able to **see your image** pushed into your container repository now

Once your image is available **grab Image URI** which will be used in ECS when we create a task definition to deploy this as a container.

Considering your **ECS cluster is already up and running** if not you can follow the steps [here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create_cluster.html), it is straightforward to spin up one.

Next, you need to **create a task definition** from your ECS cluster either using FARGATE/EC2 or can attach an EXTERNAL instance type, so that when you run a task it will use this definition that will further be used to host your container fetching from ECR, and that's where you provide your image URI. 

_Remember: launch type of task should be the same as the type of your task definition_

_

![](/blog/blog-images/avvxseicu7opfcycyync8w-qlfcdsfcdrufogs7z-8c73c1d33d0c.png)

_

follow the [aws-doc](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-task-definition.html) to create a task definition. It's moderately easy to create one.

after the task is created & deployed you need to run it, on running the task it will deploy the container on EC2 instance linked with your ECS if the launch type is used as EC2, using an image from your ECR and you should be able to see your container up and running under task section.

Perhaps if launch type is used as FARGATE it will deploy your container to AWS-managed infrastructure, where no Amazon EC2 instances are involved and uses awsvpc as network mode. You should be able to see your container up and running the same way under the task section.

**Few things to remember**

-   You use/configure a **Service** when you want to introduce an **Application Load Balancer** for your containerized app in ECS Fargate. Here service will create task's for you and you can access them using the DNS name generated by your LB.

-   When you start an ECS optimized image, it starts the _ECS agent on the instance by default._ The ecs agent registers the instance with the default ecs cluster.
-   For your instance to be available on the cluster, you will have to create the default cluster.
-   if you have a custom ecs cluster, you can set the cluster name using the userdata section.
-   The ecs agent expects the cluster name inside the ecs.config file available at  `~/etc/ecs/ecs.config`  

```
 You can set it up at instance boot up using userdata script.
 #!/bin/bash
 echo ECS_CLUSTER={cluster_name} >> /etc/ecs/ecs.config
```
