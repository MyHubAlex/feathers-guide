# Offline Strategy Features



| Feature                                      | snap shot | real time | own-data | own-net | sync-data | sync-net | time-travel |
|----------------------------------------------|-----------|-----------|----------|---------|-----------|----------|-------------|
| **Select remote items to replicate**         | Y         | Y         | Y        | Y       | Y         | Y        |             |
| - Using query syntax                         | Y         | Y         | Y        | Y       | Y         | Y        |             |
| - Using JS functions                         | opt2      | opt2      | opt2     | opt2    | opt2      | opt2     |             |
| **Replicate to client service**              | Y         | Y         | Y        | Y       | Y         | Y        |             |
| - feathers-nedb                              | Y         | Y         | Y        | Y       | Y         | Y        |             |
| - feathers-memory                            | tba       | tba       | tba      | tba     | tba       | tba      |             |
| - feathers-localStorage                      | tba       | tba       | tba      | tba     | tba       | tba      |             |
| **Replicate to data store**                  | tba       | tba       | tba      | tba     | tba       | tba      |             |
| **Is a uuid field required?**                |           |           | Y        | Y       | Y         | Y        |             |
|                                              |           |           |          |         |           |          |             |
| **Copy remote data at startup**              | Y         | Y         | Y        | Y       | Y         | Y        |             |
| **Remote changes mutate client in realtime** |           | Y         | Y        | Y       | Y         | Y        |             |
| - Minimize events sent                   |           | opt2      | opt2     | opt2    | opt2      | opt2     |             |
| **Client changes mutate remote in realtime** |           |           | Y        | Y       | Y         | Y        |             |
| **Offline queue while disconnected**         |           |           | Y        | Y       | Y         | Y        |             |
| - Keep every call                            |           |           | Y        |         | Y         |          |             |
| - Only item net change                       |           |           |          | Y       |           | Y        |             |
| **Process offline queue on reconnection**    |           |           | Y        | Y       | Y         | Y        |             |
| - Conflict resolution handling               |           |           |          |         | Y         | Y        |             |
| **Copy remote data on reconnect**            |           |           | opt1     | opt1    | opt1      | opt1     |             |
|                                              |           |           |          |         |           |          |             |
| **Regular edition**                          | Y         | Y         | Y        |         |           |          |             |
| **Enterprise edition**                       | Y         | Y         | Y        | Y       | Y         | Y        | Y           |

- **opt1** Programmatically selectable.
- **opt2** Enterprise edition (tba).
