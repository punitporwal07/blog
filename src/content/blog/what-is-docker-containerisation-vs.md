---
title: "Docker: Containerization Tool"
description: "Docker allows you to encapsulate your application, operating system and hardware configuration into a"
pubDate: 2017-11-23T10:52:00.184-08:00
updatedDate: 2025-05-04T02:21:53.907-07:00
tags:
  - "Containerisation"
  - "Docker"
originalUrl: "https://cloudnetes.blogspot.com/2017/11/what-is-docker-containerisation-vs.html"
---

![](/blog/blog-images/0f4faa46d20e.jpg)

Docker allows you to encapsulate your application, operating system and hardware configuration into a
single unit to run it anywhere.
It's all about applications and every application requires much of Infrastructure, which is a massive waste of resources since it utilizes very less % of it. I mean with Physical Machine/ram/CPU results heavy loss of cost & bla blah.. hence Hypervisor/Virtualization came into the picture, where we use shared resources on top of a single physical machine and create multiple VMs to utilize more from it but still not **perfect.**

**Docker** is the solution to the above problem, it can containerize your requirement & works on the principle of layered images.
working with docker is as simple as three steps:

-   Install Docker-engine
-   Pull the image from HUB/docker-registry
-   Run image as a container/service

**

**How containers evolved over Virtualization**

**

![](/blog/blog-images/vmvsdocker-3dcba83760b0.png)

\-In the virtual era, you need to maintain guest OS on the host OS in form of virtualization which boots up in minutes or so.
whereas containers bypass gust OS from host OS in containerization & boots up in a fraction of seconds
\- It is not replacing virtualization, it is just the next step in evolution (more advanced)

**What is docker?**
Docker is a containerization platform that can bundle up technologies and packages your application and all its dependencies together in the form of an **image** which further you run as a service called container so as to ensure that your application will work in any environment be it Dev/Test/Prod

**Point to remember**

