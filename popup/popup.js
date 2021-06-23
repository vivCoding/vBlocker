$("#block").click(function(e) {
	domain = getDomain(window.location.href)
	alert(`Block this domain ${domain} ?`)
})

$("#settings").click(function (e) { 
	chrome.tabs.create({
		url: chrome.extension.getURL('../pages/settings.html')
	})
})