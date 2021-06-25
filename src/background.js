let blockedDomains = []
let recentlyBlocked = { url: '', blockedPath: '' }
let tempAccess = []

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
		let blockedPath = blockedDomains[i].split('/')
		for (let j = 0; j < blockedPath.length; j++) {
			if (path[j] !== blockedPath[j]) {
				samePath = false
			}
		}
		if (samePath && path.length >= blockedPath.length) {
			console.log('blocked', path, blockedPath)
			recentlyBlocked.url = request.url
			recentlyBlocked.blockedPath = blockedDomains[i]
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
	blockedDomains = changes.blockedDomains.newValue
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
			blockedDomains = blockedDomains.filter(domain => !tempAccess.includes(domain))
			break
		case 'setTempAccess': 
			tempAccess = payload
			blockedDomains = blockedDomains.filter(domain => !tempAccess.includes(domain))
			break
	}
})