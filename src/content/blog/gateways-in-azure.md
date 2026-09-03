---
title: "Gateways in Azure"
description: "There are different gateways in public cloud networking that helps you to connect with different systems."
pubDate: 2020-05-11T06:14:00.104-07:00
updatedDate: 2023-05-12T07:34:30.002-07:00
tags:
  - "Azure"
  - "VPN"
originalUrl: "https://cloudnetes.blogspot.com/2020/05/gateways-in-azure.html"
---

![](/blog/blog-images/avvxsei6efeylx2e47qvucantca1q-qqrqweneot-426f6054d1e5.png)

There are different gateways in public cloud networking that helps you to connect with different systems.

**Virtual Network Gateway** a.k.a **VPN Gateway** Azure VPN Gateway **connects your on-premises networks** to Azure through Site-to-Site VPNs in a similar way that you set up and connect to a remote branch office. The connectivity is secure and uses the industry-standard protocols Internet Protocol Security (IPsec) and Internet Key Exchange (IKE).

In simple terms, azure VPN Gateway provides a secure and reliable networking solution for **connecting on-premises infrastructure to Azure virtual networks over the internet**.

there are different configurations available for VPN gateway connections

1.  [Site-to-site VPN](https://learn.microsoft.com/en-us/azure/vpn-gateway/design?wt.md_id=searchAPI_azureportal_inproduct_rmskilling&sessionId=3697cb7b703448bca2eea6bf111991c2#s2smulti)
2.  [Point-to-site VPN](https://learn.microsoft.com/en-us/azure/vpn-gateway/design?wt.md_id=searchAPI_azureportal_inproduct_rmskilling&sessionId=3697cb7b703448bca2eea6bf111991c2#P2S)

**Site-to-site VPN**
A Site-to-site (S2S) VPN gateway connection is a connection over IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. S2S connections can be used for cross-premises and hybrid configurations. A S2S connection requires a VPN device located on-premises that has a public IP address assigned to it.

**![](/blog/blog-images/avvxsegcypu2qwu5imq9x7owdrdh3kgs-z7ymu6u-afb1364497ff.png)**

**ExpressRoute Gateway**
It provides a dedicated, private connection **between on-premises** infrastructure **and Azure data centers**.

**NAT Gateway** 
A NAT (Network Address Translation) Gateway in Azure is a service that **enables outbound internet connectivity** for resources deployed in a virtual network. NAT Gateway provides a static public IP address for resources within the virtual network to communicate with resources outside the network.

In Azure, NAT Gateway is used to translate private IP addresses used by resources within the virtual network to a public IP address that can be accessed over the internet. This allows resources in the virtual network to securely communicate with services outside of the network, such as Azure services, internet resources, or on-premises resources connected via a VPN or ExpressRoute.

**Application Gateway** is as=as WAF in AWS
Azure Application Gateway is a service that helps **manage and scale traffic to multiple web applications** running in your Azure virtual network. It acts as a traffic cop, routing requests to the appropriate server based on your defined rules. It can also help improve the performance and security of your web applications.
