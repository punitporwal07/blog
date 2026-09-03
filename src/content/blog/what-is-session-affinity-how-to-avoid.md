---
title: "What is Session Affinity ? & How to avoid Load balancing Failure ?"
description: "The request coming from the same client should always be entertained by the Same WL Server instance"
pubDate: 2014-11-25T21:19:00.001-08:00
updatedDate: 2021-04-10T05:01:24.606-07:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/what-is-session-affinity-how-to-avoid.html"
---

![](/blog/blog-images/oracle-weblogic-a30f9e2eb5e6.png)

**T**he request coming from the same client should always be entertained by the Same WL Server instance
where that clients request was processed earlier & if that server is not able to process the request then only the request will be processed by another available Cluster Node.

Example:

By default WL server's Session affinity is ON. It means suppose if I have one application deployed on a Cluster (which contains 2-ManagedServers)

In this Case even if the Cluster follows Round-Robin algorithm to serve the incoming requests. First client (Client\_1) request comes then it will be served by MS1 managed Server (Primary Session will be created here) and the replicated Session (Secondary Session) will be created on MS2.
If the Same Client (Client\_1) sends a second request, so in that case ideally the request should be processed by MS2 server, but because Session Affinity which is Enable by default, WLS Cluster will first check where the Primary Session is created for this client, then It will try to redirect the request to MS1 only because primary session was created here for that client.
If MS1 is not able to process the request then only the request will be sent to MS2 for processing.

My understanding is that the session cookie carries the information of the primary and secondary server in form of:

**sessionid!primary\_server\_id!secondary\_server\_id**

and the load balancer is expected to respect the preference for the primary server - unless the server dies, only then it switches to the secondary server.
So, even if 2 different browsers are using the same session (this can happen indeed, for instance with IE8), they still should hit the same "affinity" server.

what happened with sticky or session affinity load balancing is, when your http request connect with a server/node in a cluster, all subsequent requests for the same session send to the same server/node every time, that request create a session and maintain it in the request header, thus called uneven load balancing.

So, you can directly go ahead and disable the sticky load balancing / session affinity at hardware load balancer level. In order to maintain a proper load balancing over weblogic cluster.

client request

            |

            |

           V

HAProxy Frontend

            |

            |

           V

backend choice

            |

            |

           V

HAproxy Backend

            |

            |

           V

Does the request contain

persistence information ---------

            |                                |

            | NO                          |

           V                               |

    Server choice by               |   YES

load-balancing algorithm        |

            |                                |

            |                                |

           V                                |

   Forwarding request <---------- u="">

      to the server

   client ---- HAProxy ---- Server

[**Br,**](https://www.blogger.com/null)

**Punit**
