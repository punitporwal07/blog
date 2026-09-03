---
title: "Different api versions to use in your manifest file"
description: "APIs are gateway to your kubernetes cluster"
pubDate: 2019-03-06T03:17:00.020-08:00
updatedDate: 2020-06-26T07:43:18.336-07:00
tags:
  - "apiversion"
  - "K8S"
  - "Kubernetes"
originalUrl: "https://cloudnetes.blogspot.com/2020/02/different-api-versions-to-use-in-your.html"
---

![](/blog/blog-images/api-6a7f88ba19ff.png)according to kubernetes : The API server exposes an HTTP API that lets end users, different parts of your cluster, and external components communicate with one another. The Kubernetes API lets you query and manipulate the state of objects in the Kubernetes API (for example: Pods, Namespaces, ConfigMaps, and Events)

                                  **APIs are gateway to your kubernetes cluster**

| Kind | apiVersion |
| --- | --- |
| CertificateSigningRequest | certificates.k8s.io/v1beta1 |
| ClusterRoleBinding | rbac.authorization.k8s.io/v1 |
| ClusterRole | rbac.authorization.k8s.io/v1 |
| ComponentStatus | v1 |
| ConfigMap | v1 |
| ControllerRevision | apps/v1 |
| CronJob | batch/v1beta1 |
| DaemonSet | extensions/v1beta1 |
| Deployment | extensions/v1beta1 |
| Endpoints | v1 |
| Event | v1 |
| HorizontalPodAutoscaler | autoscaling/v1 |
| Ingress | extensions/v1beta1 |
| Job | batch/v1 |
| LimitRange | v1 |
| Namespace | v1 |
| NetworkPolicy | extensions/v1beta1 |
| Node | v1 |
| PersistentVolumeClaim | v1 |
| PersistentVolume | v1 |
| PodDisruptionBudget | policy/v1beta1 |
| Pod | v1 |
| PodSecurityPolicy | extensions/v1beta1 |
| PodTemplate | v1 |
| ReplicaSet | extensions/v1beta1 |
| ReplicationController | v1 |
| ResourceQuota | v1 |
| RoleBinding | rbac.authorization.k8s.io/v1 |
| Role | rbac.authorization.k8s.io/v1 |
| Secret | v1 |
| ServiceAccount | v1 |
| Service | v1 |
| StatefulSet | apps/v1 |

**alpha**

API versions with ‘alpha’ in their name are early candidates for new functionality coming into Kubernetes. These may contain bugs and are not guaranteed to work in the future.

**beta**

‘beta’ in the API version name means that testing has progressed past alpha level, and that the feature will eventually be included in Kubernetes. Although the way it works might change, and the way objects are defined may change completely, the feature itself is highly likely to make it into Kubernetes in some form.

**stable**

Those do not contain ‘alpha’ or ‘beta’ in their name. They are safe to use.

_[reference](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html)_
