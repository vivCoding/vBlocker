function pushBlockedDomains(domain, callback) {
	chrome.storage.local.get('blockedDomains', data => {
		let blockedDomains = data.blockedDomains ?? []
		if (blockedDomains.indexOf(domain) === -1) {
			blockedDomains.push(domain)
		}
		chrome.storage.local.set({ blockedDomains: blockedDomains }, callback)
	})
}