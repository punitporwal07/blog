---
title: "HPA vs KEDA"
description: "HPA stands for Horizontal Pod Autoscaling - It is a feature that automatically adjusts the number of replicas of a deployment based on the resource utilization (such as CPU or memory utilization) of t"
pubDate: 2023-01-12T14:11:00.049-08:00
updatedDate: 2023-02-10T07:30:30.683-08:00
originalUrl: "https://cloudnetes.blogspot.com/2023/01/hpa-vs-keda.html"
---

![](/blog/blog-images/keda-e9cb95546dea.png)

**HPA** stands for Horizontal Pod Autoscaling - It is a feature that automatically adjusts the number of replicas of a deployment based on the resource utilization (such as CPU or memory utilization) of the pods in that deployment. 

By using HPA, you can make your applications more scalable, resilient, and cost-effective, without having to manually adjust the number of replicas.

but, with some limitations -
**\- Metrics-based scaling:** HPA scales replicas based on CPU utilization or memory usage, which may not be suitable for event-driven workloads.

**\- No scaling to zero:** HPA does not support scaling down to zero replicas, meaning that at least one pod must be running at all times.
**\- Latency in scaling:** HPA operates on a periodic basis and may not respond immediately to changes in resource usage, leading to potential latency in scaling.

The inline command to autoscale your deployment -

`kubectl autoscale deploy/sampleapp-deployment --min=1 --max=3 --cpu-percent=50`

a sample manifest for hpa looks like -

apiVersion: autoscaling/v2

kind: HorizontalPodAutoscaler

metadata:

  name: my-hpa

  namespace: myapp-ns

spec:

  scaleTargetRef:

    apiVersion: apps/v1

    kind: Deployment

    name: sampleapp-deployment

  minReplicas: 1

  maxReplicas: 3

  metrics:

  - type: Resource

    resource:

      name: cpu

      target:

        averageUtilization: 50

        type: Utilization

![](/blog/blog-images/avvxsegas44tyldacazp5gpesmcelyuw0gkyce0k-51ab943b3e6b.png)

**next, you need to deploy a metric server that will monitor the metrics of your cluster
**

```
kubectl apply -f https://raw.githubusercontent.com/ACloudGuru-Resources/content-cka-resources/master/metrics-server-components.yaml
```

![](/blog/blog-images/avvxseijbjvjbt0bm-732qwhoeatkie04m0ajfyb-1056c1e6d69a.png)

now it will start monitoring the memory and CPU of your cluster resources as shown in the below ss - 

![](/blog/blog-images/avvxseibvrozwlu44q3m-r0keybdap6lllf-7gxj-d54cc74d84a4.png)

as soon as avg CPU reaches the targeted limit, HPA will autoscale the deployment pods.

**vs**

**KEDA** stands for Kubernetes event-driven auto-scaling - it is more event-driven, as in when there is a sudden spike of msgs in the queue it will auto-scale the application.

(Typical use case for autoscaling - to scale up if an application has received a sudden spike in web traffic and to scale down when the amount of web traffic is low enough to save costs and resources)

we can trigger KEDA event based on CUSTOM METRICs -

Event-driven
Batch Workload
Number of messages in the queue

so you configure events - as soon as a new event is triggered - KEDA will auto-scale-up the Job

**KEDA comes with 2 CRDs -** 

**ScaledObject** \- used for scaling a Kubernetes Deployment, StatefulSet, or custom resource.
**ScaledJob** \-    used to run and scale Kubernetes Jobs.

In summary, the choice between KEDA and HPA depends on the specific requirements of the workload being deployed.

**Install KEDA with helm**

```
helm repo add kedacore https://kedacore.github.io/charts
helm repo update
helm install keda kedacore/keda --namespace keda

NAME: keda
LAST DEPLOYED: Thu Jan 12 21:55:21 2023
NAMESPACE: keda
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

**Un-install KEDA (considering you have deleted ScaledObjects& Jobs)**

```
kubectl delete $(kubectl get scaledobjects,scaledjobs -oname)
helm uninstall keda -n keda
```

**if stuck without deleting the scaledObject/Jobs, Patch the deployment**

```
for i in $(kubectl get scaledobjects -oname);
do kubectl patch $i -p '{"metadata":{"finalizers":null}}' --type=merge
done

for i in $(kubectl get scaledjobs -oname);
do kubectl patch $i -p '{"metadata":{"finalizers":null}}' --type=merge
done
```

when A KEDA CRD object is deployed which contains the autoscaling configurations, including which events will trigger the target to be autoscaled.

A typical Keda manifest will look like -

apiVersion: keda.sh/v1alpha1

kind: ScaledObject

metadata:

  name: scale-example-workload

spec:

  scaleTargetRef:

    apiVersion:    apps/v1

    kind:          Deployment

    name:          example-workload

  pollingInterval: 3

  cooldownPeriod:  30

  minReplicaCount: 1

  maxReplicaCount: 5

  advanced:

    horizontalPodAutoscalerConfig:

      behavior:

        scaleDown:

          stabilizationWindowSeconds: 30

          policies:

          - type: Pods

            value: 1

            periodSeconds: 3

        scaleUp:

          stabilizationWindowSeconds: 0

          policies:

          - type: Pods

            value: 1

            periodSeconds: 3

  triggers:

  - type: prometheus

    metadata:

      serverAddress: http://<prometheus-host>:9090

      metricName: http\_requests\_total

      query: increase(promhttp\_metric\_handler\_requests\_total{namespace="keda-demo", code="200"}\[30s\])

      threshold: '3'

ref - [https://keda.sh/docs/2.9/concepts/scaling-deployments/](https://keda.sh/docs/2.9/concepts/scaling-deployments/)
      - [https://livewyer.io/blog/2021/06/17/keda-showcase-autoscaling-based-on-prometheus-redis/](https://livewyer.io/blog/2021/06/17/keda-showcase-autoscaling-based-on-prometheus-redis/)
