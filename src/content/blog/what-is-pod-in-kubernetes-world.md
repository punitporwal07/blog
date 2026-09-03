---
title: "What is a Pod in Kubernetes world"
description: "PODs are mortal & are the smallest unit of deployment in K8s."
pubDate: 2020-11-17T23:46:00.225-08:00
updatedDate: 2023-06-30T07:09:04.686-07:00
tags:
  - "Pod"
originalUrl: "https://cloudnetes.blogspot.com/2020/11/what-is-pod-in-kubernetes-world.html"
---

**POD**s are mortal & are the smallest unit of deployment in K8s.

![](/blog/blog-images/pod-154dcbbf1722.png)

Each pod can host a different set of containers. The proxy is then used to control the exposure of these services to the outside world. They are created by deployments,  replicasets, or statefulsets. Whenever a pod runs it calls a container image from the registry(if not available locally) and deploys its container within itself. It can have more than one container.![](/blog/blog-images/pods-8255372216b5.png)

-   each Pod has only 1 IP, irrespective of the number of containers.
-   all containers in a Pod shares IP, cgroups, namespaces, localhost adapter, volumes
-   every pod can interact directly with another pod via Pod N/W (Inter-Pod communication)

there are two types of communication in pods

-   Inter-pod
-   Intra-pod - every container in a pod can interact with each other via a shared localhost interface

![](/blog/blog-images/interpod-37206e18bbed.png)                               ![](/blog/blog-images/intrapod-36789a3a517a.png)

![](/blog/blog-images/pod-lifecycle-80933de7f057.png)

**

lets see how a pod manifest file look like to run in a cluster pod.yaml**

```
---apiVersion: v1
kind: Pod
metadata:
  name: myapp
  labels:
    zones: prod
    version: v1
spec:
  containers:
  - name: app-container
    image: punitporwal07/myapp:0.1
    ports:
    -  containerPort: 8000
...
```

`$ kubectl create -f pod.yaml`

`$ kubectl get pods $ kubectl describe pods (checks status)`
**NOTE: we don't work directly on pods**

![](/blog/blog-images/services-37c18633f80c.png)

so we use a replication controller to manage the container inside a pod, which implements the desired state
get your sample [replcationController.yml](https://github.com/punitporwal07/ingressController/blob/master/replicationController.yml)

Now big question is, how do we access our pods ? **Service** is the answer.

1\. accessing outside the cluster (Browser, client)
2\. accessing inside the cluster (How Pods interact with each other)
services nail both the above

every service gets a name and IP which are STABLE! which means name and this IP will never change throughout its life.
services are REST objects in K8s, service stands infront of Pod so that outside world can interact to Pods via service. service never changes means its IP, DNS, Ports are reliable, unlike Pods which are unreliable in nature.

Service use **Labels** to identify the **Pods** and do the things on them.

now since pods are mortal and they come and go, so how do service identify which pods are alive. so Its **Endpoint** which maintains the list of available pods dynamically and let service know about the active pods.

![](/blog/blog-images/label-1a10806162a1.png)

**accessing replication controller pod and exposing it to a different Port (create/get/describe)**

`$ kubectl create -f svc.yml$ kubectl get svc $ kubectl describe svc -myapp-svc`

`$ kubectl expose rc myapp-rc --name=myapp-svc --taget-port=8000 --type=NodePort` (this way it will expose the service hello-svc)

`$ kubectl` **describe** `svc myapp-svc` (describes the service with all its meaningful attributes like port, Namespace, labels etc.)

**K8S Deployments:**
Deployment is about updates and rollbacks this is the superset of replication controller and can access deployment via node pod service

**for example, deployment.yml may look like**

```
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: myapp-deployspec:  replicas: 5  template:    metadata:       labels:
        app: prod
    spec:
      containers:
      - name: myapp-container
        image: punitporwal07/myapp:0.1
        ports:
        -  containerPort: 8000
...
```

**at last be declarative!**

`$` `kubectl create -f <manifest.yaml>`

check in to source control > make changes to same file > apply change with 

`$ kubectl apply --record` 

![](/blog/blog-images/avvxseilyivhqumocsozrmhzsjitcha3bhokketp-2049a9e90d61.png)
