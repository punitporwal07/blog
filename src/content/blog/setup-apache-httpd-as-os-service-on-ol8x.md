---
title: "Setup httpd as os-service on OL8.x"
description: "This article will help you to setup Apache httpd as an OS service on OL8.x releases"
pubDate: 2020-07-07T04:07:00.029-07:00
updatedDate: 2023-08-26T14:43:37.740-07:00
tags:
  - "apache"
originalUrl: "https://cloudnetes.blogspot.com/2020/07/setup-apache-httpd-as-os-service-on-ol8x.html"
---

This article will help you to setup Apache httpd as an OS service on OL8.x releases

NOTE - should be run using sudo/root privileges.

![](/blog/blog-images/41093ffe6b5b.jpg)

**STEP 1 - Verify Package** 

before you install httpd as an OS service - confirm if it is already installed in your server by running any command as below

```
$ systemctl status httpd or ​​​​​​​rpm -qi httpd
```

​​​​​​​if the system is unable to find the service, proceed to the next step

  

**STEP 2 - Install httpd**

```
$ yum install httpd
```

this will install the latest package available from the server repository - at the time of writing this article 2.4.37 is the latest offering by Oracle in OL8.x

upon successful installation, you should able to see the httpd package available now.

**STEP 3 - verify package post-installation** 

```
$ systemctl status httpd
```

the above confirms the package is installed now, however at default the service is inctive and disabled

**STEP 4 - Start the service**

```
$ systemctl start httpd
$ systemctl status httpd
```

this shows apache is up and running now, check the process by running the regular ps command

```
$ ps -ef  | grep httpd
```

the conf file of this package can be found under - _/etc/httpd/conf_

verify the newly installed apache by running the following commands

```
$ httpd -v
$ rpm -qi httpd
```

Additionally, you can set this apache instance as an auto boot-up service post VM reboot by running the following command -

```
$ sudo chkconfig httpd on
```

**How to configure 2nd Instance of Apache in the same server**

Copy the whole httpd configure directory "_/etc/httpd_" to "_/etc/httpd**1**_"

```
$ cp -fr /etc/httpd /etc/httpd1
```

Modify the httpd directives which may be a conflict if running multiple instances at the same time in file "_/etc/httpd1/conf/httpd.conf_"

```
ServerRoot
Listen
PidFile
ErrorLog
CustomLog

For example, we changed as following in "/etc/httpd1/conf/httpd.conf" for 2nd Instance

ServerRoot /etc/httpd1
Listen 8080
PidFile run/httpd1.pid
ErrorLog logs/httpd1_error_log
CustomLog logs/httpd1_access_log combined
```

Start Apaches

```
$ httpd -f /etc/httpd1/conf/httpd1.conf -k start
$ httpd -f /etc/httpd/conf/httpd1.conf -k start
```

**How to configure SSL module**

install the mod\_ssl module by running the following command -

```
$ yum -y install mod_ssl
```

it will install the required module and place it under

```
/usr/lib64/httpd/modules/mod_ssl.so
```

load this module in _/etc/httpd/conf/httpd.conf_ as -

```
LoadModule ssl_module modules/mod_ssl.so
```

configuration requires certificates and start the httpd service as usual

**How to install a Signed Certificate into Apache Instance**

```
Generate CSR, that will generate server.key & server.csr
​​​​​​​
$ openssl req -new -newkey rsa:4096 -nodes -keyout server.key -out server.csr
```

Get CSR signed by an authorized CA

Copy the server/end-entity certificate provided by CA into a _server.crt_ file Update the certificate & key file into _ssl.conf_ & comment the default self-signed certificate.

```
$ vi /etc/httpd/conf.d/ssl.conf

#SSLCertificateFile /etc/pki/tls/certs/localhost.crt
SSLCertificateFile "/etc/httpd/ssl/server.crt"

#SSLCertificateKeyFile /etc/pki/tls/private/localhost.key
SSLCertificatekeyFile "/etc/httpd/ssl/server.key"
```

restart your httpd service

You should be able to access _index.html_ on HTTPS now.

**
In case of a self-signed certificate**

Configure the SSL module as mentioned above and add port 443 in the following lines in /etc/httpd/conf/httpd.conf and restart the Apache.

Listen 80
Listen 443

ServerName 10.20.30.40:80
ServerName 10.20.30.40:443

Please note that with the self-signed certificate, you will get a warning while testing on _https://$hostname:443/_ because self-signed certificate is the problem, the browser could not trust the server due to its certificate signed by itself but not by a trusted certificate authority (CA).​​​
​​​​
​​​​​​​Known Issue **-**

After enabling mod\_wl\_24.so for the WebLogic proxy you might see the following issue while starting the httpd service -

`cannot load modules/mod_wl_24.so into server: libdms2.so: cannot open shared object file:`

**How to fix -** 

Since systemctl by default does not load **LD\_LIBRARY\_PATH** so you need to manually configure it.

```
$ vi /usr/lib/systemd/system/httpd.service
```

Under \[**Service**\] add the following line -

**LD\_LIBRARY\_PATH=${LD\_LIBRARY\_PATH}:/usr/lib64

**Reload system daemon

```
$ systemctl daemon-reload​​​​​​​
```

Now copy only the missing modules or libs from _/usr/lib64/httpd/modules/_ to _/usr/lib64/_

Ex -
`cp -rp /usr/lib64/httpd/modules/libonssys.so  /usr/lib64/cp -rp /usr/lib64/httpd/modules/libonsssl.so  /usr/lib64/cp -rp /usr/lib64/httpd/modules/libdms2.so    /usr/lib64/`

restart httpd

```
$ systemctl start httpd
```
