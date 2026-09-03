---
title: "What is XA-Transactions"
description: "Drivers provide connectivity between WebLogic Server connection pools and the DBMS. Drivers used in distributed transactions are designated by the driver name followed by /XA For an XA transaction to "
pubDate: 2014-11-25T22:52:00.006-08:00
updatedDate: 2021-07-15T05:12:16.976-07:00
originalUrl: "https://cloudnetes.blogspot.com/2014/11/xa-transactions.html"
---

**D**rivers provide connectivity between WebLogic Server connection pools and the DBMS. Drivers used in distributed transactions are designated by the driver name followed by /XA For an XA transaction to complete, all the Resource Managers participate in a two-phase commit (2pc). A commit in an XA transaction is called a two-phase commit because there are two passes made in the committing process.

In the first pass, the Transaction Manager asks each of the Resource Managers (through the enlisted XA Resource) whether they will encounter any problems committing the transaction. If any Resource Manager objects to committing the transaction, then all work done by any party on any resource involved in the XA transaction must all be rolled back. 

The Transaction Manager calls the rollback() method on each of the enlisted XA Resources.
 However, if no resource Managers object to committing, then the second pass involves the Transaction Manager actually calling commit() on each of the enlisted XA Resources. This process guarantees the ACID (atomicity, consistency, isolation, and durability) properties of a transaction that can span multiple resources.

\--
