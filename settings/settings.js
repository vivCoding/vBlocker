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
	askPassword().then(success => {
		if (success) renderSettings()
		else accessDeniedMessage.show()
	})
})

$("#viewLogsBtn").click(function () {
	chrome.tabs.create({
		url: '../logs/index.html'
	})
})

function renderSettings() {
	settingsContent.show()
	accessDeniedMessage.hide()
	getBlockedDomains().then(data => {
		blockedDomains = data
		// TODO fix
		// if (blockedDomains.length == 0) {
		// 	blockedDomainList.append(`<p>No blocked urls yet.</p>`)
		// }
		blockedDomains.forEach(domain => {
			renderDomainToList(domain)
		})
	})
	getTempAccessDomains().then(data => {
		tempAccessDomains = data
		// if (tempAccessDomains.length == 0) {
		// 	tempAccessList.append(`<p>No temporarily allowed domains yet.</p>`)
		// }
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
		.append($("<button class='unlockBtn'>Remove</button>")
			.click(function () {
				if (confirm(`Are you sure you want to unblock "${domain}"?`)) {
					blockedDomains.splice(blockedDomains.indexOf(domain), 1)
					unblockDomain(domain).then(() => listElement.remove())
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
							unblockDomain(domain).then(() => blockDomain(newDomain))
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
		.append(`<span>${domain}</span>`)
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

async function changePassword() {
	// first make user enter old password (if set)
	const isSet = await isPasswordSet()
	if (isSet) {
		const shouldContinue = await askPassword(warn = false, message = "Enter old password:")
		if (!shouldContinue) {
			return
		}
	}
	// prompt for new password
	while (true) {
		let newPassword = prompt("Enter new password")
		if (newPassword == null) return
		let confirmPassword = prompt("Re-enter new password")
		if (confirmPassword == null) return
		if (newPassword === confirmPassword) {
			setPassword(newPassword).then(() => {
				alert("Successfully changed password!")
			})
			break
		} else {
			alert("New password and confirmed new password did not match!")
		}
	}
}
