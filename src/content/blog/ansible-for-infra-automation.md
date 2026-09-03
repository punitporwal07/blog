---
title: "ANSIBLE: Configuration management tool for Infra automation"
description: "Ansible is an agent-less task execution engine, used for configuring, managing and installing software onto clients and nodes without any downtime and without an agent installed on them."
pubDate: 2017-07-11T03:22:00.092-07:00
updatedDate: 2024-02-23T03:05:47.518-08:00
tags:
  - "ansible"
originalUrl: "https://cloudnetes.blogspot.com/2017/07/ansible-for-infra-automation.html"
---

![https://www.middlewareandme.tech/search/label/ansible](/blog/blog-images/ansible-logo-dd8986f6b43c.png)

Ansible is an agent-less task execution engine, used for configuring, managing and installing software onto clients and nodes without any downtime and without an agent installed on them.
It uses SSH to communicate with clients.
provided all the nodes should have python installed in them + every step should **not** be carried with root user instead with ansible user.
Ansible needs:

-   SSH connection
-   a user
-   Python 2.4+

![](/blog/blog-images/ansiblejdkwls-07fc48c6e062.jpg)

-   It works on the principle of 'PUSH Based', which means it pushes modules from VCS to servers directly without the intervention of any intermediate client/agent
-   it contains Playbooks that are written in YAML code ( YAML ain't markup language)

**Hierarchy of Ansible roles -**

\- create <roles> directory

    \- inside roles create roles <roleDir>

    \- inside <roleDir> -> create taskDir, defaultDir, templateDir

        \- inside <taskDir> -> add all the ymls.

        \- inside <defaultDir> -> add main.yml

        \- inside <templateDir> -> add any template file if you are calling in any playbook

**\-** last at <roles> directory create a yaml and call  your <roleDir> as shown below -

```
- name: NameYourPlay
  hosts: "{{ target_hosts | default ('none') }}"
  become: yes
  become_method: sudo
  roles:
    - roleDir
```

![](/blog/blog-images/plays-8f3cf56f057f.jpg)Prototype of ansible-playbook

**Ansible** Contain Playbooks **Playbook** has a number of **plays**
**Play** contains **tasks**
**Task** calls core or custom **modules**
**Task** can use **templates**
**Handlers** triggers from notify
executed at the end and only once

\- Ansible contains more than 750 modules and can be customized and turned into custom modules.

\- Modules gets executed when you run Playbook onto your 1..n nodes.
\- For connectivity it uses

-   SSH password less connection by generating Public key install on all your nodes
-   Connection Plugins
-   export ANSIBLE\_HOST\_KEY\_CHECKING=False

 ```
 Quickly start with Ansible, try using my docker image
 pull : docker pull punitporwal07/ansible:2.6
 run : docker run -it punitporwal07/ansible:2.6
 test: ./runansibletest.sh

 By default ansible package is not available in some yum repositories,
 so you need to enable/add EPEL(extra package for Enterprise Linux) repository
 which is maintained over at Fedora Project

 $ rpm -ivh http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
 $ yum install ansible -y
 Installing Ansible on Ubuntu
 $ yum update -y
 $ apt-get update
 $ apt-get install ansible
 or
 $ sudo yum install ansible -y
 $ ansible --version
 Installing Ansible & boto on/for amazon EC2 instance
 $ amazon-linux-extras install epel
 $ sudo yum update -y
 $ sudo yum install ansible -y
 $ sudo yum install python-boto python-boto3 -y
 Install boto from source, if unable to find package
 $ git clone git://github.com/boto/boto.git
 $ cd boto && python setup.py install
 $ sudo apt-get install -y python3-botocore
 SETTING SSH COMMUNICATION BETWEEN SERVERS
 prepare SSH key for remote hosts
 switch to ansible user
 $ ssh-keygen -t rsa              --> enter enter enter
 $ ssh-copy-id -i ansible@nodes   --> enter passwords
                            or
 $ export ANSIBLE_HOST_KEY_CHECKING=False
   //which will bypass the host-key-check

 test using
 $ ansible -m ping all

 sudo pass command
 $ ansible-playbook --ask-sudo-pass
   //it will prompt for sudo password
 — If no passwordless ssh setup is there, then hardcode the cred. as below:

 linux1 ansible_host=10.20.192.1 ansible_connection=ssh ansible_user=username ansible_ssh_pass="pass"
 linux2 ansible_host=10.20.192.3 ansible_connection=ssh ansible_user=username ansible_ssh_pass="pass"
 linux3 ansible_host=10.20.192.3 ansible_connection=ssh ansible_user=username ansible_ssh_pass="pass"

 linux1 ansible_host=172.20.192.1 ansible_become_pass="rootpass" ansible_ssh_user=usertossh ansible_ssh_pass="pass"
 linux2 ansible_host=172.20.192.3 ansible_become_pass="rootpass" ansible_ssh_user=usertossh ansible_ssh_pass="pass"
 linux3 ansible_host=172.20.192.3 ansible_become_pass="rootpass" ansible_ssh_user=usertossh ansible_ssh_pass="pass"
```

**HOST INVENTORY**

```
 $ /etc/ansible/hosts //default Location

 provide list of target IP address which can be grouped as

 [local]
 localhost ansible_connection=local

 [appserver]
 1.2.3.4
 2.3.4.5

 [dbserver]
 3.4.5.6

```

**alternatively, you can design your own inventory and place it anywhere**

\- Inventory is the expression of your environment

\- Hostnames, groups, vars are for YOUR use, they have to make sense to YOU

\- Ansible cares about hosts and tasks, everything else is in support of that

\- Select a single source of truth. or try to minimize duplication of data

\- Normally, there is a simpler way to do it

\- Ansible makes it easy to switch approaches, don't be afraid to test and try

\- Mistakes are not failures

**How ansible commands are structured**
**ansible + host-group  + module    +   argument to module**
ansible  + localhost      + \-m yum    +  \-a "name=nginx state=latest"
ansible  + allserver       + -m shell   +   -a 'uptime'
ansible  + appserver     + \-m user    +   \-a "name=red group=oracle shell=bin/bash/"

**Ad-hoc commands**
ansible all -a 'uptime' (determine the uptime of all machines)
ansible -m ping all (test connection with all the host defined in host\_inventory)

**You can find some sample playbook's from my git repository**

[apache.yaml](https://github.com/punitporwal07/ansible/blob/master/example-playbooks/apache.yaml)

[java.yaml](https://github.com/punitporwal07/ansible/blob/master/example-playbooks/java.yaml)

[nginx.yaml](https://github.com/punitporwal07/ansible/blob/master/example-playbooks/nginx.yaml)

[ec2.yaml](https://github.com/punitporwal07/ansible/blob/master/aws-playbooks/aws-ec2-quickly.yaml)

**Ansible vault**

```
 We can use this utility to secure your sensitive data like password, keys etc

 some useful commands of ansible-vault

 $ ansible-vault encrypt  //encrypt any file
 $ ansible-vault edit     //edit encrypted file
 $ ansible-vault view     //view encrypted file
 $ ansible-vault rekey    //change the pass of encrypted file
 $ ansible-playbook -i inv.ini playbook.yml --ask-vault-pass
   // this will ask for vault pass while running playbook
 Using Ansible-vault without inline commands
 Create ansible inventory using command
 $ ansible-vault
 Define your inventory pass in some hidden text file
 $ echo mypass > .my-pass.txt
 Add password file in ansible.cfg
 vault_password_file = /path/to_your_file/.my-pass.txt
```

 Now next time when you run any playbook to use an encrypted inventory file it will pick up your inventory pass from the txt file defined in **ansible.cfg**

      [Rundeck](http://www.cloudnetes.blogspot.com/2020/08/rundeck.html) also uses the same mechanism when you define your ansible.cfg as a configuration file.
