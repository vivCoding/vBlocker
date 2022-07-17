# vBlocker
Simple browser extension that blocks user from accessing specified domains with a password.

This extension uses manifest v3. If you are looking for the manifest v2 version (which is [soon to be deprecated](https://developer.chrome.com/docs/extensions/mv3/mv2-sunset/)), go to the [manifest_v2 branch](https://github.com/vivCoding/vBlocker/tree/manifest_v2)

[Watch demo](https://youtu.be/RSFkTDDa0gQ)

### Features
- Restrict domains and specific URL paths
- Temporary access to blocked websites
- Logging

### Blocked Domains Example
Block all urls under [www.instagram.com](www.instagram.com)
```
instagram.com
````
Block all urls under [www.instagram.com/explore](www.instagram.com/explore). (Does not block [www.instagram.com](www.instagram.com))

```
instagram.com/expore
```

### Installation
Coming soon

### Roadmap
- Add feature to block all except (list of urls)
- Make pages look less ugly
- Schedule blocking (e.g. block at specific time of day) (if possible)
- Block disabling/uninstalling extension (if possible)
    - ~~If not possible, add logging (e.g. blocked domain at what time/date)~~ (added)