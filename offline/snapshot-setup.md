# snapshot setup

| **Let's show the code needed for the snapshot strategy.**

Snapshot distributes data exactly as it appears at a specific moment in time
and does not monitor for updates to the data.
When synchronization occurs, the entire snapshot is generated and sent to client service.

## Read entire file using snapshot

#### Client code

```javascript
const { readService } = require('feathers-mobile/lib/snapshot');
const remoteService = clientApp.service('remote-service');

readService(remoteService)
  .then(result => ...)
```

#### Example

You can run an example using this strategy.
```text
cd path/to/feathers-mobile/examples
npm install
cd ./snapshot
npm run build
npm start
```
Then point a browser at `localhost:3030`.

The entire file is read.
```text
===== Read remoteService service directly
{dept: "a", stock: "a1", _id: "3NoUsKVqAjcQNb1j"}
{dept: "a", stock: "a2", _id: "ORz3YqSqGqPV18zO"}
{dept: "a", stock: "a3", _id: "EcWIiNJXnQJD9AcA"}
{dept: "a", stock: "a4", _id: "zkkBvGxeto2DNlHH"}
{dept: "a", stock: "a5", _id: "fbDONG4MgbTl4VQO"}
{dept: "b", stock: "b1", _id: "jEkLYt9hmBEQtVB2"}
{dept: "b", stock: "b2", _id: "k6ORo68NIrI9aoyk"}
{dept: "b", stock: "b3", _id: "KUY40fNyghvFuRsm"}
{dept: "b", stock: "b4", _id: "DKUjyUxmaaahNpG7"}
{dept: "b", stock: "b5", _id: "JJY4W7kEmE6shnwf"}
===== readService, all records
{dept: "a", stock: "a1", _id: "3NoUsKVqAjcQNb1j"}
{dept: "a", stock: "a2", _id: "ORz3YqSqGqPV18zO"}
{dept: "a", stock: "a3", _id: "EcWIiNJXnQJD9AcA"}
{dept: "a", stock: "a4", _id: "zkkBvGxeto2DNlHH"}
{dept: "a", stock: "a5", _id: "fbDONG4MgbTl4VQO"}
{dept: "b", stock: "b1", _id: "jEkLYt9hmBEQtVB2"}
{dept: "b", stock: "b2", _id: "k6ORo68NIrI9aoyk"}
{dept: "b", stock: "b3", _id: "KUY40fNyghvFuRsm"}
{dept: "b", stock: "b4", _id: "DKUjyUxmaaahNpG7"}
{dept: "b", stock: "b5", _id: "JJY4W7kEmE6shnwf"}
```

## Read selected records using snapshot

#### Client code

```javascript
const { readService } = require('feathers-mobile/lib/snapshot');
const remoteService = clientApp.service('remote-service');

readService(remoteService, { selection: { dept: 'a' } })
  .then(result => ...)
```

`selection` may also be a function, i.e. `data => data.dept === 'a'`.

#### Example

The above example also runs this strategy, reading part of the file.
```text
===== Read remoteService service directly
{dept: "a", stock: "a1", _id: "3NoUsKVqAjcQNb1j"}
{dept: "a", stock: "a2", _id: "ORz3YqSqGqPV18zO"}
{dept: "a", stock: "a3", _id: "EcWIiNJXnQJD9AcA"}
{dept: "a", stock: "a4", _id: "zkkBvGxeto2DNlHH"}
{dept: "a", stock: "a5", _id: "fbDONG4MgbTl4VQO"}
{dept: "b", stock: "b1", _id: "jEkLYt9hmBEQtVB2"}
{dept: "b", stock: "b2", _id: "k6ORo68NIrI9aoyk"}
{dept: "b", stock: "b3", _id: "KUY40fNyghvFuRsm"}
{dept: "b", stock: "b4", _id: "DKUjyUxmaaahNpG7"}
{dept: "b", stock: "b5", _id: "JJY4W7kEmE6shnwf"}
===== readService, dept: 'a'
{dept: "a", stock: "a1", _id: "3NoUsKVqAjcQNb1j"}
{dept: "a", stock: "a2", _id: "ORz3YqSqGqPV18zO"}
{dept: "a", stock: "a3", _id: "EcWIiNJXnQJD9AcA"}
{dept: "a", stock: "a4", _id: "zkkBvGxeto2DNlHH"}
{dept: "a", stock: "a5", _id: "fbDONG4MgbTl4VQO"}
```


## Copy entire file using snapshot

#### Client code

```javascript
const { copyService } = require('feathers-mobile/lib/snapshot');
const remoteService = clientApp.service('remote-service');
const clientService = clientApp.service('local-service');

copyService(remoteService, clientService)
  .then(() => clientService.find())
```

