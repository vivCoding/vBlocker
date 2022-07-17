# vBlocker
Simple browser extension that blocks user from accessing specified domains with a password.

This extension uses manifest v3.

[Watch demo](https://youtu.be/RSFkTDDa0gQ)

### Features
- Restrict domains and specific URL paths
- Temporary access to blocked websites

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
- Block disabling/uninstalling extension (if possible)
    - If not possible, add logging (e.g. blocked domain at what time/date)
- Schedule blocking (e.g. block at specific time of day) (if possible)
- Make page look less ugly