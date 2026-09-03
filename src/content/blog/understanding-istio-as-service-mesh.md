---
title: "Understanding ISTIO as a service mesh"
description: "When your service mesh grows it becomes more complex to understand, manage, monitor and load balance the flow. ISTIO is what you need that will take care of all your mesh worries. It is a control plan"
pubDate: 2021-05-02T04:16:00.189-07:00
updatedDate: 2023-01-20T09:51:11.020-08:00
tags:
  - "istio"
originalUrl: "https://cloudnetes.blogspot.com/2021/05/understanding-istio-as-service-mesh.html"
---

![](/blog/blog-images/avvxsehvzklsny7yw91wa8fdp8n97m61rrtanef5-27dfb604fd04.png)

When your service mesh grows it becomes more complex to understand, manage, monitor and load balance the flow. ISTIO is what you need that will take care of all your mesh worries. It is a control plane for all proxies, in Greek, it means "**Sail**" which uses [Envoy](https://www.envoyproxy.io/docs/envoy/latest/intro/what_is_envoy#:~:text=Envoy%20is%20an%20L7%20proxy,large%20modern%20service%20oriented%20architectures.&text=All%20of%20the%20Envoys%20form,unaware%20of%20the%20network%20topology.) as a sidecar proxy.

**the formal definition of istio is - it allows one to connect, secure, control & observe microservices.** 

A microservice application has more moving parts as compared to a monolithic application. Each service is simpler but the entire system as a whole is more complex.

Microservices is an app architectural style that divides an app into components where each component is a full but diminutive app that’s focused on producing a single business task according to the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle).

**Before we understand ISTIO first we need to see the -**

**Basic Challenge in MicroService Architecture -**
Usually, communications in microservice clusters are insecure, request comes via a proxy to clusters, MS talks to each other freely without any security that increases the risk of being attacked. Every service can talk to others without any restrictions.
Rather than working on applications' actual service logic, developers have to work on securing their applications, integrating them with monitoring tools, or adding some new non-business-logics to MS to address these challenges, which also add complexity to services, instead of keeping them simple and lightweight. The below diagram depicts the same.

![](/blog/blog-images/avvxsegagkqefgh3k1xrsmj-4mzdiehdeot0qhvt-03507dd15ee3.png)

**Service registry** - every time you deploy a microservice it gets registered to the service registry that will keep a track of all the services you have deployed in your architecture. It uses register() heartbeat() & unregister() functions to maintain an updated instances list. 

**Service discovery -** whenever a service needs another service, it uses the service discovery function to find an instance of that service, service discovery works closed with the service registry to serve its purpose.

**Automated testing -** these tools ensures the resiliency of your application deployed as a microservice.
**canary** deployment (or rollout) is the tool in ISTIO, when you introduce a new version of a service by first it tests it using a small percentage of user traffic, and then if all goes well, increases, possibly gradually in increments fashion.

