---
title: "RBACs in Kubernetes"
description: "Security should be our top priority. In Kubernetes, role-based access control is used to grant users access to API resources. RBAC is a security design that restricts access to Kubernetes resources ba"
pubDate: 2022-11-02T06:26:00.024-07:00
updatedDate: 2022-12-21T07:05:56.106-08:00
tags:
  - "K8S"
  - "rbacs"
originalUrl: "https://cloudnetes.blogspot.com/2022/11/security-should-be-our-top-priority.html"
---

![](/blog/blog-images/rbacs-5053cdfc8359.png)

Security should be our top priority. In Kubernetes, role-based access control is used to grant users access to API resources. RBAC is a security design that restricts access to Kubernetes resources based on the roles.

There are two ways we can restrict and add RBAC policies

**1\. Namespace-wide RBAC policies**

**![](/blog/blog-images/avvxsei0phfmysoq9fdddxlirpfbclngjvfsdywk-f21b54231ac2.png)**

[**defining manifests to implement RBAC policies at the namespace level**](https://gist.githubusercontent.com/punitporwal07/15649f402dbd18f80bf86000d6a36b2f/raw/f48895aee8382661096979b62aee07ae847ea148/rbac-manifests.yaml)

with the above example, you have restricted the access to a specific namespace(myapp) for a specific application(Istio) linked with a serviceAccount deployed in the myapp namespace, but if you wish to access the resource of another namespace say myapp2 you will get a 403 forbidden error. 

![](/blog/blog-images/avvxseh2by9gf0b0zqtc9gdjqll1urlgw16vpm79-7d8291a9f055.png)

**

**2\. Cluster-wide RBAC policies**

![](/blog/blog-images/avvxseht5qcwvfvm9d1jhxnbky5sz8ubdanbhzml-e9b39cf342e5.png)

**

ClusterRoles are similar to Roles however when assigned to a ServiceAccount can give cluster-wide permissions to access other resources in it. 

**[defining manifests to implement RBAC policies at cluster-wide level](https://gist.githubusercontent.com/punitporwal07/7717cfe59a69b3ae99edf9bf52a14408/raw/db3df6d21d65d4c1c569983bd73da8a0d59cd203/c-rbac-manifest.yaml)**

with the above example, we have implemented clusterRoles to a ServiceAccount to access resources at a cluster-wide level.

![](/blog/blog-images/avvxsegstd8n3brhnotpr21s3owor-5guhem3aac-ab20df636113.png)

if the user tries to access another namespace or system namespace like (kube-system). definitely, it will throw a forbidden error because when we create this user/SA only have access to myapp & myapp2 namespace. Usually, developers no need access to the system namespace (kube-system).
