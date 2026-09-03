---
title: "Secret detection in GitLab"
description: "this article will help you to enable secret detection in GitLab a.k.a GitLeaks."
pubDate: 2024-10-15T09:38:00.000-07:00
updatedDate: 2025-03-27T03:43:15.954-07:00
tags:
  - "gitlab"
originalUrl: "https://cloudnetes.blogspot.com/2024/10/secret-detection-in-gitlab.html"
---

![](/blog/blog-images/avvxseiow-euf0exc1spdywjivsuhr094ce2mtpg-5fd87995c131.png)

 this article will help you to enable secret detection in GitLab a.k.a GitLeaks.

Once you have your GitLab project created. You are required to have the following file structure in it which is highlighted below -

![](/blog/blog-images/avvxsei-mnofwcgv7gwdlydvusubezi9vcu2giyq-7bb98dff681e.png)

ref - [https://docs.gitlab.com/ee/user/application\_security/secret\_detection/pipeline/index.html#detecting-complex-strings](https://docs.gitlab.com/ee/user/application_security/secret_detection/pipeline/index.html#detecting-complex-strings) 

```
 # .gitlab-ci.yml
 # See https://docs.gitlab.com/ee/ci/variables/#cicd-variable-precedence

 include:
   - template: Jobs/Secret-Detection.gitlab-ci.yml
 secret_detection:
   variables:
     SECRETS_ANALYZER_VERSION: "4.5"
 # .gitlab/secret-detection-ruleset.toml

 # https://docs.gitlab.com/ee/user/application_security/secret_detection/pipeline/index.html#create-a-ruleset-configuration-file

 [secrets]
   [[secrets.passthrough]]
     type   = "file"
     target = "gitleaks.toml"
     value  = "extended-gitleaks-config.toml"
 # extended-gitleaks-config.toml

 # See https://docs.gitlab.com/ee/user/application_security/secret_detection/pipeline/index.html#detecting-complex-strings

 [extend]
 # Extends default packaged ruleset, NOTE: do not change the path.
 path = "/gitleaks.toml"

 [[rules]]
   description = "Generic Password Rule"
   id = "generic-password"
   regex = '''(?i)(?:pwd|passwd|password)(?:[0-9a-z\-_\t .]{0,20})(?:[\s|']|[\s|"]){0,3}(?:=|>|
              =:|:{1,3}=|\|\|:|<=|=>|:|\?=)(?:'|\"|\s|=|\x60){0,5}([0-9a-z\-_.=\S_]{3,50})(?:['
              |\"|\n|\r|\s|\x60|;]|$)'''
   entropy = 3.5
   keywords = ["pwd", "passwd", "password"]

 [[rules]]
 description = "Generic Complex Rule"
 id = "COMPLEX_PASSWORD"
 regex = '''(?i)(?:key|api|token|secret|client|passwd|password|PASSWORD|auth|access)(?:[0-9a-z\
            -_\t .]{0,20})(?:[\s|']|[\s|"]){0,3}(?:=|>|:{1,3}=|\|\|:|<=|=>|:|\?=)(?:'|\"|\s|=|\
            x60){0,5}([0-9a-z\-_.=]{10,150})(?:['|\"|\n|\r|\s|\x60|;]|$)'''
 severity = "high"
```

More complex rule can be referred from here  - [https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml](https://github.com/gitleaks/gitleaks/blob/master/config/gitleaks.toml)

once you have the following structure, enable GitLab Runner and invoke the pipeline.

In case the runner is not registered, do the following within your project 

ref - [https://docs.gitlab.com/runner/register/](https://docs.gitlab.com/runner/register/) 

Navigate to GitLab **project** > **settings** \> **CI/CD** > expand **Runner** tab 

Click on **three dots** and retrieve the registration token -

![](/blog/blog-images/avvxsega92xlmnlqawet0g99eyr4bzta9b9g-k-e-73377659c4e9.png)

Login to your GitLab-Runner VM and register your project.

```
 dont have gitlab-runner installed on VM, do the following -

 $ curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
 $ sudo apt install -y gitlab-runner
 $ gitlab-runner --version
 $  sudo systemctl status gitlab-runner
 If failed to verify public key - NO_PUBKEY 3F01618A51312F3F

   Use legacy method - apt-key -

 # Remove previous attempts
 $ sudo rm -f /usr/share/keyrings/gitlab-runner-archive-keyring.gpg
 $ sudo rm -f /etc/apt/sources.list.d/gitlab-runner.list

 # Import key using apt-key (legacy)
 $ curl -fsSL https://packages.gitlab.com/runner/gitlab-runner/gpgkey | sudo apt-key add -

 # Add repo without signed-by
 $ echo "deb https://packages.gitlab.com/runner/gitlab-runner/ubuntu jammy main" | sudo tee /etc/apt/sources.list.d/gitlab-runner.list

 # Update and install
 $ sudo apt update
 $ sudo apt install -y gitlab-runner
 # verify gitlab-runner
 $ gitlab-runner -version
Version:      17.10.1
Git revision: ef334dcc
Git branch:   17-10-stable
GO version:   go1.23.6 X:cacheprog
Built:        2025-03-26T12:24:33Z
OS/Arch:      linux/amd64

 Now start registering runners
 $ gitlab-runner register

 Runtime platform                                    arch=amd64 os=linux pid=927974 revision=853330f9 version=16.5.0
 Running in system-mode.

 Enter the GitLab instance URL (for example, https://gitlab.com/):
 https://gitlab.company.domain.com/
 Enter the registration token:
 GR-EXAMPLE-REGISTRATION-TOKEN
 Enter a description for the runner:
 [gitrunnerinstance01]: myproject-runner
 Enter tags for the runner (comma-separated):

 Enter optional maintenance note for the runner:

 WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6
 and will be replaced with support for authentication tokens. For more information, see https://docs.gitlab.com/ee/ci/runners/new_creation_workflow
 Registering runner... succeeded                     runner=GR_EXAMPLE_TOKEN_REDACTED
 Enter an executor: shell, ssh, docker-autoscaler, docker+machine, kubernetes, custom, docker, docker-windows, parallels, virtualbox, instance:
 docker
 Enter the default Docker image (for example, ruby:2.7):
 gcr.io/kaniko-project/executor

 Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!

 Configuration (with the authentication token) was saved in "/etc/gitlab-runner/config.toml"
```

Now that the runner is registered with your project you can invoke the ci/cd-pipeline on your next commit & if your project contains any secrets will be detected in the pipeline and a job artifact will be generated in the form of json that will have the detected leaks as shown in the screenshot below -

![](/blog/blog-images/avvxseilkn2mbumrsihcdqkrz1sxrccs4oknoral-fe677dea847b.png)

leak report showing detected secrets -

![](/blog/blog-images/avvxseilcj-emtanwaz1tfhz12cao2urs0ccp6ca-8e1a60ffef37.png)

gl-secret-detection-report.json can be downloaded by navigating thru - **Jobs** \> **Artifacts** \> **gl-secret-detection-report.json**
that is how secrets in the code will be detected using GitLeaks before the code is pushed to the source repository GitLab.
