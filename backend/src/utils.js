const randomDigits = (digits) => {
	const min = 10 ** (digits - 1); // 10 ** (5 - 1) -> 10000
	const max = 10 ** digits; // 10 ** 5 -> 100000
	// random is [0;1[, so the upper bound will not be reached
	// Math.random() * (100000 - 10000) -> [0;90000[
	// Math.random() * (100000 - 10000) + min -> [10000;100000[ -> [10000;99999]
	return Math.floor(Math.random() * (max - min) + min);
}

module.exports = {
	randomDigits
}