---
title: "Google Cloud Platform cheatsheet"
description: "Google as a cloud provider gives your various web services to build your infrastructure and automate it for seamless delivery of your application in production environment in a highly secure way."
pubDate: 2019-04-03T03:55:00.000-07:00
updatedDate: 2021-12-08T23:08:25.500-08:00
tags:
  - "GCP"
originalUrl: "https://cloudnetes.blogspot.com/2020/07/google-cloud-platform-commands-sheet.html"
---

![](/blog/blog-images/gcp-73cda8a5d95e.png)

Google as a cloud provider gives your various web services to build your infrastructure and automate it for seamless delivery of your application in production environment in a highly secure way.

This post lists out all the gcloud command which you can apply in your google cloud operations. 

GCP comprises of 3 core components:

Network          ¬Moving

Compute         ¬Processing

Storage           ¬Remembering

**`GCP Basics`** 

| Function | Command |
| --- | --- |
| Check versionsettings | gcloud versiongcloud infogcloud components list |
| Init profile | gcloud init |
| list serviceslist enabled services | gcloud services list gcloud services list --enabled |
| Upgrade local SDK | gcloud components updategcloud components update --version 219.0.1 |
| List all sql instances | gcloud sql instances list |

**List all zones**`gcloud compute zones list`                 

**`Project configs`**

| Function | Command |
| --- | --- |
| List projects | gcloud projects list, gcloud config list |
| Show project info | gcloud compute project-info describe |
| Switch project | gcloud config set project <project-id> |

| create project & set as default | gcloud projects create mygcp-project-777 --name mygcp-project --set-as-default |
| --- | --- |
| set a default project | gcloud config set core/project mygcp-project-777 |
| set default compute regions & zone | gcloud config set compute/region europe-west6 gcloud config set compute/zone europe-west-6-a |

**`Bucket Basics, gsutil=gcloud storage`**

| Function | Command |
| --- | --- |
| List all buckets and files | gsutil ls, gsutil ls -lh gs://<bucket-name> |
| Download file | gsutil cp gs://<bucket-name>/<dir-path>/package-1.1.tgz . |
| Upload file | gsutil cp <filename> gs://<bucket-name>/<directory>/ |
| Cat file | gsutil cat gs://<bucket-name>/<filepath>/ |
| Delete file | gsutil rm gs://<bucket-name>/<filepath> |
| Move file | gsutil mv <src-filepath> gs://<bucket-name>/<directory>/<dest-filepath> |
| Copy folder | gsutil cp -r ./conf gs://<bucket-name>/ |
| Show disk usage | gsutil du -h gs://<bucket-name/<directory> |
| Create bucket | gsutil mb gs://<bucket-name> |
| Make all files readable | gsutil -m acl set -R -a public-read gs://<bucket-name>/ |
| Config auth | gsutil config -a |

| Grant bucket access | gsutil iam ch user:pporwal@gmail.com:objectCreator,objectViewer gs://<bucket-name> |
| --- | --- |
| Remove bucket access | gsutil iam ch -d user:pporwal@gmail.com:objectCreator,objectViewer gs://<bucket-name> |
| Calculate file sha1sum | gsha1sum syslog-migration-10.0.2.tgz, shasum syslog-migration-10.0.2.tgz |
| Gsutil help | gsutil help gsutil help options |

**`Image & Containers`**

| Function | Command |
| --- | --- |
| List all images | gcloud compute images list |
| List all container clusters | gcloud container clusters list |
| Set kubectl context | gcloud container clusters get-credentials <cluster-name> |

**`GKE`**

| Function | Command |
| --- | --- |
| Set the active account | gcloud config set account <ACCOUNT> |
| Set kubectl context | gcloud container clusters get-credentials <cluster-name> |
| Change region | gcloud config set compute/region us-west |
| Change zone | gcloud config set compute/zone us-west1-b |
| List all container clusters | gcloud container clusters list |

**`IAM`**

| Function | Command |
| --- | --- |
| Authenticate client | gcloud auth activate-service-account --key-file <key-file> |
| list of credentialed accounts | gcloud auth list |
| Set the active account | gcloud config set account <ACCOUNT> |
| Auth to GCP container registry | gcloud auth configure-docker |
| Print token for active account | gcloud auth print-access-token, gcloud auth print-refresh-token |
| Revoke generated credential | gcloud auth <application-default> revoke |

**`Compute Instance`**

| Function | Command |
| --- | --- |
| List all instances | gcloud compute instances list, gcloud compute instance-templates list |
| Show instance info | gcloud compute instances describe "<instance-name>" --project "<project-name>" --zone "us-west2-a" |
| Stop an instance | gcloud compute instances stop myinstance |
| Start an instance | gcloud compute instances start myinstance |
| Create an instance | gcloud compute instances create vm1 --image image1 --tags test --zone "<zone>" --machine-type f1-micro |
| SSH to instance | gcloud compute ssh --project "<project-name>" --zone "<zone-name>" "<instance-name>" |
| Download files | gcloud compute copy-files example-instance:~/REMOTE-DIR ~/LOCAL-DIR --zone us-central1-a |
| Upload files | gcloud compute copy-files ~/LOCAL-FILE-1 example-instance:~/REMOTE-DIR --zone us-central1-a |

**`Compute Columes/Disk`**

| Function | Command |
| --- | --- |
| List all disks | gcloud compute disks list |
| List all disk types | gcloud compute disk-types list |
| List all snapshots | gcloud compute snapshots list |
| Create snapshot | gcloud compute disks snapshot <diskname> --snapshotname <name1> --zone $zone |

