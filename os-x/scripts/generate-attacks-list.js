const { WORDLISTS, DICTIONARIES, RULES, MASKS } = require('../config');

const generateAttackList = (attackType) => {
	const attackList = [];

	for (const wordlist of WORDLISTS) {
		for (const rule of RULES) {
			attackList.push(["-a 0", wordlist, rule]);
		}
	}

	for (const dictionary of DICTIONARIES) {
		for (const rule of RULES) {
			attackList.push(["-a 0", dictionary, rule]);
		}
	}

	for (const rule of RULES) {
		attackList.push(["-a 0", "", rule]);
	}

	for (const mask of MASKS) {
		attackList.push(["-a 3", mask]);
	}

	for (const wordlist of WORDLISTS) {
		for (const mask of MASKS) {
			attackList.push(["-a 6", wordlist, mask]);
		}
	}

	for (const dictionary of DICTIONARIES) {
		for (const mask of MASKS) {
			attackList.push(["-a 6", dictionary, mask]);
		}
	}

	return attackList;
};

const writeAttacksToFile = (attacks) => {
	const fs = require('fs');
	const path = require('path');
	const filePath = path.join(__dirname, 'attacks_list.js');

	const content = `
// attacks_list.js
// Generated attacks list

const attacks = ${JSON.stringify(attacks, null, 2)};

module.exports = attacks;
`;

	fs.writeFileSync(filePath, content);
	console.log(`Attacks list written to ${filePath}`);
};

if (require.main === module) {
	const attackType = 0;  // Set the desired attack type
	const attacks = generateAttackList(attackType);
  
	writeAttacksToFile(attacks);
}
