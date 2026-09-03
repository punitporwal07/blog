---
title: "Why to use SSL certificate & when to Use a Self-Signed Certificate"
description: "This video helps you to understand SSL in the simplest way!!"
pubDate: 2014-11-25T22:58:00.008-08:00
updatedDate: 2023-09-10T14:27:05.503-07:00
tags:
  - "selfsigned"
  - "SSL"
originalUrl: "https://cloudnetes.blogspot.com/2014/11/when-to-use-self-signed-certificate.html"
---

This video helps you to understand SSL in the simplest way!! 

Video: [https://www.youtube.com/watch?v=SJJmoDZ3il8](https://www.youtube.com/watch?v=SJJmoDZ3il8)

You should never use a self-signed certificate for any e-commerce website or any site that transfers valuable personal information like credit cards, social security numbers, etc.

An SSL certificate is necessary for more than just distributing the public key: if it is signed by a trusted third party, it verifies the identity of the server so clients know they aren’t sending their information to the wrong person.

**So what is a self-signed certificate?** 
It is a certificate that is signed by itself rather than a trusted third party. Isn’t that bad? In most cases, yes. You will almost never want to use a self-signed certificate on a public apache server that requires anonymous visitors to connect to your site because they could easily become a victim of a man-in-the-middle attack. However, self-signed certificates have their place:

-   Self-signed certificates can be used on an Apache development server. There is no need to spend extra cash buying a trusted certificate when you are just developing or testing an application.
-   Self-signed certificates can be used on an intranet. When clients only have to go through a local intranet to get to the server, there is virtually no chance of a man-in-the-middle attack.
-   Self-signed certificates can be used on personal sites with few visitors. If you have a small personal site that transfers non-critical information, there is very little incentive for someone to attack the connection.

Just keep in mind that visitors will see a warning in their browsers when connecting to an Apache site that uses a self-signed certificate until it is permanently stored in their certificate store.

**For example:** 
WebLogic Server is configured by default with Demo Identity and Demo Trust. To use these, you need to enable the SSL port under the General Tab of the server and generate a demo certificate using keytool utility of weblogic, and WLS will start listening over SSL on that port.

To generate the certificates, you need to use keytool. It is a standard java keystore utility. This is included with the Java SE JDK as well as the JRockit JDK.

A keystore is a database of key material. Key material is used for a variety of purposes, including authentication and data integrity.

There are two types of keystores:

**identity keystores:**  An identity keystore contains the server's private key and is therefore referred to as the identity. This keystore can contain more than one private key.

**trust keystores:** A trust keystore contains the root and intermediate certificates which are trusted by the server.

However, using these demo certificates is not recommended in a production environment because they do not provide adequate security. Instead of using the demo certificates, we can either get our certificates signed by a third-party certifying authority or use self-signed certificates (use our own root ca which we can use to sign our own certificates).

since for demonstration purpose we cannot afford a _certificate signing authority_ to sign our certificate, we use self signed certificate.
For instance, lets try to install one on a weblogic server

**Step1:** create a private key/identity store:

```
$JAVA_HOME/keytool -genkey -alias slefcert -keyalg RSA -keypass weblogic1 -keystore identity.jks -storepass weblogic1 -validity 365
```

you will be asked a few questions like:
Organisation Unit=?
Organisation=?
City=?
State=?
County=?
after entering all the above details type 'yes'

**Step2**: being a self-signed, export the same cert into identity store (root cert)

```
$JAVA_HOME/keytool -export -alias mycert -file root.cer -keystore identity.jks -storepass weblogic1
```

**Step3:** import same cert into trust store which will be root.cert

```
$JAVA_HOME/keytool -import -alias selfcert -trustcacerts -file root.cer -keystore tust.jks -storepass weblogic1
```

this will list out your certificate request details
owner:
Issuer:
Serial number:
Validity:
certificate fingerprints:
Algorithms:
Version:

which will ask you to trust this certificate? : 'yes' 
and it will add the certificate to your keystore

now after successful generation of certs, let weblogic know what have you generated 

login to console & navigate to : servers > serverName > configuration > keystore

\-custom identity keystore : path to your identity.jks
\-custom identity keystore type: jks
\-custom identity keypass : weblogic1
\-custom identity identity store pass : weblogic1
\-custom trust keystore: path to your trust.jks
\-custom trust keystore type: jks
\-custom trust keypass: weblogic1
\-custom trust trust store pass: weblogic1

navigate to SSL tab and update following:

\-private key alias: selfcert
\-private key pass: weblogic1

enable SSL port by navigation to configuration > general and update the port number

restart the service for changes to take effect

now try to access the service on https://localhost:7002/console 
_(here I have installed cert on admin server of weblogic domain)_

\--
