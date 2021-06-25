$("document", () => {
	console.log('vBlocker loaded')
})

chrome.runtime.onMessage.addListener(message => {
	let domain = getDomainAndPath(window.location.href)
	switch(message) {
		case 'confirmBlock':
			let confirmedDomain = window.prompt(`Block this domain?`, domain)
			if (confirmedDomain) {
				askPassword(success => {
					if (success) {
						pushBlockedDomains(confirmedDomain, () => {
							alert(`Added domain ${confirmedDomain} to blocked domains list!\nYou can edit it later in the settings page.`)
							window.location.reload()
						})
					}
				})
			}
			break
		default:
			console.log('got weird message')
			break
	}
})