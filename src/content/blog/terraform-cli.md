---
title: "Terraform Cheatsheet"
description: "| Category | Command | Purpose |"
pubDate: 2021-01-13T12:46:00.009-08:00
updatedDate: 2026-08-28T04:09:49.239-07:00
tags:
  - "terraform"
originalUrl: "https://cloudnetes.blogspot.com/2022/06/terraform-cli.html"
---

![](/blog/blog-images/d7fbaa8efb36.png)

| Category | Command | Purpose |
| --- | --- | --- |
| Initialize | terraform init | Initialize working directory, providers, and modules |
| Initialize | terraform init -upgrade | Upgrade providers and modules to newer versions |
| Formatting | terraform fmt | Format Terraform files |
| Formatting | terraform fmt -recursive | Format all Terraform files recursively |
| Validation | terraform validate | Validate Terraform configuration |
| Planning | terraform plan | Show infrastructure changes before applying |
| Planning | terraform plan -out=tfplan | Save execution plan to a file |
| Planning | terraform plan -detailed-exitcode | Return exit code based on changes detected |
| Apply | terraform apply | Apply infrastructure changes |
| Apply | terraform apply -auto-approve | Apply changes without confirmation |
| Apply | terraform apply tfplan | Apply a saved plan file |
| Destroy | terraform destroy | Destroy managed resources |
| Destroy | terraform destroy -auto-approve | Destroy resources without confirmation |
| Output | terraform output | Display output variables |
| Output | terraform output <name> | Display a specific output |
| Output | terraform output -json | Display outputs in JSON format |
| Show | terraform show | Display current state or plan details |
| Show | terraform show -json | Display state/plan in JSON format |
| Console | terraform console | Interactive Terraform expression console |
| Graph | terraform graph | Generate dependency graph |
| Version | terraform version | Show Terraform version |
| Providers | terraform providers | List providers in use |
| Providers | terraform providers schema -json | View provider schemas |

Import & Resource Replacement

| Command | Purpose |
| --- | --- |
| terraform import <resource> <id> | Import existing infrastructure |
| terraform plan -replace=<resource> | Plan resource replacement |
| terraform apply -replace=<resource> | Replace resource during apply |

### State Lock & Terraform Cloud

| Command | Purpose |
| --- | --- |
| terraform login | Login to Terraform Cloud |
| terraform logout | Logout from Terraform Cloud |
| terraform force-unlock <lock\_id> | Remove stale state lock |

### Refresh & Targeting

| Command | Purpose |
| --- | --- |
| terraform plan -refresh-only | Refresh state without making changes |
| terraform apply -refresh-only | Apply refreshed state |
| terraform plan -target=<resource> | Plan specific resource only |
| terraform apply -target=<resource> | Apply specific resource only |

**Terraform workspaces in more detail -**

Terraform workspaces are a feature that allows you to manage multiple distinct sets of Terraform state files within a single Terraform configuration.

Workspaces are useful when you need to maintain multiple copies of the same infrastructure for different purposes, such as development, testing, staging, and production, without duplicating your configuration files.

When you work with Terraform workspaces, each workspace has its own state file, which means that you can have different resource instances or configurations for each workspace.

This separation helps prevent accidental changes to the wrong environments and makes it easier to manage complex deployments.

Terraform starts with a single, default workspace named \`default\` that you cannot delete. If you have not created a new workspace, you are using the default workspace in your Terraform working directory.

Few commands to work on workspaces -

```
List workspaces:
$ terraform workspace list
 * default
Create a workspace:
$ terraform workspace new dev
 Created and switched to workspace "dev"!
```

You're now on a new, empty workspace. Workspaces isolate their state,

so if you run "terraform plan" Terraform will not see any existing state

for this configuration.

```
$ terraform workspace new staging
 Created and switched to workspace "staging"!
```

You're now on a new, empty workspace. Workspaces isolate their state,

so if you run "terraform plan" Terraform will not see any existing state

for this configuration.

To check the current workspace, use the \`terraform workspace show\` command.

```
$ terraform workspace show
staging
Select a Workspace:
To switch b/w workspaces

$ terraform workspace list
  default
  dev
* staging

$ terraform workspace select dev
 Switched to workspace "dev".

$ terraform workspace show
 dev

Destroy Resources per workspace:
$ terraform workspace delete dev
```
