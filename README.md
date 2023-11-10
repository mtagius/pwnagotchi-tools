# Pwnagotchi-Tooling Refactor

In this repo I am refactoring the original [Pwnagotchi-Tooling](https://github.com/mtagius/pwnagotchi-tools) repo created by: [mtagius](https://github.com/mtagius)

My goal is to create an updated version of the Windows setup and a new OS X version.

----

Here is a series of scripts that will automate cracking WiFI handshake collected by a [Pwnagotchi](https://pwnagotchi.ai/).

<img src="./images/pwnagotchi.gif" width="500">

----

# Table of Contents
* [Windows Dependencies](#windows-dependencies)
* [Setup](#setup)
* [Running](#running)
* [Troubleshooting](#troubleshooting)

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
	fullProjectPath = "C:\Users\[XXXXXX]\pwnagotchi-tools\\"

	# The FULL path to your hashcat 6.x.x install. Even if hashcat is added to your path,
	# there are problems saving and accessing the session files when running hashcat
	# commands while not in the hashcat folder, so the full path is needed
	fullHashcatPath = "C:\Users\[XXXXXX]\hashcat-6.2.6\\"

	# the FULL path to where your wordlists are saved
	fullWordListPath = "C:\Users\[PATH_TO_REPO]\wordlists\\"
	```
3. `Pwnagotchi`
	1. TBA

## Wordlists
By default this repo does not contain any wordlists so you will need to download the ones you want to work with and place them in the `.\wordlists` folder.

### Personal Wordlist
* You can add your own passwords by cloning the example file and editing it.
	1. `cp .\known-wpa-passwords.txt.example .\wordlists\known-wpa-passwords.txt`

### Standalone Wordlists
* TBA

### Massive Wordlists
* TBA

----

# Running
1. Use your `Pwnagotchi` to collect WiFi handshakes.
2. Plug your `Pwnagotchi` into your computer and ensure the device is in manual (`MANU`) mode.
3. Run the `get-files-from-pwnagotchi.bat` file to copy the handshakes from your `Pwnagotchi`. This will place the handshakes in the `.\handshakes\pcap\` folder.
	1. `.\get-files-from-pwnagotchi.bat`
4. Build the Vagrant image:
	1. `cd vagrant`
	2. `vagrant up`
5. Move back to the root directory:
	1. `cd ..`
6. Run the `generate-hashcat-scripts.py` file to generate the necessary `.bat` scripts to run different `hashcat` attacks. There will be one `.bat` script for each of the WiFi handshake `.pcap` files for each of the different attack methods.
	1. `python .\generate-hashcat-scripts.py`
7. Run one of the `XXXXXX.bat` scripts in the `.\hashcat\scripts\` folder for a particular WiFi network. Depending on your graphics card, the full set of attacks for a specific WiFi network could take about a day to run.
	1. `.\hashcat\scripts\[XXXXXX].bat`
8. Run the `` file to see a printed list of all of the WiFi networks that have been cracked so far with their `SSID`s and passwords.
	1. `python .\print-final-results.py`

----

## Troubleshooting
* If you run into the following error, do the following:
	* `ERROR`
		```bash
		Timed out while waiting for the machine to boot.
		```

	* `SOLUTION`
		1. Ensure that Vagrant is running:
			* `vagrant global-status`
		2. Run:
			* `vagrant destroy -f`

* If you run into the foillowing error, do the following:
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
			fullProjectPath = "C:\Users\[XXXXXX]\pwnagotchi-tools\\"

			# The FULL path to your hashcat 6.x.x install. Even if hashcat is added to your path,
			# there are problems saving and accessing the session files when running hashcat
			# commands while not in the hashcat folder, so the full path is needed
			fullHashcatPath = "C:\Users\[XXXXXX]\hashcat-6.2.6\\"

			# the FULL path to where your wordlists are saved
			fullWordListPath = "C:\Users\[XXXXXX]\[PATH_TO_REPO]\wordlists\\"
			```
		2. Rerun: `python .\generate-hashcat-scripts.py`

* If you run into the following error, do the following:
	* `ERROR`
		```bash
		'hashcat' is not recognized as an internal or external command, operable program or batch file.
		```

	* `SOLUTION` - Make sure you downloaded the `Hashcat v6.2.6 binaries` NOT the `Hashcat v6.2.6 sources`.

----

# OLD

## What can this project do?

The [pwnagotchi](https://pwnagotchi.ai/) automates the process of capturing 4-way handshakes and other crackable material from wifi networks. This project fills in some of the gaps in the full process of wifi hacking after the pwnagotchi is used. Included here are scripts to:

* Copy all pcap files from the pwnagotchi onto your computer
* Convert those pcap files into pmkid/hccapx files that can be used with hashcat
* Keep a list of the pmkid/hccapx files and track if they have been cracked or if attempts to crack failed
* Generate hashcat scripts to run a set of [custom designed attacks](#Password-cracking-techniques) for WPA/WPA2 password cracking
* Optionally, provision a AWS EC2 P2 instance for running hashcat in the cloud

In short, these scripts will help you crack WPA/WPA2 passwords in the most automated way possible.

#### These tools were custom made to serve my purposes and as a result these scripts are written for Windows and contain dependencies on Python, Vagrant, Virtual Box, and of course, Hashcat. For example, to convert pcap files into pmkid/hccapx files Vagrant creates a headless Debian Linux VM, which is total overkill for someone already running Linux. To run this project on Linux the bat scripts, Vagrant script, and generate-hashcat-scripts.py would need to be converted.

#### This project is ONLY to be used for wifi security education in conjunction with a pwnagotchi. Hacking wifi networks you don't own is ILLEGAL and is not endorsed by this project.

### Wordlists

This project comes with no wordlists, so you will need download them yourself. If you do not download these lists then any wordlist attacks set up for hashcat will fail. All of these wordlists should be placed in the same folder of your choosing. The wordlist folder is configured in the `generate-hashcat-scripts.py` file.

* known-wpa-passwords.txt - This is your own personal list of your cracked wifi passwords.
* [netgear-spectrum.txt](https://raw.githubusercontent.com/soxrok2212/PSKracker/master/dicts/netgear-spectrum/netgear-spectrum.txt) - The repo for this list is [here](https://github.com/soxrok2212/PSKracker)
* [NAMES.DIC](https://www.outpost9.com/files/wordlists/names.zip)-  Any list of all lowercase first names can replace this.
* [words_alpha.txt](https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt) - Any list of all lowercase common words can replace this.
* [hashesorg2019](https://weakpass.com/wordlist/1851)
* [openwall.net-all.txt](https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/openwall.net-all.txt)
* [rockyou](https://github.com/praetorian-code/Hob0Rules/blob/master/wordlists/rockyou.txt.gz) - Literally the famous rockyou list. This is the first link I found online to download it.
* [Top24Million-WPA-probable-v2.txt](https://github.com/berzerk0/Probable-Wordlists/blob/master/Real-Passwords/WPA-Length/Real-Password-WPA-MegaLinks.md)
* [Top1pt8Billion-WPA-probable-v2.txt](https://github.com/berzerk0/Probable-Wordlists/blob/master/Real-Passwords/WPA-Length/Real-Password-WPA-MegaLinks.md)
* [passphrases.txt](https://initstring.keybase.pub/passphrase-wordlist/passphrases.txt?dl=1) - The repo for this list is [here](https://github.com/initstring/passphrase-wordlist).
* [Custom-WPA](https://weakpass.com/wordlist/490)
* [Super-WPA](https://weakpass.com/wordlist/500)
* [nerdlist.txt](https://github.com/tarahmarie/nerdlist/blob/master/nerdlist.txt)

### Configs

* Create an SSH key for your pwnagotchi (and optionally your AWS SSH key) and place it in the `ssh` folder. The SSH key for the pwnagotchi should be named `id_rsa`. The optional AWS SSH key should be named `aws.pem`
* If your pwnagotchi is not named `pwnagotchi` change the `pi@pwnagotchi.local` name in the `get-files-from-pwnagotchi.bat`

## Password cracking techniques

I have compiled a comprehensive list of attacks that includes many wordlist attacks, attacks that use the MAC address of the AP, attacks on router default passwords, and many brute force attacks. As passwords evolve this list will get less effective over time so, it is important to keep updating these attacks and to analyze your cracked passwords for new patterns and points of weakness. To help automate the process of using new attacks if you update the attack list in `generate-hashcat-scripts.py` and then run `generate-hashcat-scripts.py` new scripts will be generated for any networks listed as `waiting` in `network-cracked-status.json`.

| Attack | Keyspace | Notes |
|---|--:|---|
| known-wpa-passwords.txt quick-ssid.rule | ~1240 | known-wpa-passwords.txt is your list of cracked wifi passwords. Keyspace is calculated assuming a list of 20 passwords | 
| known-wpa-passwords.txt unix-ninja-leetspeak.rule | ~61420 | |
| known-wpa-passwords.txt rockyou-30000.rule | ~600000 | |
| known-wpa-passwords.txt d3ad0ne.rule | ~681980 | |
| nerdlist.txt quick-ssid.rule | 19220 | nerdlist.txt is a small (< 500) list of "nerdy" passwords and references like "hacktheplanet" |
| nerdlist.txt unix-ninja-leetspeak.rule | 9300000 | |
| nerdlist.txt rockyou-30000.rule | 9300000 | |
| nerdlist.txt d3ad0ne.rule | 10570690 | |
| bssid.rule | 225 | The BSSID (MAC Address) of the AP (router) with all combinations of uppercase/lowercase, with/without colons, and with all lengths of chars chopped off the end.  |
| ssid-ninja.rule | ~5300 | Uses `wordNinjaGenerator.py` to generate a wordlist from the ssid Ex: LuckyCoffeeWifi --> Lucky123! Keyspace is generated assuming a wordlist generated from the SSID with 100 words. |
| MYWIFI?d?d?d?d | 10000 | all default passwords for MYWIFI (EE) routers |
| wifi?d?d?d?d | 10000 | Ex: wifi1970 |
| -1 !@$??#~%^&*^^ wifi?d?d?d?1 | 10000 | Ex: wifi123! The charset looks weird because windows cmd chars must be escaped |
| wifi?d?d?d?d?d | 100000 | Ex: wifi12345 |
| ?d?d?d?dwifi | 10000 | Ex: 1989wifi |
| ?d?d?d?d?dwifi | 100000 | Ex: 12345wifi |
| WIFI?d?d?d?d | 10000 | Ex: WIFI2008 |
| -1 !@$??#~%^&*^^ WIFI?d?d?d?1 | 10000 | Ex: WIFI343@ |
| WIFI?d?d?d?d?d | 100000 | Ex: WIFI12345 |
| ?d?d?d?dWIFI | 10000 | Ex: 2006WIFI |
| ?d?d?d?d?dWIFI | 100000 | Ex: 12345WIFI |
| ?l?l?l?lwifi | 456976 | Ex: bookwifi |
| -1 !@$??#~%^&*^^ ?l?l?l?lwifi?1 | 4569760 | Ex: pinkwifi! |
| ?l?l?l?l?lwifi | 11881376 | Ex: trackwifi |
| wifi?l?l?l?l | 456976 | Ex: wificook |
| -1 !@$??#~%^&*^^ wifi?l?l?l?l?1 | 4569760 | Ex: wificafe$ |
| wifi?l?l?l?l?l | 11881376 | Ex: wififrogs |
| ?u?l?l?lWifi | 456976 | Ex: CafeWifi |
| ?u?l?l?l?lWifi | 11881376 | Ex: MarioWifi |
| ?u?u?u?uWIFI | 456976 | Ex: CAFEWIFI |
| -1 !@$??#~%^&*^^ ?u?u?u?uWIFI?1 | 4569760 | Ex: MECHWIFI# |
| ?u?u?u?u?uWIFI | 11881376 | Ex: BULLSWIFI |
| WIFI?u?u?u?u | 456976 | Ex: WIFISHOE |
| -1 !@$??#~%^&*^^ WIFI?u?u?u?u?1 | 4569760 | Ex: WIFIBOAT! |
| WIFI?u?u?u?u?u | 11881376 | Ex: WIFICOACH |
| NAMES.DIC names.rule | 2595058 | Ex: lukewifi2020 |
| words_alpha.txt names.rule | 34789776 | Ex: pizzawifi |
| 4-digit-append.rule | ~1111000 | Uses `wordNinjaGenerator.py` to append all 1-4 digit number combinations to ssid words Ex: MyCafeWifi --> CafeWifi2020 Keyspace is generated assuming a wordlist generated from the SSID with 100 words. |
| ?d?d?d?d?d?d?d?d | 100000000 | all 8 digit number combos |
| netgear-spectrum.txt ?d?d?d | 573348000 | MANY netgear and other routers have a default password that is a word + word + 1-3 digits. If I could only run 1 attack this is the one I would run. |
| netgear-spectrum.txt ?d | 5733480 | |
| netgear-spectrum.txt ?d?d | 57334800 | |
| openwall.net-all.txt quick-ssid.rule | 68651298 | simple wordlist |
| netgear-spectrum.txt quick-ssid.rule | 9845724 | Ex: breezyapplewifi |
| words_alpha.txt ?d | 3701040 | Ex: seashell1 |
| words_alpha.txt -1 !@$??#~%^&*^^ ?1 | 3701040 | Ex: seashell$ |
| words_alpha.txt -1 !@$??#~%^&*^^ ?d?1 | 37010400 | Ex: seashell1! |
| words_alpha.txt -1 !@$??#~%^&*^^ ?1?d | 37010400 | Ex: seashell!0 |
| words_alpha.txt ?d?d | 37010400 | Ex: seashell69 |
| words_alpha.txt -1 !@$??#~%^&*^^ ?d?d?1 | 370104000 | Ex: seashell92@ |
| words_alpha.txt ?d?d?d | 370104000 | Ex: seashell123 |
| ?l?l?l?l?l?l1! | 308915776 | Ex: slyfox1! |
| ?u?l?l?l?l?l1! | 308915776 | Ex: Slyfox1! |
| ?u?u?u?u?u?u1! | 308915776 | Ex: SLYFOX1! |
| ?d?d?d?d?d?d?d?d?d | 1000000000 | all 9 digit number combos |
| hashesorg2019 | 1279729139 | a modern wordlist with a great hit ratio |
| rockyou.txt quick-ssid.rule | 889352242 | rockyou is a classic wordlist. quick-ssid.rule has rules made for wifi cracking. It's worth noting that rockyou comes from a database dump and online account passwords are often different from wifi passwords. |
| NAMES.DIC rockyou-30000.rule | 828210000 | Ex: j0sh2009 |
| netgear-spectrum.txt unix-ninja-leetspeak.rule | 1760751708 | Ex: br33zyappl3 |
| Top1pt8Billion-WPA-probable-v2.txt | 1800000000 | Top1pt8Billion-WPA-probable-v2.txt is a popular wordlist. It claims to be 'WPA probable' but really they just cut out all passwords less then 8 chars. That doesn't make it wifi probable. |
| Top24Million-WPA-probable-v2.txt quick-ssid.rule | 1487550376 | |
| passphrases.txt passphrases.rule | 1441673030 | This is from the [passphrases repo](https://github.com/initstring/passphrase-wordlist). This SHOULD help with passwords like 'youshallnotpass' and 'maytheforcebewithyou' |
| Custom-WPA | 185866729 | This is a large wordlist. Ex: au7h0rized |
| Super-WPA | 982963903 | This is a large wordlist. Ex: au7h0rized |
| ?h?h?h?h?h?h?h?h | 4294967296 | MANY router default passwords are 8 hex chars (0-9,a-f) |
| ?H?H?H?H?H?H?H?H | 4294967296 | MANY router default passwords are 8 hex chars (0-9,A-F) |
| ?d?d?d?d?d?d?d?d?d?d | 10000000000 | This is, by far, the longest attack, but is covers ALL 10 digit number combos, which includes ALL US phone numbers and area codes. |
| Total: | 33,021,512,190 | At 375 kH/s (GTX 1080) it would take about 24.4 hours to run all attacks. |

## Some thoughts on wifi cracking and pwnagotchi

### What is wifi cracking

Specifically, `wifi cracking` is the process of obtaining the password to a wifi network. There is tremendous value in getting the wifi password for a network and here are some examples:
* Once you have the wifi password, you can decrypt the encryption the router placed on web traffic of devices connected to that wifi. Most sites will still use `https` so there is a whole other layer of encryption you will not break, but any sites using `http` will have their data sent in the clear.
* Once on a network you can scan for other vulnerable devices and interact with them. For example, you could play a video on a chromecast or turn on and off [smart switches.](https://github.com/softScheck/tplink-smartplug)
* Once you have the password you can place new devices on the network like a [signal owl](https://shop.hak5.org/products/signal-owl) to monitor devices, monitor traffic, and coordinate other attacks.
* You can have free internet access.

### The real difficulty of wifi cracking

I had passively heard about wifi cracking methods before I started this project from reading articles like these ([1](https://www.guru99.com/how-to-hack-wireless-networks.html), [2](https://medium.com/bugbountywriteup/how-i-hacked-into-my-neighbours-wifi-and-harvested-credentials-487fab106bfc), [3](https://thehackernews.com/2018/08/how-to-hack-wifi-password.html)). These articles explain that wifi cracking is as easy as capturing the wifi handshake and running a password cracker to get the password. This does little to explain that attempting to crack a WPA/WPA2 password is by far the hardest part of wifi cracking. In my experience the odds of successfully cracking a wifi password is about 40%, so wifi cracking is not as easy as these articles make it out to be. This process is so hard because WPA/WPA2 is very slow to crack and wifi passwords are hard to guess.

### WPA/WPA2 is a very slow algorithm to crack

WPA/WPA2 is slow to crack and each network is unique, much like if salts were used on a database list of password hashes, so there is no speed benefit to running an attack against several networks at once.

Lets look at how slow it takes to crack WPA/WPA2 compared to other hashes. I used H/s to further show how slow it is to crack WPA/WPA2.

##### GeForce GTX 1060 6GB:
| Hash | Speed (H/s) |
|---|--:|
| MD5 | 11,560,200,000 H/s |
| SHA2-256 | 1,478,300,000 H/s |
| WPA2 | 205,800 H/s |

##### AWS p2.16xlarge 16 GPU Instance:
| Hash | Speed (H/s) |
|---|--:|
| MD5 | 73,286,500,000 H/s |
| SHA2-256 | 12,275,600,000 H/s |
| WPA2 | 1,316,200 H/s |

Let's say you wanted to run a mask attack in hashcat against a WPA2 handshake for the mask `?d?d?d?d?d?d?d?d?d?d` (all 10 digit combos). This attack would take about 13.5 hours to run on a GTX 1060. By comparison, the same 10 digit attack against a SHA2-256 hash would take about 7 seconds to run. Due to the complexity it takes to calculate WPA2, it takes WAY more time to run attacks against it than it takes to run attacks against many other hashes.

### Wifi passwords are hard to guess

Decades of database dumps and hundreds of millions of leaked passwords create a huge sample size to learn from that has given password crackers wordlists, techniques, and strategies to crack passwords used in online accounts. Wifi passwords are often not similar to online account passwords and sample sizes of leaked passwords for home and office wifi routers is MUCH smaller. As a result, most traditional wordlists and cracking strategies designed for online accounts are not useful for wifi passwords.

Many [WPA wordlists](https://github.com/berzerk0/Probable-Wordlists/tree/master/Real-Passwords/WPA-Length) are just regular wordlists from online accounts with all passwords removed that are under 8 characters because WPA has an 8 character minimum. So, those lists still don't source their data from real wifi passwords and can miss the mark a bit.

It's not all bad news. Wifi passwords are often created to be shared. So, while an online account password might look like this `pAri$lover252!` a wifi password might look more like this `jakeswifi1` because it is shared to guests to give wifi access. In many cases that means wifi passwords are less complex, so they can be easier to crack. However, that also means the wifi passwords that are complex are often complex in ways we don't have enough of a sample size to create wordlists or strategies for.

The other good news is that many wifi networks use the default password provided by the AP (router) and the [keyspace for most router default passwords is known.](https://github.com/soxrok2212/PSKracker/blob/master/keyspace.md) Some of these defaults are super easy to attack, like the ones that are just 8 digits, so in under 10 minutes you can run through all combinations. However, a default password made with 10 lowercase hex characters will take about 2 months to run through all combinations.

When you combine the horrendous cracking speed of WPA/WPA2 that makes running attacks slow and the need to run many attacks because there is not a big enough sample size of leaked wifi passwords to nail down reliable wordlists or strategies it's not a surprise wifi password cracking is pretty tough.

### The advantage of using pwnagotchi

The real advantage of using pwnagotchi is that it can automatically collect data from dozens of wifi networks to get a large sample size and then the lowest hanging fruit from those networks can be cracked. You get the best odds of cracking a few networks without all the waste of manually capturing the wifi handshake just to be unsuccessful at cracking the password. So, I made this project to best automate the process of password cracking batches of handshakes the pwnagotchi has collected.

## Credit

* Thank you Danie Conradie for writing a nice article on [hackaday](https://hackaday.com/2020/09/30/automated-tools-for-wifi-cracking/) about this project!
* Thanks to CyrisXD for writing [Pwnagetty](https://github.com/CyrisXD/Pwnagetty). I use Pwnagetty to convert pcap files to pmkid/hccapx files. I modified the script so much it hardly looks like the original, but still, thank you CyrisXD.
* I made liberal use of the WPA/WPA2 password cracking techniques from [PSKracker](https://github.com/soxrok2212/PSKracker) by soxrok2212. To discover wordlist words for default passwords soxrok2212 searches for wifi routers on ebay and then looks at the photos to find default passwords written on the serial number sticker. That's brilliant!
* I totally got the idea to use [word ninja](https://github.com/keredson/wordninja) on the ssid from dizcza's [repo.](https://github.com/dizcza/hashcat-wpa-server)
* I used the hashcat rules and wordlists for complex passwords from initstring's [repo.](https://github.com/initstring/passphrase-wordlist)
* The [pwnagotchi](https://pwnagotchi.ai/) project was created by [evilsocket](https://twitter.com/evilsocket) and [hexwaxwing](https://twitter.com/gniwxawxeh). Unfortunately, very serious allegations that evilsocket domestically abused hexwaxwing have brought to light disturbing behavior I cannot support. As a result, many references to evilsocket on this page have been removed.
