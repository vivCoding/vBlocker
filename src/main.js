$("document", () => {
	console.log('vBlocker loaded')
})

chrome.runtime.onMessage.addListener(message => {
	let domain = getDomain(window.location.href)
	switch(message) {
		case 'confirmBlock':
			let confirm = window.confirm(`Block domain ${domain}?`)
			if (confirm) {
				askPassword(success => {
					if (success) {
						pushBlockedDomains(domain, () => alert(`Added domain ${domain} to blocked domains list!\nYou can unblock it later in the settings page.`))
					}
				})
			}
			break
		default:
			console.log('got weird message')
			break
	}
})