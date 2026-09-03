---
title: "A quick intro on Python"
description: "Programming in Python can be used for a wide variety of purposes, with strengths in scripting, automation, data analysis, machine learning, and back-end development. Suitable for both beginners and ex"
pubDate: 2016-08-30T05:41:00.036-07:00
updatedDate: 2024-01-24T06:41:11.552-08:00
tags:
  - "python"
originalUrl: "https://cloudnetes.blogspot.com/2018/08/python-3.html"
---

![](/blog/blog-images/8850e06d594c.png)

Programming in Python can be used for a wide variety of purposes, with strengths in scripting, automation, data analysis, machine learning, and back-end development. Suitable for both beginners and experienced developers.

There are two methods in software design

_One is - write code so simple that there are **obviously no bugs** in it,_ _Secondly - write code so complex that there are **no obvious bugs** in it_ 

_\- Tony Hoare_

So what makes Python so amazing. Click here to [Download](https://www.python.org/ftp/python/3.7.0/python-3.7.0.exe)

Automation for server maintenance
Cross-Platform apps
Android Development
Website

-   Python doesn't require to include/call classes/functions all time like in Java
-   Python doesn't ask you to use delimit statement({}) to close blocks and statements
-   Python 2 and Python 3 can do exist on a single system
-   You don't have to declare data type in advance as we do in other languages
-   Python IDE is [**PyCharm**](https://www.jetbrains.com/pycharm/download)

Data Types: Integers, strings, boolean

Flow Control: If

Loops: for, While & list

Dictionaries: resembles with json

Exceptions: 

Built-in Data types: topos, sets, frozenSets, complex.

**Some sample python code to play around that you can try in an [online compiler1](https://trinket.io/embed/python3/a5bd54189b)** [**online compiler2**](https://www.programiz.com/python-programming/online-compiler/)

```
# Wages Cal. where you'll be paid £5/hr/wk and for every extra hour after 40hrs, £10/hrhr = int(input( "enter working hour :" ))
nhr = hr - 40
if hr == 0:
  print ("no money made")
elif hr < 1:
  print ("error")
elif hr <= 40:
  print ( "You have earned", hr * 5 ,"Pounds")
elif hr > 168:
  print ("you cannot work more than 168hr in 1 wk")
else:
  print ("You have earned", nhr * 10 + 200,"Pounds")
# Calculate your BMI#!/usr/bin/python3

w = float(input("enter your weight in kg -" ))
h = float(input("enter you height in meter -"))

bmi = float( w/h**2)

print ("your BMI is", bmi)
# Making a healthy connection with an API & printing its response & response codeimport requests
res = requests.get("https://official-joke-api.appspot.com/random_joke")
print (res.json())print ("response code is -", res.status_code)
# Pulling data from an open source COVID API which is in jsonimport requests
import json
res = requests.get('https://api.covid19india.org/state_district_wise.json')

# printing the response code
print("response code is -" , res.status_code)

# pull the data from the API
data = res.text

# parsing the data into json format
parse_json = json.loads(data)

# extract the data and print it
acase = parse_json['Madhya Pradesh']['districtData']['Bhopal']['active']
print("Active cases in one of the district of Madhya Pradesh is:", acase)
# A sample Python script to Check wls-server state in Linux environmentusername = 'weblogic'
password = 'weblogic'
URL='t3://localhost:7001'
connect('username','password','URL')
servers=cmo.getServers()
print "-------------------------------------------------------"
print "\t"+cmo.getName()+" domain status"
print "-------------------------------------------------------"
for server in servers:
        state(server.getName(),server.getType())
print "-------------------------------------------------------"
 // execute using java weblogic.WLST
```
