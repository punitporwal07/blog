---
title: "EKS with Fargate Profile"
description: "Getting started with Amazon EKS is easy:"
pubDate: 2021-03-20T07:41:00.410-07:00
updatedDate: 2023-11-07T07:24:26.376-08:00
tags:
  - "AWS"
  - "eks"
  - "fargate"
originalUrl: "https://cloudnetes.blogspot.com/2021/03/eks-with-fargate-profile.html"
---

Getting started with Amazon EKS is easy:

![](/blog/blog-images/fargate-d17e279f5c50.png)

1\. Create an Amazon EKS cluster in the AWS Management Console or with the AWS CLI or one of the AWS SDKs.

2\. Launch managed or self-managed Amazon EC2 nodes, or **deploy your workloads to AWS Fargate** (is what we are doing in this article).

3\. When your cluster is ready, you can configure your favorite Kubernetes tools, such as kubectl, to communicate with your k8s-cluster.

4\. Deploy and manage workloads on your Amazon EKS cluster the same way that you would do with any other Kubernetes environment. You can also view information about your workloads using the AWS Management Console.

5\. Here we are going to use eksctl utility that will help you to create your cluster using AWS **cloud-shell**, or you can do same using **Bastion host.**

**NOTE \-**  **When configuring the** **aws** **shell, be sure that the user whose Access and Security key you will configure must have admin access role attached to it so that it can define and describe resources.** Else you might endup getting errors like -

`Error: operation error EC2: DescribeSubnets, https response error StatusCode: 403, RequestID: 310f662c-799c-4c78-99ff-dec773557025, api error UnauthorizedOperation: You are not authorized to perform this operation.`

ex of devops user -

![](/blog/blog-images/avvxseh2pqfonh-cccwukr4-jcirro2sfutqexnk-4501dacfc726.png)

To create your first cluster For the fargate profile in EKS, you are required to have the following things in place

OIDC provider
IAM roles
IAMServiceAccount
Addons - (VPC-CNI, CoreDNS, kube-proxy)
ALB-Controller
Fargate Compute Profile

for more details consider referring to AWS documentation - - [https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)

![](/blog/blog-images/avvxsejay9maiqw9woxmcudhkwebgyqzyoslziyl-9dd363aeb72e.png)

**To begin with, we will start with the eksctl & kubectl installation**

```
 curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C sudo cp -rp eksctl /usr/local/bin
 OR
 wget https://github.com/eksctl-io/eksctl/releases/download/v0.162.0/eksctl_Linux_amd64.tar.gz 
 tar -xpf eksctl_Linux_amd64.tar.gz && cp -rp eksctl /usr/local/bin
 curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.23.6/bin/linux/amd64/kubectl
 sudo chmod +x kubectl &&  sudo cp -rp kubectl /usr/local/bin
```

**Cluster creation using eksctl, if doing from shell following command will work** 

```
 # with EC2 as underline compute (nodeGroup)

 Simpletest form -
 eksctl create cluster --name ekscluster --region region-code

 Complex form with nodeGroup -
 eksctl create cluster \ --name ekscluster \ --region eu-west-2 \ --vpc-private-subnets subnet-0b10bDEMOfbdd235,subnet-0d9876DEMOa41fba,subnet-0b1168dDEMO1e66a2 \ --version 1.27 \ --nodegroup-name standard-eks-workers \ --node-type t2.small \ --nodes 2 --nodes-min 1 --nodes-max 2 \ --ssh-access=true \ --ssh-public-key=devops-kp 
 without nodeGroup - (preferred method & add NodeGroup once Kluster is up)
 eksctl create cluster \
 --name ekscluster \
 --region eu-west-2 \
 --vpc-private-subnets subnet-0b10bDEMOfbdd235,subnet-0d987DEMO1a41fba,subnet-0b1168dDEMO1e66a2 \
 --version 1.27 \
 --without-nodegroup
 # with fargate profile as underline compute    
 Simpletest form -
 eksctl create cluster --name ekscluster --region region-code --fargate
 Complex form -
 eksctl create cluster \
 --name eksCluster \
 --region eu-west-2 \
 --version 1.27 \
 --vpc-private-subnets subnet-0b10be78a0fbdd235,subnet-0d9876a68e1a41fba,subnet-0b1168d86d71e66a2
 
 update following values
 # cluster name
 # region code
 # subnets (private)
```

