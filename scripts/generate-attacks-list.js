const fs = require("fs");
const path = require("path");
const config = require("../config");

// Function to determine attack type based on file combination
function determineAttackType(wordlist, rule, mask) {
	if (wordlist.endsWith(".txt") || wordlist.endsWith(".dic")) {
		if (rule !== "" && mask !== "") {
			mask = "";
		}
	}

	if ((wordlist.endsWith(".txt") || wordlist.endsWith(".dic")) && mask !== "") {
		return 6; // Type --attack-mode=6 for .txt/.dic * mask
	}

	if (mask !== "") {
		return 3; // Type --attack-mode=3 for masks
	}

	if (rule !== "" && wordlist === "" && mask === "") {
		return 0; // Type --attack-mode=0 for .rule by itself
	}

	if (rule !== "" && (wordlist.endsWith(".txt") || wordlist.endsWith(".dic"))) {
		return 0; // Type --attack-mode=0 for .txt/.dic * .rule
	}

	return null; // Unknown combination
}

// Function to get file paths from directories or handle single files
function getFilePaths(directoryOrFile, allowedExtensions = []) {
	if (fs.statSync(directoryOrFile).isDirectory()) {
		const files = fs.readdirSync(directoryOrFile);
		return files
			.filter(file => allowedExtensions.length === 0 || allowedExtensions.some(ext => file.endsWith(ext)))
			.map(file => path.join(directoryOrFile, file));
	} else {
		return [directoryOrFile];
	}
}

// Function to generate attack combinations
function generateAttacks() {
	const attacks = [];

	// Loop through wordlists
	for (const wordlistDir of config.WORDLISTS) {
		const wordlistFiles = getFilePaths(wordlistDir, [".txt"]);

		// Loop through dictionaries
		for (const dictionaryDir of config.DICTIONARIES) {
			const dictionaryFiles = getFilePaths(dictionaryDir, [".dic"]);

			// Loop through rules
			for (const ruleDir of config.RULES) {
				const ruleFiles = getFilePaths(ruleDir, [".rule"]);

				// Loop through masks
				for (const mask of config.MASKS) {

					// Loop through wordlists
					for (const wordlist of wordlistFiles) {

						// Loop through rules
						for (const rule of ruleFiles) {
							const attackType = determineAttackType(wordlist, rule, mask);

							if (attackType !== null) {
								const attack = [`--attack-mode=${attackType}`];

								if (wordlist !== "") {
									// Push the full file path
									attack.push(wordlist);
								}

								if (rule !== "") {
									// Push the full file path
									attack.push(rule);
								}

								if (wordlist !== "" && rule == "") {
									// Push the full file path
									attack.push(wordlist);
								}

								attacks.push(attack);
							}
						}
					}
				}
			}
		}
	}

	// Add standalone --attack-mode=0 attacks for .rule files
	for (const ruleDir of config.RULES) {
		const ruleFiles = getFilePaths(ruleDir, [".rule"]);
		for (const rule of ruleFiles) {
			const attackType = determineAttackType("", rule, "");
			if (attackType === 0) {
				attacks.push([`--attack-mode=${attackType}`, "", rule]);
			}
		}
	}

	// Add --attack-mode=3 attacks for mask alone
	for (const mask of config.MASKS) {
		const attackType = determineAttackType("", "", mask);
		if (attackType === 3) {
			attacks.push([`--attack-mode=${attackType}`, mask]);
		}
	}

	// Add --attack-mode=6 attacks for (.txt * mask) and (.dic * mask)
	for (const mask of config.MASKS) {
		for (const wordlistDir of config.WORDLISTS) {
			const wordlistFiles = getFilePaths(wordlistDir, [".txt"]);
			for (const wordlist of wordlistFiles) {
				const attackType = determineAttackType(wordlist, "", mask);
				if (attackType === 6) {
					// Push the full file path
					attacks.push([`--attack-mode=${attackType}`, wordlist, mask]);
				}
			}
		}

		for (const dictionaryDir of config.DICTIONARIES) {
			const dictionaryFiles = getFilePaths(dictionaryDir, [".dic"]);
			for (const dictionary of dictionaryFiles) {
				const attackType = determineAttackType(dictionary, "", mask);
				if (attackType === 6) {
					// Push the full file path
					attacks.push([`--attack-mode=${attackType}`, dictionary, mask]);
				}
			}
		}
	}

	return attacks;
}

// Function to write attacks to a file
function writeAttacksToFile(attacks, filePath) {
	const content = `const attacks = ${JSON.stringify(attacks, null, 2)};\n\nmodule.exports = attacks;`;

	fs.writeFileSync(filePath, content, "utf8");
}

// Main function
function main() {
	const attacks = generateAttacks();

	writeAttacksToFile(attacks, config.HASHCAT_ATTACK_LISTS);

	console.log(`Generated attacks saved to ${config.HASHCAT_ATTACK_LISTS}.`);
}

main();
