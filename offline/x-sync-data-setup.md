# Realtime setup

## Replicate entire file

##### Server code

Register application-level hook.
Its required for replicated remote services,
and will not affect ones not being replicated.
```javascript
const { client } = require('feathers-hooks-common');
app.hooks({ before: client('_offline') });
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
const realtime = require('feathers-mobile/lib/realtime');

const replicator = realtime({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
  publication: {
    module: commonPublications, name: 'query', params: { dept: 'a' },
    ifServer: true, checkBefore: true
  },
});

replicator.subscribe()
  .then(() => ...)
```



## With server publications

##### Server code

Attach hooks to each remote service:
Attach hooks to each remote service:
```javascript
const { client } = require('feathers-hooks-common');
app.hooks({ before: client('_offline') });
```

```javascript
const { offlineFirstBeforeHookServer } = require('feathers-mobile/lib/server');
const { client } = require('feathers-hooks-common');

module.exports = { // 'remote-service'
  before: {
    all: [
      client('_offline'),
      offlineFirstBeforeHookServer() // needed when checkBefore: true
    ]
  }
};
```

Startup server publication filters:
```javascript
const { serverOfflineFirst } = require('feathers-mobile/lib/server');
const commonPublications = require('feathers-mobile/lib/common/commonPublications');

serverOfflineFirst(app, ['remote-service'], { publications: commonPublications });
```


##### Client code

Attach hooks to each local service:
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
const realtime = require('feathers-mobile/lib/realtime');

const replicator = realtime({
  name: 'foo',
  app: clientApp,
  remoteServiceName: 'remote-service',
  clientServiceName: 'client-service',
  publication: {
    module: commonPublications, name: 'query', params: { dept: 'a' },
    ifServer: true, checkBefore: true
  },
});

replicator.subscribe()
  .then(() => ...)
```
