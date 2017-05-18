# Sync-data, sync-net setup

| **Let's show the code needed for the sync-data and sync-net strategies.**

Both sync strategies start with a snapshot of the remote database data.
Subsequent data changes made at the remote are delivered to the client as they occur in near real time.
The data changes are applied at the client in the same order as they occurred at the remote.

Mutations of the client data can continue while the connection is lost.
Since the remote service cannot be updated immediately,
information is retained in persisted storage to await a reconnection.
The specifics of the information retained differs between sync-data and sync-net.

The server processes this information on reconnection.
A user provided conflict resolver is called when a replication conflict is detected.
This resolver decides what the record should contain.

The client service is then brought up to data with a snapshot.


## Replicate entire file using sync-data

##### Server code

Register application-level hook.
Its required for replicated remote services,
and will not affect ones not being replicated.
```javascript
const { client } = require('feathers-hooks-common');

app.hooks({
  before: client('_offline')
});
```

```javascript
const optimisticUpdatesRemote =
  require(`feathers-mobilde-enterprise/lib/optimistic-updates/sync-data/remote`);
  
app.configure(optimisticUpdatesRemote.service({ conflictResolver }));

function conflictResolver(conflict) {
  return conflict.resolveUsingClient(); // always use client version of record
}
```

##### Client code

Attach hooks to each replicated local service:
```javascript
const { offlineFirstAfterHook, offlineFirstBeforeHook } = require('feathers-mobile');
const { client } = require('feathers-hooks-common');

module.exports = { // 'client-service'
  before: {
    all: [
      client('_offline'),
      offlineFirstBeforeHook('foo')
    ]
  },

  after: {
    all: [
      offlineFirstAfterHook('foo')
    ]
  }
};
```

Configure the replication and start it:
```javascript
const commonPublications = require('feathers-mobile/lib/common/commonPublications');
const sync = require('feathers-mobile/lib/sync-data');

const replicator = sync({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
  eventQueueServiceName: 'client-service-queue'
});

replicator.subscribe()
  .then(() => ...)
```

##### Example

You can run an example using this strategy.
```text
cd path/to/feathers-mobile/examples
npm install
cd ./sync-data
npm run build
npm start
```
Then point a browser at `localhost:3030`.

A snapshot of the remote service is made to the client when replication starts.
```text
===== remoteService, before mutations
{dept: "a", stock: "a1", uuid: "aa1", _id: "fbtKHSncfOqOie0l"}
{dept: "a", stock: "a2", uuid: "aa2", _id: "QN9ugaxOlqwLRb4A"}
{dept: "a", stock: "a3", uuid: "aa3", _id: "fcwE2SovnTACD45d"}
{dept: "a", stock: "a4", uuid: "aa4", _id: "Eoi0lyr1GxWyAZoC"}
{dept: "a", stock: "a5", uuid: "aa5", _id: "isoXUR6OpjjHQVQF"}
===== clientService, before mutations
{dept: "a", stock: "a1", uuid: "aa1", ___id: "fbtKHSncfOqOie0l", _id: "ixFV8jPcVmWFUESy"}
{dept: "a", stock: "a2", uuid: "aa2", ___id: "QN9ugaxOlqwLRb4A", _id: "FtgYKaU2ujbu9T7F"}
{dept: "a", stock: "a3", uuid: "aa3", ___id: "fcwE2SovnTACD45d", _id: "W4tHWgYht6AsPj4w"}
{dept: "a", stock: "a4", uuid: "aa4", ___id: "Eoi0lyr1GxWyAZoC", _id: "TCEYbaLq1d7yWUV2"}
{dept: "a", stock: "a5", uuid: "aa5", ___id: "isoXUR6OpjjHQVQF", _id: "ihS9go5yAsCbZ5fm"}
```

We can simulate someone mutating the remote service,
while we mutate the client service.
```text
===== mutate remoteService
remoteService.patch stock: a1
remoteService.create stock: a99
remoteService.remove stock: a2
===== mutate clientService
clientService.patch stock: a1
clientService.create stock: a97
clientService.remove stock: a5
```

