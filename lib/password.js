// TODO: somehow make this more secure
function askPassword(callback=undefined, warn=true) {
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