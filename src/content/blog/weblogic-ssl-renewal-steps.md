---
title: "Weblogic SSL Renewal Steps"
description: "When you wish to install the security certificate on your WebLogic server, it's a 3 step procedure"
pubDate: 2015-06-03T03:11:00.016-07:00
updatedDate: 2022-03-03T04:38:11.315-08:00
tags:
  - "keystore"
  - "SSL"
  - "weblogic"
originalUrl: "https://cloudnetes.blogspot.com/2015/06/weblogic-ssl-renewal-steps.html"
---

![](/blog/blog-images/avvxseiv9vfpi3pc5pon-8xemxwb0am9sa3esqhu-fd8e6fa869a2.png)

When you wish to install the security certificate on your WebLogic server, it's a 3 step procedure 

**STEP 1: Creating a Keystore (.jks file )** 

(this is the prime entity that stores your certificates)

```
 # Generate a public key
 $ keytool -genkey -alias punit -keyalg RSA -keysize 2048 -keystore identity_keystore.jks -storepass weblogic1

 it will prompt you for following questions:

 What is your first and last name?
 [Unknown]: abc.com
 What is the name of your organizational unit?
 [Unknown]: MW
 What is the name of your organization?
 [Unknown]: CTS
 What is the name of your City or Locality?
 [Unknown]:
 What is the name of your State or Province?
 [Unknown]:
 What is the two-letter country code for this unit?
 [Unknown]: IN

 it will prompt for confirmation so give > yes

 this will create a file named > identityKeystore.jks
```

**STEP 2: Generating CSR (Certificate Signing Request )**

```
 $ keytool -certreq -alias punit -file csr.txt -keystore identity_keystore.jks -storepass weblogic1

 this will create a file named > csr.txt
```

copy the content of csr.txt and send it to the signing authority, they will encrypt their private key into the CSR's and send three files (root.pem, interim.pem & server.pem)

**STEP 3: Importing the Certificates:**

open all the three certificates and copy & paste the content into certificate\_chain.pem in order
server > intermediate > root
now import this certificate\_chain.pem into identity keystore (identity\_keystore.jks) using below command

```
 $ keytool -v -import -alias punit -file certificate_chain.pem -keystore identity_keystore.jks -storepass weblogic1
 or
 $ keytool -importcert -file certificate.cer -keystore keystore.jks -alias "Alias"
```

(use alias & password defined by you while requesting the certificate)

it will prompt you for Yes/No  > Yes

this will import the certificate chain (Root, Interim, Server) into identity\_keystore.jks

if required import (Root, Interim) into trust\_keystore.jks as well (optional/Depends)

(now define the ssl & keystore properties from Admin console for identity & trust keystore and bounce the servers)

\*\*
Select keystore type as: **Custom Identity and Command-Line Trust**
Define attributes for the **Identity keystore**
Custom Identity Keystore File Name - The fully **qualified path** to the Identity keystore
Keystore type - The type of the keystore. Generally, this attribute is **jks**
Keystore PassPhrase—The **password** defined when creating the keystore
\-Enable **SSL port** of server (from server SSL tab)
\-click **continue**
\-click **finish**
\-**Reboot** weblogic server

\*\*

NOTE: for SHA2 certs we need to enable JSSE ssl options corresponding to the servers & sometimes if required add below java\_options also in server starts or in nodemanger.properties files if node manager is configured.

```
 -Dweblogic.security.SSL.enableJSSE=true    (client)

 -Dweblogic.ssl.JSSEEnabled=true            (server)
```
