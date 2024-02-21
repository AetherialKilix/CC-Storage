const errors = [];

// decided that I should remove these from the launch configs before i do my first commit :)
if (! process.env.MAIL_ADDR) errors.push("Please set the MAIL_ADDR environment variable.");
if (! process.env.MAIL_PASS) errors.push("Please set the MAIL_PASS environment variable.");

if (errors.length > 0) {
	errors.forEach(error => console.error);
	process.exit(1);
}