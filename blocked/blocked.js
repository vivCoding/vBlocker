let blockedDomainText = $("#blockedDomain")
let blockedImg = $("#blockedImg")

blockedImg.attr('src', `../assets/trolled/${Math.floor(Math.random() * 7 + 1)}.webp`)

$("#settingsBtn").click(function (e) {
	chrome.tabs.create({
		url: '../settings/index.html'
	})
})