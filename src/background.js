/* Runs in background during browser session */

let blockedDomains = []
let tempAccess = []

// load domains and block them for this session
chrome.storage.local.get('blockedDomains', data => {
    blockedDomains = data.blockedDomains ?? []
    console.log(blockedDomains)
    const rules = blockedDomains.map(domain => ({
        id: hashString(domain),
        priority: 1,
        action: {
            type: "redirect",
            redirect: {
                extensionPath: "/blocked/blocked.html"
            }
        },
        condition: {
            urlFilter: domain,
            resourceTypes: [
                "main_frame"
            ]
        }
    }))
    chrome.declarativeNetRequest.updateSessionRules({ addRules: rules })
})

function blockDomain(domain) {
    if (blockedDomains.indexOf(domain) === -1) {
        blockedDomains.push(domain)
        chrome.storage.local.set({ blockedDomains })
        chrome.declarativeNetRequest.updateSessionRules({
            addRules: [{
                id: hashString(domain),
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: {
                        extensionPath: "/blocked/blocked.html"
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
        chrome.storage.local.set({ blockedDomains })
        chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [hashString(domain)]
        })
    }
}

function addTempAccessDomain(domain) {
    if (tempAccess.indexOf(domain) === -1) {
        tempAccess.push(domain)
        chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [hashString(domain)]
        })
    }
}

function removeTempAccessDomain(domain) {
    let idx = tempAccess.indexOf(domain)
    if (idx !== -1) {
        tempAccess.splice(idx, 1)
        chrome.declarativeNetRequest.updateSessionRules({
            addRules: [{
                id: hashString(domain),
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: {
                        extensionPath: "/blocked/blocked.html"
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

