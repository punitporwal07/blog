---
title: "SSLv3 to TLS1.*"
description: "What is the POODLE Vulnerability? (Padding Oracle On Downgraded Legacy Encryption)"
pubDate: 2016-09-12T00:00:00.022-07:00
updatedDate: 2021-06-04T07:01:03.581-07:00
tags:
  - "Poodle"
  - "SSL"
  - "TLS"
  - "weak SSL"
originalUrl: "https://cloudnetes.blogspot.com/2016/09/sslv3-to-tls1_12.html"
---

![](/blog/blog-images/ssl-7986d9c9d028.png)

**What is the POODLE Vulnerability? (**Padding Oracle On Downgraded Legacy Encryption)

The POODLE vulnerability is a weakness in version 3 of the SSL protocol that allows an attacker in a man-in-the-middle context to decipher the plain text content of an SSLv3 encrypted message.

**Who is affected by this Vulnerability?**

This vulnerability affects every piece of software that can be coerced into communicating with SSLv3. This means that any software that implements a fallback mechanism that includes SSLv3 support is vulnerable and can be exploited.

Some common pieces of software that may be affected are web browsers, web servers, VPN servers, mail servers, etc.

**How Can I Protect Myself?**

Servers and clients should take steps to disable SSLv3 support completely. Many applications use better encryption by default, but implement SSLv3 support as a fallback option. This should be disabled, as a malicious user can force SSLv3 communication if both participants allow it as an acceptable method.

**Steps to disable SSLv3 protocol on JBoss and Weblogic and WebSphere:**

**Steps to disable SSLv3 protocol on JBoss:**

1\. While enabling/configuring the https connection in standalone-full.xml file at location \\standalone\\configuration, specify the ssl protocol

**sslProtocol = "TLS"** key-alias="jbosskey" certificate-key-file="../standalone/configuration/server.keystore"/>

2\.  If you don't specify the sslprotocol attribute in tag, by default it takes SSLv3 for Jboss. We need to explicitly point it to another protocol other than SSlv3

**Steps to disable SSLv3 protocol on Weblogic:**

1\.  The weblogic.security.SSL.protocolVersion command-line argument lets you specify which protocol is used for SSL connections.

2\.  After enabling/configuring the SSL for weblogic server, append the following option to the JAVA\_OPTIONS variable

        -Dweblogic.security.SSL.protocolVersion=TLS1

     NOTE: If you don’t specify the above property, by default it takes SSLv3.

 ```
 Execute below command to check what all protocol   components are working
 openssl s_client -connect -ssl3
 openssl s_client -connect -tls1
 openssl s_client -connect -tls1_1
 openssl s_client -connect -tls1_2
```

\-----------------------------------------------

**Web Services and Client Applications (Outbound Connections)**   
You may also have applications running as a client, (e.g. web services, scripts, or command line) for an outbound ssl connection. Within a Fusion Middleware environment there are also internal processes running where an ssl connection is made, (e.g. OPMN, DMS, EM/FMW Control). To control the outbound connections the following system property is available:
**\-Djdk.tls.client.protocols=TLSv1.0,TLSv1.1,TLSv1.2**

(Example shown to allow all TLS protocols)

Notes:  
• TLSv1.1 and TLSv1.2 protocol versions are supported but were not enabled by default when using earlier versions of JDK 6 and 7. You need to explicitly set them (like above example), else only TLS 1.0 will be used. The JDK 8 default allows both TLS 1.1 and 1.2 by default. You may also set a minimum by removing the older versions, but it is important to consider the external servers the application is connecting to. The protocol will always be negotiated to the highest supported level between the client and server. If you see ssl handshake failures when all components are set to use only TLS 1.2, then look at what the other side supports.   
• The jdk.tls.client.protocols system property is available **since 7u95 and 6u121** to be able to set this. All versions of JDK 8 support this. In other words, older JDK versions only support TLS 1.0 for outbound client connections.   
\-----------------------------------------------

**Steps to disable SSLv3 protocol on WebSphere:**

Login to ibm admin console

1\.  Go to Security > SSL certificate and key management > SSL configurations

2\.  The collection of all SSL configurations is listed. For each SSL configuration in the list the SSL protocol will need to be modified to use TLS.

3\.  Select an SSL Configuration then click Quality of protection (QoP) settings under Additional Properties on the right.

4\.  On the Quality of protection (QoP) settings panel, select TLS form the pull down list in the box labeled Protocol.

5\.  Apply/Save.

6\.  Restart application server

**How to check if SSLv3 is disabled:**

1\.  Install Openssl on windows machine (http://gnuwin32.sourceforge.net/packages/openssl.htm)

2\.  In command prompt run the below commands

     openssl s\_client -connect : -ssl3

3\.  You will see some error something like below

**Loading 'screen' into random state - done**

**CONNECTED(00000170)**

**7468:error:1409E0E5:SSL routines:SSL3\_WRITE\_BYTES:ssl handshake**

**failure:./ssl/s3\_pkt.c:530:**

4\.  If SSLv3 is enabled, and you run the same command. You will see an output something like below

Loading 'screen' into random state - done

CONNECTED(00000170)

Server certificate

 ```
 -----BEGIN CERTIFICATE-----
 MIIB7jCCAZgCEMo7NdTe8IBenV/2c4NGZ/QwDQYJKoZIhvcNAQEEBQAweTELMAkG
 A1UEBhMCVVMxEDAOBgNVBAgTB015U3RhdGUxDzANBgNVBAcTBk15VG93bjEXMBUG
 A1UEChMOTXlPcmdhbml6YXRpb24xGTAXBgNVBAsTEEZPUiBURVNUSU5HIE9OTFkx
 EzARBgNVBAMTCkNlcnRHZW5DQUIwHhcNMTQxMTE4MTIxMTQ2WhcNMjkxMTE5MTIx
 MTQ2WjB8MQswCQYDVQQGEwJVUzEQMA4GA1UECAwHTXlTdGF0ZTEPMA0GA1UEBwwG
 TXlUb3duMRcwFQYDVQQKDA5NeU9yZ2FuaXphdGlvbjEZMBcGA1UECwwQRk9SIFRF
 U1RJTkcgT05MWTEWMBQGA1UEAwwNU1VMVEEwMi04eDY0ZTBcMA0GCSqGSIb3DQEB
 AQUAA0sAMEgCQQDDWNUgPAmWB9f/4mpKEXeNG13gVjHk4GTpnUuEVisBkJGw86oY
 u+JqjgtnlXdbRIUx0MYDl5noEXK114zwcq4vAgMBAAEwDQYJKoZIhvcNAQEEBQAD
 QQCR34QFhqqjKoP1al13jZlJGvmBX5zZl0Hxh7IjFiwo68LrSiPLHNL4z9PHbuRn
 HwisRAXddwAImpisalHRTCG+
 -----END CERTIFICATE-----
```

br,

Punit
