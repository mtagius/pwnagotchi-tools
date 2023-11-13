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

----

# Scripts
## Copy the .PCAP files to your machine.
To copy the `.pcap` files from your `Pwnagotchi` run the following script. It will copy the files from the `/root/handshakes` directory on the `Pwnagotchi` to one that you can access from your machine, `/usr/[USERNAME]/handshakes`. Then it will copy the `/usr/[USERNAME]/handshakes` directory to your machine.
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
To generate the necessary scripts to crack the WiFi handshakes run the following script.
* `npm run scripts`

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


### Example Terminal Output
```bash
hashcat (v6.2.6) starting

* Device #2: Apple's OpenCL drivers (GPU) are known to be unreliable.
             You have been warned.

METAL API (Metal 341.16)
========================
* Device #1: Apple M1, 5408/10922 MB, 8MCU

OpenCL API (OpenCL 1.2 (Aug  5 2023 05:54:47)) - Platform #1 [Apple]
====================================================================
* Device #2: Apple M1, skipped

Minimum password length supported by kernel: 8
Maximum password length supported by kernel: 63

Hashes: 36 digests; 12 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates

Optimizers applied:
* Zero-Byte
* Single-Salt
* Slow-Hash-SIMD-LOOP

Watchdog: Temperature abort trigger set to 100c

Host memory required for this attack: 281 MB

Dictionary cache hit:
* Filename..: wordlists/known-passwords.txt
* Passwords.: 2
* Bytes.....: 17
* Keyspace..: 20000

The wordlist or mask that you are using is too small.
This means that hashcat cannot use the full parallel power of your device(s).
Unless you supply more work, your cracking speed will drop.
For tips on supplying more work, see: https://hashcat.net/faq/morework

Approaching final keyspace - workload adjusted.           

Cracking performance lower than expected?                 

* Append -w 3 to the commandline.
  This can cause your screen to lag.

* Update your backend API runtime / driver the right way:
  https://hashcat.net/faq/wrongdriver

* Create more work items to make use of your parallelization power:
  https://hashcat.net/faq/morework

[s]tatus [p]ause [b]ypass [c]heckpoint [f]inish [q]uit => q

Session..........: EXAMPLE_a0648f5681d7_6215          
Status...........: Quit
Hash.Mode........: 22000 (WPA-PBKDF2-PMKID+EAPOL)
Hash.Target......: handshakes/hccapx/EXAMPLE_a0648f5681d7.hc22000
Time.Started.....: Sun Nov 12 20:02:04 2023 (44 secs)
Time.Estimated...: Sun Nov 12 21:02:18 2023 (59 mins, 30 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (wordlists/known-passwords.txt), Left Side
Guess.Mod........: Mask (MYWIFI?d?d?d?d) [10], Right Side
Guess.Queue.Base.: 1/1 (100.00%)
Guess.Queue.Mod..: 1/1 (100.00%)
Speed.#1.........:        6 H/s (0.27ms) @ Accel:1024 Loops:8 Thr:32 Vec:1
Recovered........: 0/12 (0.00%) Digests (total), 0/12 (0.00%) Digests (new)
Progress.........: 244/20000 (1.22%)
Rejected.........: 0/244 (0.00%)
Restore.Point....: 0/2 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:122-123 Iteration:0-12
Candidate.Engine.: Device Generator
Candidates.#1....: passwordMYWIFI0777 -> passwordMYWIFI0777
Hardware.Mon.#1..: Util: 95%



Session..........: Pizzaislife_a0648f5681d7_6215
Status...........: Quit
Hash.Mode........: 22000 (WPA-PBKDF2-PMKID+EAPOL)
Hash.Target......: handshakes/hccapx/EXAMPLE_a0648f5681d7.hc22000
Time.Started.....: Sun Nov 12 20:02:04 2023 (44 secs)
Time.Estimated...: Sun Nov 12 21:02:18 2023 (59 mins, 30 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (wordlists/known-passwords.txt), Left Side
Guess.Mod........: Mask (MYWIFI?d?d?d?d) [10], Right Side
Guess.Queue.Base.: 1/1 (100.00%)
Guess.Queue.Mod..: 1/1 (100.00%)
Speed.#1.........:        6 H/s (0.27ms) @ Accel:1024 Loops:8 Thr:32 Vec:1
Recovered........: 0/12 (0.00%) Digests (total), 0/12 (0.00%) Digests (new)
Progress.........: 244/20000 (1.22%)
Rejected.........: 0/244 (0.00%)
Restore.Point....: 0/2 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:122-123 Iteration:0-12
Candidate.Engine.: Device Generator
Candidates.#1....: passwordMYWIFI0777 -> passwordMYWIFI0777
Hardware.Mon.#1..: Util: 95%

[s]tatus [p]ause [b]ypass [c]heckpoint [f]inish [q]uit => Started: Sun Nov 12 20:01:49 2023
Stopped: Sun Nov 12 20:02:49 2023
```

---

# Clean-Up
* If you want to delete the generated `.hc22000`/`.pmkid` files, run the following script.
	* `npm run clean-up-handshakes`

* If you want to delete the generated `[HC22000_FILE_NAME]-output.txt`/`[HC22000_FILE_NAME]-potfile.txt` files, run the following script.
	* `npm run clean-up-hashcat-logs`

----

# Troubleshooting

