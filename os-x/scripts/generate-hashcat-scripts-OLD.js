// Import configurations from config.js
const {
	HASHCAT_PATH,
	PROJECT_PATH,
	WORDLIST_PATH,
	HASHCAT_SCRIPT_VERSION,
	TEMP_ABORT,
	WORKLOAD_PROFILE,
	HASHCAT_POTFILE_PATH,
	HASHCAT_OUTPUT_PATH,
	RULE_PATH,
	WORD_NINJA_PATH,
} = require('../config');

// Import attacks list from attacks.js
const attacks = require('../attacks_list');

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
	execSync
} = require('child_process');

// Global data
let networkCrackedStatusData = {};
let networkBssidData = {};
let sessionScripts = [];

const updateNetworkCrackedStatus = (status, filename) => {
	networkCrackedStatusData = {};

	const filePath = path.join(__dirname, 'network-cracked-status.json');
	if (fs.existsSync(filePath)) {
		networkCrackedStatusData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	}

	// Check if the key exists before updating the status
	if (filename in networkCrackedStatusData) {
		networkCrackedStatusData[filename].status = status;

		fs.writeFileSync(filePath, JSON.stringify(networkCrackedStatusData, null, 4));

		console.log('\n' + filename);
		if (status === 'cracked') {
			console.log(`
			▄▄· ▄▄▄   ▄▄▄·  ▄▄· ▄ •▄ ▄▄▄ .·▄▄▄▄  
			▐█ ▌▪▀▄ █·▐█ ▀█ ▐█ ▌▪█▌▄▌▪▀▄.▀·██▪ ██ 
			██ ▄▄▐▀▀▄ ▄█▀▀█ ██ ▄▄▐▀▀▄·▐▀▀▪▄▐█· ▐█▌
			▐███▌▐█•█▌▐█ ▪▐▌▐███▌▐█.█▌▐█▄▄▌██. ██ 
			·▀▀▀ .▀  ▀ ▀  ▀ ·▀▀▀ ·▀  ▀ ▀▀▀ ▀▀▀▀▀• 
			`);
		} else {
			console.log(`
			▄▄▄ .▐▄• ▄  ▄ .▄ ▄▄▄· ▄• ▄▌.▄▄ · ▄▄▄▄▄▄▄▄ .·▄▄▄▄  
			▀▄.▀· █▌█▌▪██▪▐█▐█ ▀█ █▪██▌▐█ ▀. •██  ▀▄.▀·██▪ ██ 
			▐▀▀▪▄ ·██· ██▀▐█▄█▀▀█ █▌▐█▌▄▀▀▀█▄ ▐█.▪▐▀▀▪▄▐█· ▐█▌
			▐█▄▄▌▪▐█·█▌██▌▐▀▐█ ▪▐▌▐█▄█▌▐█▄▪▐█ ▐█▌·▐█▄▄▌██. ██ 
			▀▀▀ •▀▀ ▀▀▀▀▀ · ▀  ▀  ▀▀▀  ▀▀▀▀  ▀▀▀  ▀▀▀ ▀▀▀▀▀• 
			`);
		}
		// Delay for 15 seconds
		setTimeout(() => {}, 15000);
	} else {
		console.log(`${filename} not found in network-cracked-status.json`);
	}
};

