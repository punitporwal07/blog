---
title: "Understanding YAML"
description: "Basics"
pubDate: 2021-02-11T07:56:00.034-08:00
updatedDate: 2023-02-11T09:49:32.423-08:00
tags:
  - "yaml"
originalUrl: "https://cloudnetes.blogspot.com/2021/02/understanding-yaml.html"
---

![](/blog/blog-images/avvxsegwpzzezvyd4yabfawrw4zukmt3iesrvjbg-f33532bd5650.png)

**Basics** 

 yaml has three basic rules -

1\. Indentation - only 2 or 4 spaces
2\. Maps - key-value pairs
3\. list - a collection of things

 a yaml file uses space as indentation, you can use 2 or 4 spaces but no tab

**why does yaml forbid tab?**
Tabs have been outlawed since they are treated differently by different editors and tools.

![](/blog/blog-images/avvxseggcxje1ojjb4i6lbsx3oku9culfdtsfyqd-d249eba6b62a.png)

**Maps
**maps let you associate key-value pairs,
maps can be nested and in k8s you nest a lot of maps

![](/blog/blog-images/avvxsej5-gztkieadnn0gjk5nw8qg-sx14rf-dah-e9246436a6bf.png)

**lists
**a yaml list is a sequence of objects, you can virtually have any number of items in a list,
defined as items that start with a dash '-' indented from the parent

![](/blog/blog-images/avvxsejbxplo0p69d2m4psx5vtag1710lcsbjvku-ef47466423bf.png)

maps and list are the basic building blocks of any YAML file
any list or map's value can be a string,  a number, a boolean, 'null', or another dictionary or list
in most cases, strings don't require quotes, But sometimes if you miss them BOOOMM...

**The Norway problem
**by default, the **yes** and **no** are converted into booleans

![](/blog/blog-images/avvxseiykxheymajpyfmvctkemrjrjeevsk670dg-4a1649c5fcda.png)

**Quotes**
if you are setting the version of a library without quotes
YAML automatically converts it into a number

![](/blog/blog-images/avvxsegbsbnk8bnj6kbs1f46u-4doa8nyq2eh2cb-9c0b5363e6fb.png)

**Time**
YAML automatically converts time into a seconds
ex - 4h 60m 60s + 30m x 60s = 16200s

![](/blog/blog-images/avvxseg7i2xj2gkygwmbbk2lt3-bvuu-dvvn-xys-afbbada09cd0.png)

**Keys**
Keys in JSON are always strings, in YAML - they can be any value, including boolean
having **on** as a key is a terrible idea 

![](/blog/blog-images/avvxseghg4gbq6wc-oysexsd53aklancgsm0bdjy-b29830735fe5.png)

**File**
YAML file is terminated with three dots '**...**'
YAML definitions in the same manifest can be separated using three dashes '**\---**'

![](/blog/blog-images/avvxsegcrvbjhwtw7fka0jqej9vvppq9uwh5r-le-990e1b53fcf7.png)

**label**
in YAML you can define structures and assign them labels using the '**&**' operator 
you can recall the structure with the '**\**' operator and the label name when you wish to reuse it

![](/blog/blog-images/avvxsehcdnpsnzhh06mqtnk9dfuozhfk0ssz27he-cd4c78cc55ce.png)

**
useful tools**

**yq -** https://mikefarah.gitbook.io/yq/ - CL tool designed to transform YAML

**jq  -** similar to popular JSON tool

_Disclaimer - This article has no intention of being commercially exploited and is solely for educational purposes._ 

_Credit - Daniele Polencic_
