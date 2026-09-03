---
title: "Testing Ingress in Azure Kubernetes Service"
description: "If you are familiar with the Kubernetes ecosystem, you know we can use NGINX as an ingress controller to expose Kubernetes services on an static external/Public IP address. Azure Kubernetes Services p"
pubDate: 2023-10-27T06:03:00.102-07:00
updatedDate: 2023-11-03T07:09:16.100-07:00
originalUrl: "https://cloudnetes.blogspot.com/2023/10/testing-ingress-in-azure-kubernetes.html"
---

![](/blog/blog-images/avvxseimlcjwt5oiiyb9k3fepgp0pncmc5p5-kgl-f52acd1ae249.png)

If you are familiar with the Kubernetes ecosystem, you know we can use NGINX as an ingress controller to expose Kubernetes services on an static external/Public IP address. Azure Kubernetes Services provides the solution. In AKS, you have the option of installing your NGINX ingress controller(using helm) on an internal network. This ensures that your resources are only accessible on your internal network and that they can be accessed through an Express Route or a VPN connection.

The process of setting up Ingress in AKS can be summarized in following steps:`%3CmxGraphModel%3E%3Croot%3E%3CmxCell%20id%3D%220%22%2F%3E%3CmxCell%20id%3D%221%22%20parent%3D%220%22%2F%3E%3CmxCell%20id%3D%222%22%20value%3D%22%22%20style%3D%22sketch%3D0%3Bhtml%3D1%3Bdashed%3D0%3Bwhitespace%3Dwrap%3BfillColor%3D%232875E2%3BstrokeColor%3D%23ffffff%3Bpoints%3D%5B%5B0.005%2C0.63%2C0%5D%2C%5B0.1%2C0.2%2C0%5D%2C%5B0.9%2C0.2%2C0%5D%2C%5B0.5%2C0%2C0%5D%2C%5B0.995%2C0.63%2C0%5D%2C%5B0.72%2C0.99%2C0%5D%2C%5B0.5%2C1%2C0%5D%2C%5B0.28%2C0.99%2C0%5D%5D%3BverticalLabelPosition%3Dbottom%3Balign%3Dcenter%3BverticalAlign%3Dtop%3Bshape%3Dmxgraph.kubernetes.icon%3BprIcon%3Ding%3Bdirection%3Deast%3B%22%20vertex%3D%221%22%20parent%3D%221%22%3E%3CmxGeometry%20x%3D%221260%22%20y%3D%22930%22%20width%3D%2231%22%20height%3D%2230.53%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3C%2Froot%3E%3C%2FmxGraphModel%3E``%3CmxGraphModel%3E%3Croot%3E%3CmxCell%20id%3D%220%22%2F%3E%3CmxCell%20id%3D%221%22%20parent%3D%220%22%2F%3E%3CmxCell%20id%3D%222%22%20value%3D%22%22%20style%3D%22sketch%3D0%3Bhtml%3D1%3Bdashed%3D0%3Bwhitespace%3Dwrap%3BfillColor%3D%232875E2%3BstrokeColor%3D%23ffffff%3Bpoints%3D%5B%5B0.005%2C0.63%2C0%5D%2C%5B0.1%2C0.2%2C0%5D%2C%5B0.9%2C0.2%2C0%5D%2C%5B0.5%2C0%2C0%5D%2C%5B0.995%2C0.63%2C0%5D%2C%5B0.72%2C0.99%2C0%5D%2C%5B0.5%2C1%2C0%5D%2C%5B0.28%2C0.99%2C0%5D%5D%3BverticalLabelPosition%3Dbottom%3Balign%3Dcenter%3BverticalAlign%3Dtop%3Bshape%3Dmxgraph.kubernetes.icon%3BprIcon%3Ding%3Bdirection%3Deast%3B%22%20vertex%3D%221%22%20parent%3D%221%22%3E%3CmxGeometry%20x%3D%221260%22%20y%3D%22930%22%20width%3D%2231%22%20height%3D%2230.53%22%20as%3D%22geometry%22%2F%3E%3C%2FmxCell%3E%3C%2Froot%3E%3C%2FmxGraphModel%3E`

