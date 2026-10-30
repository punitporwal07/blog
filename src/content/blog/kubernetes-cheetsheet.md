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

| Function | Command |
|---|---|
| Enable kubectl auto-completion | `echo "source <(kubectl completion bash)" >> ~/.bashrc` |
| Initialize Kubernetes cluster | `kubeadm init --apiserver-advertise-address=MASTERIP --pod-network-cidr=192.168.0.0/16` |
| Verify cluster info | `kubectl cluster-info --minify` |
| Verify Kubernetes version | `kubectl version --short` |
| Check component status | `kubectl get componentstatus` |
| Show nodes with labels | `kubectl get nodes --show-labels` |
| Display cluster information | `kubectl cluster-info` |
| Reset cluster | `kubeadm reset -f && rm -rf /etc/kubernetes/` |
| Remove IPIP/tunl0 interface | `modprobe -r ipip` |
| Force delete kube-system Pods | `kubectl delete pods --all -n kube-system --grace-period=0 --force` |
| Disable scheduling on a node | `kubectl cordon nodeName` |
| Drain a node | `kubectl drain nodeName` |
| Force drain a node | `kubectl drain nodeName --ignore-daemonsets --delete-local-data --force` |
| Remove node from cluster | `kubectl delete node nodeName` |
| Enable scheduling on a node | `kubectl uncordon nodeName` |
| Add a taint to a node | `kubectl taint nodes node01 key1=value1:NoSchedule` |
| Remove a taint from a node | `kubectl taint nodes node01 key1=value1:NoSchedule-` |
| Add a label to a node | `kubectl label nodes node01 key=value` |
| Set default namespace | `kubectl config set-context --current --namespace=<namespace-name>` |
| Check current namespace | `kubectl config view --minify \| grep namespace` |
| List resources across all namespaces | `kubectl get all --all-namespaces` |
| Describe/investigate an object | `kubectl describe node/deployment/svc <objectName>` |
| Check kubelet logs | `sudo journalctl -u kubelet` |
| Expose Deployment as NodePort | `kubectl expose deploy/web --type=NodePort --name=my-svc` |
| Expose Deployment as LoadBalancer | `kubectl expose deploy/web --port=9443 --target-port=61002 --name=mysvc --type=LoadBalancer` |
| Change Service to NodePort | `kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}'` |
| Port-forward a Service | `kubectl port-forward svc/my-service -n myNamespace 8080:443` |
| Start kubectl proxy | `kubectl proxy --port=61000 --address=0.0.0.0 --accept-hosts='.*' &` |
| Scale Deployment from 3 to 4 replicas | `kubectl scale --current-replicas=3 --replicas=4 deployment/my-deployment` |
| Scale Deployment in a namespace | `kubectl scale deployment/my-deployment --replicas=2 -n my-namespace` |
| Access Service in another namespace | `<service-name>.<namespace>.svc.cluster.<domain>` |
| Show all Pod attributes | `kubectl explain pod --recursive` |
| Show Pods with additional details | `kubectl get pods -o wide` |
| Force delete a Pod | `kubectl delete pod mypodName --grace-period=0 --force --namespace myNamespace` |
| Delete all Pods in a namespace | `kubectl delete --all pods -n my-namespace` |
| Open Bash shell inside a Pod | `kubectl exec -it podName -- bash` |
| Execute command inside a Pod | `kubectl exec -it podName -- cat /etc/hosts` |
| Generate Deployment YAML without creating it | `kubectl create deployment web --image=nginx --dry-run=client -o yaml > web.yaml` |
| Apply YAML files recursively | `kubectl apply -R -f .` |
| Validate a YAML manifest | `kubectl create --dry-run=client --validate=true -f file.yaml` |
| Create Deployment with 3 replicas | `kubectl create deployment web --image=nginx --replicas=3` |
| Edit Deployment | `kubectl edit deployment/web` |
| Autoscale Deployment | `kubectl autoscale deployment/web --min=2 --max=5 --cpu-percent=10` |
| Perform rolling image update | `kubectl set image deployment/web web=registry/web:2.0` |
| Check rollout status | `kubectl rollout status deployment/web` |
| Undo previous rollout | `kubectl rollout undo deployment/web` |
| Create ConfigMap from literal | `kubectl create configmap my-config --from-literal=MESSAGE="hello from configmap"` |
| Create ConfigMap from properties file | `kubectl create configmap my-config --from-file=my.properties` |
| Query application health endpoint | `curl -L http://localhost:8080/healthz` |
| View Pod logs | `kubectl logs podName` |
| View logs of specific container | `kubectl logs podName -c containerName` |

**run kubectl against pods using xargs**
**fetch 1st colmn from o/p of multi pods**      
**refine o/p with specific value**                             

**`kubectl`** `get pods -o name | xargs -I{} kubectl exec {} -- command` `kubectl get pods -n ns | grep -v NAME | sed 's/\|/ /'|awk '{print $1}'kubectl get pods -n ns | grep -v NAME | awk '{print $1}' | cut -c8-14`  

**Calculate max pods in an EC2 instance type**             

**`curl`** `-O https://gist.githubusercontent.com/punitporwal07/4dccce3e51503b8fc786d754e64fbe6f/raw/0e4d130db82ee953ce9f93366a35b803cac39faa/max-pods-calculator.shchmod +x max-pods-calculator.shaws configure./max-pods-calculator.sh --instance-type m5.large --cni-version 1.9.0-eksbuild.1`
