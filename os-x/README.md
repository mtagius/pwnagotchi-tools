# os-x-pwnagotchi-tools
# Install
* `brew install hcxpcaptool`
* `npm install`

# TO-DO
I need to generate a set of scripts that can execute "hashcat" commands.
- Example command: `hashcat --hash-type=22000 --attack-mode=0 --session NONRISPWL_100e7e03b00c_3829 --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/hashcat-potfile.txt" --outfile="./hashcat/hashcat-output.txt" "./handshakes/hccapx/NONRISPWL_100e7e03b00c.hc22000" --rules-file="./hashcat/rules/d3ad0ne.rule" -S "./wordlists/known-passwords.txt"`

```javascript
hashcat
	--hash-type=22000
	--attack-mode=0
	--session NONRISPWL_100e7e03b00c_3829
	--hwmon-temp-abort=100
		-w 2
	--potfile-path "./hashcat/hashcat-potfile.txt"
	"./handshakes/NONRISPWL_100e7e03b00c.pmkid"
	--outfile="./hashcat/hashcat-output.txt"
	--rules-file="./hashcat/rules/d3ad0ne.rule"
		-S "./wordlists/known-passwords.txt"
```

# Command Breakdown
`hashcat` - "Hashcat is the world’s fastest CPU-based password recovery tool."
`--hash-type=22000` - Hash type: `WPA2-PSK`
`--attack-mode=0` - Attack mode: `Straight`
`--session "NONRISPWL_100e7e03b00c_3829"` - Specify a name for the cracking session which is useful for keeping track of multiple cracking sessions.
`--hwmon-temp-abort=100` - Abort temperture: `100 C`
	`-w 2` - Wait for 2 seconds after reaching the abort temperature before shutting down.
`--potfile-path="./hashcat/hashcat-potfile.txt"` - The potfile is a file that stores the hashes that have been cracked by hashcat. This allows hashcat to resume cracking a hash from where it left off if the process is interrupted.
`--outfile="./hashcat/hashcat-output.txt"` - The output of the command should be written to a file instead of being displayed on the terminal
`--rules-file="./hashcat/rules/d3ad0ne.rule"` - The file that contains the rules for generating password candidates.
	`-S "./wordlists/known-passwords.txt"` - List of known passwords
`"./handshakes/NONRISPWL_100e7e03b00c.pmkid"` - The targetted .pmkid file that needs to be cracked.

## --attack-mode=0 sample
`hashcat --hash-type=22000 --attack-mode=0 --session Arcot_6032b1a6ba8f_2713 --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/hashcat-potfile.txt" --outfile="./hashcat/Arcot_6032b1a6ba8f-output.txt" "handshakes/hccapx/Arcot_6032b1a6ba8f.hc22000" --rules-file="./hashcat/rules/names.rule" -S "wordlists/known-passwords.txt"`

## --attack-mode=3 sample
``

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


hashcat --hash-type=22000 --attack-mode=0 --session Pizzaislife_a0648f5681d7_6091 --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/hashcat-potfile.txt" --outfile="./hashcat/Pizzaislife_a0648f5681d7-output.txt" "handshakes/hccapx/Pizzaislife_a0648f5681d7.hc22000" --rules-file="./hashcat/rules/names.rule" -S "wordlists/known-passwords.txt"

hashcat --hash-type=22000 --attack-mode=0 --session Pizzaislife_a0648f5681d7_6091 --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/hashcat-potfile.txt" --outfile="./hashcat/Pizzaislife_a0648f5681d7-output.txt" "handshakes/hccapx/Pizzaislife_a0648f5681d7.hc22000" --rules-file="./hashcat/rules/names.rule" -S "wordlists/known-passwords.txt"

hashcat --hash-type=22000 --attack-mode=0 --session BadaiHo_100c6bf75d1b_1066 --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/hashcat-potfile.txt" --outfile="./hashcat/BadaiHo_100c6bf75d1b-output.txt" "handshakes/hccapx/BadaiHo_100c6bf75d1b.hc22000" --rules-file="./hashcat/rules/names.rule" -S "wordlists/known-passwords.txt"