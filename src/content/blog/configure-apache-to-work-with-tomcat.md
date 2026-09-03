---
title: "Things to know in Apache"
description: "Tomcat with Apache:"
pubDate: 2015-09-08T03:11:00.005-07:00
updatedDate: 2021-08-22T03:28:12.138-07:00
tags:
  - "apache"
originalUrl: "https://cloudnetes.blogspot.com/2015/09/configure-apache-to-work-with-tomcat.html"
---

**Tomcat with Apache:

![](/blog/blog-images/2b6d655d0cf8.jpg)

**

-   Apache needs to load a "adapter" module, which uses a certain protocol, such as Apache JServ Protocol (AJP), to communicate with the Tomcat, via another TCP port (port 8009 in the default configuration).
-   When Apache receives an HTTP request, it checks if the request belongs to Tomcat. If so, it lets the adapter takes the request and forwards it to Tomcat, as illustrated below

![](/blog/blog-images/apacheplustomcat-0d0b40b66646.png)

![](/blog/blog-images/apache-tomcat-integration-5aeec13f3717.jpg)

**mod\_jk.so**

\- Place the module **mod\_jk.so** inside modules directory of Apache
\- Load this module in **httpd.conf** with below parameters

`LoadModule jk_module modules/mod_jk.so JkWorkersFile /apps/apache/httpd-2.2.29/conf/workers.properties |IfModule jk_module| |Location /*/WEB-INF/*| deny from all |/Location| JkMount /manager/* worker1 |/IfModule|`

\- Create **workers.properties** file inside apache/conf folder with below parameters

`JkLogFile /apps/apache/httpd-2.2.29/logs/mod_jk.log JkShmFile /apps/apache/httpd-2.2.29/logs/mod_jk.shm JkLogLevel info JkLogStampFormat "[%a %b %d %H:%M:%S %Y]" JkMount /manager/ worker1 worker.list=worker1 #Set worker properties worker.worker1.type=ajp13 worker.worker1.host=localhost worker.worker1.port=8009`
`now just try hitting URL : http://localhost:ApachePort/TomcatApplicationContext` 

which means you are hitting Apache Port & its redirecting to Tomcat app

**mod\_rewrite.so**
 
\- Load module in **httpd.conf**
`LoadModule rewrite_module modules/mod_rewrite.so`
\- Allow override in **httpd.conf** to all under below two parameters as
`|Directory|Options FollowSymLinksAllowOverride allOrder allow,denyallow from all |/Directory| |Directory "/apps/apache/httpd-2.2.29//htdocs| AllowOverride allOrder allow,denyAllow from all |/Directory|`

\- add (define rewrite rule) in **.htaccess** which is hidden in Document Root /htdocs as

`RewriteRule ^/?index.html$ index1.html [L]`

\- to test create another file index1.html as defined in the rule and try hitting the index.html, you will see the magic of rewrite module here as it shows the content of index1.html keeping the context URL as it is i.e index.html

**Alias**

it allows you to point your Web server to directories outside your document root,Once set up correctly, any URL ending in the alias will automatically resolve to the path set in the alias

\- define Alias in **httpd.conf** as
`Alias /webpath /full/filesystem/path`

## Things to know in Apache

**1: mod\_rewrite**
mod\_rewrite is the rule-based rewrite engine that allows Apache to rewrite requested URLs on the fly. This module basically catches incoming URL requests and rewrites them as needed. These rewrites can be according to the needs of a specific server application, the needs of a specific domain, or many other, varied requirements of a server, system, or company. This module also allows you to use more user-friendly URLs. So instead of having to type [http://this.is.my.domain/this\_is\_my\_address?=id.4567](http://this.is.my.domain/this_is_my_address?=id.4567), your users could just type [http://this.is.my.domain/address](http://this.is.my.domain/address). This module is incredibly complex and should be well researched before implementing.
**2: Alias**
Alias is one of the must-use directives, as it allows you to point your Web server to directories outside your document root. Once set up correctly, any URL ending in the alias will automatically resolve to the path set in the alias. So you could take a folder, say, /home/sites/docs, which wouldn't normally be accessible by Apache, and make it such that a user could just go to [http://this.is.my.domain/docs](http://this.is.my.domain/docs) and see everything within that folder.
**3: AddType**
AddType can easily have you pulling out your hair. If you plan on serving up .php files, you'll need to add the MIME in your configuration file; otherwise, Apache will just display the code for .php files in the browser. Not an option. To get Apache to actually execute the files, the MIME type has to be set up — which is done with the help of the AddType directive.
**4: AddHandler**
Where AddType configures MIMEs, AddHandler configures extensions. This allows you to define .php, .phtml as both handlers for the php MIME. If you find out your server isn't executing .php files properly, make sure you have this directive set up in the form AddHandler application/x-httpd-php .php, along with the AddType directive and you should be good to go.
**5: VirtualHost**
VirtualHost allows you to create multiple virtual hosts on a single Apache server. This directive accepts most all other container directives. If you're using Apache2, these virtual hosts will be defined within the /etc/apache2/sites-available directory. You define each virtual host separately within that directory (using the VirtualHost directive) and then enable the site with the command a2ensite (if on Ubuntu).
**6: DocumentRoot**
DocumentRoot defines the document root of the server. Typically this will be /var/www on Apache2 on Ubuntu and some servers can be set to /etc/httpd. You can set this to whatever you like, but make sure the directory configured has the right permissions so that the Web server user has full permission to access the directory. Change this directive only if you know exactly what you're doing.
**7: KeepAlive**
KeepAlive is an important directive. It defines whether a server allows more than one request per connection. If used properly, KeepAlive can prevent any one client from consuming too much of a server's resources. By default, KeepAlive is set to off, which prevents the server from becoming too busy. If you do enable it, use the related KeepAliveTimeout directive and set it to a low number.
**8: Listen**
Listen is the directive used to define the port Apache listens on. By default, Apache listens on port 80, but you can define this to a nonstandard port if needed. There is one caveat to this. If you change the port to 1024, the Apache daemon can be started only by the root user. You can also use Listen to define specific addresses that the server will accept connections from.
**9: LoadModule**
LoadModule is the directive used to inform the Apache server of a module to be loaded. Tons of modules are included in a default Apache installation — and more can be found. But not all modules are loaded by default (nor would you want them to be). If you look in the Apache configuration directory, /etc/apache2, for example, you'll find a subfolder that contains all the available modules. It will probably require some Google time to determine exactly what each module does. Once you're sure you want to load a module, do so with the LoadModule directive.
**10: Options**
Options allows you to define specific options to be available for a defined directory. This is an incredibly handy directive to have at your fingertips, as it allows you to fine-tune on a per-directory basis. Some of the more useful options available are FollowSymLinks, Indexes, ExecCGI, and Includes. Now with Options you can use + to tell Apache to add the option or - to remove an option. You can also add the options without + or -, but you can't mix these two or Apache will get confused.

Br,
Punit
