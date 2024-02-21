const WebSocket = require("ws");
const {randomDigits} = require("./utils");
const sendMail = require("./email");
const {LocalDateTime} = require("@js-joda/core");
const jwt = require("./jwt");
const { logout, snackbar } = require("./quickactions");

const CLOSE_NOT_FOUND = 1011
const CLOSE_NORMAL = 1000

const signupRequests = {}
const handlers = {
	logout: (conn, message) => logout(conn),
	login: (conn, message) => {
	},
	signup: (conn, message) => {
		const code = randomDigits(8);
		const timestamp = LocalDateTime.now()
		signupRequests[conn] = {
			code,
			email: message.email,
			password: message.password,
			remember: message.remember,
			isExpired: () => timestamp.plusHours(1).isBefore(LocalDateTime.now())
		};
		sendMail(message.email, `Your verification code: ${code}`, `Here is your verification code:<br/><strong>${code}</strong>`);
	},
	verify: (conn, message) => {
		const request = signupRequests[conn];
		if (!request) return snackbar(conn, "No verification request made. Please sign up first.", "error")
		
		if (request.isExpired()) {
			delete signupRequests[conn];
			return snackbar(conn, "Verification code expired.", "error");
		}
		
		if (String(request.code) !== message.code) return snackbar(conn, "Verification code invalid.", "error");
		
		// create account
		const tokens = request.remember
			? jwt.createTokenPair(request.email) // accessToken for 1h + refreshToken for 30d
			: jwt.createAccessToken(request.email) // accessToken for 1h
		
		conn.send(JSON.stringify({
			type: "account",
			account: {
				email: request.email
			},
			tokens,
		}));
	},
	authorize: (conn, message) => {
		const token = jwt.verify(message.accessToken);
		
		if (! token) {
			snackbar(conn, "Invalid Session", "error");
			return logout(conn, "Invalid session");
		}
		
		// TODO: fetch account from DB
		
		conn.send(JSON.stringify({
			type: "account",
			account: { email: token.email }
		}))
	},
	refresh: (conn, message) => {
		const valid = jwt.verify(message.refreshToken);  // -> results in forced log-out
		if (! valid) return logout(conn, "Invalid Session");
		
		console.log(valid)
	},
}

const createWSS = (server) => {
	const wss = new WebSocket.Server({server});
	
	wss.on("connection", (conn) => {
		conn.on("message", (data, isBinary) => {
			const request = JSON.parse(isBinary ? data : data.toString())
			const timestamp = LocalDateTime.now().toString()
			const handler = handlers[request.type]
			if (handler) {
				console.log(`[${timestamp}][${request.type}] `)
				handler(conn, request);
			} else {
				console.log(`[${timestamp}][${request.type}] unknown packet type`)
				conn.send(JSON.stringify({
					type: "error",
					reason: "unknown request type: " + request.type
				}));
			}
		});
	})
	wss.on("error", console.error)
}

module.exports = createWSS