-   docker images are the read-only template & used to run containers
-   There is always a base image on which you layer up your requirement
-   the container is the actual running instance of the images
-   we always create images and run containers using images
-   we can pull images from the image registry/hub can be public/private
-   docker daemon runs on the host machine
-   **docker0** is not a normal interface | Its a Bridge | Virtual Switch | that links multiple containers
-   Docker images are registered in the image registry & stored in the image hub
-   [Docker hub](https://hub.docker.com/) is docker's own cloud repository (for sharing & caring purpose of images)

**The essence of docker:** if you are new to any technology and want to work on it, get its image from the docker hub configure it, work on it, destroy it, then you can move the same image to another environment and run as it is out there.   

                          ![](/blog/blog-images/doc-65bee0fc4272.jpg)                      
**key attribute of kernel used by containers**

-   Namespaces (PID, net, mountpoint, user) Provides Isolation
-   cgroups (control groups)
-   capabilities ( assigning privileges to container users)
-   but each container shares common Kernel

**how communication happens b/w docker client & docker daemon
**

-   Rest API
-   Socket.IO
-   TCP

## **Dockerfile supports the following list of variables**

**`FROM       image:tag AS name`**

**`ADD        ["src",... "dest"]`**

**`COPY`**       **`/src/ dest/`**

**`ENV`**        **`ORACLE_HOME=/software/Oracle/`**

**`EXPOSE`**     **`port, [port/protocol]`**

**`LABEL`**      **`multi.label1="value1"`** **`multi.label2="value2" other="value3"`**

**`STOPSIGNALUSER`**       **`myuser`**

**`VOLUME`**     **`/myvolume`**

**`WORKDIR`**    **`/locationof/directory/`**

**`RUN`**        **`write your shell command`**

**`CMD`**        **`["executable","param1","param2"]`**

**`ENTRYPOINT`** **`["executable","param1","param2"] (exec form, preferred)`**

**`ENTRYPOINT`** **`command param1 param2 (shell form)`**

**`ENTRYPOINT`** **`script ; /bin/bash`**

**`How RUN | ENTRYPOINT | CMD differ from each other`**

`RUN is built time instructions used to add layers to images & to install appsENTRYPOINT is not mandatory to use, it cannot be overridden at run-time with normal commands like docker run command. Any command passed to ENTRYPOINT is treated as first-ever command of that container.CMD only executes at runtime. It executes commands in container at launch time equivalent of docker run <args> <command>. It can be used only once per DockerfileShell form/commands are expressed the same way as a shell command. Commands get prepended by "/bin/sh -c" | variable expansion etc.Exec form | json array style - ["command", "arg1"]container don't need a shell | no variable expansion | no special characters(&&,||, <>)`

**Some arguments which you can use while running any docker Image

**

`$ docker run -it` `--privileged` `image:tag`

`--privileged` will give all capabilities to the container and lifts all the limitations enforced by OS/device, even you can run docker inside docker with it.

# Installing docker-engine onto any Ubuntu system

$ sudo apt-get update -y && apt-get install docker.io \# this will install docker-engine as a Linux service. Check engine status by running $ service docker status // else $ service docker start

check docker details installed in your system by running any of these commands

`$ docker -v | docker version | docker info`

**Docker needs root to work** for the creation of Namespaces/cgroups/etc..

`$ ls -l /var/run/docker.sock`

`srw-rw---- 1 root docker 0 Jun 21 06:43 /var/run/docker.sock`

so you need to add your local user to docker group (verify docker group from /etc/group and add your user as:

`$ sudo usermod -aG docker $USER`

`# restart your session`

`# Alternatively, add your user to the docker group`

`$ vi /etc/group`

`# append $USER to docker group and start using docker with your user now`

`# if fails with -`

level=error msg="'**overlay**' is not supported over **btrfs**" `level=fatal msg="Error starting daemon: error initializing graphdriver:`

Failed to start Docker Application Container Engine.

`it appears that the underlying storage defined in daemon.json is not supported`

`/etc/docker/daemon.json`

remove the above file and clear the `/var/lib/docker/*`

`restart the docker service`

## `Basic commands`

| Function | Command |
| --- | --- |
| pull a docker image | docker pull reponame:imagename:tag |
| run an image | docker run parameters imagename:tag |
| removing all the images for a specific registry | docker images --format "{{.Repository}}:{{.Tag}}" | grep "registry.docker.com" | xargs -I {} docker rmi {} |
| list running containerslist container even not runningdocker ps Filter | docker psdocker ps -adocker ps --format "table {{.ID}}\\t{{.Names}}\\t{{.Status}}" |
| build an image | docker build -t imagename:tag . |
| remove n processes in one command | docker rm $(docker ps -a -q) // for older versionsdocker container prune -f // for newer versions |
| remove n images in one command | docker rmi $(docker image -a -q) |
| reset docker system | docker system prune |
| create mount | docker volume create |
| using mount point | docker run -it -p 8001-8006:7001-7006 --mount type=bind, source=/software/, target=/software/docker/data/ registry.docker/weblogic12213:191004docker run -it -p 8001-8006:7001-7006 -v data:/software/ registry.docker/weblogic1036:191004 |

| create network | docker network create --driver bridge --subnet=192.168.0.0/20 --gateway=192.168.0.2 mynetworkdocker run -it -p 8001:8006:7001:7006 --network=mynetwork registry.docker/weblogic1036:191004 |
| --- | --- |
| For more on networkinghandful aliases | click here: networking in dockeralias d='docker'alias di='docker images'alias dps='docker ps'alias dpa='docker ps -a' |

## **
As an exercise, let's attempt to set up Jenkins via Docker on a Linux machine**

Open a terminal window and run(Provided Docker is already installed)

**`$ docker pull punitporwal07/jenkins`**

`$ docker container run --rm -d -p 9090:8080 -v jenkins-data:/var/jenkins_home/ punitporwal07/jenkins` where
**docker run :** default command to run any docker container
**\--rm :** this will remove the docker container as soon as process exits
**\-d :** run the container in detached mode(in background) and omit the container ID
**\-p :** port assignation from image to you local setup **\-p host-port:container-port**
**\-v :** Jenkins data to be mapped to /var/Jenkins\_home/ directory/volume to one of your file system
**punitporwal07/jenkins:** docker will pull this image from your image registry
it will process for 2-3 mins then prompt as:

INFO: Jenkins is fully up and running

to access the jenkins console( http://localhost:9090 ) for the first time you need to provide admin password to make sure it was installed by admin only. & it will prompt admin password during the installation process as something like:

![](/blog/blog-images/jenkins-plugins-912db4537a98.png)

`e72fb538166943269e96d5071895f31c`
This may also be found at: /var/jenkins\_home/secrets/initialAdminPassword

here we are running Jenkins inside docker as a detached container you can use:
**$ docker logs** to collect jenkins logs
if we select to install recommended plugins which are most useful, Jenkins by default will install

**Best practice to write a Dockerfile**

best practice is to build a container first, run all the instructions one by one that you are planning to put in a Dockerfile. Once they got succeed you can put them in your Dockerfile, which will avoid you building n images from your Dockerfile again and again and save image layers as well.

Writing a docker File: ( **FROM COPY RUN CMD**)

a Container runs on level of images:
            base image
            layer1 image
            layer2 image

Dockerfiles are simple text files with a command on each line.
To define a base image we use the instruction **FROM** 

Creating a Dockerfile

-   The first line of the Dockerfile should be **FROM** nginx:1.11-alpine (it is better to use exact version rather then writing it as latest, as it can deviate your desired version)
-   **COPY** allows you to copy files from the directory containing the Dockerfile to the container's image. This is extremely useful for source code and assets that you want to be deployed inside your container.
-   **RUN**  allows you to execute any command as you would at a command prompt, for example installing different application packages or running a build command. The results of the RUN are persisted to the image so it's important not to leave any unnecessary or temporary files on the disk as these will be included in the image & it will create a image for each command
-   **CMD** is used to execute any single command as soon as container launch

**Life of a docker Image

**

**write** a Dockerfile > **build** the image > **tag** the image > **push** it to registry > **pull** the image to any system > **run** the image as **container**

vi Dockerfile: 

FROM baseLayer:version
MAINTAINER xxx@xx.com
RUN install
CMD special commands/instructions
`$ docker build -t imagename:tag .$ docker tag 4a34imageidgfg43 punixxorwal07/image:tag$ docker push punixxorwal07/image:tag$ docker pull punixxorwal07/image:tag$ docker run -it -p yourPort:imagePort punixxorwal07/image:tag`

**How to Upload/Push your image to a registry**

after building your image (docker build -t imageName:tag .) do the following:

**step1**\- login to your docker registry
$ docker login --username=punitporwal --email=punixxorwal@xxxx.com

list your images
$ docker images

**step2**\- tag your image for registry
$ docker tag b9cc1bcac0fd reponame/punitporwal07/helloworld:0.1

**step3**\- push your image to registry
$ docker push reponame/punitporwal07/helloworld:0.1

your image is now available and open for world, by default your images is public.

repeat the same step if you wish to do any changes in your docker image, make the changes, tag the new image, push it to you docker hub

**Running your own image registry**

`$ docker pull registry/registry:2`

`$ docker run -d -p 5000:5000 --restart always -v /registry:/var/lib/registry --name registry registry:2` 

if its an insecure registry update registries.conf with entry of your insecure registry before pushing your image to it

`$ sudo vi /etc/containers/registries.conf`

## **Volumes in Docker**

**first of all create volume for your docker container using command**
`$ docker volume create myVolume`
`$ docker volume ls` 
`DRIVER              VOLUME NAME`
`local               2f14a4803f8081a1af30c0d531c41684d756a9bcbfee3334ba4c33247fc90265`
`local               21d7149ec1b8fcdc2c6725f614ec3d2a5da5286139a6acc0896012b404188876`
`local               myVolume`
there after use following way to use volume featurewe can define volumes in one container and same can be share across multiple containers

to define in container 1
`$ docker run -it -v /volume1 --name voltainer centos /bin/bash`

to call in another container from other container
`$ docker run -it --volumes-from=voltainer centos /bin/bash`

we can call Volumes in a container from Docker engine host
`$ docker run -v /data:/data`

`$ docker run --volume mydata:/mnt/mqm`

     /volumeofYourHost/:/volumeofContainer/

to define in a Dockerfile
VOLUME /data (but we cannot bind the volume from docker host to container via this, just docker run command can do this)

**DOCKER DAEMON LOGGING**

![](/blog/blog-images/logging-415578fe007a.png)

first of all stop the docker service
`$ service docker stop`
`$ docker -d -l debug &`
\-d here is for daemon

\-l log level
& to get our terminal back
or
`$ vi /etc/default/docker/`
add log-level
**DOCKER\_OPTS="--log-level=fatal"**
then restart docker deamon
`$ service docker start`

**Br**

**Punit**
