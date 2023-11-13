# os-x-pwnagotchi-tooling

# Purpose
This repo contains a number of scripts to automate the process of cracking Wi-Fi handshakes gathered by a `Pwnagotchi` using the `Hashcat` tooling.

# Dependencies
* [Brew](https://docs.brew.sh/Installation)
* [NodeJS](https://nodejs.org/en/download)

# Installation
* `git clone https://github.com/ivy00johns/pwnagotchi-tools/`
* `npm install`
* `brew install hcxpcaptool`
	* [hcxpcapngtool](https://github.com/warecrer/Hcxpcaptool)
* `brew install hashcat`
	* [Hashcat](https://manpages.org/hashcat)

# Initial Configuration
1. `cp .config.example .config`
2. Set the details for your `Pwnagotchi`:
	* `HOST_IP: ""`
	* `USERNAME: ""`
	* `PASSWORD: ""`

# Additional Configuration Steps
## Wordlists
- Single wordlist. `nerdlist.txt`

# Scripts
## Copy the .PCAP files to your machine.
To copy the `.pcap` files from your `Pwnagotchi` run the following script. It will copy the files from the `/root/handshakes` directory to one that you can access from your machine, `/usr/[USERNAME]/handshakes`.
* `npm run get`

## Generate the .HC22000/.PMKID files.
To generate the necessary `.hc22000`/`.pmkid` files needed to crack the WiFi handshakes run the following script.
* `npm run generate`

## Generate the list of attacks.
To generate the list of attacks based on the config variables outlined in the `.config` file, run the following script.
* `npm run attacks`

### Combinations
The script will generate commands based on the following combinations.
```text
--attack-mode=0
.txt X .rule
.dic X .rule
.rule

--attack-mode=3
mask

--attack-mode=6
.txt X mask
.dic X mask
```

### Example Output
```javascript
const attacks = [
  [
	"--attack-mode=0",
	"./wordlists/known-passwords.txt",
	"./hashcat/rules/wifi.rule"
  ],
  [
	"--attack-mode=0",
	"./wordlists/known-passwords.dic",
	"./hashcat/rules/wifi.rule"
  ],
  [
	"--attack-mode=0",
	"",
	"./hashcat/rules/wifi.rule"
  ],
  [
	"--attack-mode=3",
	"",
	"?h?h?h?h?h?h?h?h"
  ],
  [
	"--attack-mode=6",
	"./wordlists/known-passwords.txt",
	"?h?h?h?h?h?h?h?h"
  ],
  [
	"--attack-mode=6",
	"./wordlists/known-passwords.dic",
	"?h?h?h?h?h?h?h?h"
  ]
];
```

## Generate the attack scripts.
### Command Breakdown
* `hashcat` - "Hashcat is the world’s fastest CPU-based password recovery tool."
* `--hash-type=22000` - Hash type: `WPA2-PSK`
* `--attack-mode=0` - Attack mode: `Straight`
* `--session "[HC22000_FILE_NAME]_[RANDOM-NUMBER]"` - Specify a name for the cracking session which is useful for keeping track of multiple cracking sessions.
* `--hwmon-temp-abort=100` - Abort temperture: `100 C`
	* `-w 2` - Wait for 2 seconds after reaching the abort temperature before shutting down.
* `--potfile-path="./hashcat/potfiles/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-potfile.txt"` - The potfile is a file that stores the hashes that have been cracked by hashcat. This allows hashcat to resume cracking a hash from where it left off if the process is interrupted
* `--outfile="./hashcat/outputs/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-output.txt"` - The output of the command should be written to a file instead of being displayed on the terminal.
* `"./handshakes/hccapx/[HC22000_FILE_NAME].hc22000"` - The targetted `.hc22000` file that needs to be cracked.
* `--rules-file="./hashcat/rules/[RULES_NAME].rule"` - The file that contains the rules for generating password candidates.
* `-S "./wordlists/[PASSWORDS_LIST_NAME].txt"` - List of passwords.
* `"MYWIFI?d?d?d?d"` - A mask is a string of characters that represents the structure of a password. It uses placeholders to indicate which characters can be used at each position in the password. This allows hashcat to generate password candidates more efficiently than a brute-force attack, which would try every possible combination of characters.

### Attack Command Examples
#### --attack-mode=0
```bash
hashcat --hash-type=22000 --attack-mode=0 --session [HC22000_FILE_NAME]_[RANDOM-NUMBER] --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/potfiles/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-potfile.txt" --outfile="./hashcat/outputs/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-outfile.txt" "handshakes/hccapx/[HC22000_FILE_NAME].hc22000" --rules-file="./hashcat/rules/[RULES_NAME].rule" -S "wordlists/[PASSWORDS_LIST_NAME].txt"
```

#### --attack-mode=3
```bash
hashcat --hash-type=22000 --attack-mode=3 --session [HC22000_FILE_NAME]_[RANDOM-NUMBER] --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/potfiles/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-potfile.txt" --outfile="./hashcat/outputs/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-outfile.txt" "handshakes/hccapx/[HC22000_FILE_NAME].hc22000" "[MASK]"
```

#### --attack-mode=6
```bash
hashcat --hash-type=22000 --attack-mode=6 --session [HC22000_FILE_NAME]_[RANDOM-NUMBER]--hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/potfiles/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-potfile.txt" --outfile="./hashcat/outputs/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-outfile.txt" "handshakes/hccapx/[HC22000_FILE_NAME].hc22000" "wordlists/[PASSWORDS_LIST_NAME].txt" "[MASK]"
```

## Execute the handshake attacks.

