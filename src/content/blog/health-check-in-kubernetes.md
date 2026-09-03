---
title: "PROBES - Health check mechanism of application running inside Pod's container in Kubernetes"
description: "Kubernetes provides health checking mechanism to verify if a container inside a pod is working or not using PROBE."
pubDate: 2018-12-30T01:58:00.000-08:00
updatedDate: 2021-07-04T05:54:07.189-07:00
tags:
  - "K8S"
  - "Kubernetes"
originalUrl: "https://cloudnetes.blogspot.com/2020/07/health-check-in-kubernetes.html"
---

![](/blog/blog-images/health-check-6b1f05b20631.jpg)

Kubernetes provides health checking mechanism to verify if a container inside a pod is working or not using PROBE.

Kubernetes gives two types of health checks performed by the kubelet.

**Liveness probe**

k8s checks the status of the container via liveness probe.

If liveness Probe fails, then the container is subjected to its restart policy.

**Readiness Probe**

Readiness probe checks whether your application is ready to serve the requests.

If readiness probe fails, the pod's IP is removed from the endpoint list of the service.

we can define liveness probe in three types of actions that kubelet performs on a pod:

-   Executes a command inside the container
-   Checks for a state of a particular port on the container
-   Performs a GET request on container's IP

```
# Define a liveness command
livenessProbe:
  exec:
    command:
    - sh
    - /tmp/status.sh; sleep 10; rm /tmp/status.sh; sleep 600
  initialDelaySeconds: 10
  periodSeconds: 5

# Define a liveness HTTP request
livenessProbe:
  httpGet:
    path: /healthz
    port: 10254
  initialDelaySeconds: 5
  periodSeconds: 3
# Define a TCP liveness probe
livenessProbe:
  tcpSocket:
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 20

Readiness probes are configured similarly to liveness probes.
The only difference is that you use the readinessProbe field instead of the livenessProbe field.

# Define readiness probe
readinessProbe:
  exec:
    command:
    - sh
    - /tmp/status_check.sh
  initialDelaySeconds: 5
  periodSeconds: 5
```

**Configure Probes**

Probes have a number of fields that one can use more precisely to control the behavior of liveness and readiness checks

**initialDelaySeconds**: Number of seconds after the container starts before liveness or readiness probes are initiated.

Defaults to 0 seconds. Minimum value is 0.

**periodSeconds:** How often (in seconds) to perform the probe.

Default to 10 seconds. Minimum value is 1.

**timeoutSeconds:** Number of seconds after which the probe times out.

Defaults to 1 second. Minimum value is 1.

**successThreshold:** Minimum consecutive successes for the probe to be considered successful after having failed.

Defaults to 1. Must be 1 for liveness. Minimum value is 1.

**failureThreshold:** Minimum consecutive fails for the probe to be considered restarting the container. In case of readiness probe, the Pod will be marked Unready.

Defaults to 3. Minimum value is 1.

```
# example of Nginx deploymentapiVersion: apps/v1
kind: Deployment
metadata:
  name: app1
  labels:
    app: webserver
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: webserver
    spec:
      containers:
        - name: app1
          image: punitporwal07/apache4ingress:1.0
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 3
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 3
```

httpGet have additional fields that can be set

**path:** Path to access on the HTTP server.

**port:** Name or number of the port to access the container. The number must be in the range of 1 to 65535.

**host:** Hostname to connect to, defaults to the pod IP. You probably want to set "Host" in httpHeaders instead.

**httpHeaders:** Custom headers to set in the request. HTTP allows repeated headers.

scheme: Scheme to use for connecting to the host (HTTP or HTTPS). Defaults to HTTP

keep probing!
