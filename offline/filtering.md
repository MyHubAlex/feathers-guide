# Filtering service events

A service event is sent to the client every time the remote service is mutated,
regardless of who mutated it, or how it was mutated.

Consider this sequence of events:
- The client mutates a record in the local service.
- The replicator automatically mutates that record on the remote service.
- That remote mutation may run hooks which further mutate the remote record,
e.g. the `setNow` hook is used on the remote service.
- The service event sends the new version of the remote service to the client.
- The replicator automatically mutates the record on the local service to match the remote's.

You need all these messages if you are replicating the whole database.
However wouldn't you want to minimize the messages
if you are replicating only the accounting `dept`?
Wouldn't you want to prevent sending events to the client
for mutations involving records from other departments?

The answer is yes, and no.

## State

Filtering requires the server to maintain state,
that is, to save in memory some information for each client.
State is something we try to avoid when possible as it reduces the number of connections a server
can handle.

This may not be that great a concern for us.
Offline-first is available with WebSocket clients only,
and both socket.io and Primus retain state.
Furthermore Feathers uses their state storage for its own needs,
as does offline-first.

> **ProTip** State will likely not be a concern unless you use a **lot** of publications.

## Processing load

More importantly, filtering imposes a processing load on the server
which may or may not be significant.

Assume we are replicating only records for the accounting department,
and consider these events:
- The remote service has a particular record belonging to the accounting department.
- Our client's local service has replicated that record.
- Someone (not us!) mutates that record, moving it to the receiving department.
- The client has to be informed of this mutation so it can remove that record from the local service
as it no longer belongs to accounting.
- Feathers service event filters only provide the latest contents of a record,
so we wouldn't have enough information to know the event has to be sent.

That's why, in the general case, the server component of offline-first
must read the before value of the record before mutating it.
The publication function can be used on both the before and current record contents
to properly determine if the mutation needs to be sent to a client.

> **ProTip** The before record is read just one per mutation, not once per client.

Database `get` calls are usually fast.
The before record contents may still be cached and quickly available.
This extra `get` may not impose an excessive extra load on the server,
but it has to be kept in mind.