const generateHashcatScript = (filename, override = false) => {
	const hashType = '-m 22000';
	const fileID = path.parse(filename).name;
	const session = `--session ${fileID}`;

	// Check if the file is already tracked and override is false
	if (!override && filename in networkCrackedStatusData) {
		console.log(`${filename} is already being tracked.`);
		return;
	}

	const scriptPath = path.join(__dirname, 'hashcat', 'scripts', `${fileID}.js`);
	const attackScripts = attacks.map((attack) => {
		let hashcatCommand = `hashcat ${attack[0]} ${hashType} ${session}_${Math.floor(Math.random() * 9000) + 100} ${TEMP_ABORT} ${WORKLOAD_PROFILE}`;

		if (attack[0].includes('0')) {
			if (attack[2].includes('bssid.rule')) {
				hashcatCommand += `echo ${getBssid(filename)} |`;
			} else if (attack[2].includes('ssid-ninja.rule') || attack[2].includes('4-digit-append.rule')) {
				hashcatCommand += `node ${path.join(WORD_NINJA_PATH, 'wordNinjaGenerator.js')} ${filename.split('_')[0]} |`;
			}

			hashcatCommand += ` ${hashType} ${session}_${Math.floor(Math.random() * 9000) + 100} ${TEMP_ABORT} ${WORKLOAD_PROFILE} ${HASHCAT_OUTPUT_PATH} ${HASHCAT_POTFILE_PATH}`;

			if (attack[2].includes('bssid.rule')) {
				hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
			} else if (attack[2].includes('ssid-ninja.rule') || attack[2].includes('4-digit-append.rule')) {
				hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
			} else {
				hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])}`;
				if (attack.length > 2) {
					hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
				}
			}
		} else if (attack[0].includes('1')) {
			hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])} ${path.join(WORDLIST_PATH, attack[2])}`;
		} else if (attack[0].includes('3')) {
			hashcatCommand += ` ${attack[1]}`;
		} else if (attack[0].includes('6')) {
			hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])} ${attack[2]}`;
		}

		return hashcatCommand;
	});

	const scriptContent = `
	// ${HASHCAT_SCRIPT_VERSION}
	const execSync = require('child_process').execSync;
	const os = require('os');
	
	execSync(\`cd \${os.platform() === 'win32' ? '/d ' : ''}"${HASHCAT_PATH}" && ${attackScripts.join(' && ')}\`);
	`;

	fs.writeFileSync(scriptPath, scriptContent);

	sessionScripts.push(`${fileID}.js`);
	updateNetworkCrackedStatus('exhausted', filename);
};

const processAttackType0 = (attack, hashcatCommand, ssid, filename) => {
	if (attack[2].includes('bssid.rule')) {
		return `${hashcatCommand}echo ${getBssid(filename)} | -r ${path.join(RULE_PATH, attack[2])}`;
	} else if (attack[2].includes('ssid-ninja.rule') || attack[2].includes('4-digit-append.rule')) {
		return `${hashcatCommand}node ${path.join(WORD_NINJA_PATH, 'wordNinjaGenerator.js')} ${ssid} | -r ${path.join(RULE_PATH, attack[2])}`;
	} else {
		return processWordlistAttack(attack, hashcatCommand);
	}
};

const processAttackType1 = (attack, hashcatCommand) => {
	return `${hashcatCommand} ${path.join(WORDLIST_PATH, attack[1])} ${path.join(WORDLIST_PATH, attack[2])}`;
};

const processAttackType3 = (attack, hashcatCommand) => {
	return `${hashcatCommand} ${attack[1]}`;
};

const processAttackType6 = (attack, hashcatCommand) => {
	return `${hashcatCommand} ${path.join(WORDLIST_PATH, attack[1])} ${attack[2]}`;
};

const processWordlistAttack = (attack, hashcatCommand) => {
	hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])}`;
	if (attack.length > 2) {
		hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
	}
	return hashcatCommand + '\n';
};

const getBssid = (filename) => {
	const pcapFileName = filename.replace('.pmkid', '.pcap').replace('.hc22000', '.pcap');

	try {
		const bssid = networkBssidData[pcapFileName].bssid;
		return bssid;
	} catch (error) {
		const rawMac = filename.split('_').pop().match(/(?:[0-9A-Fa-f]{2}){6}/)[0].toUpperCase();
		const bssid = rawMac.match(/.{1,2}/g).join(':');
		return bssid;
	}
};

const generateScriptForBatch = () => {
	if (sessionScripts.length > 1) {
		const batchScriptPath = path.join(__dirname, 'hashcat', 'scripts', 'batches', `batch-${Math.floor(Math.random() * 9000) + 100}.js`);
		const batchScriptContent = sessionScripts.map((script) => `execSync(\`node ${path.join(PROJECT_PATH, 'hashcat', 'scripts', script)}\`);`).join(os.EOL);

		fs.writeFileSync(batchScriptPath, batchScriptContent);

		console.log(`\nBatch script created for ${sessionScripts.length} scripts`);
	}
};

