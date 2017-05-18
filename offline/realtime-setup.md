# Realtime setup

| Present the code needed for realtime replication.

Realtime starts with a snapshot of the remote database data.
As soon as the initial snapshot is taken,
subsequent data changes made at the remote are delivered to the client as they occur in near real time.
The data changes are applied at the client in the same order as they occurred at the remote.

Replication stops when communication is lost with the server.
It can be restarted on reconnection.

## Replicate the entire file

The client service will contain all the same records as the remote service.
All service events are emitted to the client, because they are all required.

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

##### Client code

Attach hook to each replicated local service:
```javascript
const { client } = require('feathers-hooks-common');

module.exports = { // 'client-service'
  before: {
    all: ('_offline')
  }
};
```

Configure the replication and start it:
```javascript
const realtime = require('feathers-mobile/lib/realtime');

const replicator = realtime({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
});

replicator.subscribe()
  .then(() => ...)
```

##### Example

You can run an example using this:
```text
cd path/to/feathers-mobile/examples
npm install
cd ./realtime-1
npm run build
npm start
```
and then pointing a browser at `localhost:3030`.

A snapshot of the remote service is made to the client when replication starts.
```text
===== remoteService, before mutations
{dept: "a", stock: "a1", _id: "JdYINLVZkU70vcgL"}
{dept: "a", stock: "a2", _id: "X6ymJYOqYWLe3KHj"}
{dept: "a", stock: "a3", _id: "p1zZviQzhAed2jMd"}
{dept: "a", stock: "a4", _id: "cE9ujfWFHTjNh4px"}
{dept: "a", stock: "a5", _id: "fyyErGpn8Hk2Q5EY"}
===== clientService, before mutations
{dept: "a", stock: "a1", ___id: "JdYINLVZkU70vcgL", _id: "A29Urf0WmOfjV8W6"}
{dept: "a", stock: "a2", ___id: "X6ymJYOqYWLe3KHj", _id: "RuZlujc09it23Ikx"}
{dept: "a", stock: "a3", ___id: "p1zZviQzhAed2jMd", _id: "Y1SuSBXUB659vEWm"}
{dept: "a", stock: "a4", ___id: "cE9ujfWFHTjNh4px", _id: "I7s4gsQTFtUZPyUt"}
{dept: "a", stock: "a5", ___id: "fyyErGpn8Hk2Q5EY", _id: "agzsMMxP04EhMksH"}
```

We can simulate other people changing data on the remote service is mutated with
```javascript
remoteService.patch(remoteIds['a1'], { foo: 1 });
remoteService.create({ dept: 'a', stock: 'a99' });
remoteService.remove(remoteIds['a2']);
```
```text
===== mutate remoteService
remoteService.patch stock: a1
remoteService.create stock: a99
remoteService.remove stock: a2
```

The mutations are replicated to the client.
```text
===== remoteService, after mutations
{dept: "a", stock: "a1", _id: "JdYINLVZkU70vcgL", foo: 1}
{dept: "a", stock: "a3", _id: "p1zZviQzhAed2jMd"}
{dept: "a", stock: "a4", _id: "cE9ujfWFHTjNh4px"}
{dept: "a", stock: "a5", _id: "fyyErGpn8Hk2Q5EY"}
{dept: "a", stock: "a99", _id: "1VD0hWlkfaZdDBt0"}
===== clientService, after mutations
{dept: "a", stock: "a1", foo: 1, ___id: "JdYINLVZkU70vcgL", _id: "A29Urf0WmOfjV8W6"}
{dept: "a", stock: "a3", ___id: "p1zZviQzhAed2jMd", _id: "Y1SuSBXUB659vEWm"}
{dept: "a", stock: "a4", ___id: "cE9ujfWFHTjNh4px", _id: "I7s4gsQTFtUZPyUt"}
{dept: "a", stock: "a5", ___id: "fyyErGpn8Hk2Q5EY", _id: "agzsMMxP04EhMksH"}
{dept: "a", stock: "a99", ___id: "1VD0hWlkfaZdDBt0", _id: "NkBp4yXfitEauNh1"}
```

