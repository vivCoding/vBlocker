/* Gets loaded into every page */

chrome.runtime.onMessage.addListener(({ message, payload }, sender, response) => {
    // to be called from popup.html and have the correct window.location.href, it must be called thru listener
    switch (message) {
        case 'confirmBlock':
            let domain = getDomainAndPath(window.location.href)
            let confirmedDomain = window.prompt(`Block this domain?`, domain)
            if (confirmedDomain) {
                askPassword(success => {
                    if (success) {
                        blockDomain(confirmedDomain, () => {
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

// TODO: somehow make this more secure
function askPassword(callback = undefined, warn = true) {
    chrome.storage.local.get("password", data => {
        let password = data.password
        if (!password && warn) {
            alert("Warning: No password has been set!\nSet a password in the settings page to avoid users modifying blocked sites")
        } else if (password) {
            while (true) {
                input = prompt("Enter password")
                if (input === password) {
                    break
                } else if (input === null) {
                    callback(false)
                    return
                } else {
                    alert("Incorrect password")
                }
            }
        }
        if (callback) callback(true)
    })
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


function blockDomain(domain, callback) {
    chrome.runtime.sendMessage({ message: "blockDomain", payload: domain }, callback)
}

function unblockDomain(domain, callback) {
    chrome.runtime.sendMessage({ message: "unblockDomain", payload: domain }, callback)
}

function getBlockedDomains(callback) {
    chrome.runtime.sendMessage({ message: "getBlockedDomains" }, callback)
}

function addTempAccessDomain(domain, callback) {
    chrome.runtime.sendMessage({ message: "addTempAccessDomain", payload: domain }, callback)
}

function removeTempAccessDomain(domain, callback) {
    chrome.runtime.sendMessage({ message: "removeTempAccessDomain", payload: domain }, callback)
}

function getTempAccessDomains(callback) {
    chrome.runtime.sendMessage({ message: "getTempAccessDomains" }, callback)
}