const addNetworkToNetworkCrackedStatusData = (filename) => {
	networkCrackedStatusData[filename] = {
		ssid: filename.split('_')[0],
		bssid: getBssid(filename),
		status: 'waiting',
		version: HASHCAT_SCRIPT_VERSION,
	};
};

const generateScriptsForPmkidsAndHccapxs = (forceOverride = false) => {
	['pmkid', 'hccapx'].forEach((folder) => {
		const files = fs.readdirSync(path.join(__dirname, 'handshakes', folder)).filter((file) => file.endsWith('.pmkid') || file.endsWith('.hc22000'));

		if (!files.length) {
			console.log(`No .pmkid or .hc22000 files found in the ${folder} folder.`);
			return;
		}

		files.forEach((filename) => {
			if (forceOverride || !(filename in networkCrackedStatusData) || (filename in networkCrackedStatusData && networkCrackedStatusData[filename].status === 'waiting')) {
				addNetworkToNetworkCrackedStatusData(filename);
				console.log(`Generating hashcat script for ${filename}`);
				generateHashcatScript(filename, forceOverride);
			}
		});
	});
};

// Main function
const main = () => {
	const args = process.argv.slice(2);

	const printLogo = () => {
		console.log(`
	  ▄ .▄ ▄▄▄· .▄▄ ·  ▄ .▄ ▄▄·  ▄▄▄· ▄▄▄▄▄    .▄▄ ·  ▄▄· ▄▄▄  ▪   ▄▄▄·▄▄▄▄▄
	  ██▪▐█▐█ ▀█ ▐█ ▀. ██▪▐█▐█ ▌▪▐█ ▀█ •██      ▐█ ▀. ▐█ ▌▪▀▄ █·██ ▐█ ▄█•██  
	  ██▀▐█▄█▀▀█ ▄▀▀▀█▄██▀▐███ ▄▄▄█▀▀█  ▐█.▪    ▄▀▀▀█▄██ ▄▄▐▀▀▄ ▐█· ██▀· ▐█.▪
	  ██▌▐▀▐█ ▪▐▌▐█▄▪▐███▌▐▀▐███▌▐█ ▪▐▌ ▐█▌·    ▐█▄▪▐█▐███▌▐█•█▌▐█▌▐█▪·• ▐█▌·
	  ▀▀▀ · ▀  ▀  ▀▀▀▀ ▀▀▀ ··▀▀▀  ▀  ▀  ▀▀▀      ▀▀▀▀ ·▀▀▀ .▀  ▀▀▀▀.▀    ▀▀▀ 
				   ▄▄ • ▄▄▄ . ▐ ▄
  `);
	};

	printLogo();

	const updateNetworkCrackedStatus = (status, filename) => {
		networkCrackedStatusData = {};

		const filePath = path.join(__dirname, 'network-cracked-status.json');
		if (fs.existsSync(filePath)) {
			networkCrackedStatusData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		}

		// Check if the key exists before updating the status
		if (filename in networkCrackedStatusData) {
			networkCrackedStatusData[filename].status = status;

			fs.writeFileSync(filePath, JSON.stringify(networkCrackedStatusData, null, 4));

			console.log('\n' + filename);
			if (status === 'cracked') {
				console.log(`
	  ▄▄· ▄▄▄   ▄▄▄·  ▄▄· ▄ •▄ ▄▄▄ .·▄▄▄▄  
	  ▐█ ▌▪▀▄ █·▐█ ▀█ ▐█ ▌▪█▌▄▌▪▀▄.▀·██▪ ██ 
	  ██ ▄▄▐▀▀▄ ▄█▀▀█ ██ ▄▄▐▀▀▄·▐▀▀▪▄▐█· ▐█▌
	  ▐███▌▐█•█▌▐█ ▪▐▌▐███▌▐█.█▌▐█▄▄▌██. ██ 
	  ·▀▀▀ .▀  ▀ ▀  ▀ ·▀▀▀ ·▀  ▀ ▀▀▀ ▀▀▀▀▀• 
	`);
			} else {
				console.log(`
	  ▄▄▄ .▐▄• ▄  ▄ .▄ ▄▄▄· ▄• ▄▌.▄▄ · ▄▄▄▄▄▄▄▄ .·▄▄▄▄  
	  ▀▄.▀· █▌█▌▪██▪▐█▐█ ▀█ █▌▐█▌▄▀▀▀█▄ ▐█.▪▐▀▀▪▄▐█· ▐█▌
	  ▐▀▀▪▄ ·██· ██▀▐█▄█▀▀█ █▌▐█▌▄▀▀▀█▄ ▐█.▪▐▀▀▪▄▐█· ▐█▌
	  ▐█▄▄▌▪▐█·█▌██▌▐▀▐█ ▪▐▌▐█▄█▌▐█▄▪▐█ ▐█▌·▐█▄▄▌██. ██ 
	  ▀▀▀ •▀▀ ▀▀▀▀▀ · ▀  ▀  ▀▀▀  ▀▀▀▀  ▀▀▀  ▀▀▀ ▀▀▀▀▀• 
	`);
			}
			// Delay for 15 seconds
			setTimeout(() => {}, 15000);
		} else {
			console.log(`${filename} not found in network-cracked-status.json`);
		}
	};

	const generateHashcatScript = (filename, override = false) => {
		const hashType = '-m 22000';
		const fileID = path.parse(filename).name;
		const session = `--session ${fileID}`;

		// Check if the file is already tracked and override is false
		if (!override && filename in networkCrackedStatusData) {
			console.log(`${filename} is already being tracked.`);
			return;
		}

		const scriptPath = path.join(__dirname, 'hashcat', 'scripts', `${fileID}.js`);
		const attackScripts = attacks.map((attack) => {
			let hashcatCommand = `hashcat ${attack[0]} ${hashType} ${session}_${Math.floor(Math.random() * 9000) + 100} ${TEMP_ABORT} ${WORKLOAD_PROFILE}`;

			if (attack[0].includes('0')) {
				if (attack[2].includes('bssid.rule')) {
					hashcatCommand += `echo ${getBssid(filename)} |`;
				} else if (attack[2].includes('ssid-ninja.rule') || attack[2].includes('4-digit-append.rule')) {
					hashcatCommand += `node ${path.join(WORD_NINJA_PATH, 'wordNinjaGenerator.js')} ${filename.split('_')[0]} |`;
				}

				hashcatCommand += ` ${hashType} ${session}_${Math.floor(Math.random() * 9000) + 100} ${TEMP_ABORT} ${WORKLOAD_PROFILE} ${HASHCAT_OUTPUT_PATH} ${HASHCAT_POTFILE_PATH}`;

				if (attack[2].includes('bssid.rule')) {
					hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
				} else if (attack[2].includes('ssid-ninja.rule') || attack[2].includes('4-digit-append.rule')) {
					hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
				} else {
					hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])}`;
					if (attack.length > 2) {
						hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
					}
				}
			} else if (attack[0].includes('1')) {
				hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])} ${path.join(WORDLIST_PATH, attack[2])}`;
			} else if (attack[0].includes('3')) {
				hashcatCommand += ` ${attack[1]}`;
			} else if (attack[0].includes('6')) {
				hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])} ${attack[2]}`;
			}

			return hashcatCommand;
		});

		const scriptContent = `
