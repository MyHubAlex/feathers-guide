# Publications

The local service will replicate the entire remote service by default.
You may replicate only a subset of the remote service records using **publications**.

## Publication functions

A `publication` is a function which, given a record,
indicates if it belongs to the subset of records the publication identifies.
For example a publication could select all the records belonging to a specific user.

The publication function, if one is provided, will always run on the client.
It will identify service events which are relevant to the publication.

The publication function optionally runs on the server
to reduce the number of service events sent the client.
This may potentially result in better throughput.

Here is a `publications` object containing two `publication` functions:
```javascript
const { query } = require('feathers-mobile/lib/common/commonPublications');

publications = {
  userData: username => (data, connection, hook) => data.username === username,
  
  query
};
```

The `userData` publication identifies the subset of records belonging to the provided `username`.
You might use a publication like this in an app where each user has their own compartmentalized data
which other users cannot see.
This would allow the records for all users to be kept in one table
rather than using a separate table for each user.

The `query` publication is one provided with offline-first,
and you are likely to use it often.
It tests records with [MongoDB queries](http://docs.mongodb.org/manual/reference/operator/query/).

Features:
* Supported operators: $in, $nin, $exists, $gte, $gt, $lte, $lt, $eq, $ne, $mod, $all, $and, $or,
$nor, $not, $size, $type, $regex, $where, $elemMatch
* Regexp searches
* sub object searching
* dot notation searching

Publications are passed only the `data` object when they are run on the client.
They are additionally passed the `connection` and `hook` objects when they are run as
[service event filters](https://docs.feathersjs.com/api/events.html#event-filtering)
on the server.

## Publications on the client

We will discuss later how to start a replication on the client.
However let's continue out our discussion by briefly looking
at the replicator's `publication` option.

We could replicate only records belonging to one user using the publications object
we wrote above.
```javascript
publication: { module: publications, name: 'userData', params: [username], ifServer: true, checkBefore: false }
```

This would call the publication function using
`publications.userData(...params)(data, connection, hook)`.

Assuming the record layout had a `dept` field,
we could replicate only the records for the accounting department with:
```javascript
const commonPublications = require('feathers-mobile/lib/common/commonPublications');
...
publication: { module: commonPublications, name: 'query', params: { dept: 'acct' } }
```

## Publications on the server

The server is automatically informed of
which publication each client is using for each remote service.
Furthermore the server components of offline-first can configure
[service event filters](https://docs.feathersjs.com/api/events.html#event-filtering)
to control the events sent to each client.

We can see that both the client and the server are likely `require` the same `publications` object.
So its best to keep these in a directory that can be shared between the client and server code.
That's why the `feathers-mobile/lib/common/commonPublications` path contains a `common` directory.
