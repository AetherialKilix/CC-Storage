module.exports = {
	logout: (conn, reason = null) => {
		conn.send(JSON.stringify({ type: "logout", reason }))
	},
	snackbar: (conn, message, severity = "info") => {
		conn.send(JSON.stringify({
			type: "snachbar",
			message, severity
		}))
	},
}