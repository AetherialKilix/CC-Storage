const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const {LocalDate, LocalDateTime} = require("@js-joda/core");

const JWT_SECRET = uuid.v4();

// jwt.sign(payload, secretOrPrivateKey, options, callback)
function createAccessToken(email) {
	return {
		accessToken: jwt.sign({email}, JWT_SECRET, {expiresIn: "1h"}),
		accessTokenExpire: LocalDateTime.now().plusHours(1)
	}
}

function createTokenPair(email) {
	return {
		accessToken: jwt.sign({email}, JWT_SECRET, {expiresIn: "1h"}),
		accessTokenExpire: LocalDateTime.now().plusHours(1),
		refreshToken: jwt.sign({email}, JWT_SECRET, {expiresIn: "30d"}),
		refreshTokenExpire: LocalDateTime.now().plusDays(1)
	}
}

function verify(token) {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (err) {
		return null;
	}
}

module.exports = {
	createTokenPair,
	createAccessToken,
	verify
}