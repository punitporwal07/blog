---
title: "OPatch"
description: "OPatch is a Java-based utility built by Oracle that runs on all supported operating systems and requires the installation of the Oracle Universal Installer. It is used to apply patches to Oracle softw"
pubDate: 2014-11-25T22:44:00.029-08:00
updatedDate: 2022-07-09T10:29:54.866-07:00
tags:
  - "weblogic"
originalUrl: "https://cloudnetes.blogspot.com/2014/11/opatch-12c.html"
---

![](/blog/blog-images/oracle-weblogic-2871b0ad5fe5.png)

OPatch is a Java-based utility built by Oracle that runs on all supported operating systems and requires the installation of the Oracle Universal Installer. It is used to apply patches to Oracle software.

Oracle has recently implemented a new patch nomenclature for Oracle products.

In previous releases of Oracle WebLogic Server, you can patch your WebLogic server software using a utility called Bea Smart Update (bsu). Smart Update is a standalone Java application that you use to upgrade the software installations quickly and easily with maintenance patches and maintenance packs.

For Oracle Fusion Middleware 12c (12.1.2), BSU is no longer supported. instead, WebLogic server users can use **OPatch** to apply patches for both WebLogic Server and for Oracle Fusion Middleware.

OPatch offers many of the same features as Smart Update, but it has a different set of commands and command options.

OPatch can be found in the following location after you install any Oracle Fusion Middleware product:

ORACLE\_HOME/OPatch

To run OPatch, simply run the opatch command in this directory.

For example, to view the list of commands available for OPatch on a UNIX system, enter the following:

`$ ./opatch –help`

The multiple commands that can be used with opatch utility are 

`Command: = apply`      `Example: opatch -help` 

`Checkapplicable      opatch apply -help Compare lsinventory             Use: to check the number of patches applied lspatches               List out the number of patches Napply                  to apply multiple patches in one go Nrollback               to rollback multiple patch in one go // opatch nrollback -id` `15343893,``14342349`

`Rollback                to rollback a patch you applied //Syntax: opatch rollback –id 15343893 Query version                 to check the version of opatch prereq util`

To verify that a patch can be applied to a specific Oracle home, use the -report argument to the OPatch apply command, as follows: 

`$ opatch apply <path_to_patch_directory> -report`

To apply a patch

`$ ./opatch apply /tmp/15941858/`

if opatch fails to find oraInst.loc or central Inventory

`$ ./opatch lsinventory  -invPtrLoc ../oraInst.loc`

**Possible causes of opatch commands getting failed:**

-   Dependency on another component
-   Corrupted patch zip file download
-   Downloaded or extracted the patch zip file under $ORACLE\_HOME/inventory/oneoffs
-   The OPatch version is too old
-   The patch was unzipped for installation in a remote location ( NFS)
-   OPatch detects wrong Middleware Home in inventory.xml

which can be fixed, after correcting HOME NAME in inventory.xml which can be found at:
             /software/bea/Middleware/product/oraInventory\_ver/ContentsXML/**inventory.xml**

`<HOME_LIST> <HOME NAME="OracleHome1" LOC="/software/bea/Middleware/product/version/" TYPE="O" IDX="1"/>`

`</HOME_LIST>`

-   Prerequisite check "CheckActiveFilesAndExecutables" failed.

                    The details are:

                    Exception occurred : fuser could not be located:

                    UtilSession failed: Prerequisite check "CheckActiveFilesAndExecutables" failed.

The OPatch utility uses "fuser" on UNIX systems to check for active Oracle instances which is unavailable on the host so do the following:

    Set the environment variable **OPATCH\_NO\_FUSER=true**
    Shut down the WebLogic instances
    Run the OPatch utility

-   Opatch uplift : **Doc ID 224346.1**

\- download p28186730\_139424\_Generic.zip for 12c

\- unzip p28186730\_139424\_Generic.zip 

you will get a patch folder named - **6880880**
`$ cd $ORACLE_HOME/OPatch/ $ ./opatch version`
if ask Include OPatch in PATH  `export PATH=$ORACLE_HOME/OPatch:$PATH` 

and run below command to uplift

`$ <javaHome>/bin/java -jar 6880880/opatch_generic.jar -silent oracle_home=​<ORACLE_HOME>`

ORACLE\_HOME will be the absolute path till your WebLogic installation.
e.g /software/bea/wls/12.2.1.3/

**if Opatch Fails With Error Code 255**

There are possible reasons for this error code to name a few :-

\- Your installer doesn't want an opatch uplift and you need to rollback this opatch to the supported version

\- The ORACLE\_HOME variable you are using is incorrect
