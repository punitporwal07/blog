---
title: "SSL Cheatsheet"
description: "ORACLE-JRE"
pubDate: 2015-06-25T03:57:00.099-07:00
updatedDate: 2024-01-03T09:49:47.826-08:00
tags:
  - "keytool"
  - "SSL"
originalUrl: "https://cloudnetes.blogspot.com/2015/06/ssl.html"
---

**ORACLE-JRE**

![](/blog/blog-images/ssl-8610472303f5.png)

```
# to create a keystore.jks file (pair of keys)
$ keytool -genkey -keyalg RSA -alias benefits -keystore keystore.jks \
  -storepass 123456 -keysize 2048

# to export/store a certificate in a file
$ keytool -export -alias benefits -file root.cer -keystore identity.jks -storepass mypass

# to import a certificate into keystore
$ keytool -importcert -file certificate.cer -keystore keystore.jks -alias "Alias"

# to create a csr request in form of myapp.csr file
$ keytool -certreq -alias benefits -keystore keystore.jks -file myapp.csr

# to generate the certificate as myapp.crt
$ keytool -exportcert -alias benefits -keystore keystore.jks -v -file myapp.crt

# command to convert .pfx to .jks
$ keytool -importkeystore -srckeystore abc.com.pfx \
  -destkeystore servercertstore.jks -srcstoretype PKCS12 \
  -deststoretype JKS -srcstorepass w3bl0g1c -deststorepass pa55w0rd -noprompt

# command to change alias name
$ keytool -changealias -alias "oldAlias" -destalias "newAlias" -keypass w3bl0g1c \
  -keystore servercertstore.jks -storepass pa55word

# command to delete a certificate from Keystore
$ keytool -delete -noprompt -alias ${cert.alias}  -keystore ${keystore.file}  -storepass ${keystore.pass}
```

**IBM-JRE**

```
 # to create jks type DB
 $ ikeycmd -keydb -create -db keystore.jks -pw password -type jks -expire 365

 # request for CSR
 $ ikeycmd -certreq -create -db keystore.jks -label mylabel \
   -dn "CN=mysite.com,O=cloudnetes,OU=IT,C=IN" -size 2048  -sig_alg SHA256_WITH_RSA -file mysite.com.csr

 # import certficates into DB
 $ ikeycmd -cert -add -db keystore.jks -label ca_intermediate -file ca-inter.crt
 $ ikeycmd -cert -add -db keystore.jks -label ca_root -file ca-root.crt

 # validate personal/end-entity cert
 $ ikeycmd -cert -receive -file mysite-identity.crt -db keystore.jks
```

**IBM-MQ** 

```
  # add a cert in cert-key DB
 $ runmqakm -cert -add -db keystore.kdb -stashed -label ca_root -file ca_root.crt

 # check all certs
 $ runmqakm -cert -list -db keystore.kdb -stashed

 # delete a cert
 $ runmqakm -cert  -delete  -label mylabel -db keystore.kdb -stashed

 # check cert expiry
 $ runmqakm -cert -details -db keystore.kdb -stashed  -label mylabel | grep -i "Not After"
```

**CERTUTIL**

```
# to view certificate installed on sunone instance
$ certutil -d -P https-pricer-pfix-wxvrw99a0016- -L -n Server-Cert

# to list certificate installed on sunone instance with alias name
$ certutil -d /opt/sunone617/suitespot/alias \
  -P https-saXXXit2.abc.com-wsszw2057- -L -n Server-Cert

# listing the details of Server-Cert
$ certutil -L -n Server-Cert -d /instance-name/ -P instance-name

# Generating a CSR & output it to the file serverCert.req
$ certutil -R -s "CN=abc.com,OU=IT, O=CTS, l=Bangalore, st=karnataka, c=IN" -o serverCert.req -a -d /instance_path/P instance -g 2048

# Deleting the existing cert with name Server-Cert
$ certutil -D -n Server-Cert -d /Instance-Name/ -P instance-name-

# Import the cert
$ certutil -A -n Server-Cert -t "u,u,u" -i /instance-path/instance.pem -d /instance-name -P https-instance
```

**OPENSSL**

```
# Decode a CSR
$ openssl req -in mycsr.csr -noout -text

# Decode a certificate
$ openssl x509 -in certificate.crt -text -noout

# Generate a key pair: (.key)
$ openssl genrsa -des3 -out |.key file name| 2048

# Generate self-signed certificate
$ openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt

# Generate CSR to request CA-signed certificate $ openssl req -new -newkey rsa:4096 -nodes -keyout server.key -out server.csr

# Create certificates: (.pem)
$ openssl x509 -in name.crt -noout -text

$ openssl x509 -subject -dates -issuer -noout -in name.crt

# To open key file and check modules
$ openssl rsa -noout -text -in application.key -modulus
```

**CERTIFICATE CHECK/DETAILS** 

```
$ openssl x509 -in certName.crt  -noout -text
$ openssl x509 -subject -dates -issuer -noout -in file

$ keytool -list -v -keystore keystoreName.jks

$ certutil -L -d certDbName-cert8.db

# Print available ciphers in any Linux host
$ openssl ciphers -v | awk '{print $2}' | sort | uniq
```

**CURL WITH JAVA KEYSTORE**

 Curl doesn't support Java Keystore file, so the file should be converted to a PEM format(PKCS12).

 It consists of the following 3/4 steps:

 **STEP1** - Convert keystore to p12 file

 **STEP2** - Convert p12 file to pem file
 **STEP3** - Export Private key (valid for 2 way mTLS)

 **STEP4** - Run curl command with pem files

 **1way TLS/Authentication**

 **STEP1** - Convert keystore to p12 file

 keytool -importkeystore -srckeystore keystore.jks -destkeystore keystore.pk12 -srcstoretype JKS -deststoretype PKCS12

 **STEP2** - Convert P12 to pem file

 openssl pkcs12 -in truststore.pk12 -out trusted-certs.pem

 **STEP3 -** `Run curl command with pem files **`

 curl secret --cacert trusted-certs.pem https://localhost:8443/api/hello

 **2way TLS/Authentication also known as Mutual Authentication**

 **STEP1** - Convert keystore to p12 file

 keytool -importkeystore -srckeystore keystore.jks -destkeystore keystore.p12 -srcstoretype JKS -deststoretype PKCS12

 **STEP2** - Convert p12 file to pem file

 openssl pkcs12 -in identity.p12 -nokeys -out client-cert.pem

 openssl pkcs12 -in identity.p12 -nocerts -out client-key.pem

 **STEP3** - Export Private key

 `openssl pkcs12 -in` `truststore``.pk12  -nodes -nocerts -out client-key.pem`

 **STEP4 -** Run curl command with pem files

 curl --key client-key.pem --cert client-cert.pem --cacert trusted-certs.pem https://localhost:8443/api/hello
