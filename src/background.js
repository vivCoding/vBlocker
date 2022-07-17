/* Runs in background during browser session */

let blockedDomains = []
let tempAccess = []
let logs = []
let extensionId = ""

chrome.declarativeNetRequest.getDynamicRules(data => {
    blockedDomains = data.map(rule => rule.condition.urlFilter)
})

chrome.storage.local.get("logs", data => {
    logs = data.logs ?? []
})

chrome.management.getSelf(data => {
    extensionId = data.id
})

function blockDomain(domain) {
    if (blockedDomains.indexOf(domain) === -1) {
        blockedDomains.push(domain)
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                id: hashString(domain),
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: {
                        extensionPath: "/blocked/index.html"
                    }
                },
                condition: {
                    urlFilter: domain,
                    resourceTypes: [
                        "main_frame"
                    ]
                }
            }]
        })
        addLog(domain, "block")
    }
}

function unblockDomain(domain) {
    let idx = blockedDomains.indexOf(domain)
    if (idx !== -1) {
        blockedDomains.splice(idx, 1)
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [hashString(domain)]
        })
        addLog(domain, "unblock")
    }
}

function addTempAccessDomain(domain) {
    if (tempAccess.indexOf(domain) === -1) {
        tempAccess.push(domain)
        chrome.declarativeNetRequest.updateSessionRules({
            addRules: [{
                id: hashString(domain),
                priority: 2,
                action: {
                    type: "allow",
                },
                condition: {
                    urlFilter: domain,
                    resourceTypes: [
                        "main_frame"
                    ]
                }
            }]
        })
        addLog(domain, "allow temporary access")
    }
}

function removeTempAccessDomain(domain) {
    let idx = tempAccess.indexOf(domain)
    if (idx !== -1) {
        tempAccess.splice(idx, 1)
        chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [hashString(domain)]
        })
        addLog(domain, "remove temporary access")
    }
}

function hashString(str) {
    let hash = 0, i, chr
    if (str.length === 0) return hash
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0 // Convert to 32bit integer
    }
    hash &= 0xfffffff
    return hash
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

