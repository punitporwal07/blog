---
title: "SHA2 on Oracle Http Server"
description: "OHS has Limitation to work with SHA2 certificates and supports from 11.1.1.9 onwards"
pubDate: 2017-04-18T05:22:00.009-07:00
updatedDate: 2021-11-14T21:27:15.297-08:00
tags:
  - "OHS"
  - "sha2"
  - "SSL"
originalUrl: "https://cloudnetes.blogspot.com/2017/04/sha2-on-oracle-http-server.html"
---

OHS has Limitation to work with SHA2 certificates and supports from 11.1.1.9 onwards

Here are the steps to configure SHA2 certificate over OHS server

```
1 generate a private key
$ openssl genrsa -des3 -out private.key 2048
(give password )

2 generate CSR
$ openssl req -new -sha256 -key private.key -out abc.csr

3 Create openssl wallet
$ openssl pkcs12 –export –out ewallet/ewallet.p12 –inkey priv_key_location \   –in server_cert_location –certfile root_cert_location

  verify It using below command. You will see ‘User and trusted certificate’   as shown in green below(if above command used correctly)
$ orapki wallet display -wallet ewallet/
**
User Certificates:
Subject:    CN=www.abc.com,O=GOOGLE INC,L=London,ST=London,C=GB
Trusted Certificates:
Subject:    CN=VeriSign Universal Root Certification Authority,OU=(c) 2008 VeriSign\,            Inc. - For authorized use only,OU=VeriSign Trust Network,O=VeriSign\, Inc.,C=US
**

4 Extract user.crt  from the wallet created in previous step
$ orapki wallet export -wallet /opt/software/wt/ohs_instance/config/OHS/ohs1/keystores/ewallet/ \  -dn "CN=www.abc.com,O=GOOGLE INC,L=London,ST=London,C=GB" -cert user.crt -pwd **

Extract the intermediate and root certificate in base 64 format from certificate received by CA.(from windows machine)

5 Create chain certificates ( copy certificates into single file chain.crt)
user --> Intermendiate --> root

6 Create a wallet using openssl
$ openssl pkcs12 –export –out /ohs_instance/config/OHS/ohs1/keystores/openssl/ewallet.p12 \  –inkey private.key –in user.crt –certfile chain.crt

7 Convert openssl wallet to JKS
$ orapki wallet pkcs12_to_jks -wallet /ohs_instance/config/OHS/ohs1/keystores/openssl \   -pwd ** -jksKeyStoreLoc /ohs_instance/config/OHS/ohs1/keystores/punit.jks -jksKeyStorepwd welcome1

8 Create an auto login wallet using orapki
$ orapki wallet create -wallet /ohs_instance/config/OHS/ohs1/keystores/abc -auto_login -pwd welcome1

9 Convert jks to wallet
$ orapki wallet jks_to_pkcs12 -wallet /ohs_instance/config/OHS/ohs1/keystores/dslcheck -pwd welcome1 \   -keystore /opt/software/wt/ohs_instance/config/OHS/ohs1/keystores/punit.jks -jkspwd welcome1

10 verify  wallet
 $ orapki wallet display -wallet /ohs_instance/config/OHS/ohs1/keystores/abc/
this should show below result and include all the certificates

**
User Certificates:
Subject:    CN=www.abc.com,O=GOOGLE INC,L=London,ST=London,C=GB
Trusted Certificates:
Subject:    CN=www.abc.com,O=GOOGLE INC,L=London,ST=London,C=GB
Subject:    CN=Symantec Class 3 Secure Server CA - G4,OU=Symantec Trust Network,O=Symantec Corporation,C=US
Subject:    CN=VeriSign Class 3 Public Primary Certification Authority - G5,OU=(c) 2006 VeriSign\,             Inc. - For authorized use only,OU=VeriSign Trust Network,O=VeriSign\, Inc.,C=US
**
```

**Refer the wallet path into ssl.conf & httpd.conf as**

**SSLWallet "/opt/software/wt/ohs\_instance/config/OHS/ohs1/keystores/abc"**

**Restart the instance.**

**Refer this to check your installed certificate**

**[https://www.sslshopper.com/ssl-checker.html#hostname=abc.com](https://www.sslshopper.com/ssl-checker.html#hostname=abc.com)**
