---
title: "Deploying IaC using Terraform"
description: "In my view IaC is replacement of SOPs which is automated on top of it."
pubDate: 2020-04-30T04:52:00.093-07:00
updatedDate: 2023-11-07T04:03:03.256-08:00
tags:
  - "AWS"
  - "terraform"
originalUrl: "https://cloudnetes.blogspot.com/2020/04/deploying-iac-using-terraform.html"
---

![](/blog/blog-images/tws-93158840c855.png)TERRAFORM is used to automate infrastructure deployment across multiple providers in both public and private clouds & even on-prem. Provisioning of infrastructure through 'software' to achieve 'consistent' and 'predictable' environments is **I**nfrastructure **a**s **c**ode, it maintains a copy of the Local/Remote state.

                **In my view IaC is replacement of SOPs which is automated on top of it.**

**core concepts to achieve this**:

-   **Defined in Code:** Iac should be defined in code whether in the form of JSON YAML or HCL.
-   **Stored in source control:** the code should be stored somewhere in the version source control repository like GitHub.
-   **Declarative & Imperative:** In imperative, I am going to tell the software each and everything which it needs to do the job. In declarative software already have some sort of Idea or a predefined routine, what it is going to do with taking some references. so terraform is an example of a declarative approach to deploy IaC
-   **Idempotent & consistency:** once a job is done, and if again I get a request to do the same job it is idempotent behavior of terraform to not repeat the steps done while fulfilling this job, instead will say there is no change in configuration and current requirement is same as the desired one so no changes needs to be made. otherwise in a non-idempotent world each time this job comes it gonna repeat the same steps again and again to fulfil the requirement which is already in place.
-   **Push & pull:** terraform works on the principle of push mechanism where it pushes the configuration to its target.

The key benefit here is - everything is documented in code, which makes you understand your infrastructure in more detail.

**key terraform components**

**

![](/blog/blog-images/tfc-9b536d61d8f6.png)

**

