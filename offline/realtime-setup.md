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
