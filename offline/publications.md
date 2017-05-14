# Publications

The local service will replicate the entire remote service by default.
You can replicate just a subset of the remote service records using **publications**.

## Publication functions

A `publication` is a function which, given a record, indicates if it belongs to its subset.
It will always run on the client if a subset of the recorsd is being replicated.
It optionally runs on the server to reduce the number of service events being sent the client.

Here are two publication functions within a `publications` object.
```javascript
const { query } = require('feathers-mobile/lib/common/commonPublications');

publications = {
  userData: username => (data, connection, hook) => data.username === username,
  
  query
};
```

The `userData` publication restricts the records to those belonging to the provided `username`.
You might use a publication like this in an app where each user has their own compartmentalized data
which other users cannot see.
This allows the records for all users to be kept in one table
rather than having a separate table for each user.

The `query` publication is provided with offline-first,
and you are likely to use it often.
It tests records with [MongoDB queries](http://docs.mongodb.org/manual/reference/operator/query/).

Features:
* Supported operators: $in, $nin, $exists, $gte, $gt, $lte, $lt, $eq, $ne, $mod, $all, $and, $or, $nor, $not, $size, $type, $regex, $where, $elemMatch
* Regexp searches
* sub object searching
* dot notation searching

Publications are passed only the `data` object when they are run on the client.
They are passed the `data`, `connection`, and `hook` objects when they are run as
[service event filters](https://docs.feathersjs.com/api/events.html#event-filtering)
on the server.

## Publications on the client

We will later discuss how to start a replication on the client.
However let's round out our current discussion by briefly looking
at the replicator's `publication` option.

We could replicate only records belonging to one user using the publications object
we wrote above.
```javascript
publication: { module: publications, name: 'userData', params: [username], checkBefore: false }
```

This would call the publication function using
`publications.userData(...params)(data, connection, hook)`.

Assuming the record layout had a `dept` field,
we could replicate only the records for the accounting department.
```javascript
const commonPublications = require('feathers-mobile/lib/common/commonPublications');
...
publication: { module: commonPublications, name: 'query', params: { dept: 'acct' } }
```

## Publications