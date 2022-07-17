let blockedDomainText = $("#blockedDomain")
let blocked

// $("document", () => {
// 	chrome.runtime.sendMessage({ message: "getRecentlyBlocked" }, response => {
// 		blockedDomainText.text(response?.blockedPath ?? '')
// 		blocked = response
// 	})
// })

// $("#tempAccessBtn").click(function () {
// 	if (confirm(`Allow temporarily access for "${blocked.blockedPath}"?`)) {
// 		askPassword(success => {
// 			if (success) {
// 				alert(`Allowing temporarily access for "${blocked.blockedPath}" for this session. It will automatically be removed when the browser restarts. \n
// 					You can also remove it during this session through the settings page.
// 				`)
// 				// in case it doesn't reload page
// 				$("#navigateBtn").text(`Go to ${blocked.url}`).click(function () {
// 					window.location.href = blocked.url
// 				}).show()
// 				window.location.href = blocked.url
// 				chrome.runtime.sendMessage({ message: "addTempAccess", payload: blocked.blockedPath })
// 			}
// 		})
// 	}
// })


$("#settingsBtn").click(function (e) {
	chrome.tabs.create({
		url: '../settings/settings.html'
	})
})