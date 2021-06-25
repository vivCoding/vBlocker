let blockedDomains = []
let blockedDomainList = $("#blockedDomainsList")
let saved = true
let settingsContent = $("#settings")
let accessDeniedMessage = $("#accessDenied")

$("#saveBtn").click(save)
$("#addBtn").click(addDomain)
$("#changePwdBtn").click(changePassword)

$("document", () => {
	settingsContent.hide()
	console.log("vBlocker settings")
	askPassword(success => {
		if (success) renderContent()
		else accessDeniedMessage.show()
	})
})

$(window).on("beforeunload", function() {
	if (!saved) {
		return "You have unsaved changes. Are you sure you wish to leave?"
	}
})

function renderContent() {
	settingsContent.show()
	accessDeniedMessage.hide()
	chrome.storage.local.get("blockedDomains", data => {
		blockedDomains = data?.blockedDomains ?? []
		if (blockedDomains.length == 0) {
			blockedDomainList.append(`<p>No blocked urls yet.</p>`)
		}
		blockedDomains.forEach(domain => {
			renderDomainToList(domain)
		});
	})
}

function renderDomainToList(domain) {
	let li = $('<li></li>')
	rerenderListElement(li, domain)
	blockedDomainList.append(li)
}

function rerenderListElement(listElement, domain) {
	listElement.empty()
		.append(`<span>${domain}</span>`)
		.append($("<button class='unlockBtn'>Remove</button>")
			.click(function() {
				if (confirm(`Are you sure you want to unblock "${domain}"?`)) {
					blockedDomains.splice(blockedDomains.indexOf(domain), 1)
					listElement.remove()
				}
			}))
		.append($("<button class='editBtn'></button>").text("Edit")
			.click(function() {
				let editPrompt = domain
				while (true) {
					editPrompt = prompt("Edit domain:", editPrompt)
					if (!!editPrompt) {
						if (confirm(`Change "${domain}" to "${editPrompt}"?`)) {
							let newDomain = editPrompt
							blockedDomains[blockedDomains.indexOf(domain)] = newDomain
							rerenderListElement(listElement, newDomain)
							break
						}
					} else break
				}
			}))
		
}

function addUnblockBtn(domain) {
	let unblockBtn = $("<button class='unlockBtn'></button>").text("Remove").click(function() {
		if (confirm(`Are you sure you want to unblock "${domain}"?`)) {
			console.log(domain, blockedDomains.indexOf(text.text()), blockedDomains)
			blockedDomains.splice(blockedDomains.indexOf(domain), 1)
			$(this).closest("li").remove()
		}
	})
	return unblockBtn
}

function addDomain() {
	while (true) {
		let domain = prompt("Enter domain to block:")
		if (domain === null) return
		else if (/\S/.test(domain)) {
			if (blockedDomains.indexOf(domain) === -1) {
				blockedDomains.push(domain)
				renderDomainToList(domain)
				saved = false
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
				chrome.storage.local.set({ password: newPassword}, function() {
					alert("Successfully changed password!")
				})
				break
			} else {
				alert("New password and confirmed new password did not match!")
			}
		}
	}, warn=false)
}

function save() {
	askPassword(function() {
		chrome.storage.local.set({ blockedDomains: blockedDomains }, function() {
			alert("Successfully saved changes!")
			saved = true
		})
	})
}