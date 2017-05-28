# -data, -net setup

> **In progress. Don't read.**

| **Let's show the code needed for the sync-data and sync-net strategies.**

Both * strategies start with a snapshot of the remote database data.
Subsequent data changes made at the remote are duplicated on the client as they occur in near real time.
Data changes made on the client are likewise duplicated on the remote service.
The data changes are applied in the same order as they occurred.

Mutations of the client data can continue while disconnected.
Since the remote service cannot be updated immediately,
information is retained in persisted storage to await a reconnection.
The specifics of the information retained
[differs](./data-net.md)
between -data and -net.

The server processes this information on reconnection.
There is no conflict detection.

The client service is then brought up to data with a snapshot.


## Replicate entire file using own-data

#### Server code

Register an application-level hook.
Its required for replicated remote services,
and will not affect ones not being replicated.
```javascript
const { paramsFromClient} = require('feathers-hooks-common');

app.hooks({
  before: paramsFromClient('_offline')
});
```

Configure the service that processes queued mutations on reconnection.
```javascript
const optimisticUpdatesRemote =
  require(`feathers-mobile/lib/server/own-data`);
  
app.configure(optimisticUpdatesRemote.service());
```


#### Client code

Attach hooks to each replicated local service:
```javascript
const { offlineFirstAfterHook, offlineFirstBeforeHook } = require('feathers-mobile');
const { paramsFromClient } = require('feathers-hooks-common');

module.exports = { // 'client-service'
  before: {
    all: [
      paramsFromClient('_offline'),
      offlineFirstBeforeHook('foo')
    ]
  },

  after: {
    all: offlineFirstAfterHook('foo')
  }
};
```

Configure the replication and start it:
```javascript
const own = require('feathers-mobile/lib/own-data');

const replicator = own({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
  eventQueueServiceName: 'client-service-queue' // table to persist queue
});

replicator.subscribe()
  .then(() => ...)
```

#### Example

You can run an example using this strategy.
```text
cd path/to/feathers-mobile/examples
npm install
cd ./own-data
npm run build
npm start
```
Then point a browser at `localhost:3030`.

A snapshot of the remote service is made to the client when replication starts.
```text
===== remoteService, before mutations
{dept: "a", stock: "a1", uuid: "aa1", _id: "kTCqEW4ONbbT6jD9"}
{dept: "a", stock: "a2", uuid: "aa2", _id: "8xEdaDaBf5R5VIon"}
{dept: "a", stock: "a3", uuid: "aa3", _id: "1J3kfm2Uw0q5vCXr"}
{dept: "a", stock: "a4", uuid: "aa4", _id: "6XzxML6No7WN9yO1"}
{dept: "a", stock: "a5", uuid: "aa5", _id: "30O1fG51SYNx7VLh"}
===== clientService, before mutations
{dept: "a", stock: "a1", uuid: "aa1", ___id: "kTCqEW4ONbbT6jD9", _id: "b6Do9mf7hjN77D18"}
{dept: "a", stock: "a2", uuid: "aa2", ___id: "8xEdaDaBf5R5VIon", _id: "QP5vNtdFWRrxIPeT"}
{dept: "a", stock: "a3", uuid: "aa3", ___id: "1J3kfm2Uw0q5vCXr", _id: "NMDZ3ZlLBsruPyLl"}
{dept: "a", stock: "a4", uuid: "aa4", ___id: "6XzxML6No7WN9yO1", _id: "ES77JjX2jVm5kj7v"}
{dept: "a", stock: "a5", uuid: "aa5", ___id: "30O1fG51SYNx7VLh", _id: "zMXiwkOws1G2SjIr"}
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

The remote and local services will both reflect the mutations.
```text
{dept: "a", stock: "a1", uuid: "aa1", foo: 1, bar: 1, _id: "Zwbub2UvJ6XMv6ou"}
{dept: "a", stock: "a3", uuid: "aa3", _id: "jumjhw7I9nHmCBhf"}
{dept: "a", stock: "a4", uuid: "aa4", _id: "dakpnAb9NKNqbq1f"}
{dept: "a", stock: "a97", uuid: "aa97", _id: "IxahXM4WycU2SYsE"}
{dept: "a", stock: "a99", uuid: "aa99", _id: "jgF5J0AWGHGSN7PO"}
===== clientService, after mutations
{dept: "a", stock: "a1", uuid: "aa1", foo: 1, bar: 1, ___id: "Zwbub2UvJ6XMv6ou", _id: "zSukLc1iUqdrFKMv"}
{dept: "a", stock: "a3", uuid: "aa3", ___id: "jumjhw7I9nHmCBhf", _id: "3pf0NyUQjGDpIa0x"}
{dept: "a", stock: "a4", uuid: "aa4", ___id: "dakpnAb9NKNqbq1f", _id: "1TzP01wsXsgxrJOO"}
{dept: "a", stock: "a97", uuid: "aa97", ___id: "IxahXM4WycU2SYsE", _id: "cEuT6lSPbUw2zek2"}
{dept: "a", stock: "a99", uuid: "aa99", ___id: "jgF5J0AWGHGSN7PO", _id: "kYlWWiIxjpZc7krr"}
```

We can simulate a lost connection, after which we mutate the client data,
while others mutate the remote service data.
```javascript
replicator.connection.disconnected();
```
```text
>>>>> disconnection from server
2-reconnect.js:22 ===== mutate clientService
2-reconnect.js:23 clientService.patch stock: a3 bar: 1
2-reconnect.js:25 clientService.patch stock: a3 bar: 2
2-reconnect.js:27 clientService.create stock: a98
2-reconnect.js:30 clientService.patch stock: a98 bar 2
2-reconnect.js:32 clientService.remove stock: a4
```

*Notice that `stock: "a97"` has been changed, differently, on the client and on the server.*

Now we simulate a reconnection.
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
```

