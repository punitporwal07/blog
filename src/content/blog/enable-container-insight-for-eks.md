---
title: "Enable container insight for EKS-Fargate in cloudwatch"
description: "In this article, we will demonstrate on how to implement Container Insights metrics using an (AWS Distro for OpenTelemetry) ADOT collector on an EKS Fargate cluster to visualize your cluster & contain"
pubDate: 2023-01-28T11:42:00.041-08:00
updatedDate: 2023-07-02T07:08:53.264-07:00
tags:
  - "AWS"
  - "cloudwatch"
  - "fargate"
  - "K8S"
originalUrl: "https://cloudnetes.blogspot.com/2023/01/enable-container-insight-for-eks.html"
---

![](/blog/blog-images/avvxseir3zsza1uh72cfvxcjoii74fnon1ofaaep-09c50c94193f.png)

In this article, we will demonstrate on how to implement Container Insights metrics using an (AWS Distro for OpenTelemetry) ADOT collector on an EKS Fargate cluster to visualize your cluster & container data at every layer of the performance stack in Amazon Cloudwatch. Presuming you have an EKS-Cluster with a fargate profile already up and running, if not follow the [**article**](http://www.cloudnetes.blogspot.com/2021/03/eks-with-fargate-profile.html) to setup one. then it involves only the following things to achieve it -

\- adot IAM service account

\- adot-collector

\- fargate profile for adot-collector

![](/blog/blog-images/avvxsejvoq6ldykjhu-o5woru2ltkirahv02r9vs-a48f7ee868dc.png)

## **Create adot iamserviceaccount** 

```
eksctl create iamserviceaccount \
--cluster btcluster \
--region eu-west-2 \
--namespace fargate-container-insights \
--name adot-collector \
--attach-policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy \
--override-existing-serviceaccounts \
--approve
```

in-case of deleting iamserviceacount

```
eksctl delete iamserviceaccount --cluster btcluster --name adot-collector -n fargate-container-insights
```

## Deploy Adot-collector

```
wget https://github.com/punitporwal07/kubernetes/blob/master/monitoring/cloudwatch-insight/eks-fargate-container-insights.yaml

kubectl apply -f eks-fargate-container-insights.yaml
```

![](/blog/blog-images/avvxseho2vejn-f7zu85iifxe1cja5ebcmwhcnd--bf82cf1b54d9.png)

## **Create compute fargate profile for the adot-collector pod that comes with statefulset
**

`eksctl create fargateprofile --name adot-collector --cluster btcluster -n fargate-container-insights` 

**Navigate to AWS cloudwatch**

services > cloudWatch > logs > log groups & search for **insight** 

![](/blog/blog-images/avvxsejyhyf5pr44didxwm5gvallpzqhd9onwxmb-5e8a94675ca1.png)

services > cloudWatch > insights > Container insights > **resources**

![](/blog/blog-images/avvxseg0vysvseku-adqvpqduej5uvla-soltlrp-3af8046bf88e.png)

services > cloudWatch > insights > Container insights > **container map**

![](/blog/blog-images/avvxseh8dait5qaunnt-tfwp1m8cb0y1zgfh81ik-e635fd9b1e80.png)

**Some helpful commands**

```
to scale down statefulset -

kubectl -n fargate-container-insights patch statefulset.apps/adot-collector -p '{"spec": {"template": {"spec": {"nodeSelector": {"non-existing": "true"}}}}}'

to scale up statefulset -

kubectl -n fargate-container-insights patch statefulset.apps/adot-collector --type json -p='[{"op": "remove", "path": "/spec/template/spec/nodeSelector/non-existing"}]'
```

ref - [https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-container-insights-eks-fargate/](https://aws.amazon.com/premiumsupport/knowledge-center/cloudwatch-container-insights-eks-fargate/)
