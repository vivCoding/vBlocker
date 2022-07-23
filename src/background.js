/* Runs in background during browser session */

let blockedDomains = []
let tempAccess = []
let logs = []
let password = ""

// retrieve info from storage
chrome.storage.local.get("blockedDomains", data => blockedDomains = data.blockedDomains ?? [])
chrome.storage.local.get("logs", data => logs = data.logs ?? [])
chrome.storage.local.get("password", data => password = data.password ?? "")

// intercepts every request and checks to see if user has blocked it
chrome.webRequest.onBeforeRequest.addListener(
    request => {
        if (!request) return
        let url = new URL(request.url)
        let path = request.url.replace('www.', '').replace(url.protocol + "//", '')

        for (let i = 0; i < blockedDomains.length; i++) {
            if (path.indexOf(blockedDomains[i]) === 0) {
                // make sure it's not temporarily allowed
                if (tempAccess.indexOf(blockedDomains[i]) === -1) {
                    return { redirectUrl: chrome.runtime.getURL('../blocked/index.html') }
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
        addLog("block", domain)
    }
}

function unblockDomain(domain) {
    let idx = blockedDomains.indexOf(domain)
    if (idx !== -1) {
        blockedDomains.splice(idx, 1)
        chrome.storage.local.set({ blockedDomains })
        addLog("unblock", domain)
    }
}

function addTempAccessDomain(domain) {
    if (tempAccess.indexOf(domain) === -1) {
        tempAccess.push(domain)
        addLog("allow temporary access", domain)
    }
}

function removeTempAccessDomain(domain) {
    let idx = tempAccess.indexOf(domain)
    if (idx !== -1) {
        tempAccess.splice(idx, 1)
        addLog("remove temporary access", domain)
    }
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
        case 'checkPassword':
            sendResponse(checkPassword(payload))
            break
        case 'setPassword':
            setPassword(payload)
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
