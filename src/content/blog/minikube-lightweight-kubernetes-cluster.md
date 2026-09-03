---
title: "Minikube - lightweight Kubernetes cluster"
description: "Launching Kubernetes as a single node cluster locally"
pubDate: 2021-03-29T14:42:00.007-07:00
updatedDate: 2023-08-30T03:45:41.144-07:00
tags:
  - "K8S"
  - "minikube"
originalUrl: "https://cloudnetes.blogspot.com/2021/03/minikube-lightweight-kubernetes-cluster.html"
---

![](/blog/blog-images/avvxsejj7foeksfqhpf7yemoplkp2r42m9wpwnsv-a24453f01e58.png)

 **Launching Kubernetes as a single node cluster locally
**

**Minikube** is the tool that allows you to launch K8S locally. Minikubes runs as a single-node-k8s-cluster inside a VM at your local, before you install kubectl do as below

```
 # Install minikube on Ubuntu
 # setup minikube using the script here -
   https://github.com/punitporwal07/minikube/blob/master/install-minikube-v2.sh
 # Install minikube on Linux
 # use this script to launch k8s-cluster on local and interact with Minikube install-minikube.sh
 $ git clone https://github.com/punitporwal07/minikube.git
 $ cd minikube
 $ chmod +x install-minikube.sh
 Now add your localuser as sudo-user, with root do the following -
 $ vi /etc/sudoers
   next to root ALL=(ALL) add as below for your user
   localuser ALL=(ALL) NOPASSWD:ALL
 $ su - localuser
 $ ./install-minikube.sh
```

![](/blog/blog-images/minikubeinstall-0f5ae8df5091.png)

**

`basic minikube command`

| Function | Command |
| --- | --- |
| verify kubectl to talk to the cluster | kubectl config current-context ( should return minikube) |
| to start/stop cluster with resources | minikube start/stop minikube start --cpus 6 --memory 8192 |
| to delete note | minikube delete |
| start version-specific Kube node | minikube start --vm-driver=none --kubernetes-version="v1.20.0" |
| check node info | kubectl get nodes |
| kubernetes cluster-info | kubectl cluster-info |
| kubectl binary for Windows | kubectl.exe |
| minikube 64-bit installer | minikube-installer.exe |

**