**if doing from Bastion host you need to authorise instance to perform this operation -**
(create an [IAM policy](https://gist.githubusercontent.com/punitporwal07/030bddeb026ecfb1a5b08d1dfe3e3e93/raw/5453041145119be509a5d09531d08124c1266249/gistfile1.txt) to create eks cluster using eksctl (optional))

**Accessing  your cluster**

on Bastion host do the following -

```
 # export necessary varibles as below & set cluster context

 $ export KUBECONFIG=~/.kube/config/kubeconfig_eksCluster $ export AWS_DEFAULT_REGION=eu-west-2
 $ export AWS_DEFAULT_PROFILE=dev

 $ aws eks update-kubeconfig --name eksCluster --region=eu-west-2 Added new context arn:aws:eks:eu-west-2:295XXXX62576:cluster/eksCluster to $PWD/kubeconfig_eksCluster
 $ kubectl cluster-info
 Kubernetes control plane is running at https://01C5E459355DEMOFDC1E8FB6CA7.gr7.eu-west-2.eks.amazonaws.com
CoreDNS is running at https://01C5E459355DEMOFDC1E8FB6CA7.gr7.eu-west-2.eks.amazonaws.com/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

![](/blog/blog-images/avvxsejvtotegtihgjzyluqwgm-puoyh4yy3mn8d-e246eb5e9dd5.png)with EC2 instance in nodeGroup

**Add networking add-ons via GUI, consider looking at next point before adding them -**

1\. **coredns** \- DNS server used for service-discovery
2\. **vpc-cni**  -  networking plugin for pod networking
3\. kube-proxy - It maintains network rules on your nodes and enables network communication to your pods. (only applicable when using EC2 in node group)

\---> **Add coredns compute profile via CLI ( if working with Fargate)**_for coredns, you are required to create a Fargate profile of coredns under compute tab in the kube-system namespace, or via CLI as below -_

```
 eksctl create fargateprofile --name coredns --cluster eksCluster --namespace kube-system
```

`update the value for # cluster name`

**Optional (if there is any issue with addons try to patch the deployment, usually coredns goes into Degraded mode)**

Ex - for **coredns** deployment

```
 kubectl patch deployment coredns -n kube-system --type json \
-p='[{"op": "remove", "path": "/spec/template/metadata/annotations/eks.amazonaws.com~1compute-type"}]'

 kubectl rollout restart -n kube-system deployment coredns
```

**NOTE-** if addon \[coredns\] remains in a **degraded** state, delete the coredns replicaset with 0 desired value & associated pods so that it will look for fargate compute next time when it deploys new pods instead on EC2 compute(by default it attempts to deploy on EC2)

```
 kubectl scale deployment/coredns --replicas=0 -n kube-system
 kubectl scale deployment/coredns --replicas=3 -n kube-system
```

**Setup IAM Policy**

```
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.4/docs/install/iam_policy.json

aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
```

**Create IAM Role with the below policies attached that we use for the Fargate profile & update the trust relationship**

![](/blog/blog-images/avvxsejugplita3clzdg6ebjwq6pqfhpgbkg-9fz-d46047f6ad65.png)

\# TRUST RELATIONSHIP SHOULD BE UPDATED AS BELOW

{

    "Version": "2012-10-17",

    "Statement": \[

        {

            "Effect": "Allow",

            "Principal": {

                "Service": "eks-fargate-pods.amazonaws.com"

            },

            "Action": "sts:AssumeRole",

            "Condition": {

                "ArnLike": {

                    "aws:SourceArn": "arn:aws:eks:eu-west-2:481xxxx1953:fargateprofile/**MyEKSCluster**/\*"

                }

            }

        }

    \]

}

**Associate IAM OIDC provider  with your cluster

**

```
 oidc_id=$(aws eks describe-cluster --name eksCluster --query "cluster.identity.oidc.issuer" \
 --output text | cut -d '/' -f 5)

 aws iam list-open-id-connect-providers | grep $oidc_id | cut -d "/" -f4

 eksctl utils associate-iam-oidc-provider --cluster eksCluster --approve
 2022-10-26 12:46:52 [ℹ]  will create IAM Open ID Connect provider for cluster "eksCluster" in "eu-west-2"
 2022-10-26 12:46:52 [✔]  created IAM Open ID Connect provider for cluster "eksCluster" in "eu-west-2"
```

**Create IAM ServiceAccount**

```
eksctl create iamserviceaccount \
--cluster eksCluster \
--region eu-west-2 \
--namespace kube-system \
--name aws-load-balancer-controller \
--attach-policy-arn arn:aws:iam::4812xxxx1953:policy/AWSLoadBalancerControllerIAMPolicy \
--override-existing-serviceaccounts \
--approve
2022-10-26 12:50:33 [ℹ]  1 iamserviceaccount (kube-system/aws-load-balancer-controller) was included (based on the include/exclude rules)
2022-10-26 12:50:33 [!]  metadata of serviceaccounts that exist in Kubernetes will be updated, as --override-existing-serviceaccounts was set
2022-10-26 12:50:33 [ℹ]  1 task: {
    2 sequential sub-tasks: {
        create IAM role for serviceaccount "kube-system/aws-load-balancer-controller",
        create serviceaccount "kube-system/aws-load-balancer-controller",
    } }2023-10-26 12:50:33 [ℹ]  building iamserviceaccount stack "eksctl-eksCluster-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-26 12:50:33 [ℹ]  deploying stack "eksctl-eksCluster-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-26 12:50:33 [ℹ]  waiting for CloudFormation stack "eksctl-eksCluster-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-26 12:51:04 [ℹ]  waiting for CloudFormation stack "eksctl-eksCluster-addon-iamserviceaccount-kube-system-aws-load-balancer-controller"
2022-10-26 12:51:04 [ℹ]  created serviceaccount "kube-system/aws-load-balancer-controller"
```

`update following values`

`# cluster name# region name# caller identity`

**Install & Setup Helm** for aws-lb-controller

```
 wget https://get.helm.sh/helm-v3.10.3-linux-amd64.tar.gz
 tar -xzpf helm-v3.0.0-linux-amd64.tar.gz
 sudo cp -rp linux-amd64/helm /usr/local/bin/

 helm repo add eks https://aws.github.io/eks-charts
 helm repo update
```

**Deploy aws-load-balancer-controller**

```
 helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system \
 --set clusterName=eksCluster \
 --set serviceAccount.create=false \
 --set serviceAccount.name=aws-load-balancer-controller \
 --set image.repository=602401143452.dkr.ecr.eu-west-2.amazonaws.com/amazon/aws-load-balancer-controller \
 --set region=eu-west-2 \
 --set vpcId=vpc-0d417VPC-ID7694dd7
```

`update following values`

`# cluster name# region name# repository name# vpc-ID`

![](/blog/blog-images/controller-76ae7126e14c.png)

**

# **Deploy compute for your app i.e. FARGATE PROFILE**

```
 eksctl create fargateprofile --name sampleapp-ns --namespace sampleapp-ns --cluster eksCluster
```

`Deploy your application`

**

 **```
 kubectl create deployment sampleapp --image=punitporwal07/sampleapp:3.0 -n sampleapp-ns
```**

\[deploy all the resources of my sampleapp from here \- [full-sampleapp-for-eks-fargate.yaml](https://gist.githubusercontent.com/punitporwal07/17e04a7c60ab7e1a9573ed7ada7daef8/raw/6a2062f83909252d77f36e93049ab9c2ded54a0b/full-sampleapp-for-eks-fargate.yaml) \]

# **Deploy Ingress which will do rest of the magic**

![](/blog/blog-images/avvxseg9rtjg9os4azqk7mbzlfahwxoevhcckvb8-18091120ac1e.png)

\# INGRESS RESOURCE/ROUTE THAT WILL BE DEPLOYED AS APP LOAD-BALANCER IN AWS ---

apiVersion: networking.k8s.io/v1

kind: Ingress

metadata:

  namespace: sampleapp-ns

  name: sampleapp-ing

  annotations:

    alb.ingress.kubernetes.io/scheme: internet-facing

    alb.ingress.kubernetes.io/target-type: ip

spec:

  ingressClassName: alb

  rules:

    - http:

        paths:

        - path: /

          pathType: Prefix

          backend:

            service:

              name: sampleapp-svc

              port:

                number: 80

![](/blog/blog-images/ing-6f78683ac8d0.png)

Ingress works with clusterIP service type as well however, to make it private deploy an NLB as a LoadBalancer service type. 

![](/blog/blog-images/svc-lb-783c727a527e.png)

test your application by hitting the DNS of the **Application Load Balancer,** to test NLB test it from/within your VPC instance.

**![](/blog/blog-images/alb-test-ccc1bfe3e827.png)**

**Some helpful commands during the setup** 

**To delete resources** 

```
 helm delete aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system
 eksctl delete iamserviceaccount --cluster eksCluster --name aws-load-balancer-controller --namespace kube-system // when using CLI options, the --namespace option defaults to default, so if the service account was created in a different namespace, the filter would fail to match and, as a result, the deletion would not proceed.

 eksctl delete fargateprofile --name coredns --cluster eksCluster
 eksctl delete cluster --name eksCluster --region eu-west-2
```

**Scale down your deployments to save some cost

```
 kubectl scale deploy --replicas=0 aws-load-balancer-controller -n kube-system
 kubectl scale deploy --replicas=0 coredns -n kube-system 
 kubectl scale deploy --replicas 0 --all -n namespace
```

**

**Switch your cluster context in aws cloud-shell**

```
 aws eks update-kubeconfig --region eu-west-2 --name eksCluster
```

**To decode encoded error message**

`aws sts decode-authorization-message --encoded-message "message"`

# **
Known Issues

**

**Issue 1 - When you Add a nodeGroup with Private-Subnet, you might get an error -**

NodeCreationFailure

**Fix** - Your launched instances are unable to register with your Amazon EKS cluster. Common causes of this failure are **insufficient [node IAM role](https://docs.aws.amazon.com/eks/latest/userguide/create-node-role.html) permissions.**
or **lack of outbound internet access for the nodes**. Your nodes must meet either of the following requirements:

Able to access the internet using a public IP address. ( Your private subnet should have Nat-G/w associated to it)
The security group associated to the subnet the node is in must allow the communication. 

**Issue 2 - Resolve the single subnet discovery error**

![](/blog/blog-images/subnet-discover-error-fb2ab351ec17.png)

**Fix -** Add the appropriate tags on your subnets to allow the AWS Load Balancer Ingress Controller to create a load balancer using auto-discovery.

for public load balancer \[**public subnet**\] define in at least 2:

```
  Key                                                                                                    Value
 kubernetes.io/role/elb                      1
 kubernetes.io/cluster/your-cluster-name     shared or owned

  for [private subnets] tags:

  Key                                                                                                    Value
 kubernetes.io/role/elb                      1 or empty tag value for internet-facing load balancers
 kubernetes.io/role/internal-elb             1 or empty tag value for internal load balancers

  Note: You can manually assign subnets to your load balancer using the annotation -

 alb.ingress.kubernetes.io/subnets: subnet-1xxxxx, subnet-2xxxxx, subnet-3xxxxx
```

however, it is advisable that EKS discovers the subnet automatically so tagging the subnet with the cluster is the better approach if you are hitting the BUG, which usually occurs when -

Any of the following is true:
\- You have multiple clusters that are running in the same VPC. use **shared** value on your next cluster.
\- You have multiple AWS services that share subnets in a VPC.
\- You want more control over where load balancers are provisioned for each cluster.

**Issue 3 - Resolve nodes are not available**

0/2 nodes are available: 2 Too many pods, 2 node(s) had untolerated taint {eks.amazonaws.com/compute-type: fargate}.
preemption: 0/2 nodes are available: 2 Preemption is not helpful for scheduling.

![](/blog/blog-images/avvxsehtzzozclr-mjmzvkumhdvnsgzfu7gljpls-bb0d7022fe9d.png)

**Fix -** Add compute profile so that - aws-lb-controller pods can be scheduled on it,  and then delete the pending pods

```
 eksctl create fargateprofile --name aws-lb --cluster eksCluster --namespace kube-system
```

![](/blog/blog-images/avvxsehhuunbn0hah8vt39htheuck7mfjz2cyaqs-91657baba7a0.png)

![](/blog/blog-images/avvxsegejogdrulvkhi1-pfio5ishtchkczpumwe-e3038699cb23.png)

![](/blog/blog-images/avvxseixnr-wohr-qlwrnalvs4fzhkclnm67ajhr-5aaa852e58a2.png)

from the above, you can see the alb-controller is using aws-lb compute profile that we created and started its pod on it.