We can simulate a lost connection, during which time other people mutate more data.
```javascript
replicator.connection.disconnected();
then(() => console.log('remoteService.patch stock: a3'))
remoteService.patch(remoteIds['a3'], { foo: 1 });
remoteService.create({ dept: 'a', stock: 'a98' });
remoteService.remove(remoteIds['a5']);
```
```text
>>>>> disconnection from server
===== mutate remoteService
remoteService.patch stock: a3
remoteService.create stock: a98
remoteService.remove stock: a5
```

After we simulate a reconnection, the client service is brought up to data with a snapshot.
```javascript
replicator.connection.reconnected();
```
```text
<<<<< reconnected to server
===== remoteService, after reconnection
{dept: "a", stock: "a1", _id: "JdYINLVZkU70vcgL", foo: 1}
{dept: "a", stock: "a3", _id: "p1zZviQzhAed2jMd", foo: 1}
{dept: "a", stock: "a4", _id: "cE9ujfWFHTjNh4px"}
{dept: "a", stock: "a98", _id: "zd7o0ulMagYjyGBo"}
{dept: "a", stock: "a99", _id: "1VD0hWlkfaZdDBt0"}
===== clientService, after reconnection
{dept: "a", stock: "a1", foo: 1, ___id: "JdYINLVZkU70vcgL", _id: "sQ8LYLXMO2wK8VQC"}
{dept: "a", stock: "a3", foo: 1, ___id: "p1zZviQzhAed2jMd", _id: "prAZ8yJjLJw0GAfG"}
{dept: "a", stock: "a4", ___id: "cE9ujfWFHTjNh4px", _id: "1M2xDGBpQL201hfK"}
{dept: "a", stock: "a98", ___id: "zd7o0ulMagYjyGBo", _id: "DgWgc3vA8z0fewaf"}
{dept: "a", stock: "a99", ___id: "1VD0hWlkfaZdDBt0", _id: "WAFFfnvvnTDaUDwi"}
===== Example finished.
```

## Replicate part of a file

The client service will contain those records on the remote service which satisfy a given criteria.
All service events are emitted to the client,
where they are checked for applicability.

##### Server code

Register application-level hook.
```javascript
// No change from above
const { client } = require('feathers-hooks-common');
app.hooks({ before: client('_offline') });
```

##### Client code

Attach hook to each replicated local service:
```javascript
// No change from above
const { client } = require('feathers-hooks-common');
module.exports = { before: { all: ('_offline') } };
```

Configure the replication, with a publication to identify the desired records, and then start it:
```javascript
// One line change from above
const commonPublications = require('feathers-mobile/lib/common/commonPublications');
const realtime = require('feathers-mobile/lib/realtime');

const replicator = realtime({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
  publication: { module: commonPublications, name: 'query', params: { dept: 'a' } }, // new line
});

replicator.subscribe()
  .then(() => ...)
```


## Filter service events on server

The client service will contain those records on the remote service which satisfy a given criteria.
The server determines which service events are applicable for each client,
and only emits the relevant ones.

##### Server code

Attach hooks to each remote service:
```javascript
// No change from above
const { client } = require('feathers-hooks-common');
app.hooks({ before: client('_offline') });
```

Startup server publication filters:
```javascript
// New code
const { serverOfflineFirst } = require('feathers-mobile/lib/server');
const commonPublications = require('feathers-mobile/lib/common/commonPublications');

serverOfflineFirst(app, ['remote-service'], { publications: commonPublications });
```


##### Client code

Attach hooks to each local service:
```javascript
// New code
const { offlineFirstAfterHook, offlineFirstBeforeHook } = require('feathers-mobile');
const { client } = require('feathers-hooks-common');

module.exports = { // 'client-service'
  before: {
    all: [
      client('_offline'),
      offlineFirstBeforeHook('foo') // We call our replicator 'foo' below.
    ]
  },

  after: {
    all: [
      offlineFirstAfterHook('foo')
    ]
  }
};
```

Configure the replication, with a publication to identify the desired records, and then start it:
```javascript
// One line change from above
const commonPublications = require('feathers-mobile/lib/common/commonPublications');
const realtime = require('feathers-mobile/lib/realtime');

const replicator = realtime({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
  publication: {
    module: commonPublications, name: 'query', params: { dept: 'a' },
    ifServer: true, checkBefore: true // new line
  },
});

replicator.subscribe()
  .then(() => ...)
```
