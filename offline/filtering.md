# Filtering service events

Feathers, by default, emits a service event to each client every time a service is mutated,
regardless of who mutated it, or how it was mutated.

Offline-first uses these events to synchronize services while the client is connected to the server.
- The client mutates a record in the local service.
- The replicator automatically mutates that record on the remote service.
- That remote mutation may run hooks which further mutate the remote record,
e.g. the [`setNow`](https://docs.feathersjs.com/api/hooks-common.html#setnow)
hook is used on the remote service.
- The service event emits the new version of the remote service to the client.
- The replicator automatically mutates the record on the local service to match the remote's.

You need to act on all events if you are replicating the entire database.
However wouldn't you want to minimize the number of events sent
if you are replicating only a subset of the database?
Would you want to stop the emitting of events for mutations involving records
from other departments if you are only interested in records from accounting?

**The answer is yes ... and no.**

## State

Filtering requires the server to maintain state,
that is, to save in memory some information for each client.
State is something we try to avoid whenever possible
as it may reduce the number of connections a server can handle.

This may not be of critical a concern for us.
Offline-first is available only for WebSocket clients,
and both socket.io and Primus both retain state.
Feathers uses their state storage mechanisms for its own needs,
offline-first does so as well.

> **ProTip** State will likely not be a concern unless you use a **lot** of publications.

## Processing load

More importantly, filtering imposes a processing load on the server
which may or may not be significant.

Assume we are replicating only records for the accounting department,
and consider this:
- The remote service has a particular record belonging to the accounting department.
- Our client's local service has replicated that record.
- Someone (not us!) mutates that record, moving it to the receiving department.
- The client has to be informed of this mutation so it can remove that record from the local service
as it no longer belongs to accounting.
- Feathers service event filters only provide the latest contents of a record,
so we would not have enough information to know the event has to be sent.
We would not know the record used to be from accounting, and no longer is.

That's why, in the general case, the server component of offline-first
must read the before value of the record before mutating it.
The publication function can be used on both the before and current record contents
to properly determine if the mutation needs to be sent to a client.

> **ProTip** The before record is read just one per mutation, not once per client.

Database `get` calls are usually fast.
The before record contents may still be cached and quickly available.
This extra `get` may not impose an excessive extra load on the server,
but it has to be kept in mind.

> **ProTip** The extra processing load may not be excessive
unless the server handles a **lot** of clients.

## Apps restricted to one user

The core data for many mobile applications is unique to the user using the application.
Each record indicates the user the contents are for and, **most importantly**,
the record cannot be transferred to another user.

So if we use a publication like `userData`
```javascript
publications = {
  userData: username => (data, connection, hook) => data.username === username,
};
```
the value of `data.username` will never change.

This means the server component of the replicator does not need to `get` the before value
of the record, as the only field the publication function is interested in, `data.username`,
is always the same on the before and current records.

That is why the replicator's `publication` option in this case
 ```javascript
 publication: { module: publications, name: 'userData', params: [username], checkBefore: false }
 ```
contains the `checkBefore: false` option.
It indicates the before record need not be checked for this publication.
