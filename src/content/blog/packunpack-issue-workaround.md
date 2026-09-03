---
title: "Pack/Unpack Issue Workaround"
description: "Re-encrypt the external ldap and datasync passwords in the config.xml and jdbc.xml files with the weblogic.security.Encrypt utility."
pubDate: 2014-11-26T01:53:00.002-08:00
updatedDate: 2014-11-26T01:53:54.554-08:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/packunpack-issue-workaround.html"
---

**R**e-encrypt the external ldap and datasync passwords in the _config.xml_ and _jdbc.xml_ files with the **weblogic.security.Encrypt utility.**
2\. Include the 3 jks files while creating the domain template. Do this in the "Add Files" screen. Expand the domain directory on the left that you're creating the template from and select the 3 jks files (along with any other files you may want). Then select the Domain Root Directory on the right and add them.

    wsrpKeystore.jks
    DemoIdentity.jks
    DemoTrust.jks

2.5 Alternatively (or in addition to the keystore files) remove the SAMLAuthenticator entry in the config.xml file. Note this is only valid if you're not using the SAML Authenticator. Remove the following entry in the config.xml file:

   <sec:authentication-provider xsi:type="wls:saml-authenticatorType">
     <sec:name>SAMLAuthenticator</sec:name>
     <sec:control-flag>SUFFICIENT</sec:control-flag>
   </sec:authentication-provider>
3\. There are several workarounds:

    a. Copy/paste all of the _config.xml_ file shared library pathname references from the original domain into the newly created domain. Replace all entries in the new domain with the entries from the original domain.

    b. The _config.xml_ file can be overwritten with a correct config.xml file in the _template.jar_ after creating the template without selecting shared libraries in the Domain Template Builder.

    c. Modify the domain template's **<WLS\_HOME>/common/lib/internalpaths.txt** file to avoid inclusion of shared libraries in the applications directory. Append the following paths to the internalpaths.txt file. Once the file has been modified, launch the Domain Template Builder again and the WLP shared libraries will be excluded.

        internalpaths.txt:

<WLPInstall>/wlportal\_10.3/p13n/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/p13n/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/content-mgmt/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/content-mgmt/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/analytics/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/analytics/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/propagation/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/propagation/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/light-portal/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/light-portal/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/apps/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/apps/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/info-mgmt/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/info-mgmt/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/portal/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/portal/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/portal-admin/lib/j2ee-modules
<WLPInstall>/wlportal\_10.3/portal-admin/lib/j2ee-modules/maintenance/1030/default
<WLPInstall>/wlportal\_10.3/p13n/lib/j2ee-modules/wlp-compat
<WLPInstall>/wlportal\_10.3/workshop/common/deployable-libraries
<WLPInstall>/wlserver\_10.3/common

Br,
Punit