**Step01** - create aks cluster and connect thru bastion host **Step02 -** setup ingress and create static public IP
**Step03 -** Install Ingress Controller using helm
**Step04** - Create an ingress route 

**![](/blog/blog-images/avvxsehmuxlnau6bvmkfzetjzslyqrejavna-8ec-fe1bc8037b9a.png)**

**Step-01**  Create an AKS Cluster from Bastion Host.

**Pre-requisite**  - Verify you have the _Microsoft.OperationsManagement_ and _Microsoft.OperationalInsights_ providers registered on your subscription.

    (These Azure resource providers are required **to support Container insights)
 -** A resource group under which AKS cluster will be deployed.
 - Enable addon http\_application\_routing in case you do not have https enabled

```
 $ az provider show -n Microsoft.OperationsManagement -o table $ az provider show -n Microsoft.OperationalInsights -o table
  Enable http_application_routing
 $ az aks enable-addons --resource-group test-networking-uksouth \
   --name aks-cluster --addons http_application_routing

 $ az provider show -n Microsoft.ContainerService -o table
```

![](/blog/blog-images/avvxsejssk5yapjei0sha4d-ped-mvjs-3v1eeuo-f953d317ebe4.png)

Presuming you have a resource group in place, proceed to create an AKS cluster now -

```
 $ az aks create -g test-networking-uksouth -n aks-cluster \
   --enable-managed-identity \
   --node-count 1 \
   --enable-addons monitoring \
   --enable-msi-auth-for-monitoring \
   --generate-ssh-keys
```

Next connect to AKS Cluster from Bastion Host -

```
 $ az login
 set the cluster subscription $ az account set --subscription bf687f81-fad1-48cb-b38c-b6e9b00a5cfe
 download cluster credentials $ az aks get-credentials --resource-group test-networking-uksouth --name aks-cluster
 install Kubectl $ curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.23.6/bin/linux/amd64/kubectl $ chmod +x kubectl && mv kubectl /usr/bin/ $ kubectl cluster-info
```

**Setup Ingress** 

**Step-02** Create a static public IP -

```
 Get the resource group name of the AKS cluster that you need to update in subsequent comamnd
 $ az aks show --resource-group test-networking-uksouth --name aks-cluster --query nodeResourceGroup -o tsv

 Create a public IP address with the static allocation &
 ASSOCIATE - Assign this Public IP to a Load Balancer & replace them

 $ az network public-ip create \
   --resource-group MC_test-networking-uksouth_aks-cluster_uksouth \
   --name myAKSPublicIPForIngress \
   --sku Standard \
   --allocation-method static \
   --query publicIp.ipAddress -o tsv

  ex- o/p - 51.104.208.183
```

![](/blog/blog-images/avvxsej-x3wswmwqclajdqq-twzmeckwuymtqhe3-656b3f86460e.png)

**Step-03:** Install Ingress Controller using helm

```
 Install Helm3 (if not installed)

 $ wget https://get.helm.sh/helm-v3.10.3-linux-amd64.tar.gz
 $ tar -zxvf helm-v3.0.0-linux-amd64.tar.gz
 $ sudo cp -rp linux-amd64/helm /usr/local/bin/

 Create a namespace for your ingress resources
 $ kubectl create namespace ingress-basic

 Add the official stable repository
 $ helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
 $ helm repo add stable https://charts.helm.sh/stable
 $ helm repo update

 Customizing the Chart Before Installing.
 $ helm show values ingress-nginx/ingress-nginx

 Use Helm to deploy an NGINX ingress controller & Replace with your static IP
 $ helm install ingress-nginx ingress-nginx/ingress-nginx \
   --namespace ingress-basic \
   --set controller.image.allowPrivilegeEscalation=false \
   --set controller.replicaCount=2 \
   --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
   --set defaultBackend.nodeSelector."kubernetes.io/os"=linux \
   --set controller.service.externalTrafficPolicy=Local \
   --set controller.service.loadBalancerIP="51.104.208.183"
 ex - o/p -
 NOTES:
 The ingress-nginx controller has been installed.
 It may take a few minutes for the LoadBalancer IP to be available.
 You can watch the status by running
 'kubectl --namespace ingress-basic get services -o wide -w ingress-nginx-controller'
```

