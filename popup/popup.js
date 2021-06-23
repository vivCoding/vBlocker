$("#block").click(function(e) {
	domain = getDomain(window.location.href)
	// let confirmation = confirm(`Block this domain ${chrome.} ?`)
})

$("#settings").click(function (e) { 
	chrome.tabs.create({
		url: chrome.extension.getURL('../settings/settings.html')
	})
})