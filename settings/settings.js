$("document", () => {
	$("#settings").hide()
	console.log("vBlocker settings")
	askPassword(success => {
		if (success) renderContent()
	})
})

$("#saveBtn").click(save)
$("#addBtn").click(addDomain)
$("#changePwdBtn").click(changePassword)

let blockedDomains = []
let blockedDomainList = $("#blockedDomainsList")
let saved = true

$(window).on("beforeunload", function() {
	if (!saved) {
		return "You have unsaved changes. Are you sure you wish to leave?"
	}
})

function renderContent() {
	$("#settings").show()
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