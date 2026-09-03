---
title: "Internal certificates renewal in Kubernetes cluster"
description: "How to renew k8s-cluster components certificates when apiserver cert is expired? (usually applicable for k8s v1.12)"
pubDate: 2018-03-01T11:53:00.018-08:00
updatedDate: 2023-09-10T13:57:01.590-07:00
tags:
  - "K8S"
originalUrl: "https://cloudnetes.blogspot.com/2018/01/internal-certificates-renewal-in.html"
---

![](/blog/blog-images/k8s-ssl-f7a068b2d582.png)

How to renew k8s-cluster components certificates when apiserver cert is expired? (usually applicable for k8s v1.12)

ref - [https://github.com/kubernetes/kubeadm/issues/581](https://github.com/kubernetes/kubeadm/issues/581)

Login to the master node to verify the validity with .crt files only it will not work for .key files as below

```
 Certificate validation
 openssl x509 -in /etc/kubernetes/pki/ca.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/apiserver-etcd-client.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/front-proxy-ca.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/apiserver-kubelet-client.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/front-proxy-client.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/etcd/ca.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/etcd/server.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/etcd/peer.crt -noout -text | grep Not
 openssl x509 -in /etc/kubernetes/pki/etcd/healthcheck-client.crt -noout -text | grep Not
 unlike
 sudo openssl x509 -in /etc/kubernetes/pki/apiserver.key -noout -text |grep ' Not '
```

**Take necessary backups of the config files**

```
 sudo cp -rp /etc/kubernetes /etc/kubernetes-BACKUP
 sudo cp -rp /var/lib/etcd/ /etc/lib/etcd-BACKUP
```

**Renew certificates** 

```
 if only specific certificates expired ( give component wise)
 sudo kubeadm alpha phase certs apiserver --apiserver-advertise-address MASTER.NODE.IP
 sudo kubeadm alpha phase certs apiserver-kubelet-client
 sudo kubeadm alpha phase certs front-proxy-client

 if all the certificates got expired
 sudo kubeadm alpha phase certs renew all

 NOTE - // this will not renew all the certificates except,
           certificate-data present under /etc/kubernetes/admin.conf

 
 Backup old configuration files like 
 admin.conf kubelet.conf controller-manager.conf scheduler.conf
 sudo mv /etc/kubernetes/*.conf /etc/kubernetes/*.conf_old
 Genereate fresh config files, after moving *.conf from /etc/kubernetes/
 sudo kubeadm alpha phase kubeconfig all --apiserver-advertise-address MASTER.NODE.IP

 NOTE - // this command will re-generate new *.conf files from /etc/kubernetes/ , and
           renew the certificates which are not renewed during certs renew all command
 test your kubelet-bootstrap certificate
 grep 'client-certificate-data' $HOME/.kube/config | \
 awk '{print $2}' | base64 -d | openssl x509 -text
```

**Restart all the pods in the kube-system namespace** -

```
 kubectl delete --all pods -n kube-system
```

sample output may look like the below during renewal

`[k8sadm@master~]$` `sudo kubeadm alpha phase certs apiserver-kubelet-client`

`I0412 08:31:05.254993     814 version.go:93] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)``I0412 08:31:05.255704     814 version.go:94] falling back to the local client version: v1.12.10``[certificates] Generated apiserver-kubelet-client certificate and key.`

sample output may look like the below during regeneration

`[k8sadm@master~]$ sudo kubeadm alpha phase kubeconfig all --apiserver-advertise-address MASTER.IP``I0412 08:42:52.374602   13230 version.go:93] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)``I0412 08:42:52.374706   13230 version.go:94] falling back to the local client version: v1.12.10`

`[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/admin.conf"``[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/kubelet.conf"``[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/controller-manager.conf"``[kubeconfig] Wrote KubeConfig file to disk: "/etc/kubernetes/scheduler.conf"`

**Reconfigure kluster by placing updated admin.conf file**

Ensure that your kubectl is looking in the right place for your config files.

```
 sudo mv /home/k8sadm/.kube/config /home/k8sadm/.kube/config.old
 sudo cp -i /etc/kubernetes/admin.conf /home/k8sadm/.kube/config
 sudo chown k8sadm:docker /home/k8sadm/.kube/config
 sudo chmod 644 /home/k8sadm/.kube/config
```

**Restart services** 

```
 systemctl restart kubelet
```
