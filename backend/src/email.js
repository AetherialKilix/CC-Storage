const nodemailer = require("nodemailer");

const development = process.env.NODE_ENV === "development";

const email = process.env.MAIL_ADDR;
const password = process.env.MAIL_PASS;
const host = "mail.mailsix24.de";
const port = 587;

const productionTransporter = nodemailer.createTransport({
	host, port, secure: true,
	auth: {
		user: email,
		pass: password
	}
});

if (development) process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const developmentTransporter = nodemailer.createTransport({ port: 1025 });
const transporter = development ? developmentTransporter : productionTransporter;

async function sendMail(address, subject, html) {
	return await transporter.sendMail({
		from: `Aethernet <${email}>`,
		sender: email,
		to: address,
		subject, html
	});
}

module.exports = sendMail;