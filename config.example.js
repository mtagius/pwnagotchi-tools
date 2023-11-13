module.exports = {
	// Pwnagotchi
	HOST_ADDRESS: "",
	USERNAME: "",
	PASSWORD: "",
	PORT: 22,
	
	// Define paths for attach lists
	WORDLISTS: [
		"./wordlists"
	],

	DICTIONARIES: [
		"./wordlists"
	],

	RULES: [
		"./hashcat/rules"
	],

	MASKS: [
		"?h?h?h?h?h"
	],

	// Paths
	HANDSHAKE_DIRECTORY: `/home/${this.USERNAME}/handshakes`,
	LOCAL_PCAP_DIRECTORY: "./handshakes/pcap",
	LOCAL_PMKID_DIRECTORY: "./handshakes/pmkid",
	LOCAL_HCCAPX_DIRECTORY: "./handshakes/hccapx",
	LOCAL_POTFILES_DIRECTORY: "./hashcat/potfiles",
	LOCAL_OUTPUT_FILE_DIRECTORY: "./hashcat/outputs",

	// Hashcat script constants
	HASH_TYPE: 22000,
	ABORT_TEMPERATURE: 100,
	ABORT_WAIT_TIME: 2,

	// Hashcat file paths
	HASHCAT_ATTACK_LISTS: "./hashcat/attack-lists/attacks-list.js",
	HASHCAT_ATTACK_SCRIPTS: "./hashcat/attack-scripts"
};
