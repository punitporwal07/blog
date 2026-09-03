---
title: "What is plan.xml"
description: "Deploying an Application"
pubDate: 2016-05-15T22:21:00.006-07:00
updatedDate: 2021-05-12T00:14:00.312-07:00
originalUrl: "https://cloudnetes.blogspot.com/2016/05/what-is-planxml.html"
---

Deploying an Application 

Perform the following steps:

| 1. | Start your administration server and dizzy1 managed server, if not already started. If prompted, enter your domain's administrative username and password. |
| --- | --- |
| 2. | Download the deploy\_plan.zip file that contains the sample Web application and WLST script listed below: HRApp.war deploy\_HRApp.py Extract and place both files within the same directory on your local file system. This location will be referred to as in later steps. |
| 3. | Open a new command shell. Navigate to the directory /wlserver\_10.3/server/bin, where is the location of your Oracle WebLogic Server installation. |
| 4. | Execute the setWLSEnv script. For example, on Linux, type the following: source setWLSEnv.sh |
| 5. | Change directories to your folder (the location of the downloaded WLST script and sample application). |
| 6. | Execute the deploy\_HRApp.py script using WLST: java weblogic.WLST deploy\_HRApp.py Tip: If your domain's administrative credentials are not admin/welcome1, you will need to first edit this script file and change these values. Tip: Make sure you have not locked the administration console prior to running this script. |
| 7. | Confirm that the application has been deployed to the dizzy1 server. Direct a Web browser to the following URL: http://localhost:7003/HRApp |

Generating a Deployment Plan for an Application 

Perform the following steps:

| 1. | Return to the same command shell used to run the WLST script. Confirm that the current directory is still . |
| --- | --- |
| 2. | Execute the weblogic.PlanGenerator tool on the HRApp.war application: java weblogic.PlanGenerator -all HRApp.war |
| 3. | You should receive a message similar to the following: |

Editing a Deployment Plan 

Perform the following steps:

| 1. | Locate the /plan.xml file, and open it in a text editor. |
| --- | --- |
| 2. | Locate the following element:WeblogicWebApp\_ContextRoots\_xxxxxxxxxxxxxx |
| 3. | Remove the following text from the child element: xsi:nil="true" |
| 4. | Set the value of the child element to /HR: /HR |
| 5. | Futher down in the file, locate the following element:WeblogicWebApp\_ContextRoots\_xxxxxxxxxxxxxx/weblogic-web-app/context-root |
| 6. | Add a new child element to this :WeblogicWebApp\_ContextRoots\_xxxxxxxxxxxxxx/weblogic-web-app/context-rootreplace |
| 7. | Save your changes. |

Updating an Application with a Deployment Plan

Perform the following steps:

| 1. | Launch a Web browser and access your domain's administration console. The default port is 7001: http://localhost:7001/console |
| --- | --- |
| 2. | Log into the console using your domain's administrative username and password. |
| 3. | In the Change Center panel, click Lock & Edit: |
| 4. | In the Domain Structure panel, click Deployments: |
| 5. | Select the checkbox for the HRApp application, and click the Update button: |
| 6. | Click the Change Path button associated with the Deployment Plan Path field : |
| 7. | Select the radio button for your new plan.xml file, and click Next. If necessary, use the hyperlinks next to the Current Location field to browse to your directory: |
| 8. | Click the Finish button. |
| 9. | In the Change Center panel, click the Activate Changes button: |
| 10. | Verify the new context path of the application. Direct your Web browser to the following URL: http://localhost:7003/HR Summary |

In this lesson, you learned how to:

|  | \- Use weblogic.PlanGenerator to create an initial deployment plan for an existing application |
| --- | --- |
|  | \- Perform some simple modifications to a generated deployment plan file |
|  | \- Use the console to update an application with a deployment plan Ref: http://www.oracle.com/webfolder/technetwork/tutorials/obe/fmw/wls/10g/r3/appdeploy/deploy/deploy\_plan/deploy\_plan.htm Additionally, if you wish to undeploy the application using WLST do the following $ . /software/bea/Middleware/wls/10.3.6/wlserver\_10.3/server/bin/setWLSEnv.sh $ java weblogic.WLST connect() give username give password give t3://host:port listApplications() edit() startEdit() stopApplication('myapp') undeploy('myapp') save() activate() exit() deploy('myapp','/app/DEPLOYMENT/FRONTEND/myapp.war',targets='managed1\_dom01') Br, Punit |
