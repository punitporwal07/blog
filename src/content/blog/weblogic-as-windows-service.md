---
title: "WebLogic as a Windows service"
description: "create a file Named createSvc.cmd"
pubDate: 2016-12-20T22:28:00.002-08:00
updatedDate: 2016-12-20T22:28:55.864-08:00
originalUrl: "https://cloudnetes.blogspot.com/2016/12/weblogic-as-windows-service.html"
---

create a file Named createSvc.cmd

Input the below content into it

\*\*\*
echo off
SETLOCAL
set DOMAIN\_NAME=basedomain
set USERDOMAIN\_HOME=C:\\Oracle\\Middleware\\Oracle\_Home\\user\_projects\\domains\\base\_domain
set SERVER\_NAME=AdminServer
set PRODUCTION\_MODE=true
set MEM\_ARGS=-Xms512m -Xmx512m
set JAVA\_OPTIONS=-Dweblogic.Stdout="C:\\Oracle\\Middleware\\Oracle\_Home\\user\_projects\\domains\\base\_domain\\stdout.txt" -Dweblogic.Stderr="C:\\Oracle\\Middleware\\Oracle\_Home\\user\_projects\\domains\\base\_domain\\stderr.txt"
cd %USERDOMAIN\_HOME%
call %USERDOMAIN\_HOME%\\bin\\setDomainEnv.cmd
call "C:\\Oracle\\Middleware\\Oracle\_Home\\wlserver\\server\\bin\\installSvc.cmd"
ENDLOCAL
\*\*\*

place the createSvc.cmd into C:\\Oracle\\Middleware\\Oracle\_Home\\wlserver\\server\\bin

& execute the file this will add service as 'wlsvc basedomain\_AdminServer'

to uninstall edit the above file as:

call "C:\\Oracle\\Middleware\\Oracle\_Home\\wlserver\\server\\bin\\**un**installSvc.cmd"

Br,
Punit
