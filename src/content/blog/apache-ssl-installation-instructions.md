---
title: "Apache SSL Installation Instructions"
description: "Save the primary and intermediate certificates to a folder on the server with the private key."
pubDate: 2014-11-25T22:57:00.015-08:00
updatedDate: 2022-03-19T13:16:09.432-07:00
tags:
  - "apache"
  - "SSL"
originalUrl: "https://cloudnetes.blogspot.com/2014/11/apache-ssl-installation-instructions.html"
---

Save the primary and intermediate certificates to a folder on the server with the private key.

![](/blog/blog-images/b19f24caaf62.jpg)

Open the Apache configuration file in a text editor **httpd.conf** In most cases the <VirtualHost> blocks will be at the bottom of this httpd.conf file. Sometimes you will find the <VirtualHost> blocks in a separate file in a directory like /etc/httpd/vhosts.d/ or /etc/httpd/sites/ or in a file called **ssl.conf**

If you need your site to be accessible through both secure (https) and non-secure (http) connections, you will need a virtual host for each type of connection. Make a copy of the existing non-secure virtual host and change the port from port 80 to 443.

& add below lines as

 ```
 <VirtualHost 192.168.0.1:443>

 DocumentRoot "/var/www/htdocs"
 ServerName www.domain.com
 SSLEngine on
 SSLCertificateFile "/etc/ssl/crt/primary.crt"
 SSLCertificateKeyFile "/etc/ssl/crt/private.key"
 SSLCACertificateFile "/etc/ssl/crt/intermediate.crt"
 </VirtualHost>
```

2.     Change the names of the files and paths to match with your certificate files:

**SSLCertificateFile** should be your primary certificate file for your domain name.

**SSLCertificateKeyFile** should be the key file generated when you created the [CSR](https://www.sslshopper.com/what-is-a-csr-certificate-signing-request.html).

**SSLCertificateChainFile** should be the intermediate certificate file (if any) that was supplied by your certificate authority
(The first directive tells Apache how to find the server certificate file, the second one where the private key is located, and the third line the location of the Trust CA Bundle.)

Save the changes and exit the text editor.
After making changes to your config file it is good practice to check the file for syntax errors using `apachectl configtest`. The command will return Syntax OK if there are no errors.

Restart your Apache web server using one of the following commands:

```
 $ /bin/apachectl startssl && /bin/apachectl restart
```

**Note: make sure to un comment** **mod\_ssl.so** **from httpd.conf**

**Additionally you can generate your apache self signed certificate**

Once you have OpenSSL installed, just run this one command to create an Apache self signed certificate:

 ```
 $ openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
   -keyout mysitename.key -out mysitename.crt
```

You will be prompted to enter your organizational information and a common name. The common name should be the fully qualified domain name for the site you are securing (www.mydomain.com). You can leave the email address, challenge password, and optional company name blank. 

When the command is finished running, it will create two files: 

**mysitename.key** 
**mysitename.crt** self signed certificate file which is valid for 365 days.

Br,
Punit
