module.exports = {
	// Pwnagotchi SSH configuration
	PWNAGOTCHI_SSH: {
		HOST_ADDRESS: "", // Pwnagotchi SSH host address
		USERNAME: "", // Pwnagotchi SSH username
		PASSWORD: "", // Pwnagotchi SSH password
		PORT: 22 // Pwnagotchi SSH port
	},

	// Windows configuration
	WINDOWS: false, // Flag to indicate if running on Windows
	HASHCAT_PATH: "", // Path to Hashcat on Windows

	// Paths for attach lists
	WORDLISTS: [
		"./hashcat/wordlists"
	],

	DICTIONARIES: [
		"./hashcat/dictionaries"
	],

	RULES: [
		"./hashcat/rules/best64.rule"
	],

	MASKS: [
		"?h?h?h?h?h?h?h?h"
	],

	// File paths
	HANDSHAKE_DIRECTORY: "~/handshakes", // Directory for Pwnagotchi handshakes
	PWNAGOTCHI_HANDSHAKES: "/home/pi/handshakes", // Pwnagotchi handshakes directory
	LOCAL_PCAP_DIRECTORY: "./handshakes/pcap", // Local pcap directory
	LOCAL_PMKID_DIRECTORY: "./handshakes/pmkid", // Local pmkid directory
	LOCAL_HCCAPX_DIRECTORY: "./handshakes/hccapx", // Local hccapx directory
	LOCAL_POTFILES_DIRECTORY: "./hashcat/potfiles", // Local potfiles directory
	LOCAL_OUTPUT_FILE_DIRECTORY: "./hashcat/outputs", // Local output file directory

	// Hashcat script constants
	HASH_TYPE: 22000, // Hash type for Hashcat
	ABORT_TEMPERATURE: 100, // Abort temperature for Hashcat
	ABORT_WAIT_TIME: 2, // Abort wait time for Hashcat

	// Hashcat file paths
	HASHCAT_ATTACK_LISTS: "./hashcat/attacks-list/attacks-list.js", // Path to Hashcat attacks list
	HASHCAT_ATTACK_SCRIPTS: "./hashcat/attack-scripts", // Path to Hashcat attack scripts

	// General configurations
	PRINT_ITEMS: 10, // Number of items to print in the terminal
	GENERATE_PERMUTATIONS: 2000, // Number of permutations to generate and add to the .txt file
	EXPORT_FILE_NAME: "./hashcat/wordlists/generated-passwords.txt", // Name of the exported file
	WORD_LIST: [], // List of words for generation
	MAX_WORDS_USED: 6, // Max number of words that can be combined to form a given string

	// Sorting configurations
	SORT_BY_LENGTH: false, // Whether to sort permutations by length
	SORT_LENGTH_ASCENDING: false, // If sorting by length, whether to sort in ascending order
	SORT_ALPHABETICALLY: true, // Whether to sort alphabetically

	// Length constraints for generated strings
	MIN_LENGTH: 8, // Minimum length of generated strings
	MAX_LENGTH: 25 // Maximum length of generated strings
};
