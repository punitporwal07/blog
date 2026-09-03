---
title: "reverse proxy in HAProxy"
description: "When you want clients to connect to HAProxy using a hostname that's also listed as a SAN in"
pubDate: 2023-02-07T01:15:00.000-08:00
updatedDate: 2025-06-07T03:31:23.031-07:00
originalUrl: "https://cloudnetes.blogspot.com/2025/02/reverse-proxy.html"
---

![](/blog/blog-images/avvxsej99btvpet-2ptfk0ov-dbc4y-hkettb9hz-2bcc351359b9.png)credits - [https://www.haproxy.com/glossary/what-is-a-reverse-proxy](https://www.haproxy.com/glossary/what-is-a-reverse-proxy) 

When you want clients to connect to HAProxy using a hostname that's also listed as a SAN in
HAProxy's certificate, and then HAProxy should forward the traffic to a specific backend server. This is a common and perfectly valid use case, but it's important to understand the details.

Here's how you can achieve this:

**1\. Configure HAProxy:**

```
vi /etc/haproxy/haproxy.cfg

frontend my_frontend
    bind *:443 ssl crt /path/to/your/certificate.pem
    acl is_for_backend1 hdr(host) -i backend1.example.com  # Match the hostname/SAN
    use_backend backend1 if is_for_backend1

backend backend1
    server backend1_server 192.168.1.10:80 check  # Your backend server
```

-   **`frontend my_frontend`:** Defines the frontend that listens for incoming connections.
-   **`bind *:443 ssl crt /path/to/your/certificate.pem`:** Binds to port 443 (HTTPS) and specifies the path to your certificate. **Crucially, this certificate must have `[backend1.example.com](http://backend1.example.com/)` as a SAN entry.**
-   **`acl is_for_backend1 hdr(host) -i [backend1.example.com](http://backend1.example.com/)`:** This Access Control List (ACL) checks the `Host` header of the incoming HTTP request. It matches if the `Host` header is `[backend1.example.com](http://backend1.example.com/)` (case-insensitive).
-   **`use_backend backend1 if is_for_backend1`:** Directs traffic to the `backend1` backend _only_ if the `is_for_backend1` ACL matches (i.e., the `Host` header is `[backend1.example.com](http://backend1.example.com/)`).
-   **`backend backend1`:** Defines the backend server.
-   **`server backend1_server [192.168.1.10:80](http://192.168.1.10/) check`:** Specifies the IP address and port of your backend server.

**2\. DNS Configuration:**

You need to configure your DNS so that `[backend1.example.com](http://backend1.example.com/)` resolves to the IP address of your HAProxy server. This is how clients will be able to connect to HAProxy using that hostname.

**3\. Certificate:**

Your SSL certificate _must_ have `[backend1.example.com](http://backend1.example.com/)` listed as a Subject Alternative Name (SAN). This is essential because when a client connects to `[backend1.example.com](http://backend1.example.com/)`, HAProxy will present this certificate. The client will then verify that `[backend1.example.com](http://backend1.example.com/)` is in the certificate's SAN list. If it's not, the client will get a certificate error.

**How it Works:**

1.  Client makes a request to `[https://backend1.example.com](https://backend1.example.com/)`.
2.  DNS resolves `[backend1.example.com](http://backend1.example.com/)` to HAProxy's IP address.
3.  Client connects to HAProxy over HTTPS.
4.  HAProxy presents its certificate (which has `[backend1.example.com](http://backend1.example.com/)` as a SAN).
5.  Client verifies the certificate.
6.  HAProxy checks the `Host` header of the request.
7.  Because the `Host` header is `[backend1.example.com](http://backend1.example.com/)`, the `is_for_backend1` ACL matches.
8.  HAProxy forwards the request to the `backend1` backend server ([192.168.1.10:80](http://192.168.1.10/)).
9.  The backend server processes the request and sends the response back to HAProxy.
10.  HAProxy forwards the response back to the client.

**Key Points:**

-   **SAN is essential:** The SAN in the certificate is the critical piece that allows the client to trust the connection to `[backend1.example.com](http://backend1.example.com/)` when it's terminated at HAProxy.
-   **Host header matching:** The ACL ensures that HAProxy only forwards traffic to the correct backend when the client uses the specific hostname.
-   **DNS is crucial:** DNS must be configured correctly so that the hostname resolves to HAProxy's IP address.

This setup allows you to use a specific hostname (`[backend1.example.com](http://backend1.example.com/)`) that's associated with a particular backend server, even though the connection is terminated at HAProxy. This is a very common pattern for load balancing and reverse proxying.

![](/blog/blog-images/acg8oclqmhvbtva8emfvviarzeywl6o2vk5tdzkq-2840797b0b82.png)

ReplyForward

Add reaction
