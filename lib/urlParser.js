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

function getPath(url) {
	try {
		return new URL(url).pathname
	} catch (error) {
		return new URL('https://www.' + url).pathname
	}
}