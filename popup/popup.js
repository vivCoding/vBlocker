$("#blockBtn").click(function (e) {
    // in order to perform action on url, we need to be in the main page
    // send message into the main.js of this tab
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'confirmBlock' })
    })
})

$("#settingsBtn").click(function (e) {
    chrome.tabs.create({
        url: '../settings/index.html'
    })
})