
GUIDES - TO DO
- Adapters
    - When a service call just isn't enough
    - Adapter for Redux
    - Adapter for Angular2 (?)
    - Adapter for Vue2
        - ? https://github.com/t2t2/vue-syncers-feathers
        - https://feathersjs.slack.com/messages/help/files/F3HMXTN72/
- Client extensions for service calls
    - client input
        - $client
        - clients telling servers how to populate and serialize
- Non-DB services 
    - custom services
    - first example see (1) below
        - example swagger service
        - just look at feathers-authentication-management routing
        - info for a dashboard
    - proxy services
        - example
- The server as a client
    - convert proxy example so proxy server starts a feathers-client to another server
        - define services at the frontend,
        - write hooks for them,
        - make them communicate with backend services if needed.
- The client behaving as a server
    - hooks on clients
    - custom services on client
    - caching on client
    - local copy of part of DB (?)
- Authentication
    - authentication
        - multiple examples of authentications
    - permissions
        - examples
    - local authentication
        - feathers-authentication-management
- maybe deployment

(1) custom service example #1 from daffl
app.use('/todos', {
  get(id) {
    return Promise.resolve({
      id,
      description: `You have to do ${id}!`
    });
  }
});


Notes:
- Need ValidateSchema package. Remove stubs from sample code.