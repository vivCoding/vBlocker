/* Runs in background during browser session */

let blockedDomains = []
let tempAccess = []
let logs = []
let extensionId = ""

chrome.storage.local.get("blockedDomains", data => {
    logs = data.blockedDomains ?? []
    console.log("we got", blockedDomains)
})

chrome.storage.local.get("logs", data => {
    logs = data.logs ?? []
})

chrome.management.getSelf(data => {
    extensionId = data.id
})

chrome.webRequest.onBeforeRequest.addListener(
    request => {
        if (!request) return
        let url = new URL(request.url)
        let path = request.url.replace('www.', '').replace(url.protocol + "//", '')

        console.log("got", path)

        for (let i = 0; i < blockedDomains.length; i++) {
            console.log("whoop", blockedDomains[i], path.indexOf(blockedDomains[i]), tempAccess.indexOf(blockedDomains[i]))
            if (path.indexOf(blockedDomains[i]) === 0) {
                if (tempAccess.indexOf(blockedDomains[i]) === -1) {
                    console.log("we shoudl block", chrome.extension.getURL('../blocked/index.html'))
                    return { redirectUrl: chrome.extension.getURL('../blocked/index.html') }
                }
            }
        }
    },
    { urls: ['<all_urls>'] },
    ['blocking']
)

function blockDomain(domain) {
    if (blockedDomains.indexOf(domain) === -1) {
        blockedDomains.push(domain)
        chrome.storage.local.set({ blockedDomains })
        addLog(domain, "block")
    }
}

function unblockDomain(domain) {
    let idx = blockedDomains.indexOf(domain)
    if (idx !== -1) {
        blockedDomains.splice(idx, 1)
        chrome.storage.local.set({ blockedDomains })
        addLog(domain, "unblock")
    }
}

function addTempAccessDomain(domain) {
    if (tempAccess.indexOf(domain) === -1) {
        tempAccess.push(domain)
        addLog(domain, "allow temporary access")
    }
}

function removeTempAccessDomain(domain) {
    let idx = tempAccess.indexOf(domain)
    if (idx !== -1) {
        tempAccess.splice(idx, 1)
        addLog(domain, "remove temporary access")
    }
}

function addLog(domain, action) {
    let currDate = new Date()
    logs.push({
        date: currDate.toLocaleDateString(),
        time: currDate.toLocaleTimeString(),
        action,
        domain
    })
    chrome.storage.local.set({ logs })
}

chrome.management.onDisabled.addListener(() => {
    // doesn't actually trigger. Is there a solution?
    addLog("", "extension disabled")
})

chrome.management.onEnabled.addListener(() => {
    addLog("", "extension enabled")
})

// better way to do this? maybe look into using chrome.events?
chrome.runtime.onMessage.addListener(({ message, payload }, sender, sendResponse) => {
    switch (message) {
        case 'blockDomain':
            blockDomain(payload)
            break
        case 'unblockDomain':
            unblockDomain(payload)
            break
        case 'getBlockedDomains':
            sendResponse(blockedDomains)
            break
        case 'addTempAccessDomain':
            addTempAccessDomain(payload)
            break
        case 'removeTempAccessDomain':
            removeTempAccessDomain(payload)
            break
        case 'getTempAccessDomains':
            sendResponse(tempAccess)
            break
        case 'getLogs':
            sendResponse(logs)
            break
        default:
            break
    }
})