The client service is then brought up to data with a snapshot.
```text
===== remoteService, after reconnection
{dept: "a", stock: "a1", uuid: "aa1", foo: 1, bar:1, _id: "Zwbub2UvJ6XMv6ou"}
{dept: "a", stock: "a3", uuid: "aa3", bar: 2, _id: "jumjhw7I9nHmCBhf"}
{dept: "a", stock: "a97", uuid: "aa97", _id: "IxahXM4WycU2SYsE"}
{dept: "a", stock: "a98", uuid: "aa98", bar: 2, _id: "XhMctGnojPHpCaHQ"}
{dept: "a", stock: "a99", uuid: "aa99", _id: "jgF5J0AWGHGSN7PO"}
===== clientService, after reconnection
{dept: "a", stock: "a1", uuid: "aa1", foo: 1, bar: 1, ___id: "Zwbub2UvJ6XMv6ou", _id: "dcaNMeMhwg0CC1dI"}
{dept: "a", stock: "a3", uuid: "aa3", bar: 2, ___id: "jumjhw7I9nHmCBhf", _id: "m5GEeSYtsRHozYyD"}
{dept: "a", stock: "a97", uuid: "aa97", ___id: "IxahXM4WycU2SYsE", _id: "gkIoafTxizRYi0rm"}
{dept: "a", stock: "a98", uuid: "aa98", bar: 2, ___id: "XhMctGnojPHpCaHQ", _id: "QCpHcA73CHwSnXGK"}
{dept: "a", stock: "a99", uuid: "aa99", ___id: "jgF5J0AWGHGSN7PO", _id: "XpS5M9SdlhEny5h4"}
===== Example finished.
```

## Replicate entire file using own-net

The code for own-net is almost identical to that for own-data.
The only difference is that these modules are required instead:
```javascript
const optimisticUpdatesRemote =
  require(`feathers-mobile/lib/server/own-own`);
  
const { offlineFirstAfterHook, offlineFirstBeforeHook } = require('feathers-mobile');

const own = require('feathers-mobile-enterprise/lib/own-net');
```


#### Example

You can run an example using this strategy.
```text
cd path/to/feathers-mobile/examples
npm install
cd ./own-net
npm run build
npm start
```
Then point a browser at `localhost:3030`.

The log will be identical.


## Replicating with publications and server-side publications

Some extra code has to be added.
Its the same as was added for the realtime strategy.

