---
title: "All about Docker swarm"
description: "There is always a requirement to run every individual service without failover and load balancing. When this comes to container services docker swarm comes into the picture."
pubDate: 2019-01-20T23:21:00.073-08:00
updatedDate: 2021-08-18T00:17:08.645-07:00
tags:
  - "Docker"
  - "Swarm"
originalUrl: "https://cloudnetes.blogspot.com/2019/01/all-about-docker-swarm.html"
---

There is always a requirement to run every individual service without failover and load balancing. When this comes to container services docker swarm comes into the picture.

![](/blog/blog-images/swarm-ee6e02d48e97.png)

Docker swarm is a cluster of docker containers and provide a container orchestration framework like k8s, nomad and apache mesos.

-   comprises of managers and workers
-   managers are also known as workers
-   there will be only one manager as a leader, other managers will act as a backup
-   as a pre-requisite, your docker version should be on 1.12+

```
  # to initiate docker swarm
  $ docker swarm init --advertise-addr ManagerIP:2377 --listen-addr ManagerIP:swarmListenPort
```

**2377 -** is the default port for swarm

**172.31.22.15** \- is my Manger node IP
**addvertise-addr -** will let swarm manager to use specific IP:PORT. 

```
 [root@Manager1]# docker swarm init --advertise-addr 172.31.22.15:2377 --listen-addr 172.31.22.15:2377
 Swarm initialized: current node (icuih1r0n8juo8xigkceniu3j) is now a manager.
 To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-15z6ejowo...63dn550as-7998mw9sxnh3ig 172.31.22.15:2377
 To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

 [root@Manager1]# docker node ls
 ID                           HOSTNAME  STATUS  AVAILABILITY  MANAGER STATUS
 icuih1r0n8juo8xigkceniu3j *  docker    Ready   Active        Leader
```

the highlighted command is the exact command that we need to run on a worker/manager that you wanna join to this swarm, it includes a token

```
 [root@Manager1]# docker swarm join-token manager
 To add a manager to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-15z6ejowow...63dn550as-9wiyb3pyiviqik 172.31.22.15:2377

 [root@Worker1]# docker swarm join-token worker
 To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-15z6ejowow...63dn550as-7998mw9sxnh3ig 172.31.22.15:2377
```

following the above command to join leader as worker/manager, launch another ec2 instance or any with docker 1.12+ in it and

```
 $ docker swarm join --token SWMTKN-1-15z6ejowow53...63dn550as-9wiyb3pyiviqik 172.31.22.15:2377
```

you will see all the workers/managers you have joined with your swarm from the Leader node as:

```
 [root@Manager1]# docker node ls
 ID                           HOSTNAME  STATUS  AVAILABILITY  MANAGER STATUS
 25nwmw5eg7a5ms4ch93aw0k03    Worker3   Ready   Active
 icuih1r0n8juo8xigkceniu3j *  Manager1  Ready   Active        Leader
 5pm9f2pzr8ndijqkkblkgqbsf    Worker2   Ready   Active
 9yq4lcmfg0382p39euk8lj9p4    Worker1   Ready   Active
 # docker info will give you a detailed info on your swarm
 [root@Manager1]# docker info
 Containers: 12
 Running: 0
 Paused: 0
 Stopped: 12
 Images: 1
 Server Version: 1.13.1
 Storage Driver: aufs
 Root Dir: /var/lib/docker/aufs
 Backing Filesystem: extfs
 Dirs: 54
 Dirperm1 Supported: true
 Logging Driver: json-file
 Cgroup Driver: cgroupfs
 Plugins:
 Volume: local
 Network: bridge host macvlan null overlay
 Swarm: active
 NodeID: icuih1r0n8juo8xigkceniu3j
 Is Manager: true
 ClusterID: hpvfpcevwt8144bj65yk744q8
 Managers: 1
 Nodes: 6
 Orchestration:
 .
 ..
 Node Address: 10.91.20.119
 Manager Addresses:
 10.91.20.119:2377
 ......
 ..
```

**now creating a** **SERVICE** **and running it on docker swarm**
(the whole idea of setting this orchestration layer is, we don't need to worry about our app as where it is running but it will be up for the whole time)

```
 $ docker serivce create | update | ls | ps | inspect | rm
 ex:
  $ docker service update -image=punitporwal07/apache:2.0 --detach=true apache
  $ docker service scale >> docker service update --replicas
  $ docker service scale Name=7
  $ docker service ps Name
  $ docker network create -d overlay pp-net

 $ docker service create --name myswarmapp -p 9090:80 punitporwal07/apache
 rvzrpe4szt0vdyqte7g7tfshs
```

![](/blog/blog-images/servicesps-386d38bf9737.jpg)

by doing this, any time when you gonna hit your exposed port for service to any host/IP in swarm it will give you your application, without having its container running on it. (service will be running only on leader/manager1)

accessing the service now:

![](/blog/blog-images/servicetest-4034d2a0f824.jpg)

**NOTE:** after advertising listen address to the docker swarm, you may get an error next time when you try to initialize the docker daemon. (if you are using dynamic IP)

```
 # below two files hold your IP and failed to initialize docker-daemon
 /var/lib/docker/swarm/docker-state.json
 /var/lib/docker/swarm/state.json

 # sample error message
 ERRO[0001] cluster exited with error: failed to listen on remote API
 address: listen tcp 10.91.20.119:2377: bind: cannot assign requested address

 FATA[0001] Error creating cluster component: swarm component could
 not be started: failed to listen on remote API address: listen tcp
 10.91.20.119:2377: bind: cannot assign requested address
```

change the IP and initialize it again

```
  $ service docker restart

```

k/r,

P
