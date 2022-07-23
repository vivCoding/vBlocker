/* Runs in background during browser session */

let blockedDomains = []
let tempAccess = []
let logs = []
let password = ""

// retrieve info from storage for easier access
chrome.runtime.onStartup.addListener(() => {
    chrome.declarativeNetRequest.getDynamicRules(data => blockedDomains = data.map(rule => rule.condition.urlFilter.slice(2)))
    chrome.storage.local.get("logs", data => logs = data.logs ?? [])
    chrome.storage.local.get("password", data => password = data.password ?? "")
})

function blockDomain(domain) {
    if (blockedDomains.indexOf(domain) === -1) {
        // let the rules do the work
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                id: hashString(domain),
                priority: 10,
                action: {
                    type: "redirect",
                    redirect: {
                        extensionPath: "/blocked/index.html"
                    }
                },
                condition: {
                    urlFilter: `||${domain}`,
                    resourceTypes: [
                        "main_frame"
                    ]
                }
            }]
        }, () => {
            blockedDomains.push(domain)
            addLog("block", domain)
        })
    }
}

function unblockDomain(domain) {
    let idx = blockedDomains.indexOf(domain)
    if (idx !== -1) {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [hashString(domain)]
        }, () => {
            blockedDomains.splice(idx, 1)
            addLog("unblock", domain)
        })
    }
}

function addTempAccessDomain(domain) {
    if (tempAccess.indexOf(domain) === -1) {
        // session rules are discarded after session close
        // set to higher priority to override the dynamic rules
        chrome.declarativeNetRequest.updateSessionRules({
            addRules: [{
                id: hashString(domain),
                priority: 20,
                action: {
                    type: "allow",
                },
                condition: {
                    urlFilter: `||${domain}`,
                    resourceTypes: [
                        "main_frame"
                    ]
                }
            }]
        }, () => {
            tempAccess.push(domain)
            addLog("allow temporary access", domain)
        })
    }
}

function removeTempAccessDomain(domain) {
    let idx = tempAccess.indexOf(domain)
    if (idx !== -1) {
        chrome.declarativeNetRequest.updateSessionRules({
            removeRuleIds: [hashString(domain)]
        }, () => {
            tempAccess.splice(idx, 1)
            addLog("remove temporary access", domain)
        })
    }
}

function hashString(str) {
    // helper function to assign a numeric id given a domain name
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

function addLog(action, domain = "") {
    // helper function to add and save log
    let currDate = new Date()
    logs.push({
        date: currDate.toLocaleDateString(),
        time: currDate.toLocaleTimeString(),
        action,
        domain
    })
    chrome.storage.local.set({ logs })
}

function checkPassword(inputPassword) {
    return inputPassword === password
}

// TODO encrypt password
function setPassword(inputPassword) {
    password = inputPassword
    chrome.storage.local.set({ password })
    addLog("password changed")
}

function isPasswordSet() {
    return password !== ""
}

chrome.management.onInstalled.addListener(() => addLog("extension installed"))
chrome.management.onDisabled.addListener(() => addLog("extension disabled")) // TODO doesn't actually trigger. Is there a solution?
chrome.management.onEnabled.addListener(() => addLog("extension enabled"))

// acts as an "api" and responds to requests from the main webpage (main.js)
// better way to do this? maybe look into using chrome.events?
chrome.runtime.onMessage.addListener(({ message, payload }, sender, sendResponse) => {
    switch (message) {
        case 'blockDomain':
            sendResponse(blockDomain(payload))
            break
        case 'unblockDomain':
            sendResponse(unblockDomain(payload))
            break
        case 'getBlockedDomains':
            sendResponse(blockedDomains)
            break
        case 'addTempAccessDomain':
            sendResponse(addTempAccessDomain(payload))
            break
        case 'removeTempAccessDomain':
            sendResponse(removeTempAccessDomain(payload))
            break
        case 'getTempAccessDomains':
            sendResponse(tempAccess)
            break
        case 'checkPassword':
            sendResponse(checkPassword(payload))
            break
        case 'setPassword':
            sendResponse(setPassword(payload))
            break
        case 'isPasswordSet':
            sendResponse(isPasswordSet(payload))
            break
        case 'getLogs':
            sendResponse(logs)
            break
        default:
            break
    }
})

