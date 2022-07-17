let blockedDomains = []
let tempAccessDomains = []
let blockedDomainList = $("#blockedDomainsList")
let tempAccessList = $("#tempAccessList")
let settingsContent = $("#settings")
let accessDeniedMessage = $("#accessDenied")

$("#addBtn").click(addDomain)
$("#changePwdBtn").click(changePassword)

$("document", () => {
	settingsContent.hide()
	askPassword(success => {
		if (success) renderSettings()
		else accessDeniedMessage.show()
	})
})

function renderSettings() {
	settingsContent.show()
	accessDeniedMessage.hide()
	getBlockedDomains(data => {
		blockedDomains = data
		if (blockedDomains.length == 0) {
			blockedDomainList.append(`<p>No blocked urls yet.</p>`)
		}
		blockedDomains.forEach(domain => {
			renderDomainToList(domain)
		})
	})
	getTempAccessDomains(data => {
		tempAccessDomains = data
		if (tempAccessDomains.length == 0) {
			tempAccessList.append(`<p>No temporarily allowed domains yet.</p>`)
		}
		tempAccessDomains.forEach(domain => {
			renderTempAccessDomainToList(domain)
		})
	})
}

function renderDomainToList(domain) {
	let li = $('<li></li>')
	rerenderBlockedDomain(li, domain)
	blockedDomainList.append(li)
}

function renderTempAccessDomainToList(domain) {
	let li = $('<li></li>')
	li.append(`<span>${domain}</span>`)
		.append($("<button class='removeTempAccessBtn'>Block</button>"))
		.click(function () {
			if (confirm(`Remove temporarily access for "${domain}"?`)) {
				tempAccessDomains.splice(tempAccessDomains.indexOf(domain), 1)
				li.remove()
				removeTempAccessDomain(domain)
			}
		})
	tempAccessList.append(li)
}

function rerenderBlockedDomain(listElement, domain) {
	listElement.empty()
		.append(`<span>${domain}</span>`)
		.append($("<button class='unlockBtn'>Remove</button>")
			.click(function () {
				if (confirm(`Are you sure you want to unblock "${domain}"?`)) {
					blockedDomains.splice(blockedDomains.indexOf(domain), 1)
					listElement.remove()
					unblockDomain(domain)
				}
			}))
		.append($("<button class='editBtn'></button>").text("Edit")
			.click(function () {
				let editPrompt = domain
				while (true) {
					editPrompt = prompt("Edit domain:", editPrompt)
					// make sure it isn't empty
					if (editPrompt) {
						if (confirm(`Change "${domain}" to "${editPrompt}"?`)) {
							let newDomain = editPrompt
							blockedDomains[blockedDomains.indexOf(domain)] = newDomain
							rerenderBlockedDomain(listElement, newDomain)
							unblockDomain(domain)
							blockDomain(newDomain)
							break
						}
					} else break
				}
			}))
		.append($("<button class='editBtn'></button>").text("Allow Temporary Access")
			.click(function () {
				if (confirm(`Allow temporary access for ${domain}? (This will automatically be blocked again next browser session)`)) {
					addTempAccessDomain(domain)
					renderTempAccessDomainToList(domain)
				}
			}))

}

function addDomain() {
	while (true) {
		let domain = prompt("Enter domain to block:")
		if (domain === null) return
		else if (/\S/.test(domain)) {
			if (blockedDomains.indexOf(domain) === -1) {
				blockedDomains.push(domain)
				renderDomainToList(domain)
				blockDomain(domain)
			} else {
				alert('Domain already added!')
			}
			break
		} else alert("Domain cannot be blank!")
	}
}

function changePassword() {
	askPassword(success => {
		while (success) {
			let newPassword = prompt("Enter new password")
			if (newPassword == null) return
			let confirmPassword = prompt("Re-enter new password")
			if (confirmPassword == null) return
			if (newPassword === confirmPassword) {
				chrome.storage.local.set({ password: newPassword }, function () {
					alert("Successfully changed password!")
				})
				break
			} else {
				alert("New password and confirmed new password did not match!")
			}
		}
	}, warn = false)
}
