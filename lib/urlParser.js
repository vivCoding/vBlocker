function getDomain(url) {
	return new URL(url).hostname.replace('www.', '')
}