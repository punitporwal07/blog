---
title: Kubernetes cheatsheet
description: Kubernetes is an orchestration framework for containers that give
  you portability for managing containerized workloads and services in form of
  pods, there are two types of CLI commands -
pubDate: 2020-04-08T02:48:00.205-07:00
updatedDate: 2023-10-25T05:22:17.773-07:00
tags:
  - K8S
  - kubectl
originalUrl: https://cloudnetes.blogspot.com/2020/04/kubernetes-cheetsheet.html
---
![](/blog/blog-images/kubectl-625f4982ea1d.png)

Kubernetes is an orchestration framework for containers that give you portability for managing containerized workloads and services in form of pods, there are two types of CLI commands -

**Imperative** - imperative commands are one-liners commands.
**Declarative** - declarative has some definition of objects in a file that a developer can refer it again.
There are different CLI tools that allow you to run commands against the Kubernetes cluster some of which I attempted to collect and put together as below.

| Function                                     | Command                                                                                                             |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Enable kubectl auto-completion               | `echo "source <(kubectl completion bash)" >> ~/.bashrc`                                                             |
| Initialize Kubernetes cluster                | `kubeadm init --apiserver-advertise-address=MASTERIP --pod-network-cidr=192.168.0.0/16`                             |
| Verify cluster info                          | `kubectl cluster-info --minify`                                                                                     |
| Verify cluster and components                | `kubectl version --short && kubectl get componentstatus && kubectl get nodes --show-labels && kubectl cluster-info` |
| Reset cluster                                | `kubeadm reset -f && rm -rf /etc/kubernetes/`                                                                       |
| Delete tunl0 / unload IPIP                   | `modprobe -r ipip`                                                                                                  |
| Delete kube-system pods forcefully           | `kubectl delete pods --all -n kube-system --grace-period=0 --force`                                                 |
| Mark node as unschedulable                   | `kubectl cordon nodeName`                                                                                           |
| Drain a node                                 | `kubectl drain nodeName`                                                                                            |
| Drain node ignoring DaemonSets               | `kubectl drain nodeName --ignore-daemonsets --delete-local-data --force`                                            |
| Remove a node from cluster                   | `kubectl delete node nodeName`                                                                                      |
| Enable scheduling on node                    | `kubectl uncordon nodeName`                                                                                         |
| Add a taint to a node                        | `kubectl taint nodes node01 key1=value1:NoSchedule`                                                                 |
| Remove a taint from a node                   | `kubectl taint nodes node01 key1=value1:NoSchedule-`                                                                |
| Label a node                                 | `kubectl label nodes node01 key=value`                                                                              |
| Set default namespace                        | `kubectl config set-context --current --namespace=<namespace-name>`                                                 |
| Check current namespace                      | `kubectl config view --minify \| grep namespace`                                                                    |
| List resources across all namespaces         | `kubectl get all --all-namespaces`                                                                                  |
| Investigate an object                        | `kubectl describe node/deployment/svc <objectName>`                                                                 |
| Investigate kubelet service                  | `sudo journalctl -u kubelet`                                                                                        |
| Expose deployment as NodePort service        | `kubectl expose deploy/web --type=NodePort --name=my-svc`                                                           |
| Expose deployment as LoadBalancer            | `kubectl expose deploy/web --port=9443 --target-port=61002 --name=mysvc --type=LoadBalancer`                        |
| Patch service from ClusterIP to NodePort     | `kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'`                                     |
| Port forward a service                       | `kubectl port-forward svc/my-service -n myNamespace 8080:443`                                                       |
| Start kubectl proxy                          | `kubectl proxy --port=61000 --address=0.0.0.0 --accept-hosts='.*' &`                                                |
| Scale deployment from 3 to 4 replicas        | `kubectl scale --current-replicas=3 --replicas=4 deployment/my-deployment`                                          |
| Scale deployment in a namespace              | `kubectl scale deployment/my-deployment --replicas=2 -n my-namespace`                                               |
| Access service in another namespace          | `<service-name>.<namespace>.svc.cluster.<domain>`                                                                   |
| Show all possible attributes of a Pod        | `kubectl explain pod --recursive`                                                                                   |
| Show detailed Pod information                | `kubectl get pods -o wide`                                                                                          |
| Delete a Pod forcefully                      | `kubectl delete pod mypodName --grace-period=0 --force --namespace myNamespace`                                     |
| Delete all Pods in a namespace               | `kubectl delete --all pods -n my-namespace`                                                                         |
| Open bash shell inside a Pod                 | `kubectl exec -it podName -- bash`                                                                                  |
| Run a command inside a Pod                   | `kubectl exec -it podName -- cat /etc/hosts`                                                                        |
| Generate Deployment YAML without creating it | `kubectl create deployment web --image=nginx --dry-run=client -o yaml > web.yaml`                                   |
| Apply YAML files recursively                 | `kubectl apply -R -f .`                                                                                             |
| Validate a YAML manifest                     | `kubectl create --dry-run=client --validate=true -f file.yaml`                                                      |
| Create Deployment with 3 replicas            | `kubectl create deployment web --image=nginx --replicas=3`                                                          |
| Edit Deployment at runtime                   | `kubectl edit deployment/web`                                                                                       |
| Autoscale Deployment                         | `kubectl autoscale deployment/web --min=2 --max=5 --cpu-percent=10`                                                 |
| Perform rolling image update                 | `kubectl set image deployment/web web=registry/web:2.0`                                                             |
| Check rollout status                         | `kubectl rollout status deployment/web`                                                                             |
| Undo previous rollout                        | `kubectl rollout undo deployment/web`                                                                               |
| Create ConfigMap from literal value          | `kubectl create configmap my-config --from-literal=MESSAGE="hello from configmap"`                                  |
| Create ConfigMap from properties file        | `kubectl create configmap my-config --from-file=my.properties`                                                      |
| Query health-check endpoint                  | `curl -L http://localhost:8080/healthz`                                                                             |
| View Pod logs                                | `kubectl logs podName`                                                                                              |
| View logs for a specific container           | `kubectl logs podName -c containerName`                                                                             |

**run kubectl against pods using xargs**
**fetch 1st colmn from o/p of multi pods**      
**refine o/p with specific value**                             

**`kubectl`** `get pods -o name | xargs -I{} kubectl exec {} -- command` `kubectl get pods -n ns | grep -v NAME | sed 's/\|/ /'|awk '{print $1}'kubectl get pods -n ns | grep -v NAME | awk '{print $1}' | cut -c8-14`  

**Calculate max pods in an EC2 instance type**             

**`curl`** `-O https://gist.githubusercontent.com/punitporwal07/4dccce3e51503b8fc786d754e64fbe6f/raw/0e4d130db82ee953ce9f93366a35b803cac39faa/max-pods-calculator.shchmod +x max-pods-calculator.shaws configure./max-pods-calculator.sh --instance-type m5.large --cni-version 1.9.0-eksbuild.1`
