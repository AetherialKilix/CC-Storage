const errors = [];

if (process.env.NODE_ENV === "development") {
	console.log("Running in development environment.")
	if (!process.env.MAIL_ADDR) process.env.MAIL_ADDR = "noreply@example.com";
} else {
	console.log("Running in production environment.")
	if (!process.env.MAIL_PASS) errors.push("Please set the MAIL_PASS environment variable.");
	if (!process.env.MAIL_ADDR) errors.push("Please set the MAIL_ADDR environment variable.");
}


if (errors.length > 0) {
	errors.forEach(error => console.error(error));
	process.exit(1);
}