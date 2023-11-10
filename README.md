# Pwnagotchi-Tooling Refactor

In this repo I am refactoring the original [Pwnagotchi-Tooling](https://github.com/mtagius/pwnagotchi-tools) repo created by: [mtagius](https://github.com/mtagius)

My goal is to create an updated version of the Windows setup and a new OS X version.

----

<img src="./images/pwnagotchi.gif" width="500">

----

# Purpose
With this repo you will be able to generate a series of `.bat` scripts that will help you automate the cracking process for WiFI handshake collected by a [Pwnagotchi](https://pwnagotchi.ai/).

----

# Table of Contents
* [Windows Dependencies](#windows-dependencies)
* [Setup](#setup)
	* [Configuration](#configuration)
	* [Wordlists](#wordlists)
* [Running](#running)
* [Troubleshooting](#troubleshooting)
* [Clean-Up](#clean-up)

----

# Windows Dependencies
* [Python 3.x](https://www.python.org/downloads/windows/)
* [Vagrant](https://developer.hashicorp.com/vagrant/install)
* [Virtual Box](https://www.virtualbox.org/wiki/Downloads)
	* Vagrant and Virtual Box are only used to convert `.pcap` files to the corresponding `.hccapx`/`.pmkid` files.
	* Corresponding file locations:
		* `.pcap`: `.\handshakes\pcap\`
		* `.hccapx`: `.\handshakes\hccapx\`
		* `.pmkid`: `.\handshakes\pmkid\` 
* [Hashcat v6.2.6 binaries](https://hashcat.net/hashcat/)
	* Make note of the `PATH` to where you unpacked `Hashcat`.
		* Example: `C:\Users\XXXXXX\hashcat-6.2.6`
* [Word Ninja](https://github.com/keredson/wordninja/)
	* `pip install wordninja`
* [Tabulate](https://github.com/gregbanks/python-tabulate/)
	* `pip install tabulate`

----

# Setup
## Configuration
1. Clone the `generate-hashcat-scripts.py.example` file.
	1. `cp .\generate-hashcat-scripts.py.example .\generate-hashcat-scripts.py`
2. Edit the `generate-hashcat-scripts.py` file setting the file paths for the following variables (Ensure the file pathes end in `\\` so that the generated file pathes are correct):
	```Python
	# The FULL path to the 'pwnagotchi-tools' folder in this repo
	fullProjectPath = r"C:\Users\[XXXXXX]\pwnagotchi-tools\\"

	# The FULL path to your hashcat 6.x.x install. Even if hashcat is added to your path,
	# there are problems saving and accessing the session files when running hashcat
	# commands while not in the hashcat folder, so the full path is needed
	fullHashcatPath = r"C:\Users\[XXXXXX]\hashcat-6.2.6\\"

	# the FULL path to where your wordlists are saved
	fullWordListPath = r"C:\Users\[PATH_TO_REPO]\wordlists\\"
	```
3. `Pwnagotchi`
	1. TBA

## Wordlists
By default this repo does not contain any wordlists so you will need to download the ones you want to work with and place them in the `.\wordlists` folder.

### Personal Wordlist
* You can add your own passwords by cloning the example file and editing it.
	1. `cp .\known-wpa-passwords.txt.example .\wordlists\known-wpa-passwords.txt`

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

### Misc
* [Original](https://github.com/praetorian-inc/Hob0Rules/tree/master/wordlists)

----

# Running
1. Use your `Pwnagotchi` to collect WiFi handshakes.
2. Plug your `Pwnagotchi` into your computer and ensure the device is in manual (`MANU`) mode.
3. Run the `get-files-from-pwnagotchi.bat` script to copy the handshakes from your `Pwnagotchi`. This will place the handshakes in the `.\handshakes\pcap\` folder.
	1. `.\get-files-from-pwnagotchi.bat`
4. Build the Vagrant image.
	1. `cd .\vagrant`
	2. `vagrant up`
5. Move back to the root directory.
	1. `cd ..`
6. Run the `generate-hashcat-scripts.py` script to generate the necessary `.bat` scripts to run different `hashcat` attacks. There will be one `.bat` script for each of the WiFi handshake `.pcap` files for each of the different attack methods.
	1. `python .\generate-hashcat-scripts.py`
7. Run one of the `XXXXXX.bat` scripts in the `.\hashcat\scripts\` folder for a particular WiFi network. Depending on your graphics card, the full set of attacks for a specific WiFi network could take about a day to run.
	1. `.\hashcat\scripts\[XXXXXX].bat`
8. Run the `print-final-results.py` script to see a printed list of all of the WiFi networks that have been cracked so far with their `SSID`s and passwords.
	1. `python .\print-final-results.py`

----

## Troubleshooting
* If you run into the following `Vagrant` errors, do the following:
	1. `ERROR`
		```bash
		Timed out while waiting for the machine to boot.
		```

		* `SOLUTION`
			1. Ensure that Vagrant is running:
				* `vagrant global-status`
			2. Run:
				* `vagrant destroy -f`

	2. `ERROR`
		```
		default: Processing triggers for man-db (2.9.4-2) ...
		default: 
		default: ================================================================================
		default: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		default: ================================================================================
		default:
		default:                            SCRIPT DEPRECATION WARNING
		default:
		default:
		default:   This script, located at https://deb.nodesource.com/setup_X, used to
		default:   install Node.js is deprecated now and will eventually be made inactive.
		default:
		default:   Please visit the NodeSource distributions Github and follow the
		default:   instructions to migrate your repo.
		default:   https://github.com/nodesource/distributions
		default:
		default:   The NodeSource Node.js Linux distributions GitHub repository contains
		default:   information about which versions of Node.js and which Linux distributions
		default:   are supported and how to install it.
		default:   https://github.com/nodesource/distributions
		default:
		default: 
		default:                           SCRIPT DEPRECATION WARNING
		default:
		default: ================================================================================
		default: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
		default: ================================================================================
		default:
		default: TO AVOID THIS WAIT MIGRATE THE SCRIPT
		default: Continuing in 60 seconds (press Ctrl-C to abort) ...
		default:
		```

		* `SOLUTION` - Ignore it for now.

	3. `ERROR`
		```bash
		Bringing machine 'default' up with 'virtualbox' provider...
		==> default: Machine already provisioned. Run `vagrant provision` or use the `--provision`
		==> default: flag to force provisioning. Provisioners marked to run always will still run.

		==> default: Machine 'default' has a post `vagrant up` message. This is a message
		==> default: from the creator of the Vagrantfile, and not from Vagrant itself:
		==> default:
		==> default: Vanilla Debian box. See https://app.vagrantup.com/debian for help and bug reports
		```

		* `SOLUTION` - TBA.

* If you run into the following error, do the following:
	* `ERROR`
		```bash
		The error message "SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes in position 2-3: truncated \UXXXXXXXX escape" means that Python is trying to decode a Unicode escape sequence that is incomplete or invalid. The \UXXXXXXXX escape sequence is used to represent a Unicode character with a hexadecimal code point greater than 0xFFFF.
		```

	* `SOLUTION` - Add an `r` infront of the filepath `""`:
		```Python
		# The FULL path to the 'pwnagotchi-tools' folder in this repo
		fullProjectPath = r"C:\Users\[XXXXXX]\pwnagotchi-tools\\"

		# The FULL path to your hashcat 6.x.x install. Even if hashcat is added to your path,
		# there are problems saving and accessing the session files when running hashcat
		# commands while not in the hashcat folder, so the full path is needed
		fullHashcatPath = r"C:\Users\[XXXXXX]\hashcat-6.2.6\\"

		# the FULL path to where your wordlists are saved
		fullWordListPath = r"C:\Users\[XXXXXX]\[PATH_TO_REPO]\wordlists\\"
		```

* If you run into the following error, do the following:
	* `ERROR`
		```bash
		C:\Users\[XXXXXXX]\Documents\GitHub\pwnagotchi-tools\wordlistsknown-wpa-passwords.txt: No such file or directory
		```

	* `SOLUTION`
		1. Ensure the file pathes in the `generate-hashcat-scripts.py` file end with `\\`:
			```Python
			# The FULL path to the 'pwnagotchi-tools' folder in this repo
			fullProjectPath = r"C:\Users\[XXXXXX]\pwnagotchi-tools\\"

			# The FULL path to your hashcat 6.x.x install. Even if hashcat is added to your path,
			# there are problems saving and accessing the session files when running hashcat
			# commands while not in the hashcat folder, so the full path is needed
			fullHashcatPath = r"C:\Users\[XXXXXX]\hashcat-6.2.6\\"

			# the FULL path to where your wordlists are saved
			fullWordListPath = r"C:\Users\[XXXXXX]\[PATH_TO_REPO]\wordlists\\"
			```
		2. Rerun: `python .\generate-hashcat-scripts.py`

* If you run into the following error, do the following:
	* `ERROR`
		```bash
		'hashcat' is not recognized as an internal or external command, operable program or batch file.
		```

	* `SOLUTION` - Make sure you downloaded the `Hashcat v6.2.6 binaries` NOT the `Hashcat v6.2.6 sources`.

----

### Clean-Up
* Delete the Vagrant image.
	1. `vagrant destroy -f`

* Delete the generated files.
	1. TBA
