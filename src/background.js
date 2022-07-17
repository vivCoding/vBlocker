/* Runs in background during browser session */

console.log("Running vBlocker background.js")

let blockedDomains = []
let tempAccess = []

chrome.declarativeNetRequest.getDynamicRules(data => {
    blockedDomains = data.map(rule => rule.condition.urlFilter)
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
    }
}

function unblockDomain(domain) {
    let idx = blockedDomains.indexOf(domain)
    if (idx !== -1) {
        blockedDomains.splice(idx, 1)
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [hashString(domain)]
        })
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
    }
}

function removeTempAccessDomain(domain) {
    let idx = tempAccess.indexOf(domain)
    if (idx !== -1) {
        tempAccess.splice(idx, 1)
        chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [hashString(domain)]
        })
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
        default:
            break
    }
})

