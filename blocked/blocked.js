let blockedDomainText = $("#blockedDomain")
let blocked

$("#settingsBtn").click(function (e) {
	chrome.tabs.create({
		url: '../settings/index.html'
	})
})