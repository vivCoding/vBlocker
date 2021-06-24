let blockedDomains = []

chrome.storage.local.get("blockedDomains", data => {
	blockedDomains = data.blockedDomains ?? []
})

function checkRequest(request) {
	if (!request) return
	let url = new URL(request.url)
	let domain = url.hostname.replace('www.', '')
	let path = url.pathname.split('/').filter(pathname => pathname !== "")
	path.unshift(domain)
	for (let i = 0; i < blockedDomains.length; i++) {
		let samePath = true
		let blockedPath = blockedDomains[i].split("/")
		for (let j = 0; j < blockedPath.length; j++) {
			if (path[j] !== blockedPath[j]) {
				samePath = false
			}
		}
		if (samePath && path.length >= blockedPath.length) {
			console.log(path, blockedPath)
			return {redirectUrl: chrome.extension.getURL('../blocked/blocked.html')};
		}
	}
}

chrome.webRequest.onBeforeRequest.addListener(
	checkRequest,
	{urls: ["<all_urls>"]},
	['blocking']
);

chrome.storage.onChanged.addListener(changes => {
	blockedDomains = changes.blockedDomains.newValue
})