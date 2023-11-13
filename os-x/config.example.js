module.exports = {
	// Pwnagotchi
	HOST_IP: "",
	USERNAME: "",
	PASSWORD: "",
	HANDSHAKE_DIRECTORY: "",
	PORT: 22,
	LOCAL_PCAP_DIRECTORY: "",
	
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
		"?h?h?h?h?h?h?h?h"
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
	HASHCAT_POTFILE_PATH: "./hashcat/hashcat-potfile.txt",
	HASHCAT_OUTPUT_PATH: "./hashcat/cracked-networkds/hashcat-output.txt",
	HASHCAT_ATTACK_LISTS: "./hashcat/attack-lists/attacks-list.js",
	HASHCAT_ATTACK_SCRIPTS: "./hashcat/attack-scripts"
};
