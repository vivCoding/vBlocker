let recentlyBlocked = { url: '', blockedPath: '' }
let storageBlockedDomains = []
let tempAccess = []
let sessionBlockedDomains = []

chrome.storage.local.get("blockedDomains", data => {
	storageBlockedDomains = data.blockedDomains ?? []
	sessionBlockedDomains = storageBlockedDomains
})

function checkRequest(request) {
	if (!request) return
	let url = new URL(request.url)
	let domain = url.hostname.replace('www.', '')
	let path = url.pathname.split('/').filter(pathname => pathname !== "")
	path.unshift(domain)
	for (let i = 0; i < sessionBlockedDomains.length; i++) {
		let samePath = true
		let blockedPath = sessionBlockedDomains[i].split('/')
		for (let j = 0; j < blockedPath.length; j++) {
			if (path[j] !== blockedPath[j]) {
				samePath = false
			}
		}
		if (samePath && path.length >= blockedPath.length) {
			console.log('blocked', path, blockedPath)
			recentlyBlocked.url = request.url
			recentlyBlocked.blockedPath = sessionBlockedDomains[i]
			return {redirectUrl: chrome.extension.getURL('../blocked/blocked.html')};
		}
	}
}

chrome.webRequest.onBeforeRequest.addListener(
	checkRequest,
	{urls: ['<all_urls>']},
	['blocking']
);

chrome.storage.onChanged.addListener(changes => {
	storageBlockedDomains = changes.blockedDomains.newValue
	sessionBlockedDomains = storageBlockedDomains.filter(domain => !tempAccess.includes(domain))
})

chrome.runtime.onMessage.addListener(({message, payload}, sender, sendResponse) => {
	switch (message) {
		case 'getRecentlyBlocked':
			sendResponse(recentlyBlocked)
			break
		case 'getTempAccess':
			sendResponse(tempAccess)
			break
		case 'addTempAccess':
			tempAccess.push(payload)
			sessionBlockedDomains = storageBlockedDomains.filter(domain => !tempAccess.includes(domain))
			break
		case 'setTempAccess': 
			tempAccess = payload
			sessionBlockedDomains = storageBlockedDomains.filter(domain => !tempAccess.includes(domain))
			break
	}
})