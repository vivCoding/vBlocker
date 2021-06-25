function checkIfUrl(url) {
	try {
		url = new URL(url)
		return true
	} catch (error) {
		return false
	}
}

function getDomain(url) {
	return new URL(url).hostname.replace('www.', '')
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

function getPath(url) {
	try {
		return new URL(url).pathname
	} catch (error) {
		return new URL('https://www.' + url).pathname
	}
}