List services with labels

```
 $ kubectl get service -l app.kubernetes.io/name=ingress-nginx --namespace ingress-basic
 List Pods
 $ kubectl get pods -n ingress-basic
 $ kubectl get all -n ingress-basic
```

Access Public IP like - http://<Public-IP-created-for-Ingress>
ex - http://51.104.208.183/ 

**Output should be** -    404 Not Found from Nginx
ex -

![](/blog/blog-images/avvxsegoilgkxst5z8vauurpirshho4i9byo-seg-c5b5c36d3852.png)

Verify Load Balancer on Azure Mgmt Console

    Primarily refer Settings -> Frontend IP Configuration

![](/blog/blog-images/avvxseg0njqbiffifou7i3dv824oarqm-ybkqc8o-c7f02c7d38eb.png)

![](/blog/blog-images/avvxseg6yapz10o-memsccx4-pq0u05ywvu8z4ob-f590cc5197e8.png)

**Setup DNS**

First go to your public IP address & configure it | DNS record first to associate with your public IP address
\- create DNS zone - sampleapp.com in your resource-group
\- create alias record - my.sampleapp.com
\- add DNS name label - sampleapp1 which will become DNS

the DNS will look like - http://sampleapp1.uksouth.cloudapp.azure.com/

![](/blog/blog-images/avvxsej58fboc7ahfu3vlqnouh3xtxz7tm2-mvvq-55f373d16993.png)

Step04 - create an ingress route

\# INGRESS RESOURCE THAT WILL BE DEPLOYED AS APP LOAD-BALANCER IN AKS ---

apiVersion: networking.k8s.io/v1

kind: Ingress

metadata:

  namespace: ingress-basic

  name: sampleapp-ing

  annotations:

kubernetes.io/ingress.class: nginx

kubernetes.io/ingress.class: addon-http-application-routing

    `nginx.ingress.kubernetes.io/ssl-redirect: "false"`

`nginx.ingress.kubernetes.io/rewrite-target: /static/$2`

spec:

  ingressClassName: alb

  rules:

\# - host: sampleapp1.uksouth.cloudapp.azure.com // <DNSentryofPublicIP>

    - http:

        paths:

        - path: /

          pathType: Prefix

          backend:

            service:

              name: sampleapp-svc

              port:

                number: 80

**Test ingress by deploying a sample application**

```
 $ kubectl create deployment sampleapp --image=punitporwal07/sampleapp:3.0 -n ingress-basic
```

#### **Known issues -**

Issue1 -

on running _kubectl get pods -n ingress-basic_ you might observer that the ingress deployment fails to schedule pods and see following errors in the namespace events.

`Error creating: admission webhook "validation.gatekeeper.sh" denied the requ``est: [azurepolicy-k8sazurev3noprivilegeescalatio-b740f48149d00f4a06d8] Privilege escalation container is not allowed: controller`

![](/blog/blog-images/avvxsehy9lgd6pnfszeznvm-fvrgp9wfoozm35vu-f5b0fd256c10.png)

Solution1 -
This is due to the fact that when we create privileged pods if there is a azure policy attached, it will block the container creation.

Dashboard > cluster > Policies > look for below policy, if present install controller with following tag -

```
 --set controller.image.allowPrivilegeEscalation=false
```

![](/blog/blog-images/avvxseiffklfpyfkvfp0sqf9mq02dfmh-aspgqum-fd0d381895a2.png)

ref - [https://learn.microsoft.com/en-us/azure/aks/ingress-basic?WT.mc\_id=docs-azuredevtips-azureappsdev&tabs=azure-cli](https://learn.microsoft.com/en-us/azure/aks/ingress-basic?WT.mc_id=docs-azuredevtips-azureappsdev&tabs=azure-cli)
