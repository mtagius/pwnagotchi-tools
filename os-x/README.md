# os-x-pwnagotchi-tools
# Install
* `brew install hcxpcaptool`
* `npm install`

# TO-DO
I need to generate a set of scripts that can execute "hashcat" commands.
- Example command: `hashcat -m 22000 -a 0 --session NONRISPWL_100e7e03b00c_3829 --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/hashcat-potfile.txt" -o "./hashcat/hashcat-output.txt" "./handshakes/NONRISPWL_100e7e03b00c.pmkid" -r "./hashcat/rules/d3ad0ne.rule" -S "./wordlists/known-passwords.txt"`
- The commands need to reference the config variables in the config.js file. Such as hwmon-temp-abort, list of wordlists, dic, rules, masks.

- The scripts need to generate a combination of scripts for different combinations of attacks.
```javascript
A-0
TEXT, RULES
DICT, RULES
RULES

A-3
REGEX

A-6
TEXT, REGEX
DICT, REGEX
```

- The config variables can point to specific files, or directories. The logic needs to loop through them to generate the necessary attack combinations.
- It should geenrate an array of attacks in seperate standalone file in an array for the attacks for easy review. Example:
```javascript
const attacks = [
  [
	"-a 0",
	"known-passwords.txt",
	"hashcat/rules/wifi.rule"
  ],
  [
	"-a 0",
	"known-passwords.dic",
	"hashcat/rules/wifi.rule"
  ],
  [
	"-a 0",
	"",
	"hashcat/rules/wifi.rule"
  ],
  [
	"-a 3",
	"?h?h?h?h?h?h?h?h"
  ],
  [
	"-a 6",
	"known-passwords.txt",
	"?h?h?h?h?h?h?h?h"
  ],
  [
	"-a 6",
	"known-passwords.dic",
	"?h?h?h?h?h?h?h?h"
  ]
];
```

The attach # should be auto determined depend on the combination of file combo. 
Type -a 0 is for .txt * .rule, .dic *  .rule, and .rules by themselves.
Type -a 3 is for masks by themselves.
Type -a 6 is for .txt * mask, and .dic * mask.

Issues
- All (.txt * .rule), (.dic * .rule) attacks are listed as -a 0.
- There are no standalone -a 0 attacks for .rule files by themselves.
- There are no -a 3 attacks for mask alone attacks.
- There are no -a 6 (.txt * mask), and (.dic * mask) attacks.


- https://manpages.org/hashcat
