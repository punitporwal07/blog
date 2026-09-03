---
title: "Build and Push Image to ECR Using GitHub Actions"
description: "Throughout this article, we will use four key files to demonstrate the validity of the title. The following files should be part of your repository in order for the GitHub action to be invoked."
pubDate: 2022-10-28T04:29:00.019-07:00
updatedDate: 2022-10-30T14:12:06.226-07:00
tags:
  - "ecr"
  - "github"
originalUrl: "https://cloudnetes.blogspot.com/2022/10/build-and-push-docker-image-to-aws-ecr.html"
---

![](/blog/blog-images/gita-d5035c38b0aa.png)

Throughout this article, we will use four key files to demonstrate the validity of the title. The following files should be part of your repository in order for the GitHub action to be invoked.

![](/blog/blog-images/avvxsej0uipzqvxxmxk59ugrtbnu6fl0kn1pkg78-34d82b02f8b0.png)

Dockerfile
package.json
index.js
workflow/main.yaml

As a pre-requisite, you must have an active AWS & GitHub account.

**STEP 1** \- write a [Dockerfile](https://github.com/punitporwal07/github-action/blob/main/Dockerfile) for Nodejs App that we are going to deploy on ECR.

**STEP 2** \- Write a [package.json](https://github.com/punitporwal07/github-action/blob/main/package.json) file & include [index.js](https://github.com/punitporwal07/github-action/blob/main/index.js) in it.

**STEP 3** - Create a custom [workflow/main.yaml](https://github.com/punitporwal07/github-action/blob/main/.github/workflows/main.yaml) that plays a vital role in this experiment

from our repository, we are intending to use GitHub Actions to add a custom workflow to build the image and push it to AWS ECR.

understand the workflow -

```
 name: Build and push image to AWS-ECR
 on: push
 jobs:
   build:

     name: Build Image
     runs-on: ubuntu-latest

     steps:
     - name: This job scans Dockerfile in repository
       uses: actions/checkout@v2
     - name: This job reads the AWS credentials defined in secrets-actions to connect to ECR
       uses: aws-actions/configure-aws-credentials@v1
       with:
         aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
         aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
         aws-region: eu-west-2
     - name: This job will login to Amazon ECR
       id: login-ecr
       uses: aws-actions/amazon-ecr-login@v1

     - name: Here it will build, tag, and push image to AWS ECR
       env:
         ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
         ECR_REPOSITORY: repo-to-host-github-images
         IMAGE_TAG: github_action_image
       run: |
         docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
         docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

**STEP 4** - Create an ECR repository

`$ aws ecr create-repository --repository-name repo-to-host-github-images`

![](/blog/blog-images/avvxseinhiqvhzxeyzcft-sfynerzd2xziylyia5-0301355cf8b4.png)

**STEP 5** - Create Secret-actions in GitHub repo

From your repository navigate to **Settings > Secrets > Actions > New Repository Secret**

**

![](/blog/blog-images/avvxsejmhyc13gx2m3uz6qct1qtfh7vt2to-toj2-06eb2776485e.png)

STEP 6** - Add custom workflow -

From your repository navigate to **Actions > New workflow > setup a workflow yourself > paste above workflow > start commit** 

the workflow will be queued and start doing its job 

![](/blog/blog-images/avvxsei-3k01xemmpulwxjerb1q-opj06u6xulwo-54ab08cf5c41.png)

once the action job is successful you should be able to see them

![](/blog/blog-images/avvxsegg8kbaohjcesm5kttl84kfvzjpq-fzqzlk-703fdf33f711.png)

Your pushed image should be visible in AWS ECR as shown below

![](/blog/blog-images/avvxsejt0stsoozejbmre863poi9ttcttjcrjlqq-acc77c2e6f19.png)

**STEP 7 (Optional)** \- Test your docker image by pulling it from registry and run it

`$ docker pull 295xxx576.dkr.ecr.eu-west-2.amazonaws.com/repo-to-host-github-images:github_action_image`

`$ docker run -d -p 8080:8080 295xxx576.dkr.ecr.eu-west-2.amazonaws.com/repo-to-host-github-images:github_action_image`

![](/blog/blog-images/avvxsejazifyaoug4yfrzvxm9i9nfcsvllyvso6n-e22cdef1c360.png)

\--