**`Compute Network`**

| Function | Command |
| --- | --- |
| List all networks | gcloud compute networks list |
| Detail of one network | gcloud compute networks describe <network-name> --format json |
| Create network with auto subnet | gcloud compute networks create <network-name> |
| Create n/w with subnet | gcloud compute networks subnets create subnet1 --network my-vcp --range 192.168.0.0/24 |
| Get a static ip | gcloud compute addresses create --region us-west2-a vpn-1-static-ip |
| List all ip addresses | gcloud compute addresses list |
| Describe ip address | gcloud compute addresses describe <ip-name> --region us-central1 |
| List all routes | gcloud compute routes list |

**`DNS`**

| Function | Command |
| --- | --- |
| List of all record-sets in my zone | gcloud dns record-sets list --zone my\_zone |
| List first 10 DNS records | gcloud dns record-sets list --zone my\_zone --limit=10 |

**`Compute Firewall`**

| Function | Command |
| --- | --- |
| List all firewall rules | gcloud compute firewall-rules list |
| List all forwarding rules | gcloud compute forwarding-rules list |
| Describe one firewall rule | gcloud compute firewall-rules describe <rule-name> |
| Create one firewall rule | gcloud compute firewall-rules create my-rule --network default --allow tcp:9200 tcp:3306 |
| Update one firewall rule | gcloud compute firewall-rules update default --network default --allow tcp:9200 tcp:9300 |

**`Compute Services`**

| Function | Command |
| --- | --- |
| List my backend services | gcloud compute backend-services list |
| List all my health check endpoints | gcloud compute http-health-checks list |
| List all URL maps | gcloud compute url-maps list |

some points to remember in VPC

there are two modes of VPC

1\. AUTO MODE

2\. CUSTOM MODE

To create VPC, GCP API should be enabled.

A VPC network is global whereas Subnets are regional.

By default in VPC there is 1 subnet for all regions.

Each subnet is region comes up with 4 firewall rules.

    rule1 allow ICMP (ping)

    rule2 allow for internal use in CIDR

    rule3 allow TCP:3389 (RDP)

    rule4 allow TCP:22 (SSH)

all above rules are ingress type rules.

Firewall rules are global, can be applied by instance-level-tag/service account.

By default it blocks all the data coming in, & allows all the data going out.

to automatically create a subnet in every region:

Subnets have a \*/20 CIDR range (e.g. 192.168.0.0/20).
Get all subnets of a VPC network

`$ gcloud compute networks subnets list --filter="network:my-vpc"`

**Filter syntax**

Create a compute instance with a specific machine type

`$ gcloud compute instances create i1 --machine-type=n1-standard-2`

**Machine type**

Default machine type is n1-standard-1 (1 CPU, 3.75 GB RAM)
Instance name argument can be repeated to create multiple instances
Create a compute instance in a specific VPC network and subnet

**`$ gcloud compute instances create i1 --network my-vpc --subnet my-subnet-1`
**
Default VPC network is default

If --network is set to a VPC network with “custom” subnet mode, then --subnet must also be specified
Instance name argument can be repeated to create multiple instances

Create a compute instance with a specific OS image

**`$ gcloud compute instances create i1 --image-family ubuntu-1804-lts --image-project ubuntu-os-cloud`
**
**Images**

Default image family is debian-9

User either --image-family (uses latest image of this family) or --image (a concrete image)
\--image-project serves as a namespace for --image and --image-family(may have multiple images/image families with same name in multiple projects)

List all available images (including projects and families) with:

`$ gcloud compute images list`

Get the VPC network and subnet of a compute instance

**`{$ gcloud compute instances describe i1 --format "value(networkInterfaces.network)" | sed 's|.*/||'$ gcloud compute instances describe i1 --format "value(networkInterfaces.subnetwork)" |sed 's|.*/||'}`
**
**Format syntax**
Get the names of all compute instances

**`$ gcloud compute instances list --format="value(name)"`
**
Can be used, for example, for deleting all existing compute instances:

**`$ gcloud compute instances delete $(gcloud compute instances list --format="value(name)")`
**
Allow ingress traffic to a VPC network

**`$ gcloud compute firewall-rules create my-vpc-allow-ssh-icmp` `--network my-vpc` `--allow tcp:22,icmp` `--source-ranges 0.0.0.0/0`**

0.0.0.0/0 is the default for --source-ranges and could be omitted.

This allows incoming ICMP and SSH (TCP port 22) traffic to any instances in the VPC network from any source (e.g. from the public Internet).

After creating this firewall rule, you’re able to:
Ping instances in the VPC network:

Ping EXTERNAL\_IP
SSH to instances in the VPC network: 

`$ gcloud compute ssh i1`

Note that a newly created VPC network has no firewall rules applied and instances cannot be reached at all (not even from inside the VPC network). 

You have to create firewall rules to make compute instances reachable.
Create a regional static IP address

`$ gcloud compute addresses create addr-1 --region=europe-west6`

Regional IP addresses can be attached to compute instances, regional load balancers, etc. in the same region as the IP address.
The name argument can be repeated to create multiple addresses

One of --global or --region must be specified.
Create a global static IP address

`$ gcloud compute addresses create addr-1 --global`

Global IP addresses can only be attached to global HTTPS, SSL proxy, and TCP proxy load balancers.
The name argument can be repeated to create multiple addresses.

One of --global or --region must be specified.

keep clouding!!
