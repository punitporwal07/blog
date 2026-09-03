---
title: "CLI instruction to work with git"
description: "go to https://github.com/new ( provided you have a git account)"
pubDate: 2018-05-11T05:01:00.074-07:00
updatedDate: 2024-11-09T13:34:58.479-08:00
tags:
  - "git"
originalUrl: "https://cloudnetes.blogspot.com/2019/05/uploading-project-on-git.html"
---

![](/blog/blog-images/github-mark-b9490514cec3.png)For those who are still struggling with committing and updating their codes or got bored with SVN due to its tedious branching and complicated merging model, **Git** is the best practice with branches to a certain commit. Git allows you to create, delete, and change a branch anytime without affecting the commits. it works on the principle of Distributed version control

go to [https://github.com/new](https://github.com/new) ( provided you have a git account)

**GitHub workflow**

To work on a repository, this is the workflow GitHub recommends:

-   Create a branch  > non-master
-   Switch branch   > git checkout non-master
-   Make changes  > Work on the branch locally
-   Create a pull request  > git pull 
-   Address review comments
-   Merge your pull request
-   Delete your branch

for more info refer to GitHub's official doc - [document](https://docs.github.com/en/get-started/quickstart/github-flow)

**start setting up your git repository** 

```
 Git global setup
 git config --global user.name "punitporwal07"
 git config --global user.email "punitporwal07@gmail.com"

 Get a new repository
 git clone https://gitlab.com/punitporwal/repo.git
 cd repo
 git add README.md
 git commit -m "Commit Message"
 git push -u origin master/main

 Branching  Use branching to add new features isolated from the working project.
  Create a new branch for you to work on
  Add a branch called porwalp

 git clone https://github.com/punitporwal07/Myrepo.git
 cd Myrepo
 git checkout -b porwalp // this will add a new branch called maintainence
 git branch     // this will list all the branches
 touch test.html
 git status     // if nothing to add

 git branch --set-upstream-to origin/main // this will set the local branch to match with remote branch  // Branch 'porwalp' set up to track remote branch 'main' from 'origin'.

 git add -A     // this will add html file to stage directory
 git commit -m 'added a maintainence page'
 git push origin HEAD:porwalp // it will ask for credentials/token
    Sample output will look like -

 git status     // file pushed to maintainence branch, which will be reflected in GUI

    o/p from GitLab

    o/p from GitHub

 Update and merge

 Step 1: Clone the repository or update your local repository with the latest changes.

 git pull origin main

 Step 2: Switch to the base branch of the pull request.
 git checkout main

 Step 3: Merge the head branch into the base branch.
 git merge maintainance

 Step 4: Push the changes.
 git push -u origin main

 Push a folder to a new Git Repo-

 cd existing_folder git config --global user.name "punitporwal07"
 git config --global user.email "punitporwal07@gmail.com" git init -b main    // Initialize the local directory as a Git repository
 git add .           // Add files in local repository and stages them for commit git status          // verfiy all the files git commit -m "pushing the data" git branch -M main git remote add origin https://gitlab.com/punitporwal/repo.git
 git push -u origin main

 Push a folder to an existing Git Repo-

 cd existing_folder
 git init git pull https://gitlab.com/punitporwal/repo.git git add .           // Add files in local repository and stages them for commit git status          // verfiy all the files git commit -m "pushing the data" git remote add origin https://gitlab.com/punitporwal/repo.git git push -u origin main

 To unstage a file, use 'git reset -- HEAD YOUR-FILE'. git reset -- excludeFile.txt // excludeFile.txt will not be pushed git add -u
 git status
 git remote -v  // verifies the remote URL
 git commit -m "Initial commit"
 git push -u origin master

 Push an existing Git repository
 cd existing_repo
 git remote rename origin old-origin
 git remote add origin https://gitlab.com/punitporwal/repo.git
 git push -u origin --all
 git push -u origin --tags
 Rename a Git repository in GitLab
 git checkout old-branch-name
 git branch -m new-branch-name
 git push origin -u new-branch-name
 git push origin --delete old-branch-name
```

![](/blog/blog-images/git-200b61a19fdd.png) Distributed version control mechanism

known issue

Git push error pre-receive hook declined
\[remote rejected\] master -> master (pre-receive hook declined)

solution:

GitLab by default marks master branch as protected (See [Protecting your code](https://about.gitlab.com/2014/11/26/keeping-your-code-protected/) /why). 

Open your project > **Settings** \> **Repository** and go to "**Protected branches**", find "**master**" branch into the list and click "**Unprotect**" and try again.

[https://gitlab.com/gitlab-com/support-forum/issues/40](https://gitlab.com/gitlab-com/support-forum/issues/40)

For version 8.11 and above: [how to protect](https://docs.gitlab.com/ee/user/project/protected_branches.html#restricting-push-and-merge-access-to-certain-users)

**Generating your personal access token**

navigate to git **profile** \> **settings** \> **Developer settings** > **Personal access tokens** > **Generate new token**  New personal access token  "**nameit"**  select scope **Generate token** 

copy token value

use this token at any place where needed

for example in openshift:

```
$ oc create secret generic git-secret \
  --from-literal=username=punitporwal07 \
  --from-literal=password=4f41599f5f99e84e7cc9f552ad6c731ce0573a6a
```
