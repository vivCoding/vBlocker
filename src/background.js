let blockedDomains = []

chrome.storage.local.get("blockedDomains", data => {
	blockedDomains = data.blockedDomains ?? []
})

function checkRequest(request) {
	if (!request) return
	let url = new URL(request.url)
	let domain = url.hostname.replace('www.', '')
	if (blockedDomains.includes(domain)) {
		return {redirectUrl: chrome.extension.getURL('../blocked/blocked.html')};
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