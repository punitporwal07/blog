---
title: "Understanding network concepts in AWS"
description: "Creating Virtual private cloud aka VPC"
pubDate: 2018-09-15T23:11:00.031-07:00
updatedDate: 2023-08-21T07:37:13.504-07:00
tags:
  - "AWS"
  - "VPC"
  - "VPN"
originalUrl: "https://cloudnetes.blogspot.com/2019/07/things-to-know-in-aws-vpc-vpn.html"
---

![](/blog/blog-images/amz-n-fd76f6390ce4.png)

**Creating Virtual private cloud aka VPC
**

VPC is a virtual network dedicated to your AWS account & you can launch your AWS resources like EC2 instance into VPC

while creating VPC you must specify a range of IPv4 addresses in form of a CIDR block.

**CIDR** block is a Classless inter-domain routing which is a set of internet protocol (IP) standards that are used to create unique identifiers for networks and individual devices in it.
_The IP addresses allow particular information packets to be sent to specific computers. Shortly after the introduction of CIDR, technicians found it difficult to track and label IP addresses, so a notation system was developed to make the process more efficient and standardized. That system is known as CIDR notation._

for ex: defining a CIDR block:

/32 represents the number of bits in the mask

**CIDR                              Subnet Mask                                Total IP's**
  /32                             255.255.255.255                                1

\--------------
10.0.0.0/26

start with 10.0.0.0

formula is 2 ^(32-26) = 2^6 = 64  i.e. 64 IP's in this block

End with 10.0.0.63

so out of 64 IP we can subdivide it into 4 subnet of 16 IPs each

i.e. 10.0.0.0/28 = 16 IP's

1st subnet range :  10.0.0.0  - 10.0.0.15
2nd subnet range: 10.0.0.16 - 10.0.0.31
3rd subnet range: 10.0.0.32 - 10.0.0.47
4th subnet range: 10.0.0.48 - 10.0.0.63

lets say we have created 2 private & 2 public subnet

out of 16 IP's in each subnet, only 11 will be available to use. whereas 5 will be blocked for internal use (first 4 and last 1 )

-   with every VPC it will create a route table by default
-   1 subnet can have only one route table
-   but 1 route table can be associated with multiple subnets
-   only 1 IGW can be attached to a VPC 
-   you need to keep NAT gateway in public subnet always which helps in all Internet-bound traffic

for NACL Inbound rules in your VPC: number with smaller value will get higher rank & will be prioritized and will overwrite the other rule of its higher value.

**Network ACLs aka Firewall for VPC**
( you can limit the traffic inbound/outbound traffic coming to your subnet by applying rules \[\*\] )

A network access control list (ACL) is an optional layer of security for your VPC that acts as a firewall for controlling traffic in and out of one or more subnet.
You might set up network ACLs with rules similar to your security groups in order to add an additional layer of security to your VPC.

**Creating Virtual private network aka VPN

![](/blog/blog-images/vpn-78b74e5a7e28.png)

**

To set up a VPN we need to create two gateways

A customer gateway representing the on-prem end which specifies the public IP of the router

A virtual private gateway representing the cloud-end of the tunnel, and use both of them to create a VPN/site to site connection

**What is a transit Gateway**? 

A transit gateway is a network transit hub that you can use to interconnect your virtual private clouds (VPC) and on-premises networks.

**What is a VPC Peering?**

A VPC peering connection is a networking connection between 2 VPCs only that enables you to route traffic between them using private IPv4/IPv6 addresses. 

Transitive Peering does not work for VPC peering connections. So, if you have a VPC peering connection between VPC A and VPC B (pcx-aaaabbbb), and between VPC A and VPC C (pcx-aaaacccc). Then, there is no VPC peering connection between VPC B and VPC C. 

Instead of using VPC peering, you can use an AWS Transit Gateway.

**IG vs NAT vs ELB**

the direction of traffic is :

traffic that goes from private instance **\>** outside world goes via NAT gateway ~ forward proxy
traffic which comes from outside world **\>** private instance comes via ELB ~ reverse proxy

**Internet Gateway -** For a subnet to be accessible to the internet an AWS internet gateway is required. An internet gateway allows internet traffic to and from your VPC.
**NAT** should always be placed in **public SUBNET** with an **Elastic IP** ~ cannot span more than 1 subnet

**Route table -** A Route table specifies which external IP addresses are contactable from a subnet or internet gateway.

**ELB** can put across multiple SUBNET ~ can span across subnet

ELB Application LB (app level LB) & Classic LB (n/w layer LB)

\- private
\- public
(depending on the subnet you put it will be private/public)

_**ELB is a managed service ~ distributes incoming traffic from the internet ~ does health checks, if any instance is unhealthy will not forward the traffic**_

types of LB

1\. Classic LB: obsolete now
2\. Application LB: Layer 7 PDNTSP**A**

-   Supports HTTP & https 
-   due to the security group, you can do port filtering 
-   the header may be modified 
-   SSL Offloading
-   Path-based routing & diff logic 
-   you need a target group (instances) to route traffic

3\. N/W LB: Layer 4 PD**N**

-   supports TCP 80/8080
-   coming traffic
-   absence of security group 
-   no header modification
-   no logic can be applied here
-   static IP is possible

now you can send traffic to a target group that is on-prem and not on AWS via giving target type as IP

_keep refreshing more to come..._
