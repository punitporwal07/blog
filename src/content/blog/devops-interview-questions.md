---
title: DevOps Interview Questions
description: DevOps Engineer - Interview Questions
pubDate: 2026-09-16T08:26
tags:
  - DevOps
draft: false
---
1. How does a CI/CD pipeline work end-to-end (commit → production)?

2. What happens internally when you run a Docker container?

3. How does Kubernetes schedule pods on nodes?

4. What causes CrashLoopBackOff and how do you debug it?

5. Difference between readiness and liveness probes? 

6. Explain Kubernetes architecture (API server, scheduler, etcd).

7. How does service discovery work in Kubernetes?

8. What happens when you run kubectl apply internally?

9. Difference between Deployment, StatefulSet, and DaemonSet?

10. How do you handle configuration management across environments?

11. How does Terraform manage state and dependencies internally?

12.  What is Terraform drift and how do you detect it?

13. How do you design Infrastructure as Code for multiple environments?

14. How does DNS resolution work step by step?

15. What is the difference between Layer 4 and Layer 7 load balancers?

16. If your application is slow under load, how do you identify bottlenecks?

17. How do you design monitoring and alerting for production systems?

18. How do you implement secure authentication between services?

19. How do you design zero-downtime deployment strategies?

20. If a production system goes down, how do you approach debugging step by step?

1. You’ve deployed an app to Azure Kubernetes Service (AKS) and it fails health checks randomly. How do you debug this end-to-end?

2. In a canary deployment to production, half the traffic returns 502, while others succeed. Walk us through your troubleshooting approach.

3. CI/CD pipeline takes 40 mins to deploy a small change. What would you do to optimize it?

4. You see high CPU usage in one pod, but logs look clean. What next?

5. You’re asked to design a highly available logging system for 100+ microservices across 3 regions. What tools and architecture would you suggest?

6. Production app works fine for internal users but fails for external ones (403 error). How will you isolate the issue?

7. How do you ensure secure and dynamic secret rotation in Azure DevOps pipelines?

8. Explain how you’d use Azure Application Gateway with Web Application Firewall for a sensitive banking application.

9. During an Azure deployment, you receive intermittent DNS resolution issues. What can be the causes?

10. A user reports 10-second delays every 15 minutes in an app running on AKS. No code changes happened. How would you begin RCA?

11. Jenkins jobs are randomly failing at the artifact upload step. What layers would you check?

12. How would you set up an automated rollback strategy in Kubernetes for failed deployments?

13. Design a cost-optimized cloud architecture for an internal reporting app that runs every night and stores logs for 3 years.

14. How do you handle zero-downtime database migrations in a distributed application?

15. What’s your approach to disaster recovery for stateful apps running on containers?

16. An Azure function is being throttled. How will you detect and fix it?

17. Define a plan for blue/green deployment with rollback on Azure using Terraform and pipelines.

18. How would you monitor end-to-end SLA for services involved in a payments pipeline?

19. Explain the difference in scaling strategies for compute-intensive vs I/O-intensive workloads in Azure.