// ${HASHCAT_SCRIPT_VERSION}
const execSync = require('child_process').execSync;
const os = require('os');

execSync(\`cd \${os.platform() === 'win32' ? '/d ' : ''}"${HASHCAT_PATH}" && ${attackScripts.join(' && ')}\`);
`;

		fs.writeFileSync(scriptPath, scriptContent);

		sessionScripts.push(`${fileID}.js`);
		updateNetworkCrackedStatus('exhausted', filename);
	};

	const processAttackType0 = (attack, hashcatCommand, ssid, filename) => {
		if (attack[2].includes('bssid.rule')) {
			return `${hashcatCommand}echo ${getBssid(filename)} | -r ${path.join(RULE_PATH, attack[2])}`;
		} else if (attack[2].includes('ssid-ninja.rule') || attack[2].includes('4-digit-append.rule')) {
			return `${hashcatCommand}node ${path.join(WORD_NINJA_PATH, 'wordNinjaGenerator.js')} ${ssid} | -r ${path.join(RULE_PATH, attack[2])}`;
		} else {
			return processWordlistAttack(attack, hashcatCommand);
		}
	};

	const processAttackType1 = (attack, hashcatCommand) => {
		return `${hashcatCommand} ${path.join(WORDLIST_PATH, attack[1])} ${path.join(WORDLIST_PATH, attack[2])}`;
	};

	const processAttackType3 = (attack, hashcatCommand) => {
		return `${hashcatCommand} ${attack[1]}`;
	};

	const processAttackType6 = (attack, hashcatCommand) => {
		return `${hashcatCommand} ${path.join(WORDLIST_PATH, attack[1])} ${attack[2]}`;
	};

	const processWordlistAttack = (attack, hashcatCommand) => {
		hashcatCommand += ` ${path.join(WORDLIST_PATH, attack[1])}`;
		if (attack.length > 2) {
			hashcatCommand += ` -r ${path.join(RULE_PATH, attack[2])}`;
		}
		return hashcatCommand + '\n';
	};

	const getBssid = (filename) => {
		const pcapFileName = filename.replace('.pmkid', '.pcap').replace('.hc22000', '.pcap');

		try {
			const bssid = networkBssidData[pcapFileName].bssid;
			return bssid;
		} catch (error) {
			const rawMac = filename.split('_').pop().match(/(?:[0-9A-Fa-f]{2}){6}/)[0].toUpperCase();
			const bssid = rawMac.match(/.{1,2}/g).join(':');
			return bssid;
		}
	};

	const generateScriptForBatch = () => {
		if (sessionScripts.length > 1) {
			const batchScriptPath = path.join(__dirname, 'hashcat', 'scripts', 'batches', `batch-${Math.floor(Math.random() * 9000) + 100}.js`);
			const batchScriptContent = sessionScripts.map((script) => `execSync(\`node ${path.join(PROJECT_PATH, 'hashcat', 'scripts', script)}\`);`).join(os.EOL);

			fs.writeFileSync(batchScriptPath, batchScriptContent);

			console.log(`\nBatch script created for ${sessionScripts.length} scripts`);
		}
	};

	const addNetworkToNetworkCrackedStatusData = (filename) => {
		networkCrackedStatusData[filename] = {
			ssid: filename.split('_')[0],
			bssid: getBssid(filename),
			status: 'waiting',
			version: HASHCAT_SCRIPT_VERSION,
		};
	};

	const generateScriptsForPmkidsAndHccapxs = (forceOverride = false) => {
		['pmkid', 'hccapx'].forEach((folder) => {
			const files = fs.readdirSync(path.join(__dirname, 'handshakes', folder)).filter((file) => file.endsWith('.pmkid') || file.endsWith('.hc22000'));

			if (!files.length) {
				console.log(`No .pmkid or .hc22000 files found in the ${folder} folder.`);
				return;
			}

			files.forEach((filename) => {
				if (forceOverride || !(filename in networkCrackedStatusData) || (filename in networkCrackedStatusData && networkCrackedStatusData[filename].status === 'waiting')) {
					addNetworkToNetworkCrackedStatusData(filename);
					console.log(`Generating hashcat script for ${filename}`);
					generateHashcatScript(filename, forceOverride);
				}
			});
		});
	};

	// Run the main functionality
	generateScriptsForPmkidsAndHccapxs(args.includes('--override'));
	generateScriptForBatch();
};

// Call the main function
main();
