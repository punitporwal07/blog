---
title: "Debugging your kubernetes cluster"
description: "Whether you are a developer or an operations person, Kubernetes is an integral part of your daily routine if you are working with a microservice architecture. Therefore, it is always preferable to per"
pubDate: 2018-02-28T00:54:00.094-08:00
updatedDate: 2023-06-29T08:10:58.541-07:00
tags:
  - "K8S"
  - "Kubernetes"
originalUrl: "https://cloudnetes.blogspot.com/2018/02/debugging-your-kubernetes-cluster.html"
---

![](/blog/blog-images/debug-a423e4a681c6.png)

Whether you are a developer or an operations person, Kubernetes is an integral part of your daily routine if you are working with a microservice architecture. Therefore, it is always preferable to perform all your research and development on a test cluster before implementing it in an enterprise environment.

if you have not experienced setting up your own cluster yet, here is an **article** that will walk you through the process of **launching your own k8s-cluster** in different fashions.    [![](/blog/blog-images/k8s-5ec4298ecba4.png)](https://cloudnetes.blogspot.com/2018/02/launching-kubernetes-cluster-different.html)

there are possible failures one can encounter in their k8s cluster so here is the basic approach one can follow to debug into failures.

 **1. if a node is going into notReady state as below**

```
 $ kubectl get nodes
   NAME          STATUS   ROLES    AGE    VERSION
   controlPlane  Ready    master   192d   v1.12.10+1.0.15.el7
   worker1       Ready    <none>   192d   v1.12.10+1.0.14.el7
   worker2       NotReady <none>   192d   v1.12.10+1.0.14.el7
 # check if any of your cluster component is un-healthy or failed
 $ kubectl get pods -n kube-system
   NAME                                  READY   STATUS    RESTARTS   AGE
 calico-kube-controllers-bc8f7d57-p5vhk  1/1     Running   1          192d
 calico-node-9xtfr                       1/1     NodeLost  1          192d
 calico-node-tpjz9                       1/1     Running   1          192d
 calico-node-vh766                       1/1     Running   1          192d
 coredns-bb49df795-9fn9g                 1/1     Running   1          192d
 coredns-bb49df795-qq6cm                 1/1     Running   1          192d
 etcd-bld09758002                        1/1     Running   1          192d
 kube-apiserver-bld09758002              1/1     Running   1          192d
 kube-controller-manager-bld09758002     1/1     Running   1          192d
 kube-proxy-57n8h                        1/1     NodeLost  1          192d
 kube-proxy-gvbkh                        1/1     Running   1          192d
 kube-proxy-tzknm                        1/1     Running   1          192d
 kube-scheduler-bld09758002              1/1     Running   1          192d
 # describe node to check what is causing issue
 $ kubectl describe node nodeName
 # ssh to node and ensure kubelet/docker services are running
 $ sudo systemctl status kubelet
 $ sudo systemctl status docker
 # troubleshoot services if not-running in depth
 $ sudo journalctl -u kubelet
 # if services are getting failed frequently try to reset daemon
 $ sudo systemctl daemon-reload
 Things to remember - In kube-system namespace for every cluster
 kube-apiserver  1pod/Master
 kube-controller 1pod/Master
 kube-scheduler  1pod/Master
 etcd-node       1pod/Master
 core-dns - 2 pods/cluster and can be anywhere M/W

 calico/Network 1 pod/node every M/W (enable n/wing b/w pods)
 kube-proxy 1 pod/node every M/W (enable n/wing b/w nodes)
```

# `Some common failures`

 ```
 # If fails with
   [ERROR CRI]: container runtime is not running:
   rm /etc/containerd/config.toml
   systemctl restart containerd
 # If kubelet service fails at -
   Active: activating (auto-restart) (Result: exit-code) since Wed 2019-06-28 1
   first check "sudo journalctl -xeu kubelet" logs, if it says -
            failed to load kubelet config file
   check the Drop-in file which kubelet is loading while activating the service
   $ sudo systemctl status kubelet
   if it is not loading - /etc/systemd/system/kubelet.service.d then correct it,
   or remove anyother file that it is attempting to load & reload the daemon and restart service.

   $ systemctl daemon-reload
   $ systemctl restart kubelet
  also ensure kubelet, kubeadm, kubernetes-cni, kubernetes-cni-plugins & kubectl are of same minor version
 # If fails with
   lower docker version update docker:
   docker.io (used for older versions 1.10.x)
   docker-engine (is used for before 1.13.x )
   docker-ce ( used for higher version since 17.03)
 $ apt-get install docker-engine
 # If fails with
   Unable to connect to the server: net/http:
   request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
 $ kubectl version // check kubectl client and server version - they shouldn't mismatch

 # if fails with
   [WARNING Service-Kubelet]: kubelet service is not enabled,
   please run 'systemctl enable kubelet.service'
 $ systemctl enable kubelet.service

 # If fails with
   [ERROR Swap]: running with swap on is not supported. Please disable swap.
 $ swapoff -a
 $ sed -i '/ swap / s/^/#/' /etc/fstab

 # if fails with
   [ERROR NumCPU]: the number of available CPUs 1 is less than the required 2
   use command with flag --ignore-preflight-errors=NumCPU
   this will actually skip the issue. Please note, this is OK to use in Dev/test perhaps not in production.

 # Run again
 $ kubeadm init --apiserver-advertise-address=MasterIP \
   --pod-network-cidr=192.168.0.0/16 \
   --ignore-preflight-errors=NumCPU
 # if getting error
   The connection to the server localhost:8080 was refused - did you specify the right host or port?
   or on running 'kubectl version' it only gives client version but above error on server version
   if there is no context configured in your client you get such error
 $ kubectl config view
   apiVersion: v1
   clusters: []
   contexts: []
   current-context: ""
   kind: Config
   preferences: {}
   users: []
   you might have forgot to run below commands
 $ mkdir -p $HOME/.kube
 $ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
 $ sudo chown $(id -u):$(id -g) $HOME/.kube/config
 # Make a note - to keep the k8s-cluster functional, following containers should be up & running all the time
 - kube-controller-manager > kube-scheduler > kube-etcd > kube-apiserver > kube-proxy + n/w containers (flannel/calico)
 # Some magic commands -
   systemctl stop kubelet
   systemctl stop docker
   iptables --flush
   iptables -tnat --flush
   systemctl start kubelet
   systemctl start docker
   journalctl -xeu kubelet | less
 # Also, ensure following ports are open on masterNode -
   sudo firewall-cmd --permanent --add-port=6443/tcp
   sudo firewall-cmd --permanent --add-port=2379-2380/tcp
   sudo firewall-cmd --permanent --add-port=10250/tcp
   sudo firewall-cmd --permanent --add-port=10251/tcp
   sudo firewall-cmd --permanent --add-port=10252/tcp
   sudo firewall-cmd --permanent --add-port=10255/tcp
   sudo firewall-cmd –reload
   Ensure following ports are open on workerNode -
   sudo firewall-cmd --permanent --add-port=10251/tcp
   sudo firewall-cmd --permanent --add-port=10255/tcp
   firewall-cmd --reload
 # to check if the bridge traffic is flowing through the firewall? should return 1

   cat /proc/sys/net/bridge/bridge-nf-call-iptables
   cat /proc/sys/net/bridge/bridge-nf-call-ip6tables
 # if namespace stuck in terminating state
   kubectl get ns mynamespace -o json > ns.json

   edit the ns.json file & empty the finalizer [""] and remove the kubernetes from it. even remove " "

   kubectl proxy

   open another terminal and run below command

   curl -k -H "Content-Type: application/json" -X PUT --data-binary @ns.json http://127.0.0.1:8001/api/v1/namespaces/mynamespace/finalize

   boom namespace is gone by now
```

if you want to restore your cluster from a previously working state, take a backup of etcd directory which acts as a cluster database that holds all the kluster resource data present under **`/var/lib/etcd`** and may look like below 

![](/blog/blog-images/etcd-a20fb7d87833.png)

fix the issue and restore the database and then restart its etcd-container.

**Troubleshooting your application deployed on your kluster**

Apart from doing `kubectl logs` you should investigate what is preventing your application to run, you're probably running into one of the following - 

-   The image can't be pulled
-   there's a missing secret of volume
-   no space in the cluster to schedule the workload
-   taints or affinity rules preventing the pod from being scheduled

in such case we have a magic command which one should get tattooed as there is not shortform to run this command that may help to investigate the issue

```
   kubectl get events --sort-by=.metadata.creationTimestamp -A

   kubectl top node
```

happy troubleshooting...
