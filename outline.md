
Break into 10-min read sections, so they can each be published individually on Medium.
This likely means each 2nd level (DB connector, Wrap it in REST, ...) is a section.
Have a repo which contains a working example of each section's code.

'The unbearable lightness of [using?] Feathersjs'

- What is Feathersjs?
- Getting rid of boilerplate
    - DB connector ("So many DBs, so little time.")
        - example
            - NeDB
            - create & find
        - universal DBs
            - mongoDB, etc.
    - Wrap it in REST ("I need to REST")
        - config REST
        - curl commands
        - fetch, axios
    - REST from client ("RESTing your client")
        - client code doing some DB calls
    - Sockets from client ("SOCKET to your client")
        - client code doing same DB calls
    - Hooks
        - contains business logic
        - some conditional decisions
- Getting rid of all boilerplate
    - generator
- See, I'm doing this thing
    - When a service call just isn't enough
    - Adapter for Redux
    - Adapter for Angular2
    - Adapter for Vue2
- Let's get awesome
    - serious hooks ("Hooking big fish")
        - validateSchema
        - populate, dePopulate
    - client input ("The client is mostly right")
        - clients telling servers how to populate and serialize
- It ain't all about database tables
    - custom services
        - example swagger service
        - just look at feathers-authentication-management routing
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
