---
title: "AWS secrets scanning"
description: "Were you aware? With GitHub's secret scanning, we are able to add an additional layer of security to our repositories."
pubDate: 2023-07-21T07:57:00.004-07:00
updatedDate: 2023-08-21T08:11:20.595-07:00
tags:
  - "AWS"
originalUrl: "https://cloudnetes.blogspot.com/2023/08/aws-secrets-scanning.html"
---

![](/blog/blog-images/avvxseij1w8q3tuz53c-sv2-aqlidnrtadxaui2k-c5653fd1c069.png)

Were you aware? With GitHub's secret scanning, we are able to add an additional layer of security to our repositories.

When we make our repositories public or make changes to public repositories, GitHub's advanced secret scanning feature is triggered. The program meticulously searches the code looking for any secrets that match predefined partner patterns.

When a potential secret is detected, the investigation does not end there! As a result, GitHub **notifies** the service provider responsible for the secret issuance. This could be a third-party service like AWS. The provider then assesses the situation and decides whether to revoke the secret, issue a new one, or reach out directly to us. Their response depends on the level of risk involved for all parties.

Within minutes you will get an email from AWS about the breach and your access key would have a **quarantine policy** attached to it. 

👉 Key takeaway: It is important to note that, while AWS is a key component of our technology stack, it is not the one that scans GitHub repositories for secrets. It is GitHub's secret scanning feature that protects us against inadvertent disclosures.

Furthermore, due to this feature of GitHub aws detects any exposed/compromised keys online, and will attach the "[AWSCompromisedKeyQuarantineV2](https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AWSCompromisedKeyQuarantineV2.html)" AWS Managed Policy ("Quarantine Policy") to the IAM User of which keys are exposed, and trigger a mail notification to your registered account with the details. So every time you try to use any resources from the exposed key you will get an authorization error.  

![](/blog/blog-images/iam-role-888ea1c7d89e.png)

ex: 

```
 FAILED! => {"changed": false, "msg": "Instance creation failed => UnauthorizedOperation:
 You are not authorized to perform this operation. Encoded authorization failure message:
 mw4pJJXTCly9BRXiEEzZhmPvanjwTNMCJ0MRAsFGw-jSRJyUwRz9tgdKjQF_S_d3IspWq_d4-LL1
```

The "UnauthorizedOperation" error indicates that permissions attached to the AWS IAM role or user trying to perform the operation does not have the required permissions to launch EC2 instances. Because the error involves an encoded message, use the aws-cli to decode the message. 

```
 Encoded-message is the encrypted value you get in your error msg
 $ aws sts decode-authorization-message --encoded-message encoded-message
```

\--
