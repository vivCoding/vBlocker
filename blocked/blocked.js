let blockedDomainText = $("#blockedDomain")
let blocked

$("document", () => {
	chrome.runtime.sendMessage({ message: "getRecentlyBlocked" }, response => {
		blockedDomainText.text(response.blockedPath)
		blocked = response
	})
})

$("#tempAccessBtn").click(function() {
	if (confirm(`Allow temporarily access for "${blocked.blockedPath}"?`)) {
		askPassword(success => {
			if (success) {
				alert(`Allowing temporarily access for "${blocked.blockedPath}" for this session. It will automatically be removed when the browser restarts. \n
					You can also remove it during this session through the settings page.
				`)
				chrome.runtime.sendMessage({ message: "addTempAccess", payload: blocked.blockedPath }, response => {
					window.location.href = blocked.url
				})
			}
		})
	}
})


$("#settingsBtn").click(function (e) { 
	chrome.tabs.create({
		url: chrome.extension.getURL('../settings/settings.html')
	})
})