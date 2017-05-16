# Realtime setup


## With server publications

##### Server code

Attach hooks to each remote service:
```javascript
const { offlineFirstBeforeHookServer } = require('feathers-mobile/lib/server');
const { client } = require('feathers-hooks-common');

module.exports = { // 'remote-service'
  before: {
    all: [
      client('_offline'),
      offlineFirstBeforeHookServer() // needed when replicate with checkBefore: true
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