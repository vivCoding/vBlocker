/* Gets loaded into every page */

chrome.runtime.onMessage.addListener(({ message, payload }, sender, response) => {
    // to be called from popup.html and have the correct window.location.href, it must be called thru listener
    switch (message) {
        case 'confirmBlock':
            let domain = getDomainAndPath(window.location.href)
            let confirmedDomain = window.prompt(`Block this domain?`, domain)
            if (confirmedDomain) {
                askPassword().then(success => {
                    if (success) {
                        blockDomain(confirmedDomain).then(() => {
                            alert(`Added domain ${confirmedDomain} to blocked domains list!\nYou can edit it later in the settings page.`)
                            window.location.reload()
                        })
                    }
                })
            }
            break
        default:
            break
    }
})

async function askPassword(warn = true, message = "Enter password") {
    const isSet = await isPasswordSet()
    if (!isSet && warn) {
        alert("Warning: No password has been set!\nSet a password in the settings page to avoid users modifying blocked sites and disabling extension")
        return true
    } else {
        while (true) {
            let input = prompt(message)
            if (!input) {
                return false
            } else {
                const success = await checkPassword(input)
                if (success) {
                    return true
                } else {
                    alert("Incorrect password")
                }
            }
        }
    }
}

function getDomainAndPath(url) {
    let parsedUrl = new URL(url)
    let domain = parsedUrl.hostname.replace('www.', '')
    // can do some other stuff here
    let pathname = parsedUrl.pathname.split('/').filter(pathname => pathname !== "")
    pathname.unshift(domain)
    pathname = pathname.join("/")
    return pathname
}

// #region helper functions to communicate with background.js

function sendMessagePromise(message, payload = null) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ message, payload }, data => {
            resolve(data)
        })
    })
}

async function blockDomain(domain) {
    await sendMessagePromise("blockDomain", domain)
}

async function unblockDomain(domain) {
    await sendMessagePromise("unblockDomain", domain)
}

async function getBlockedDomains() {
    const data = await sendMessagePromise("getBlockedDomains")
    return data
}

async function addTempAccessDomain(domain) {
    await sendMessagePromise("addTempAccessDomain", domain)
}

async function removeTempAccessDomain(domain) {
    await sendMessagePromise("removeTempAccessDomain", domain)
}

async function getTempAccessDomains() {
    const data = await sendMessagePromise("getTempAccessDomains")
    return data
}

async function checkPassword(password) {
    const data = await sendMessagePromise("checkPassword", password)
    return data
}

async function setPassword(password) {
    await sendMessagePromise("setPassword", password)
}

async function isPasswordSet() {
    const data = await sendMessagePromise("isPasswordSet")
    return data
}

async function getLogs() {
    const data = await sendMessagePromise("getLogs")
    return data
}

// #endregion helper functions to communicate with background.js
