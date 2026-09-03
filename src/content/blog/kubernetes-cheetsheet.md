---
title: "Kubernetes cheatsheet"
description: "Kubernetes is an orchestration framework for containers that give you portability for managing containerized workloads and services in form of pods, there are two types of CLI commands -"
pubDate: 2020-04-08T02:48:00.205-07:00
updatedDate: 2023-10-25T05:22:17.773-07:00
tags:
  - "K8S"
  - "kubectl"
originalUrl: "https://cloudnetes.blogspot.com/2020/04/kubernetes-cheetsheet.html"
---

![](/blog/blog-images/kubectl-625f4982ea1d.png)

Kubernetes is an orchestration framework for containers that give you portability for managing containerized workloads and services in form of pods, there are two types of CLI commands -

**Imperative** \- imperative commands are one-liners commands.
**Declarative** \- declarative has some definition of objects in a file that a developer can refer it again.
There are different CLI tools that allow you to run commands against the Kubernetes cluster some of which I attempted to collect and put together as below.

| Function | Command |
| --- | --- |
| kubectl auto-complete | echo "source <(kubectl completion bash)" >> ~/.bashrc |
| Initialize cluster verify cluster-info verify kluster + components reset cluster delete tunl0 iface delete pods forcefully deregister a node from the cluster (Unscheduling enabled) Scheduling enabled add a taint to a node remove a taint from a nodelabel a node | kubeadm init --apiserver-advertise-address=MASTERIP --pod-network-cidr=192.168.0.0/16 kubectl cluster-info --minify kubectl version --short && \\ kubectl get componentstatus && \\ kubectl get nodes --show-labels && \\ kubectl cluster-info kubeadm reset -f && rm -rf /etc/kubernetes/ modprobe -r ipip kubectl delete pods --all -n kube-system --grace-period=0 --force kubectl cordon nodeName kubectl drain nodeName kubectl drain nodeName --ignore-daemonsets --delete-local-data --force kubectl delete node nodeName kubectl uncordon nodeName kubectl taint nodes node01 key1=value1:NoSchedule kubectl taint nodes node01 key1=value1:NoSchedule-kubectl label nodes node01 key=value |
| setting namespace preference validate current namespace list everything in the cluster | kubectl config set-context --current --namespace=<namespace-name> kubectl config view --minify | grep namespace kubectl get all --all-namespaces |
| investigate any object investigate kubelet service | kubectl describe node/deployment/svc <objectName> sudo journalctl -u kubelet |
| exposing deployment as a service patch a svc from ClusterIP to NP port forwarding in svc scaling your deployment use service deployed in other ns | kubectl expose deploy/web --type=NodePort --name=my-svc kubectl expose deploy/web --port=9443 --target-port=61002 --name=mysvc --type=LoadBalancer kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "NodePort"}}' kubectl port-forward svc/my-service -n myNamespace 8080:443 kubectl proxy --port=61000 --address=0.0.0.0 --accept-hosts '.\*' & kubectl scale --current-replicas=3 --replicas=4 deployment/my-deployment kubectl scale deployment/my-deployment --replicas=2 -n my-namespace Dns name: <service-name>.<namespace>.svc.cluster.<domain> |
| all possible attributes of an obj wide details of running pods delete a pod forcefully delete bulk rsrc from a namespace | kubectl explain pod --recursive kubectl get pods -o wide kubectl delete pod mypodName --grace-period=0 --force --namespace myNamespace kubectl delete --all po/podName -n my-namespace |
| open a bash terminal in a pod run shell command | kubectl exec -it podName -- bash kubectl exec -it podName -- cat /etc/hosts |
| create a yaml manifest, without sending it to the cluster apply a folder of yaml files validate a yaml | kubectl create deploy web --image=nginx --dry-run -o yaml > web.yaml \[Imperative way\] kubectl apply -R -f . kubectl create --dry-run=client --validate -f file.yaml |
| create a deploymentedit deployment web runtimeautoscale deployment rolling updatevalidate the rolloutundo the rollout | kubectl create deploy --image=nginx web --replicas=3kubectl edit deploy/webkubectl autoscale deploy/web --min=2 --max=5 --cpu-percent=10kubectl set image deploy/web web=regustry/web:2.0kubectl rollout status deploy/webkubectl rollout undo deploy/web |
| passing configmap string passing cm as a properties file query health check endpoint | kubectl create configmap my-config --from-literal=MESSAGE="hello from configmap” kubectl create cm my-config --from-file=my.properties curl -L http://localhost:8080/healthz |
| dump logs | kubectl logs podName kubectl logs podName -c containerName |

**
run kubectl against pods using xargs**
**fetch 1st colmn from o/p of multi pods**      
**refine o/p with specific value**                             

**`kubectl`** `get pods -o name | xargs -I{} kubectl exec {} -- command` `kubectl get pods -n ns | grep -v NAME | sed 's/\|/ /'|awk '{print $1}'kubectl get pods -n ns | grep -v NAME | awk '{print $1}' | cut -c8-14`  

**Calculate max pods in an EC2 instance type**             

**`curl`** `-O https://gist.githubusercontent.com/punitporwal07/4dccce3e51503b8fc786d754e64fbe6f/raw/0e4d130db82ee953ce9f93366a35b803cac39faa/max-pods-calculator.shchmod +x max-pods-calculator.shaws configure./max-pods-calculator.sh --instance-type m5.large --cni-version 1.9.0-eksbuild.1`
