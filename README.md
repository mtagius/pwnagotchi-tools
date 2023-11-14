# os-x-pwnagotchi-tooling

# DISCLAIMER
**This project is for WiFi security education ONLY!**

**Hacking WiFi networks that you DO NOT OWN IS ILLEGAL!**

# TO-DO - For Windows
* Add logic to get the handshakes from a `Pwnagotchi`.
* Write code to generate a password list based on relative information.
* Promote the repo on Reddit.

# Purpose
This repo contains a number of scripts to automate the process of cracking Wi-Fi handshakes gathered by a `Pwnagotchi` using the `Hashcat` tooling, on both Windows and OS X systems.

In order to create it I started by refactoring different repos that are no longer maintained.
* [Pwnagotchi-Tools](https://github.com/mtagius/pwnagotchi-tools): [mtagius](https://github.com/mtagius)
* [Pwnagetty](https://github.com/CyrisXD/Pwnagetty/): [CyrisXD](https://github.com/CyrisXD)

# Table Of Contents
* [Dependencies](#dependencies)
	* [OS X](#os-x-dependencies)
	* [Windows](#windows-dependencies)
* [Pwnagotchi Setup](#pwnagotchi-setup)
	* [OS X](#os-x-setup)
	* [Windows](#windows-setup)
* [Installation](#installation)
	* [OS X](#os-x-installation)
	* [Windows](#windows-installation)
* [Initial Configuration](#initial-configuration)
	* [OS X](#os-x-configuration)
	* [Windows](#windows-configuration)
* [Additional Configuration Steps](#additional-configuration-steps)
	* [Wordlists](#wordlists)
		* [Personal Wordlist](#personal-wordlist)
		* [Standalone Wordlists](#standalone-wordlists)
		* [Standalone Dictionaries](#standalone-dictionaries)
		* [Misc Wordlists](#misc-wordlists)
	* [Rules](#rules)
* [Scripts](#scripts)
	* [Copy the .PCAP files to your machine.](#copy-the-pcap-files-to-your-machine)
	* [Generate the .HC22000/.PMKID files.](#generate-the-hc22000pmkid-files)
		* [OS X](#os-x---generate)
		* [Windows](#windows---generate)
	* [Generate the list of attacks.](#generate-the-list-of-attacks)
		* [Combinations](#combinations)
		* [Output Example](#output-example)
	* [Generate the attack scripts.](#generate-the-attack-scripts)
		* [Command Breakdown](#command-breakdown)
		* [Attack Command Examples](#attack-command-examples)
			* [--attack-mode=0](#attack-mode0)
			* [--attack-mode=3](#attack-mode3)
			* [--attack-mode=6](#attack-mode6)
	* [Execute the handshake attacks.](#execute-the-handshake-attacks)
		* [Example Terminal Output](#example-terminal-output)
* [Clean-Up](#clean-up)
* [Troubleshooting](#troubleshooting)
	* [Issue #1](#issue-1)
* [LINKS](#links)

# Dependencies
## OS X Dependencies
* [Brew](https://docs.brew.sh/Installation)
* [NodeJS](https://nodejs.org/en/download)
* [hcxpcapngtool](https://github.com/warecrer/Hcxpcaptool)
* [Hashcat](https://manpages.org/hashcat)

## Windows Dependencies
* [NodeJS](https://nodejs.org/en/download)
* [Vagrant](https://developer.hashicorp.com/vagrant/install)
* [Virtual Box](https://www.virtualbox.org/wiki/Downloads)
	* Vagrant and Virtual Box are only used to convert `.pcap` files to the corresponding `.hccapx`/`.pmkid` files.
* [Hashcat v6.2.6 binaries](https://hashcat.net/hashcat/)
	* Make note of the `PATH` to where you unpacked `Hashcat`.
		* Example: `C:\\Users\\XXXXXX\\hashcat-6.2.6\\`

# Pwnagotchi Setup
## OS X Setup
* Official
	* [Connecting to your Pwnagotchi: pwnagotchi.ai](https://pwnagotchi.ai/configuration/#connect-to-your-pwnagotchi)
* Other
	* https://mattgibson.ca/pwnagotchi-1-6-2-with-waveshare-v3-macos-macbook-host/

## Windows Setup
* Other
	* https://blog.manchestergreyhats.co.uk/posts/2020-01-10-pwnagotchi-setup/

# Installation
## OS X Installation
* `git clone https://github.com/ivy00johns/pwnagotchi-tools/`
* `npm install`
* `brew install hcxpcaptool`
* `brew install hashcat`

## Windows Installation
* `git clone https://github.com/ivy00johns/pwnagotchi-tools/`
* `npm install`

# Initial Configuration
## OS X Configuration
1. `cp .config.example .config`
2. Set the details for your `Pwnagotchi`:
	* `HOST_IP: ""`
	* `USERNAME: ""`
	* `PASSWORD: ""`

## Windows Configuration
1. `cp .config.example .config`
2. Set the details for your `Pwnagotchi`:
	* `HOST_IP: ""`
	* `USERNAME: ""`
	* `PASSWORD: ""`
	* `WINDOWS: true`
	* `HASHCAT_PATH: "C:\\[PATH]\\hashcat-6.2.6"`

# Additional Configuration Steps
## Wordlists
By default this repo contains a single example wordlist. You will want to download additional ones to work with. You can place them in the provided `./wordlists` directory, or you can reference the directory directly in the `.config.js` file.
```javascript
...
WORDLISTS: [
	"./wordlists",
	"[PATH_TO_WORDLIST]"
],
...
```

### Personal Wordlist
* You can add your own known passwords by cloning the example file and editing it.
	1. `cp ./known-passwords.example.txt ./wordlists/known-passwords.txt`

### Standalone Wordlists
* [netgear-spectrum.txt](https://raw.githubusercontent.com/soxrok2212/PSKracker/master/dicts/netgear-spectrum/netgear-spectrum.txt)
	* Part of the much larger colleciton [PSKracker](https://github.com/soxrok2212/PSKracker) by [soxrok2212](https://github.com/soxrok2212/).

* [openwall.net-all.txt](https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/openwall.net-all.txt)
	* Part of the [DanielMiessler's SecLists](https://github.com/danielmiessler/SecLists/) larger collection of [passwords](https://github.com/danielmiessler/SecLists/tree/master/Passwords).

* [shortKrak.txt](https://raw.githubusercontent.com/praetorian-inc/Hob0Rules/master/wordlists/shortKrak.txt)
	* Part of the [praetorian-inc/Hob0Rules](https://github.com/praetorian-inc/Hob0Rules/) collection of [wordlists](https://github.com/praetorian-inc/Hob0Rules/tree/master/wordlists).

* [nerdlist.txt](https://raw.githubusercontent.com/TheNerdlist/nerdlist/main/nerdlist.txt)

* [English Words](https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt)

### Standalone Dictionaries
* [Outpost9 Dictionary](https://www.outpost9.com/files/wordlists/)
	* [Names](https://www.outpost9.com/files/wordlists/names.zip)

### Massive Wordlists
* [Weakpass Wordlists](https://weakpass.com/wordlist/)
	* [Custom-WPA](https://weakpass.com/wordlist/490)
	* [Super-WPA](https://weakpass.com/wordlist/500)
	* [hashesorg2019](https://weakpass.com/wordlist/1851)

### Misc Wordlists
* [Original Wordlists](https://github.com/praetorian-inc/Hob0Rules/tree/master/wordlists)

## Rules
### Included Rules
* [hob064](https://github.com/praetorian-inc/Hob0Rules)
* [best64](https://trustedsec.com/blog/better-hacking-through-cracking-know-your-rules)
* [T0XICv1](https://github.com/samirettali/password-cracking-rules/blob/master/T0XlCv1.rule)
* [T0XICv2](https://github.com/hashcat/hashcat/blob/master/rules/T0XlCv2.rule)
* [toggles5](https://github.com/hashcat/hashcat/blob/master/rules/toggles5.rule)
* [InsidePro-PasswordsPro](https://github.com/hashcat/hashcat/blob/master/rules/InsidePro-PasswordsPro.rule)
* [rockyou-30000](https://github.com/hashcat/hashcat/blob/master/rules/rockyou-30000.rule)
* [InsidePro-HashManager](https://github.com/hashcat/hashcat/blob/master/rules/InsidePro-HashManager.rule)
* [d3ad0ne](https://github.com/hashcat/hashcat/blob/master/rules/d3ad0ne.rule)
* [dive](https://github.com/hashcat/hashcat/blob/master/rules/dive.rule)
* [unix-ninja-leetspeak](https://github.com/hashcat/hashcat/blob/master/rules/unix-ninja-leetspeak.rule)
* [generated2](https://github.com/hashcat/hashcat/blob/master/rules/generated2.rule)
* [d3adhob0](https://github.com/praetorian-inc/Hob0Rules/blob/master/d3adhob0.rule)
* [_NSAKEY.v2.dive](https://github.com/NSAKEY/nsa-rules/blob/master/_NSAKEY.v2.dive.rule)

----

# Scripts
## Copy the .PCAP files to your machine.
To copy the `.pcap` files from your `Pwnagotchi` run the following script.
It will copy the files from the `/root/handshakes` directory on the `Pwnagotchi` to one that you can access from your machine, `/usr/[USERNAME]/handshakes`.
Then it will copy the `/usr/[USERNAME]/handshakes` directory to your machine, in the `./handshakes/pcap` directory.
* `npm run get`

## Generate the .HC22000/.PMKID files.
To generate the necessary `.hc22000`/`.pmkid` files needed to crack the WiFi handshakes run the following script.
### OS X - Generate
* `npm run generate`

### Windows - Generate
* `npm run vagrant-up`

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

### Output Example
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
* `"?h?h?h?h?h?h?h?h"` - A mask is a string of characters that represents the structure of a password. It uses placeholders to indicate which characters can be used at each position in the password. This allows hashcat to generate password candidates more efficiently than a brute-force attack, which would try every possible combination of characters.

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
hashcat --hash-type=22000 --attack-mode=6 --session [HC22000_FILE_NAME]_[RANDOM-NUMBER] --hwmon-temp-abort=100 -w 2 --potfile-path "./hashcat/potfiles/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-potfile.txt" --outfile="./hashcat/outputs/[HC22000_FILE_NAME]_[RANDOM-NUMBER]-outfile.txt" "handshakes/hccapx/[HC22000_FILE_NAME].hc22000" "wordlists/[PASSWORDS_LIST_NAME].txt" "[MASK]"
```

## Execute the handshake attacks.
### OS X Execution
* TBD

### Windows Execution
* Locate the necessary `.bat` file in the `.\hashcat\attack-scripts` directory.
* Run the script:
	* `.\hashcat\attack-scripts\NETWORK_a0648f5681d7.bat`

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

## Issue #1
1. If you get the error, `Integer overflow detected in keyspace of mask: ?h?h?h?h?h?h?h?h`, do the following.
* *TERMINAL OUTPUT*
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

	Integer overflow detected in keyspace of mask: ?h?h?h?h?h?h?h?h

	Started: Sun Nov 12 22:14:36 2023
	Stopped: Sun Nov 12 22:14:38 2023
	```

* *ERROR*
	* `Integer overflow detected in keyspace of mask: ?h?h?h?h?h?h?h?h`

* *SOLUTION*
	* TBA

## Issue #2 - WINDOWS
1. If you see the following error,`./OpenCL/: No such file or directory`, do the following.
* *TERMINAL OUTPUT*
```bash
PS C:\Users\John\pwnagotchi-tools> hashcat --hash-type=22000 --attack-mode=0 --session Pizzaislife_a0648f5681d7_6450 --hwmon-temp-abort=100 -w 2 --potfile-path="./hashcat/pa0648f5681d7_6450-potfile.txt" --outfile="./hashcat/outputs/Pizzaislife_a0648f5681d7_6450-outfile.txt" "./handshakes/hccapx/Pizzaislife_a0648f5681d7.hc22000" --rules-file=".rule" -S "./wordlists/shortKrak.txt"
>>
hashcat (v6.2.6) starting

./OpenCL/: No such file or directory

Started: Mon Nov 13 02:02:16 2023
Stopped: Mon Nov 13 02:02:16 2023
```

* *ERROR*
	* `./OpenCL/: No such file or directory`

* *SOLUTION*
	* Ensure that `hashcat` is included in your `PATH`.

----

# LINKS
* [pwnagotchi.ai](https://pwnagotchi.ai/)
* Main Pwnagotchi repo: [Pwnagotchi](https://github.com/evilsocket/pwnagotchi)
	* Default Pwnagotchi configuration file: [defaults.toml](https://github.com/evilsocket/pwnagotchi/blob/master/pwnagotchi/defaults.toml)
* [Pwnagotchi setup on Mac OS](https://mattgibson.ca/pwnagotchi-1-6-2-with-waveshare-v3-macos-macbook-host/)

* Wordlists
	* [Weakpass](https://weakpass.com/wordlist)
	* https://notsosecure.com/one-rule-to-rule-them-all

* Rules
	* https://github.com/samirettali/password-cracking-rules
	* [KoreLogic's](https://contest-2010.korelogic.com/rules-hashcat.html)
