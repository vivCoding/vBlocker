# vBlocker
Simple browser extension that blocks user specified domains with a password

[Watch demo](https://youtu.be/RSFkTDDa0gQ)

### Features
- Restrict domains and specific URL paths
- Temporary access to blocked websites

### Blocked Domains Example
Block all urls under [www.instagram.com](www.instagram.com)
```
instagram.com
````
Block all urls under [www.instagram.com/explore](www.instagram.com/explore). (Does not block [www.instagram.com](www.instagram.com)

```
instagram.com/expore
```

### Installation
Coming soon

### Roadmap
- Upgrade to manifest V3 and use [declarativeNetRequest](https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#type-UpdateRuleOptions)
- Add feature to block all except (list of urls)
- Block disabling/uninstalling extension