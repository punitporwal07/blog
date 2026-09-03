---
title: "Terraform  module"
description: "What is Terraform module & how to create one"
pubDate: 2022-11-08T05:06:00.026-08:00
updatedDate: 2024-01-04T06:56:15.324-08:00
tags:
  - "terraform"
originalUrl: "https://cloudnetes.blogspot.com/2022/11/advance-concepts-in-terraform.html"
---

![](/blog/blog-images/tf-modules-banner-ad6030e0c7b3.jpg)

**What is Terraform module & how to create one
**

A Terraform module is a collection of reusable Terraform configurations that represents a set of resources or infrastructure components that can be managed together as a single unit.

Terraform modules typically consist of:

**Input Variables:** Parameters that allow users of the module to provide specific values when they use the module. They serve as a way to customize the behavior of the module for different use cases.
**Resource Definitions:** A module defines the resources it creates or manages, allowing you to encapsulate complex infrastructure configurations into reusable components.
**Output Variables:** Output variables are used to expose specific information about the resources created by the module.
**Local Values (Optional):** Local values are used to define intermediate values or calculations within the module's configuration.
**Data Sources (Optional):** Data sources enable you to retrieve information about existing resources or data from external sources.
**Provisioners (Optional):** Provisioners are used to execute scripts or commands on resources after they are created or updated. While they can be used within a module, it is generally recommended to avoid using provisioners unless there is no other alternative.
**Submodules (Optional):** A Terraform module can also include other submodules, allowing for modular composition and reuse. Submodules are nested modules within the main module, which can be used to create a more granular and flexible component structure.

To create a Terraform module, follow these steps:

**Step 1**: Create a Directory
Create a new directory that will contain your module. Give it a meaningful name that represents the functionality of the module.

**Step 2**: Write Configuration Files
Inside the module directory, create one or more Terraform configuration files with the .tf extension. These files will define the resources and configurations that the module provides. The configuration files should include input variables, resource definitions, and output variables.

**Step 3**: Define Input Variables
Declare input variables in the module configuration files to allow users of the module to provide values specific to their use case. Use the declared input variables within the resource definitions and other parts of the module's configuration to make it configurable.

**Step 4**: Define Output Variables
Declare output variables to expose specific information about the created resources or any other relevant data.

**Step 5**: Publish the Module
To share the module with others, you can publish it to Terraform Registry (public or private) or a version control repository accessible to others.

Create a simple example of a Terraform module for an EC2 instance:

Directory structure for the module:

```
$ mkdir -p modules/aws-ec2-instance
$ cd modules/aws-ec2-instance/
$ touch main.tf variables.tf outputs.tf
$ cd ..
$ tree
.
└── aws-ec2-instance
    ├── main.tf
    ├── outputs.tf
    └── variables.tf

1 directory, 3 files
```

Now, let's define the contents of each file:

_main.tf_

```
resource "aws_instance" "example_instance" {
  ami           = var.ami
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  security_groups = [var.security_group_id]
}
```

_variables.tf_

```
variable "ami" {
  description = "The ID of the AMI to use for the EC2 instance."
}

variable "instance_type" {
  description = "The type of EC2 instance to create."
}

variable "subnet_id" {
  description = "The ID of the subnet where the EC2 instance will be launched."
}

variable "security_group_id" {
  description = "The ID of the security group to attach to the EC2 instance."
}
```

_outputs.tf_

```
output "instance_id" {
  description = "The ID of the created EC2 instance."
  value       = aws_instance.example_instance.id
}

output "public_ip" {
  description = "The public IP address of the EC2 instance."
  value       = aws_instance.example_instance.public_ip
}
```

With this module, you can create an EC2 instance by calling it in your root Terraform configuration:

```
provider "aws" {
  region = "us-west-2"
}

module "ec2_instance" {
  source = "./path/to/module"  # Local path to the module directory

  ami                = "ami-0c55b159cbfafe1f0"
  instance_type      = "t2.micro"
  subnet_id          = "subnet-0123456789abcdef0"
  security_group_id  = "sg-0123456789abcdef0"
}

output "module_instance_id" {
  value = module.ec2_instance.instance_id
}

output "module_public_ip" {
  value = module.ec2_instance.public_ip
}
```

You can store Terraform modules in various locations, depending on your use case and organizational preferences. Here are some common options for storing modules:

-   Local paths
-   Terraform Registry
-   Git Repositories

## Local paths

You can store modules directly in your Terraform project's directory structure, or in a subdirectory.
A local path must begin with either ./ or ../ to indicate that a local path.

```
module "instance" {
  source = "../modules/aws-ec2-instance"
}
```

**
Terraform Registry**

`(https://registry.terraform.io/modules/punitporwal07/ec2/aws/latest)`
**

![](/blog/blog-images/avvxsejbry09741o7-s4e3jfo7bo2eb4wo-0rc-n-fb84d6f03cb0.png)

**

The Terraform Registry is a public repository maintained by HashiCorp that contains many officially supported and community-contributed modules. You can publish your modules to the Terraform Registry or use existing modules directly from it.
You can also use a private registry, either via the built-in feature from Terraform Cloud or Terraform Enterprise.
Terraform Registry can be referenced using a registry source address of the form
 **< NAMESPACE >/< NAME >/< PROVIDER >** or **terraform-<PROVIDER>-<NAME>**

```
module "instance" {
  source = "hashicorp/ec2-instance/aws"
  version = "0.1.0"
}
```

**Git Repositories**
([`https://github.com/punitporwal07/terraform-aws-ec2`](https://github.com/punitporwal07/terraform-aws-ec2)) For larger projects or when you want to share modules across multiple projects or teams, you can store modules in separate Git repositories.

Each module will have its own repository, and you can refer to it using a Git URL.

**Publishing a module on Git** Repository
 refer -  [https://developer.hashicorp.com/terraform/registry/modules/publish](https://developer.hashicorp.com/terraform/registry/modules/publish) 

once module files are available in github, publish it from - [https://registry.terraform.io/](https://registry.terraform.io/) 

![](/blog/blog-images/avvxsei3wz8r26clpfjdo7-nuvarj3jzgnkdhvwr-c08e57ffbe75.png)

calling module in your code

```
module "ec2" {
  source = "punitporwal07/terraform-aws-ec2"
  version = "1.0.0" # git tag
}
```

or

```
module "ec2" {
  source = "git@github.com:aws-modules/terraform-aws-ec2.git"
  version = "1.0.0" # git tag
}
```

once published can be seen as below -

[![](/blog/blog-images/avvxsegjq3tc6fl-ri5zxyx5vazbti112j8n2aza-4f458380c337.png)](https://registry.terraform.io/modules/punitporwal07/ec2/aws/latest)
