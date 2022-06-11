$("#blockBtn").click(function (e) {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { message: 'confirmBlock' })
	})
})

$("#settingsBtn").click(function (e) {
	chrome.tabs.create({
		url: chrome.extension.getURL('../settings/settings.html')
	})
})