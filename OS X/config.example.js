module.exports = {
	// Define paths for attach lists
	WORDLISTS: [
		"known-wpa-passwords.txt"
	],

	DICTIONARIES: [
		"known-wpa-passwords.dic"
	],

	RULES: [
		"hashcat/rules/wifi.rule"
	],

	MASKS: [
		"?h?h?h?h?h?h?h?h"
	],

	// Paths
	WORDLIST_PATH: "./wordlists",

	// Hashcat script constants
	HASHCAT_SCRIPT_VERSION: "v1",
	TEMP_ABORT: "--hwmon-temp-abort=100",
	WORKLOAD_PROFILE: "-w 2",

	// Hashcat file paths
	HASHCAT_POTFILE_PATH: "./hashcat/hashcat-potfile.txt",
	HASHCAT_OUTPUT_PATH: "./hashcat/hashcat-output.txt",
	RULE_PATH: "./hashcat/rules"
};
