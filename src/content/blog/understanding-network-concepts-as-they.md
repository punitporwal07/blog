---
title: "Understanding network concepts as they relate to Azure"
description: "You should not directly access a Virtual Machine placed in a harmonized VNET instead, it has to be accessed via a Bastion instance which is secure & is the recommended method."
pubDate: 2020-04-28T07:41:00.031-07:00
updatedDate: 2023-05-10T01:41:03.525-07:00
tags:
  - "Azure"
originalUrl: "https://cloudnetes.blogspot.com/2020/04/understanding-network-concepts-as-they.html"
---

![](/blog/blog-images/31e24fffe2e2.jpg)**Things to remember in** **Azure Networking

**You should not directly access a Virtual Machine placed in a harmonized VNET instead, it has to be accessed via a Bastion instance which is secure & is the recommended method.

When connecting a VM from Bastion-instance the VM will only have internet access if a **NAT-Gateway** is attached to the VNET of the Virtual Machine or if a public IP is assigned to it.

![](/blog/blog-images/avvxsej4ncyqacphtdp-gokhuernakinn7e27tcy-e2e1ccfd6f04.png)

But, if you are unable to access the Internet even after setting up NAT-Gateway -

**start troubleshooting based on the possible scenarios**

As depicted above, consider you have set up a **NAT Gateway** under the **vnet** test-vnet-uksouth-00a5cfe as shown above,

you are using both the single IP and IP prefix/31 under the NAT Gateway configuration.

Even after the NAT Gateway configuration, you cannot access the internet from your **VM** client-machine.

This could be possible because - The **subnet** test-sn-0 under the vnet might have a **route table** applied test-sn-0-uksouth-rt.

And the route table might have a route entry with 0.0.0.0/0 and the next hop is virtual appliance 10.x.x.4.

Because of this route, the NAT Gateways' default route is not getting preference over your custom route table, 

Once we remove the 0.0.0.0/0 from under the **route table** test-sn-0-uksouth-rt, your VM will be able to access the internet.

Regarding the SSH access to the VM, note that NAT Gateway is for outbound traffic requests and its return traffic. Kindly refer- [https://learn.microsoft.com/en-us/azure/virtual-network/nat-gateway/nat-gateway-resource#coexistence-of-outbound-and-inbound-connectivity](https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Flearn.microsoft.com%2Fen-us%2Fazure%2Fvirtual-network%2Fnat-gateway%2Fnat-gateway-resource%23coexistence-of-outbound-and-inbound-connectivity&data=05%7C01%7Cpunit.2.porwal%40bt.com%7C2e03a47aefa946c1919908db458ae8cd%7Ca7f356889c004d5eba4129f146377ab0%7C0%7C0%7C638180235134240646%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=qiiy%2FOKavxVUJ0u7nstxl9zo89rJCwU0JHKymfxylyI%3D&reserved=0)

For incoming traffic requests for SSH, you can have individual instance public ip assigned on VM nic and have NSG access allowed. Instance IP will also allow you the outbound access to the internet.