**Istio** is a dedicated infrastructure layer for handling service-to-service communication, which is responsible for the reliable delivery of the request thru a complex topology of services that comprise a modern cloud-native application.
It is a configurable, open-source service-mesh layer that connects, monitors, and secures the containers in a [Kubernetes cluster](http://www.cloudnetes.tech/2018/02/kubernetes-orchestration-framework-for_24.html).
At this writing, Istio works natively with Kubernetes only, but its open-source nature makes it possible for anyone to write extensions enabling istio to run on any clustering software. Today, we'll focus on using Istio with generic Kubernetes-cluster, one of its most popular use cases.

**Before we start we should know the core features of ISTIO**

**Traffic management:** Istio’s traffic routing rules let you easily control the flow of traffic and API calls between services.
The pilot uses three types of configuration resources to manage traffic in its service mesh:
a. Virtual services b. Destination rules c. Service entries

-   **Virtual services** - A virtual service defines a set of traffic routing rules to apply when a host is addressed. Each routing rule defines matching criteria for the traffic of a specific protocol. If the traffic is matched, it is sent to a named destination service (or subset or version of it) defined in the service registry.
-   **Destination rules -** A DestinationRule defines policies that apply to traffic that is intended for service after routing has occurred. These rules specify configuration for load balancing, connection pool size from the sidecar, and outlier detection settings to detect and evict unhealthy hosts from the load balancing pool. Any destination host and subset referenced in a VirtualService rule must be defined in a corresponding DestinationRule.
-   **Service entries -** A ServiceEntry configuration enables services in the mesh to access a service that is not necessarily managed by Istio. The rule describes the endpoints, ports, and protocols of a white-listed set of mesh-external domains and IP blocks that services in the mesh are allowed to access.

**Observability:** with its custom the dashboard provides visibility of the performance of all of its services & provides visibility in your microservice operations.
**Policy enforcement -** you can apply custom policies between service interactions.
**Connect:** In the context of k8s, a service provides a simple OSI layer 4 DNS-based load balancing for the pods belonging to the service. Service mesh addresses OSI layer 7 load balancing needs.
**Secure:** It ensures the communication between two services is safely and securely using encryption and mutual TLS also includes auditing capabilities of who does what and at what time in result provides authorization and secure communication channel b/w services.
**Reliability:** It ensures provisions for health checks, timeouts, deadlines, socket breakers & retrace.
**Integration & Customization:** works with any services registered at GCP, AWS, k8s, or custom console or on-prem.

Detailed diagram of Istio Architecture which is logically split into control & data plane

![](/blog/blog-images/avvxseiqk-hbmjixcn0xigbakkoof5avmaulmh7p-bd38ec7dce54.png)

 **Control Plane** 

manages and configures proxies to route traffic and enforce policies at runtime. _Underlying orchestrator such as Kubernetes or hashicorp nomad._

**Pilot** - ( equivalent to service discovery) Responsible for configuring the Envoy and Mixer at runtime.

**Mixer** - Create a portability layer on top of infrastructure backends. Enforce policies such as ACLs, rate limits, quotas, authentication, request tracing and telemetry collection at an infrastructure level.

**Citadel / Istio CA** - ( certificate generation) Secures service to service communication over TLS. Providing identity & key management system to automate key and certificate generation, distribution, rotation, and revocation.

**Galley -** is responsible for interpreting the YAML files in Kubernetes and transforming them into a format that Istio understands. The galley makes it possible for Istio to work with other environments than Kubernetes since it translates different configuration data into the common format that Istio understands.

 Data Plan**e** composed of a set of intelligent proxies deployed as a sidecar container that mediates and control all n/w communication between services.

**Proxy / Envoy** - The proxy can communicate with another proxy without connecting to Istiod in the control plane since they have all the logic in the configs we have supplied that was converted by Istiod.
Sidecar proxies per microservice to handle ingress/egress traffic between services in the cluster and from a service to external services. The Proxy manages connections to services, handling health checking, retry, failover, and flow control. The Proxy can report client-side metrics and logs (Monitoring & Logging)
For Istio to work, **Envoy proxies must be deployed as sidecars to each pod of the deployment**. You can inject the Istio sidecar into a pod in two ways:

Manually by using the istioctl CLI tool
Automatically by using the Istio Initializer

**Ingress/Egress** - Configure path-based routing for inbound and outbound external traffic.

## **How to setup Istio for a Kubernetes-cluster** 

**NOTE:**  - The minimum supported Kubernetes version is **1.16** to work with Istio 1.7.3

              - you **don't have to adjust** the deployment & service of k8s YAML files.

              - Istio configuration is **separate** from app/MS configuration.

              - but, Istio can be configured with k8s YAML files, by extending the k8s API known as **CRD**

**CRD** (custom resource definition) is a custom API used for third-party technologies like for Istio, Prometheus etc.

**Istio setup is followed in three major parts -**

1\. Install Istio core & Istiod in k8s

2\. Configure automatic Envoy proxy injection.

3\. Istio add-ons for monitoring, tracing & visualization.

```
 Install istioctl

$ curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.7.3 sh -
$ sudo cp -rp istio-1.7.3/bin/istioctl /usr/local/bin/

 if fails use monolithic approach

$ wget https://github.com/istio/istio/releases/download/1.7.3/istioctl-1.7.3-linux-amd64.tar.gz \  --no-check-certificate

(Optional)
 Run Istio pre-installation check
$ istioctl x precheck
You will get details about
kubernetes( api, version, setup)
Istio(namespace, sideCar-Injector etc)

 Install Istio-core & Istiod in k8s and its components into the istio-system namespace

$ istioctl install

this will add istio-system namespace into your cluster and run ingress & istiod pods

 You might end up getting one of the usual error, while initiallizing istiod pod
  possibly because of less resources available to host your mesh

Warning  FailedScheduling  39s (x11 over 13m)    default-scheduler  0/2 nodes are available:
1 node(s) had taint {node-role.kubernetes.io/master: }, that the pod didn't tolerate,
1 node(s) had taint {node.kubernetes.io/disk-pressure: }, that the pod didn't tolerate.

Now deploy some MS so that we can test how istio injects envoy proxy into pods
         [https://github.com/GoogleCloudPlatform/microservices-demo]

 Injecting Envoy Proxy for microservices

it wont be happend automatically, so you have to do that,
label the namespace which you want to observe, so that ISTIO will understand where to inject proxy

$ kubectl get ns default --show-labels
NAME      STATUS   AGE   LABELS
default   Active   61m   <none>

$ kubectl label ns default istio-injection=enabled
NAME      STATUS   AGE   LABELS
default   Active   61m   istio-injection=enabled

now redeploy the microservices you will see an additional container(2/2) added into pod,
which was injected by ISTIO

 Data Visualization by installing Addons (Grafana,Prometheus,kiali,tracing etc)

[https://istio.io/latest/docs/ops/integrations/]
[https://github.com/istio/istio/releases/download/1.7.3/istioctl-1.7.3-linux-amd64.tar.gz]
[istio-1.7.3/sample/addons/*.yamls]

$ kubectl -f apply istio-1.7.3/sample/addons/

for ex - checking Kiali service to visualize data

$ kubectl get svc -n istio-system
$ kubectl port-forward svc/kiali -n istio-system 20001

open GUI - http://localhost:20001/ to visualize MS flow

Kiali - we use for MS overview in graph form
```

**The key thing to note -**

**labels:**

   **app: microserviceName**

**(which has a special meaning in istio)**

whenever you are deploying MS in a Istio enabled k8s-cluster you need to have an **app** label for deployments & services in the manifest file for the data visualization to work.

keep meshing around!
