# Offline Strategy Features



| Feature                                 | snap shot | real time | own-data | own-net | sync-data | sync-net | time-travel |
|-----------------------------------------|-----------|-----------|----------|---------|-----------|----------|-------------|
| May select table contents to replicate  | Y         | Y         | Y        | Y       | Y         | Y        |             |
| - *Selection by query syntax*             | Y         | Y         | Y        | Y       | Y         | Y        |             |
| - *Selection by JS function*              | opt2      | opt2      | opt2     | opt2    | opt2      | opt2     |             |
| Copy remote data at start               | Y         | Y         | Y        | Y       | Y         | Y        |             |
| Remote changes mutate local in realtime |           | Y         | Y        | Y       | Y         | Y        |             |
| - *Emit minimum number of events*         |           | opt2      | opt2     | opt2    | opt2      | opt2     |             |
| Local changes mutate remote in realtime |           |           | Y        | Y       | Y         | Y        |             |
| Offline queue while disconnected        |           |           | Y        | Y       | Y         | Y        |             |
| - *Queue contains every service call*     |           |           | Y        |         | Y         |          |             |
| - *Queue contains item net change*        |           |           |          | Y       |           | Y        |             |
| Handle offline events on reconnection   |           |           | Y        | Y       | Y         | Y        |             |
| - *Conflict resolution handling*          |           |           |          |         | Y         | Y        |             |
| Copy remote data on reconnect           |           |           | opt1     | opt1    | opt1      | opt1     |             |
| Regular edition                         | Y         | Y         | Y        |         |           |          |             |
| Enterprise edition                      | Y         | Y         | Y        | Y       | Y         | Y        | Y           |

- **opt1** Programmatically selectable.
- **opt2** Enterprise edition.