#### Example

The above example also runs this strategy, copying the file to clientService.
```text
===== Read remoteService service directly
{dept: "a", stock: "a1", _id: "3NoUsKVqAjcQNb1j"}
{dept: "a", stock: "a2", _id: "ORz3YqSqGqPV18zO"}
{dept: "a", stock: "a3", _id: "EcWIiNJXnQJD9AcA"}
{dept: "a", stock: "a4", _id: "zkkBvGxeto2DNlHH"}
{dept: "a", stock: "a5", _id: "fbDONG4MgbTl4VQO"}
{dept: "b", stock: "b1", _id: "jEkLYt9hmBEQtVB2"}
{dept: "b", stock: "b2", _id: "k6ORo68NIrI9aoyk"}
{dept: "b", stock: "b3", _id: "KUY40fNyghvFuRsm"}
{dept: "b", stock: "b4", _id: "DKUjyUxmaaahNpG7"}
{dept: "b", stock: "b5", _id: "JJY4W7kEmE6shnwf"}
===== copyService, all records
{dept: "a", stock: "a1", ___id: "3NoUsKVqAjcQNb1j", _id: "7QvQUj0WOuy3rYtt"}
{dept: "a", stock: "a2", ___id: "ORz3YqSqGqPV18zO", _id: "GlEVuJSLH9Kytj5z"}
{dept: "a", stock: "a3", ___id: "EcWIiNJXnQJD9AcA", _id: "2yzDs8Qri77bAJeV"}
{dept: "a", stock: "a4", ___id: "zkkBvGxeto2DNlHH", _id: "PTnKe31IGss8ajOv"}
{dept: "a", stock: "a5", ___id: "fbDONG4MgbTl4VQO", _id: "dYiyoidcU1WiPjPN"}
{dept: "b", stock: "b1", ___id: "jEkLYt9hmBEQtVB2", _id: "CkpXPS7sIswhYBXe"}
{dept: "b", stock: "b2", ___id: "k6ORo68NIrI9aoyk", _id: "wwRteg1iWgahOu8b"}
{dept: "b", stock: "b3", ___id: "KUY40fNyghvFuRsm", _id: "TSSt3UhdGb0dZKLK"}
{dept: "b", stock: "b4", ___id: "DKUjyUxmaaahNpG7", _id: "CPKM8gynyKf7pFQ0"}
{dept: "b", stock: "b5", ___id: "JJY4W7kEmE6shnwf", _id: "fSHbQ5BqEpkgR36y"}
```


## Copy selected records using snapshot

#### Client code

```javascript
const { copyService } = require('feathers-mobile/lib/snapshot');
const remoteService = clientApp.service('remote-service');
const clientService = clientApp.service('local-service');

copyService(remoteService, clientService, { selection: { dept: 'a' } })
  .then(() => clientService.find())
```

`selection` may also be a function, i.e. `data => data.dept === 'a'`.

#### Example

The above example also runs this strategy, copying part of the file to clientService.
```text
===== Read remoteService service directly
{dept: "a", stock: "a1", _id: "3NoUsKVqAjcQNb1j"}
{dept: "a", stock: "a2", _id: "ORz3YqSqGqPV18zO"}
{dept: "a", stock: "a3", _id: "EcWIiNJXnQJD9AcA"}
{dept: "a", stock: "a4", _id: "zkkBvGxeto2DNlHH"}
{dept: "a", stock: "a5", _id: "fbDONG4MgbTl4VQO"}
{dept: "b", stock: "b1", _id: "jEkLYt9hmBEQtVB2"}
{dept: "b", stock: "b2", _id: "k6ORo68NIrI9aoyk"}
{dept: "b", stock: "b3", _id: "KUY40fNyghvFuRsm"}
{dept: "b", stock: "b4", _id: "DKUjyUxmaaahNpG7"}
{dept: "b", stock: "b5", _id: "JJY4W7kEmE6shnwf"}
===== copyService, dept: `a`
clientService{dept: "a", stock: "a1", ___id: "3NoUsKVqAjcQNb1j", _id: "ERpGR3WP2f2cRu7q"}
clientService{dept: "a", stock: "a2", ___id: "ORz3YqSqGqPV18zO", _id: "uXIplOWf3FKgTO9t"}
clientService{dept: "a", stock: "a3", ___id: "EcWIiNJXnQJD9AcA", _id: "KOfEu7JWmfsdHY6t"}
clientService{dept: "a", stock: "a4", ___id: "zkkBvGxeto2DNlHH", _id: "xj68YAy49PH59eiR"}
clientService{dept: "a", stock: "a5", ___id: "fbDONG4MgbTl4VQO", _id: "Dx7GWlIeEBNWsnjk"}
```
