---
title: "RANCHER - A cluster management platform"
description: "Rancher is a 100% free and open-source software platform that enables the enterprise to run containers in production. It is a complete software stack for teams adopting containers. It has the capabili"
pubDate: 2020-03-16T04:37:00.027-07:00
updatedDate: 2021-08-05T07:05:00.008-07:00
tags:
  - "Rancher"
originalUrl: "https://cloudnetes.blogspot.com/2020/12/rancher-complete-container-management.html"
---

![](/blog/blog-images/rancher-a07e8d75acfb.png)

**R**ancher is a 100% free and open-source software platform that enables the enterprise to run containers in production. It is a complete software stack for teams adopting containers. It has the capability that it can import your k8s-cluster no matter from where it comes from. **It is a single cluster-multi tenancy tool.** It addresses the operational and security challenges of managing multiple k8s-clusters across any infrastructure while providing DevOps teams with integrated tools for running containerized workloads.

Resources like Istio, pipeline, Prometheus, Grafana are integrated with Rancher.

```
 Getting start with Rancher using Docker
 $ docker pull rancher/rancher
 $ docker run -d --restart=unless-stopped -p 61090:80 -p 61091:443 \
  -v /software/bea/rancher:/var/lib/rancher --privileged rancher/rancher:latest
```

access the Rancher console by hitting - https:localhost:61091/ 

follow the welcome instructions on the screen and it will land up to your Global screen of clusters.
once your setup is complete, start adding any of your k8s-cluster.

in this example, I am going to add my vanilla k8s-cluster which is running on-prem.

navigate to **Add-cluster** > **other cluster** > **give a name to your cluster** 

rancher will generate commands for you to import your cluster, which you need to run in your cluster CLI as below

**which will deploy required resources**

```
$ kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole cluster-admin --user [USER_ACCOUNT]
$ kubectl apply -f https://localhost:61091/v3/import/s8dkk7demo6fp2f6qffhmlkr.yaml

# if you get a certificate related error try running on insecure channel
$ curl --insecure -sfL https://localhost:61091/v3/import/s8dkk7demo6fp2f6qffhmlkr.yaml | \
  kubectl apply -f

# following resources will gets created
 clusterrole.rbac.authorization.k8s.io/proxy-clusterrole-kubeapiserver created
 clusterrolebinding.rbac.authorization.k8s.io/proxy-role-binding-kubernetes-master created
 namespace/cattle-system created
 serviceaccount/cattle created
 clusterrolebinding.rbac.authorization.k8s.io/cattle-admin-binding created
 secret/cattle-credentials-4c43de3 created
 clusterrole.rbac.authorization.k8s.io/cattle-admin created
 deployment.apps/cattle-cluster-agent created
```

**you will be able to see your cluster added into rancher now**

![](/blog/blog-images/cluster-01951526a100.jpg)

keep reading.. lot more to come...
