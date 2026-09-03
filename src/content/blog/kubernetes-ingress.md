---
title: "Kubernetes Ingress"
description: "["
pubDate: 2022-06-04T09:02:00.050-07:00
updatedDate: 2023-06-10T01:50:18.473-07:00
tags:
  - "ingress"
originalUrl: "https://cloudnetes.blogspot.com/2022/06/kubernetes-ingress.html"
---

![](/blog/blog-images/avvxsej-aqbmevyiumjcii1r-5k7w2kus7ax2uoo-007bbd4c5794.png)

Kubernetes has a built-in configuration object for HTTP load balancing called **Ingress**.
It defines rules for external connectivity to the pods represented by one or more Kubernetes services.
Ingress can provide SSL termination and name-based virtual hosting.
The traffic routing is controlled by rules defined on the Ingress resource.

Ingress resource example:

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service
            name: app-service
            port:
              number: 80
```

Ingress resource only supports rules for directing HTTP traffic. The Ingress spec has all the information needed to configure a load balancer or proxy server.

Most importantly, it contains a list of rules matched against all incoming requests.

### What are Ingress rules?

Each HTTP rule contains an optional host, a list of paths each of which has an associated backend defined with a serviceName and servicePort.

If the traffic path not matched to any rules, then traffic sends to the default backend.

### What is the default Backend?

The default backend is typically a configuration option of the Ingress controller and is not specified in your Ingress resources.

If none of the hosts or paths matches the HTTP request in the Ingress objects, the traffic is routed to your default backend.

### Types of Ingress

**Single Service Ingress**

It doesn't have any rules and it sends traffic to a single service. You can use this to create a default backend with no rules.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-ingress
spec:
  backend:
    serviceName: frontend-service
    servicePort: 80
```

**Simple fanout**

A fanout configuration routes traffic to more than one service, based on the requested HTTP URI.

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: simple-fanout-example
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.cloudnetes.com
    http:
      paths:
      - path: /cloud
        pathType: Prefix
        backend:
          service
            name: cloud-service
            port:
              number: 8080
      - path: /devops
        pathType: Prefix
        backend:
          service
            name: devops-service
            port:
        number: 8081
 
```

**Name-based virtual hosting**

Name-based virtual hosts support routing HTTP traffic to multiple host names.

```
apiVersion: networking.k8s.io/v1kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: myapp01.cloudnetes.com
    http:
      paths:
      - path: /cloud01
        pathType: Prefix
        backend:
          service
            name: cloud01-service
            port:
              number: 8080
      - path: /devops01
        pathType: Prefix
        backend:
          service
            name: devops01-service
            port:
              number: 8081

  - host: myapp02.cloudnetes.com
    http:
      paths:
      - path: /cloud02
        pathType: Prefix
        backend:
          service
            name: cloud02-service
            port:
              number: 9090
      - path: /devops02
        pathType: Prefix
        backend:
          service
            name: devops02-service
            port:
              number: 9091
```

**Ingress controller**

In order to work the ingress resource, the Kubernetes cluster must have an ingress controller running.

It runs as part of the kube-controller-manager and is typically started automatically with a cluster.

There are so many ingress controller implementations and choose that best fits your cluster.

**Additional controllers include -

**_One of its implementations can be found here in [**EKS Fargate**](http://www.cloudnetes.tech/2021/03/eks-with-fargate-profile.html) as aws lb-ingress-controller._

_NGINX, Inc. offers support and maintenance for the NGINX Ingress Controller for Kubernetes._

_Contour is an Envoy-based ingress controller provided and supported by Heptio._

_F5 Networks provides support and maintenance for the F5 BIG-IP Controller for Kubernetes._

_HAProxy based ingress controller jcmoraisjr / haproxy-ingress which is mentioned on the blog post._

_HAProxy Ingress Controller for Kubernetes. HAProxy Technologies offers support and maintenance for HAProxy Enterprise and the ingress controller jcmoraisjr/haproxy-ingress._

_Istio based ingress controller Control Ingress Traffic._

_Kong offers community or commercial support and maintenance for the Kong Ingress Controller for Kubernetes._

You can deploy multiple ingress controllers within a cluster.

When you create an ingress resource, you should annotate each ingress with the appropriate ingress.class to indicate which ingress controller should be used.

Ex : Ingress with Nginx ingress controller:

metadata:
  name: my-ingress
  annotations:
    kubernetes.io/ingress.class: nginx

If you do not define ingress.class, your cloud provider will use a default ingress provider.

The Nginx Ingress Controller for Kubernetes provides enterprise-grade delivery services for Kubernetes applications, with benefits for users of both open-source Nginx and Nginx Plus.

With the Nginx Ingress Controller, you get basic load balancing, SSL/TLS termination, support for URI rewrites, and upstream SSL/TLS encryption.

**Installation**

**Step 1**: Clone nginx controller repository

`git clone https://github.com/srinisbook/kuberntes-nginx-controller.git`

**Step 2**: Install nginx controller

`cd kuberntes-nginx-controllerkubectl apply -f nginx-ingress.yaml`

Check the pods:

`kubectl get pods -n ingress-nginx`

`NAME                                        READY     STATUS    RESTARTS   AGE`

`nginx-ingress-controller-65fd579494-f4nfv   1/1       Running   0          70s`

Check the services

`kubectl get services -n ingress-nginx`

`NAME            TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)                      AGE`

`ingress-nginx   LoadBalancer   10.12.10.200   34.69.178.130   80:30903/TCP,443:30605/TCP   2m47s`

Note: If you have your cluster in AWS, it will create an ELB with DNS name.

Using helm chart

`helm install --name nginx-ingress-controller \`

  `stable/nginx-ingress`

`NAME:   nginx-ingress-controllerLAST DEPLOYED: Tue Feb 26 21:52:48 2022NAMESPACE: defaultSTATUS: DEPLOYED`
