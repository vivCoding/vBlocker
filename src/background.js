function getBlockedUrls() {
	return ['google.com']
}

function checkRequest(request) {
	if (!request) return
	let url = new URL(request.url)
	let domain = url.hostname.replace('www.', '')
	let blockedUrls = getBlockedUrls()
	if (blockedUrls.includes(domain)) {
		return {redirectUrl: chrome.extension.getURL('../pages/blocked.html')};
	}
}

chrome.webRequest.onBeforeRequest.addListener(
	checkRequest,
	{urls: ["<all_urls>"]},
	['blocking']
);