$("document", () => {
	$("#content").hide()
	console.log("vBlocker settings")
	askPassword(renderContent)
})

$("#saveBtn").click(save)
$("#addBtn").click(addDomain)
$("#changePwdBtn").click(changePassword)

function askPassword(callback=undefined, warn=true) {
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
					return false
				} else {
					alert("Incorrect password")
				}
			}
		}
		if (callback) callback()
	})
}

let blockedDomains = []
let blockedDomainList = $("#blockedDomainsList")

function renderContent() {
	$("#content").show()
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
	let li = $('<li></li>').text(domain + " ")
	let button = $("<button class='unlockBtn'></button>").text("Unblock").click(function() {
		if (confirm("Are you sure you want to unblock this domain?")) {
			console.log("unblocked domain")
			$(this).closest("li").remove()
			blockedDomains.splice($.inArray(domain, blockedDomains), 1)
		}
	})
	li.append(button)
	blockedDomainList.append(li)
}

function addDomain() {
	while (true) {
		let domain = prompt("Enter domain to block")
		if (domain === null) return
		else if (/\S/.test(domain)) {
			blockedDomains.push(domain)
			renderDomainToList(domain)
			return
		} else alert("Domain cannot be blank!")
	}
}

function changePassword() {
	askPassword(function() {
		while (true) {
			let newPassword = prompt("Enter new password")
			if (newPassword == null) return
			let confirmPassword = prompt("Re-enter new password")
			if (confirmPassword == null) return
			if (newPassword === confirmPassword) {
				chrome.storage.local.set({ password: newPassword}, function() {
					alert("Successfully changed password!")
					console.log("new password is", newPassword)
				})
				return
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
		})
	})
}