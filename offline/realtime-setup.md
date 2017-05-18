# Realtime setup

| **Let's show the code needed for the realtime strategy.**

Realtime starts with a snapshot of the remote database data.
Subsequent data changes made at the remote are delivered to the client as they occur in near real time.
The data changes are applied at the client in the same order as they occurred at the remote.

Replication stops when communication is lost with the server.
It can be restarted on reconnection.

## Replicate the entire file

The client service will contain all the same records as the remote service.
All service events are emitted to the client, because they are all required.

#### Server code

Register an application-level hook.
Its required for replicated remote services,
and will not affect ones not being replicated.
```javascript
const { client } = require('feathers-hooks-common');

app.hooks({
  before: client('_offline')
});
```

#### Client code

Attach a hook to each replicated local service:
```javascript
const { client } = require('feathers-hooks-common');

module.exports = { // 'client-service'
  before: {
    all: client('_offline')
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

#### Example

You can run an example using this strategy.
```text
cd path/to/feathers-mobile/examples
npm install
cd ./realtime-1
npm run build
npm start
```
Then point a browser at `localhost:3030`.

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

We can simulate other people changing data on the remote service.
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

We can simulate a lost connection, after which other people mutate more data.
```javascript
replicator.connection.disconnected();
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

The client service will contain those records on the remote service
which satisfy a publication's criteria.
All service events are emitted to the client,
where they are checked against the publication.

#### Server code

Register an application-level hook.
```javascript
// No change from previous example
const { client } = require('feathers-hooks-common');
app.hooks({ before: client('_offline') });
```

#### Client code

Attach hook to each replicated local service:
```javascript
// No change from previous example
const { client } = require('feathers-hooks-common');
module.exports = { before: { all: client('_offline') } };
```

Configure the replication, with a publication to identify the desired records, and then start it:
```javascript
const commonPublications = require('feathers-mobile/lib/common/commonPublications');
const realtime = require('feathers-mobile/lib/realtime');

const replicator = realtime({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
  publication: { // new option
    module: commonPublications, name: 'query', params: { dept: 'a'
  },
});

replicator.subscribe()
  .then(() => ...)
```

#### Example

You can run an example using this strategy.
```text
cd path/to/feathers-mobile/examples
npm install
cd ./realtime-2
npm run build
npm start
```
Then point a browser at `localhost:3030`.

When replication starts,
a snapshot of those records in the remote service which satisfy the publication
is made to the client.
```javascript
publication: {
  module: commonPublications, name: 'query', params: { dept: 'a' }
}
```
```text
===== remoteService, before mutations
{dept: "a", stock: "a1", _id: "oXYki3eKCIfULIge"}
{dept: "a", stock: "a2", _id: "DVvUMzpEwhtLtYxg"}
{dept: "a", stock: "a3", _id: "k5qvFLKf7WVVr5UE"}
{dept: "a", stock: "a4", _id: "FqMgu80gxv1DdyHs"}
{dept: "a", stock: "a5", _id: "otJFp03djEuFX59R"}
{dept: "b", stock: "b1", _id: "lqeCPJ6k8iE2UerN"}
{dept: "b", stock: "b2", _id: "HEeGlMKvlPDj6K3x"}
{dept: "b", stock: "b3", _id: "Rab8IwKUo9s6QmK7"}
{dept: "b", stock: "b4", _id: "Ry81S3evrr0PEDs0"}
{dept: "b", stock: "b5", _id: "57cLF8GdIb9601fc"}
===== clientService, dept: a, before mutations
{dept: "a", stock: "a1", ___id: "oXYki3eKCIfULIge", _id: "zNMAs3M5qVunSIhj"}
{dept: "a", stock: "a2", ___id: "DVvUMzpEwhtLtYxg", _id: "xJYNmY5NCWtDywTg"}
{dept: "a", stock: "a3", ___id: "k5qvFLKf7WVVr5UE", _id: "dDV0PDLmQFonckzj"}
{dept: "a", stock: "a4", ___id: "FqMgu80gxv1DdyHs", _id: "enSfMT2c9tGKLXFr"}
{dept: "a", stock: "a5", ___id: "otJFp03djEuFX59R", _id: "tkDySDQP5P0XTzcn"}
```

