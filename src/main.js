$("document", () => {
	console.log('vBlocker loaded')
})

chrome.runtime.onMessage.addListener(({ message, payload }, sender, response) => {
	let domain = getDomainAndPath(window.location.href)
	console.log(message)
	switch (message) {
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
			break
	}
})


// TODO: somehow make this more secure
function askPassword(callback = undefined, warn = true) {
	chrome.storage.local.get("password", data => {
		let password = data.password
		if (!password && warn) {
			alert("Warning: No password has been set!\nSet a password in the settings page to avoid users modifying blocked sites")
		} else if (password) {
			while (true) {
				input = prompt("Enter password")
				if (input === password) {
					break
				} else if (input === null) {
					callback(false)
					return
				} else {
					alert("Incorrect password")
				}
			}
		}
		if (callback) callback(true)
	})
}

function pushBlockedDomains(domain, callback) {
	chrome.storage.local.get('blockedDomains', data => {
		let blockedDomains = data.blockedDomains ?? []
		if (blockedDomains.indexOf(domain) === -1) {
			blockedDomains.push(domain)
		}
		chrome.storage.local.set({ blockedDomains: blockedDomains }, callback)
	})
}

function getDomainAndPath(url) {
	let parsedUrl = new URL(url)
	let domain = parsedUrl.hostname.replace('www.', '')
	// can do some other stuff here
	let pathname = parsedUrl.pathname.split('/').filter(pathname => pathname !== "")
	pathname.unshift(domain)
	pathname = pathname.join("/")
	return pathname
}