The remote and local services reflect the mutations.
```text
===== remoteService, after mutations
{dept: "a", stock: "a1", uuid: "aa1", _id: "fbtKHSncfOqOie0l", foo: 1…}
{dept: "a", stock: "a3", uuid: "aa3", _id: "fcwE2SovnTACD45d"}
{dept: "a", stock: "a4", uuid: "aa4", _id: "Eoi0lyr1GxWyAZoC"}
{dept: "a", stock: "a97", uuid: "aa97", _id: "GqiM9KOwlKMUsV6p"}
{dept: "a", stock: "a99", uuid: "aa99", _id: "6pIT67zaQwE73fuq"}
===== clientService, after mutations
{dept: "a", stock: "a1", uuid: "aa1", foo: 1, bar: 1…}
{dept: "a", stock: "a3", uuid: "aa3", ___id: "fcwE2SovnTACD45d", _id: "W4tHWgYht6AsPj4w"}
{dept: "a", stock: "a4", uuid: "aa4", ___id: "Eoi0lyr1GxWyAZoC", _id: "TCEYbaLq1d7yWUV2"}
{dept: "a", stock: "a97", uuid: "aa97", ___id: "GqiM9KOwlKMUsV6p", _id: "kLWR0BN4r6ZQYIJA"}
{dept: "a", stock: "a99", uuid: "aa99", ___id: "6pIT67zaQwE73fuq", _id: "XRTauC0tncI1DoRu"}
```

We can simulate a lost connection, after which we mutate the client data,
while others mutate the remote service data.
```javascript
replicator.connection.disconnected();
```
```text
>>>>> disconnection from server
===== mutations
clientService.patch stock: a3 bar: 1
clientService.patch stock: a3 bar: 2
clientService.patch stock: a97 bar: 1
remoteService.patch stock: a97 bux: 0
clientService.create stock: a98
clientService.patch stock: a98 bar 2
clientService.remove stock: a4
```

*Notice that `stock: "a97"` has been changed, differently, on the client and on the server.*

After we simulate a reconnection.
```javascript
replicator.connection.reconnected();
```
```text
<<<<< reconnected to server
```

The mutations that were queued on the client are sent to the server,
which updates the remote service while resolving any conflicts.
A summary of that processing is returned to the client.
```text
<<<<< 0 errors on reconnect
<<<<< entry 2 uuid:aa97 method:patch resolve-client
<<<<< entry 4 uuid:aa98 method:patch resolve-client
```

The client service is then brought up to data with a snapshot.
```text
===== remoteService, after reconnection
{dept: "a", stock: "a1", uuid: "aa1", _id: "fbtKHSncfOqOie0l", foo: 1…}
{dept: "a", stock: "a3", uuid: "aa3", _id: "fcwE2SovnTACD45d", bar: 2}
{dept: "a", stock: "a97", uuid: "aa97", _id: "GqiM9KOwlKMUsV6p", bux: 0…}
{dept: "a", stock: "a98", uuid: "aa98", _id: "Kp5mGQHqg6UHn2L2", bar: 2}
{dept: "a", stock: "a99", uuid: "aa99", _id: "6pIT67zaQwE73fuq"}
===== clientService, after reconnection
{dept: "a", stock: "a1", uuid: "aa1", foo: 1, bar: 1…}
{dept: "a", stock: "a3", uuid: "aa3", bar: 2, ___id: "fcwE2SovnTACD45d"…}
{dept: "a", stock: "a97", uuid: "aa97", bux: 0, bar: 1…}
{dept: "a", stock: "a98", uuid: "aa98", bar: 2, ___id: "Kp5mGQHqg6UHn2L2"…}
{dept: "a", stock: "a99", uuid: "aa99", ___id: "6pIT67zaQwE73fuq", _id: "RfaOetDt53LY2YAG"}
===== Example finished.
```

## Replicate entire file using sync-net

The code for sync-net is almost identical to that for sync-data.
The only difference is that these modules are required instead:
```javascript
const optimisticUpdatesRemote =
  require(`feathers-mobilde-enterprise/lib/optimistic-updates/sync-net/remote`);

const sync = require('feathers-mobile/lib/sync-net');
```


## Replicating with publications and server-side publications

Some extra code has to be added.
Its the same as was added for the realtime strategy.

