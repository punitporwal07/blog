---
title: "Architecting hybrid infrastructure with Anthos"
description: "Anthos is an application management platform that provides a consistent development and operations experience for cloud and on-prem systems. Anthos is based on kubernetes. It runs on-premise and suppo"
pubDate: 2020-03-25T05:29:00.033-07:00
updatedDate: 2021-05-30T07:15:44.718-07:00
tags:
  - "Anthos"
  - "GCP"
originalUrl: "https://cloudnetes.blogspot.com/2020/04/architecting-hybrid-infrastructure-with.html"
---

![](/blog/blog-images/anthos-vertical-lockup-300-70034d9c7879.png) A multi-cloud service platform

Anthos is an application management platform that provides a consistent development and operations experience for cloud and on-prem systems. Anthos is based on kubernetes. It runs on-premise and supports multi and hybrid cloud environments which are fully managed by Google. it lets you write your jobs once and run it anywhere. It gives you the flexibility to move on-prem apps to the cloud when you are ready & finally it allows you to keep using the technology you are already using while improving security.

**"fun fact - Anthos means flower in Greek. Flower grow on-premise but they need rain from the cloud to flourish"**

**Anthos Technology stack look like**
Kubernetes engine
GKE on-prem
Anthos Config Management
Istio
Migrate for Anthos
Marketplace

let's take an example to understand it more clearly. In today's world, every company is trying to move their infrastructure from on-premise to cloud. And it's not a good idea to develop and modify your application into the cloud directly, instead if we get a way to modify the same application which will work in the cloud can be modified in your on-prem infrastructure first while gaining some benefits of working in the cloud and maintaining it on-prem. With Anthos you do have the leverage to extend your on-prem to your cloud environment to work more effectively.

-   It provides a platform to manage applications in a hybrid cloud environment 
-   It helps to manage hybrid infrastructure by using one single control plane.

which benefits you in :

-   write once deploy in any cloud.
-   consistency across environments.
-   Increased workload mobility.
-   Avoid vendor lock-in.
-   A techno-stack that runs in data centres, next to enterprise workload organisations currently running on-premise.

**General Idea**

In Anthos you set up an admin workstation that includes an Admin cluster as well as a user cluster, so it’s like a cluster within a cluster. Admin cluster takes care of user cluster. This eventually means the _admin control plane_ takes cares of the _user control plane_. The diagram will help you understand more clearly.

    

![](/blog/blog-images/cluster-8c4803dc5175.png)

-   Where admin control plane handles all administrative API calls to and from GKE on-prem
-   Use **gkectl** to create manage and delete the cluster

**Installation**

You will set up an admin workstation as part of the on-prem installation of GKE

![](/blog/blog-images/install-ad88aa3ed9ea.png)

-   it automate deployment on top of v-sphere shipped as a virtual appliance.
-   simple CLI installation with a local master.
-   DHCP or Static IP allocation support.
-   Integration with existing private or public container registry.

**GKE on-prem Networking**

you have two modes in GKE networking

1\. **Island mode** \-  Pod IP addresses are not routable in the data centre, i.e. from your on-prem services you cannot reach your pods directly instead you need to use endpoints like we do in k8s. (expose endpoint to reach pods)

2\. **Flood IP mode**    -  In this mode, you can reach your pods and allows to set a routing table.

**Data plane hybrid connection**

3 way to connect GKE on-prem cluster to Google N/w (on-prem to the cloud)

1\. **cloud VPN** private IP access over the internet with static or dynamic routing over BGP.

2\. **Partner Interconnect** private IP access thru a partner, data does not traverse thru the public internet.

3\. **Dedicated Interconnect** private IP over a direct physical connection to google's n/w. for 10GB connection & above.

so economically you need to calculate which way you should connect to Google n/w considering the latency and region displacement.

**Exercise**

In my lab, I exercised this using QWIKLABS provided by the google cloud training team

visit: [https://www.qwiklabs.com/](https://www.qwiklabs.com/)

search for **AHYBRID020 Managing Hybrid Clusters using Kubernetes Engine** and launch the Lab

get the credentials and login to the google cloud console

after getting in, verify the project which you been assigned by quiklabs 

        ex: qwiklabs-gcp-00-a08abc03add9

by default you will see a Kube-cluster up and running, navigate to Kubernetes Engine > clusters

activate the cloud shell ( which will be coming from a VM provided by GCP holding all necessary packages you need to exercise anthos )

```
# test the set of command provided by lab such as
$ gcloud auth list // to list the active accounts
$ gcloud config list project // to list project id

# now first thing is to enable API services
$ gcloud services enable \
  cloudresourcemanager.googleapis.com \
  container.googleapis.com \
  gkeconnect.googleapis.com \
  gkehub.googleapis.com \
  serviceusage.googleapis.com \
  anthos.googleapis.com

# on successful completion you'l see  Operation "operations/acf.60730f01-d4a2-4eaa-8dbc-5aab27d0fd3e" finished successfully.
  or if an error occurs when executing this step   it means Anthos API access is not properly enabled.

# now download files from github repository
$ git clone -b workshop-v1 \  https://github.com/GoogleCloudPlatform/anthos-workshop.git anthos-workshop
$ cd anthos-workshop

# connect cloudshell to your cluster
$ source ./common/connect-kops-remote.sh
  this will create remote cluster which will be detached to Anthos for now   & later we access this cluster and register it to GKE hub
```

 **GKE-HUB:** it is a centralized dashboard that allows you to view and manage all of your Kubernetes clusters from one central location. a cluster can be from anywhere, may your on-prem or from another cloud or from Google.

```
# Switch kubectl context to remote
$ kubectx remote
kubectx is a tool which sets the configuration used by the kubectl command.

# verify remote cluster, you'll have two worker and a master nodes$ kubectl get nodes

# now you need to grant access to service account to register clusters
$ export PROJECT=$(gcloud config get-value project)
$ export GKE_SA_CREDS=$WORK_DIR/anthos-connect-creds.json
$ gcloud projects add-iam-policy-binding $PROJECT \
  --member="serviceAccount:$PROJECT@$PROJECT.iam.gserviceaccount.com" \
  --role="roles/gkehub.connect"
so this policy binding will grant access to gkehub.connect api's

# generate private key file for service account
$ gcloud iam service-accounts keys create $GKE_SA_CREDS \
  --iam-account=$PROJECT@$PROJECT.iam.gserviceaccount.com \
  --project=$PROJECT

# now finally register the remote cluster using gcloud which creates   the membership and installs the connect agent, but first export remote cluster variable
$ export REMOTE_CLUSTER_NAME="remote"
$ gcloud container hub memberships register $REMOTE_CLUSTER_NAME \
  --context=$REMOTE_CLUSTER_NAME \
  --service-account-key-file=$GKE_SA_CREDS \
  --project=$PROJECT
 which means you are able to see your remote cluster on GKE-HUB now

# Refresh the cluster page to see the remote cluster,   but you need to login into it before it is fully connected.
$ kubectx remote
$ export KSA=remote-admin-sa # creating KSA to login into remote cluster
$ kubectl create serviceaccount $KSA

# assigning cluster-admin ClusterRole
$ kubectl create clusterrolebinding ksa-admin-binding \
  --clusterrole cluster-admin \
  --serviceaccount default:$KSA

# Extract token
$ printf "\n$(kubectl describe secret $KSA | sed -ne 's/^token: *//p')\n\n"
```

copy the extracted token & and login to the remote cluster using a token option. this way you now have access to your remote cluster and its metadata via GKE-HUB.

![](/blog/blog-images/remote-cluster-dcc708f6f554.jpg)

Br,

Punit