AWS-Terraform beyond the basics - [Terraform-beyond-the-basics-with-aws](https://aws.amazon.com/blogs/apn/terraform-beyond-the-basics-with-aws/)

In this **exercise**, I am trying to demonstrate how you can quickly deploy a t2.micro instance of amazon Linux without login into the aws console by just writing a terraform plan
to begin with, you need to fulfill a prerequisite:

-   terraform client to run terraform commands                              
-   IAM user with AWS CLI access & sufficient policies attached to it
    like  - ![](https://us-east-1.console.aws.amazon.com/iam/assets/images/policy_icon.png) AmazonEC2FullAccess
            -  ![](https://us-east-1.console.aws.amazon.com/iam/assets/images/policy_icon.png)  IAMFullAccess

Note: at the time of writing this article I have used terraform version 0.8.5 so you may see some resource deprecation.

```
Install terraform client
$ wget https://releases.hashicorp.com/terraform/0.13.4/terraform_0.13.4_linux_amd64.zip
$ unzip terraform_0.13.4_linux_amd64.zip //updated version
$ sudo mv terraform /usr/sbin/
```

To create a terraform config file with .tf as an extension, here are the key blocks that terraform tends to use to define IaC

```
#PROVIDER  - AWS, google, kuberbetes like providers can be declared here
           - on-premsise [OpenStack, VMWare vSphere, CloudStack]

#VARIABLES - input variables can be declared here
#DATA      - data from provider collected here in form of data source
#RESOURCE  - feeding info about resources from provider here
#OUTPUT    - data is outputted when apply is called
```

Defining variables in terraform can be achieved in multiple ways, you can either create an external file with **\*.tfvars** extension or can create a **variables.tf** or can include it in your **main.tf** file to persist variable values.

In this exercise, I will attempt to deploy a "t2.micro" instance on Amazon EC with Nginx up and running.

in the end, your terraform configuration files structure may look like where \*.tfplan & \*.tfstate are the key files for your IaC.

![](/blog/blog-images/config-tree-edde387fbf75.png)

## **Creating a terraform configuration file will include following blocks**

## #VARIABLES

First, we are going to define a set of variables here, that are used during the configuration. I have defined keypairs so that we can SSH to our AWS instance, with a default region where my instance will be deployed

```
# VARIABLES
variable "prefix" {
  description = "servername prefix"
  default     = "ec2-by-tf"
}
```

## #PROVIDER

In the provider file we are defining our providers, and feeding information about our key details defined in our variable section with syntax _var.variableName_

```
# PROVIDER
provider "aws" {

  region  = "eu-west-2"
  profile = "dev"
}
```

## #DATA

In the datasource block, we are pulling data from the provider, in this exercise we are using amazon as a provider and using Linux AMI for our EC2 instance

```
datasources.tf
# DATA
data "aws_ami" "aws-linux" {
    most_recent = true
    owners      = ["amazon"]

    filter {
        name   = "name"
        values = ["amzn-ami-hvm*"]
    }
    filter {
        name   = "root-device-type"
        values = ["ebs"]
    }
    filter {
        name   = "virtualization-type"
        values = ["hvm"]
    }
}
```

## #RESOURCE

In this block we can define more than one resource, But, here I am using my existing Security Group, keyPair & subnet. 

```
#RESOURCE
resource "aws_instance" "web" {
  ami                         = "ami-078a289ddf4b09ae0"
  instance_type               = "t2.micro"
  count                       = 1
  vpc_security_group_ids      = ["sg-0239c396271cffcc3"]
  key_name                    = "my-london-kp"
  subnet_id                   = "subnet-00b9ff577be292c27"
  associate_public_ip_address = "true"
  tags                        = { Name = "${var.prefix}${count.index}" }
}
```

## #OUTPUT

this block will help to give you the output of your configuration, here it will give Public IP & EC2 Instance ID

```
#OUTPUT
output "instance_ip" {
  value       = "${aws_instance.web.*.public_ip}"
  description = "PublicIP address details"
}
output "instance_id" {
  value       = "${aws_instance.web.*.id}"
  description = "ID of EC2 Instance"
}

#END
```

Update the value for the following as per your requirement -

AMI ID

KeyPair

Security Group ID

Subnet ID

**now to deploy the above configuration, terraform deployment process follows a cycle:**

**Initialization >** **Planning >** **Application >** **destruction**

`$ terraform init`

this initializes the terraform configuration and checks for provider modules/plugins if its already not available and downloads the modules as shown below

![](/blog/blog-images/tfinit-88c669fe4392.png)

`$ terraform fmt // this will check the formatting of all the config files`

`$ terraform validate // this will further validate your config`

`$ terraform plan -out ami.tfplan // outing the plan will help to reuse it`

it looks for the configuration file in pwd and loads all variables if found in the variable file, and stores out the plan as shown below

![](/blog/blog-images/tfplan1-cf54a094a102.png)

![](/blog/blog-images/tfplan-output-25ac89cc19b3.png)

`$ terraform apply "ami.tfplan" --auto-approve`

it performs the configuration you created as code, applies it to the provider and does the magic. At the time of applying tfplan if anything config your terraform doesn't like and gives you an error, you need to correct it again and **replan the ami.tfplan**

![](/blog/blog-images/tfplan-apply-fa064b4865fe.png)

![](/blog/blog-images/tfplan-output-6d53b379332b.png)

**Test your configuration by hitting the URL generated by outputs.tf file**

![](/blog/blog-images/tf-test-5063af29b7b1.png)

**Validate from your aws console you will see this**

![](/blog/blog-images/t2-micro-f572c405c403.png)

now if you don't want the configs to be active and charge you the money you can destroy it
`$ terraform destroy --auto-approve`

lastly from your config folder you can destroy the config you applied and it will destroy everything corresponding to your config

![](/blog/blog-images/tf-destroy-af23e2d8140e.png)
