
PART 2 - Feathers Patterns

- See, I'm doing this thing
    - When a service call just isn't enough
    - Adapter for Redux
    - Adapter for Angular2 (?)
    - Adapter for Vue2 (?) 
        - ? https://github.com/t2t2/vue-syncers-feathers
        - https://feathersjs.slack.com/messages/help/files/F3HMXTN72/
- Let's get awesome
    - client input ("The client is mostly right")
        - $client
        - clients telling servers how to populate and serialize
- There's more to life than tables
    - custom services
    - first example see (1) below
        - example swagger service
        - just look at feathers-authentication-management routing
        - info for a dashboard
    - proxy services
        - example
- I said client, not frontend
    - convert proxy example so proxy server starts a feathers-client to another server
        - define services at the frontend,
        - write hooks for them,
        - make them communicate with backend services if needed.
- Did I say server? I meant frontend
    - hooks on clients
    - custom services on client
    - caching on client
    - local copy of part of DB (?)
- Let's get serious
    - authentication
        - multiple examples of authentications
    - permissions
        - examples
    - local authentication
        - feathers-authentication-management
- maybe deployment




(1) custom service example #1
app.use('/todos', {
  get(id) {
    return Promise.resolve({
      id,
      description: `You have to do ${id}!`
    });
  }
});


Notes:
- feathers-hooks-common needs fix in iffElse
- Need ValidateSchema package. Remove stubs from sample code.