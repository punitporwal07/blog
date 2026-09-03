---
title: "Deploying application on Kubernetes cluster"
description: "In today's emerging world containers have become a prominent deployment mechanism. Let's see how you can deploy your containerized application to k8s cluster backed by a cloud provider."
pubDate: 2018-07-26T12:35:00.009-07:00
updatedDate: 2023-01-29T12:42:19.183-08:00
tags:
  - "K8S"
  - "Kubernetes"
originalUrl: "https://cloudnetes.blogspot.com/2019/06/how-to-deploy-application-on-kubernetes.html"
---

In today's emerging world containers have become a prominent deployment mechanism. Let's see how you can deploy your containerized application to k8s cluster backed by a cloud provider.
Create an image using any container service, your application should adhere to all the essential requirements to get into a container.
Then you build your application image.

for ex: If I have to deploy my application on tomcat inside a docker image, so that everytime when I launch my docker image, it will launch my tomcat instance and deploy my application bundled in it and run as a container service, which further I can deploy on my docker-swarm or kubernetes cluster.

NOTE: You need a cloud provider or other controller that knows how to allocate an IP and route traffic into the nodes like GKE has that in GCP. If you are on-prem, k8s has no idea what infrastructure exists on your network so you need to use NodePort approach to generate endPoints or set up your own container n/w using cni-plugins provided by [Calico](https://projectcalico.docs.tigera.io/getting-started/kubernetes/self-managed-onprem/onpremises), [weave](https://github.com/weaveworks/weave/releases/) or flannel etc.

![](/blog/blog-images/k8s-deployment-fe94c66ecfaa.png)

to acheive this your application should be encapsulated in a docker image with all the required resources. You can always scale your deployment and perform versioning of your deployment.
When you deploy an image it should be available in image:registry so that it can be called in your deployment manifest. Than you expose your application to the outside world using **service** resource of k8s. You can use any cloud provider to have a ready-made container platform like GKE, EKS, AKS to launch K8s cluster and deploying container directly on to it.

![](/blog/blog-images/k8scluster-e5358a257ee0.png)

in short:

1.  Package your app into a container image (docker build)
2.  Run the container locally on your machine (optional)
3.  Upload the image to a registry/hub (docker push)
4.  Create a container cluster (cluster init)
5.  Deploy your app to the cluster (kubectl -f apply deployment.yaml)
6.  Expose your app to the Internet (kubectl -f apply service.yaml)
7.  Scale up your deployment (kubectl scale --replicas=2)
8.  Deploy a new version of your app

```
# creating a k8s-cluster in GKE using CLI else follow this to setup a cluster locally
$ gcloud container clusters create mycluster --num-nodes=2 --zone=us-central1-c

# get the instance status
$ gcloud compute instances list
```

Output:

![](/blog/blog-images/k8s-output-901dd4c88fad.png)

```
# running a container-image on a k8s-cluster of kind deployment
$ kubectl run hello --image=punitporwal07/myapp:0.1

# To see the Pod created by the Deployment, run the following command
$ kubectl get pods
```

at times you see a different status after pulling the image or while fetching the pods status

![](/blog/blog-images/running-c45de4f24470.png)

**`ErrImagePull`**

`ImagePullBackOff`

`CrashLoopBackOff`
`Running`

so there are mainly three possible reasons behind such failures:

1.  The image tag is incorrect

2.  The image doesn't exist (or is in a different registry)

3.  Kubernetes doesn't have permissions to pull that image

whereas CrashLoopBackOff tells us that kubernetes is trying to launch your pod, but one or more of the containers is crashing or getting killed.

Let's describe the pod to get some more information:

`$ kubectl describe pod myapp-7974b8cc6b-dvsgz(Name)`

**Deleting deployment/container from K8s cluster**

first of all, you need to get the structure of your deployment resources

`$ kubectl get all`

`$ kubectl delete deployment.apps/myapp`

![](/blog/blog-images/delete-k8sdeployment-f14d285d7e4e.png)

 ```
 # since it has replicasets enabled it keeps spinning another pod for you deployment,
   so you need to delete the deployment in order to stop its cycle
 $ kubectl get deployments
 $ kebectl delete deployment myapp

 # and redeploy a fresh image
 $ kubectl run myapp --replicas=3 --image=punitporwal07/myapp:0.1 --port=8000

 # expose you application to the internet in form of service
 $ kubectl expose deployment myapp --type=LoadBalancer \   --port 8000 --target-port 8080 --name=myservice
 $ kubectl get service
```

once your service being exposed, you will see k8s will allocate and external IP to your service

![](/blog/blog-images/exposed-55233fce8202.png)

NOTE: instead of deleting a GKE cluster to save cost, recommend to resize=0 by the following command
**`$ gcloud container clusters resize mycluster --size=0 --zone=us-central1-c`
**
Then scale it back up later by running it with a non-zero value for the size flag.

Br,
Punit
