---
title: "Configure an Event Bridge to stop EC2 instance"
description: "Sometimes it is hard to keep track of your EC2 instance status and when you fail to do so you will end up"
pubDate: 2022-06-11T13:26:00.030-07:00
updatedDate: 2023-10-24T04:48:04.422-07:00
tags:
  - "AWS"
originalUrl: "https://cloudnetes.blogspot.com/2022/06/configure-event-bridge-to-stop-ec2.html"
---

![](/blog/blog-images/d021c2014d23.png)

Sometimes it is hard to keep track of your EC2 instance status and when you fail to do so you will end up
getting high bills based on their usage. 

You can cut down your bills by scheduling [**EventBridge**](https://aws.amazon.com/eventbridge/) rules for the instances you are not using.

Go to **Amazon EventBridge** > **Create Rule**

1.  Create a new rule and select **Rule type** as _Schedule_.

2.  Select **Schedule Pattern** as - _A fine-grained schedule that runs at a specific time

    _

3.  Define the cron expression for instance shutdown schedule.

    >  For eg. cron(30 17 \* \* ? \*)  this will stop your EC2 instance at 17:30 everyday

    > select time zone either as UTC or Local Time Zone 

4.  For **Target1**, select:

    -   **Target Type** as _"AWS service"_
    -   **Target** as _"EC2 StopInstances API call"_, and
    -   provide **Instance ID** to shut down as per schedule.
    -   Finally, select **Create a new role for this specific resource

        **
5.  Review the schedule and instance detail and finish creating the rule.

    ![](/blog/blog-images/eb-rule-28228c666266.png)

    You can use the method mentioned above (using lambda) to start the same instance again.

#### **Known errors -**

while adding an eventBridge rule you might get execution role error as show below -

![](/blog/blog-images/avvxsejnkhu3xy7n-vsztudg77z9dkxwcq4jrila-9c2f2c4f2025.png)

which can be fixed by updating the trust relationship for the role attached to your instance.

update the attached role to assume scheduler as trusted principal.

```
{
    "Version": "2012-10-17",    "Statement": [        {            "Effect": "Allow",            "Principal": {                "Service": [                    "ec2.amazonaws.com",                    "scheduler.amazonaws.com"                ]             },             "Action": "sts:AssumeRole"        }     ]}
```

to be continued...