We can simulate other people changing data on the remote service.
```text
===== mutate remoteService
remoteService.patch stock: a1 move to dept: b
remoteService.patch stock: b1 move to dept: a
```

The mutations are replicated to the client.
```text
===== remoteService, after mutations
{dept: "b", stock: "a1", _id: "oXYki3eKCIfULIge"}
{dept: "a", stock: "a2", _id: "DVvUMzpEwhtLtYxg"}
{dept: "a", stock: "a3", _id: "k5qvFLKf7WVVr5UE"}
{dept: "a", stock: "a4", _id: "FqMgu80gxv1DdyHs"}
{dept: "a", stock: "a5", _id: "otJFp03djEuFX59R"}
{dept: "a", stock: "b1", _id: "lqeCPJ6k8iE2UerN"}
{dept: "b", stock: "b2", _id: "HEeGlMKvlPDj6K3x"}
{dept: "b", stock: "b3", _id: "Rab8IwKUo9s6QmK7"}
{dept: "b", stock: "b4", _id: "Ry81S3evrr0PEDs0"}
{dept: "b", stock: "b5", _id: "57cLF8GdIb9601fc"}
===== clientService, dept a, after mutations
{dept: "a", stock: "a2", ___id: "DVvUMzpEwhtLtYxg", _id: "xJYNmY5NCWtDywTg"}
{dept: "a", stock: "a3", ___id: "k5qvFLKf7WVVr5UE", _id: "dDV0PDLmQFonckzj"}
{dept: "a", stock: "a4", ___id: "FqMgu80gxv1DdyHs", _id: "enSfMT2c9tGKLXFr"}
{dept: "a", stock: "a5", ___id: "otJFp03djEuFX59R", _id: "tkDySDQP5P0XTzcn"}
{dept: "a", stock: "b1", ___id: "lqeCPJ6k8iE2UerN", _id: "iYgsqQbCaS9IH78p"}
===== Example finished.
```

The `stock: "a1"` record was removed from the client service because it no longer satisfied
the publication after mutation.
The `stock: "b1"` record was added as its mutation caused it to now satisfied the publication.


## Filter service events on server

The client service will contain those records on the remote service
which satisfy a publication's criteria.
The server determines which service events are applicable for each client,
and only emits the relevant ones.

#### Server code

Register an application-level hook.
```javascript
// No change from previous example
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


#### Client code

Attach a hook to each local service:
```javascript
// No change from previous example
const { client } = require('feathers-hooks-common');
module.exports = { before: { all: client('_offline') } };
```

Configure the replication, indicating the publication should be run on the server
and that the before and after records of a mutation need to be checked:
```javascript
// One line change from previous example
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


#### Example

You can run an example using this strategy.
```text
cd path/to/feathers-mobile/examples
npm install
cd ./realtime-3
npm run build
npm start
```
Then point a browser at `localhost:3030`.

The client log for this strategy is the same as for the previous one,
However the server log shows that the server is now checking the publications
and emitting only the relevant ones.
```text
rep:filter --- filter patch +0ms
rep:filter from { dept: 'a', stock: 'a1', _id: 'SOmYFH8pzebSWL6x' } +3ms
rep:filter to   { dept: 'b', stock: 'a1', _id: 'SOmYFH8pzebSWL6x' } +3ms
rep:filter NEED true false +1ms
rep:filter --- filter patch +7ms
rep:filter from { dept: 'b', stock: 'b1', _id: 'sWTybSEdfXm8NQpu' } +1ms
rep:filter to   { dept: 'a', stock: 'b1', _id: 'sWTybSEdfXm8NQpu' } +0ms
rep:filter NEED false true +1ms
```
