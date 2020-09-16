# Pwnagotchi Tools

A series of scripts that automate password cracking wifi handshakes collected from a [pwnagotchi.](https://pwnagotchi.ai/)

<img src="images/pwnagotchi.gif" width="500">

## Table of Contents
* [What can this project do?](#What-can-this-project-do?)
* [Usage](#Usage)
* [Installation](#Installation)
* [Password cracking techniques](#Password-cracking-techniques)
* [Some thoughts on wifi cracking and pwnagotchi](#Some-thoughts-on-wifi-cracking-and-pwnagotchi)
* [Credit](#Credit)

## What can this project do?

The [pwnagotchi](https://pwnagotchi.ai/) automates the process of capturing 4-way handshakes and other crackable material from wifi networks. This project fills in some of the gaps in the full process of wifi hacking after the pwnagotchi is used. Included here are scripts to:

* Copy all pcap files from the pwnagotchi onto your computer
* Convert those pcap files into pmkid/hccapx files that can be used with hashcat
* Keep a list of the pmkid/hccapx files and track if they have been cracked or if attempts to crack failed
* Generate hashcat scripts to run a set of [custom designed attacks](#Password-cracking-techniques) for WPA/WPA2 password cracking
* Optionally, provision a AWS EC2 P2 instance for running hashcat in the cloud

In short, these scripts will help you crack WPA/WPA2 passwords in the most automated way possible.

#### These tools were custom made to serve my purposes and as a result these scripts are written for Windows and contain dependencies on Python, Vagrant, Virtual Box, and of course, Hashcat. For example, to convert pcap files into pmkid/hccapx files Vagrant creates a headless Kali Linux VM, which is total overkill for someone already running Linux. To run this project on Linux the bat scripts, Vagrant script, and generate-hashcat-scripts.py would need to be converted.

#### This project is ONLY to be used for wifi security education in conjunction with a pwnagotchi. Hacking wifi networks you don't own is ILLEGAL and is not endorsed by this project.

## Usage

1. Use your pwnagotchi to collect wifi handshakes.
1. Plug your pwnagotchi into your computer and place the device in manual mode. You will see the "MANU" icon on the bottom right of its screen.
1. Run `get-files-from-pwnagotchi.bat`  This will copy the pcap files off of your device and place them in the `handshakes/pcap` folder.
1. Run `cd vagrant` to change into the vagrant folder. Then run `vagrant up`. This will create a headless kali VM that will install and run the tools needed to convert pcap files into crackable pmkid/hccapx files.
1. Once that has finished run `vagrant destroy -f` to delete the VM and run `cd ..` to get back to the root folder.
1. Run `python generate-hashcat-scripts.py` to generate the bat scripts you will use to run the [custom WPA/WPA2 hashcat attacks](#Password-cracking-techniques) included in this repo.
1. Run any of the newly created bat scripts found in the `hashcat/scripts` folder. There will be one script for each wifi network the pwnagotchi collected crackable data for. Depending on your graphics card, the full attack could take about a day to run per wifi network.
1. Run `python generate-final-results.py` to see a printed list of all the wifi networks that have been cracked so far with their SSIDs and passwords.

* Optionally, at any point run `python get-next-hashcat-script` to print some stats of the wifi networks being tracked in `network-cracked-status.json`

### Optionally running hashcat on an AWS EC2 P2 instance

Amazon offers 3 kinds of [EC2 P2](https://aws.amazon.com/ec2/instance-types/p2/) instances with with 1, 8, or 16 GPUs. This is very valuable because cracking WPA/WPA2 is VERY slow and the more power you can add the better. It's expensive, at roughly $1 an hour per GPU, but using 16 GPUs at once you can run the full attack included in this repo in under 7 hours, when it may take a day and a half with 1 consumer GPU. [Here](https://medium.com/@iraklis/running-hashcat-in-amazons-aws-new-16-gpu-p2-16xlarge-instance-9963f607164c) is more of an explanation about running hashcat on AWS P2 instances. 

In this repo is the `aws` folder which contains scripts to help run hashcat on an AWS P2 instance.
* `move-files-to-aws.bat` will copy files to an aws instance. A ssh key named `aws.pem` must be in the `ssh` folder and the AWS instance id must replace the id included in the file. This file is missing the code to copy wordlists and pmkid/hccapx files.
* `get-files-from-aws.bat` will download the hashcat output, potfile, and session files. It also needs a ssh key named `aws.pem` in the `ssh` folder and the AWS instance id must replace the id included in the file.
* `aws-initial-provision.sh` is a bash script to provision an aws p2 instance and install hashcat.
* `set-nvidia-settings.sh` is a bash script to set the nvidia settings after hashcat has been installed.

## Installation

### Dependencies

* Windows (This is because bat files are used, but they can be converted to bash scripts to get this running on Linux)
* Python 3.x
* [Vagrant](https://www.vagrantup.com/) Vagrant and Virtual Box are only used to convert pcap files to hccapx/pmkid files
* [Virtual Box](https://www.virtualbox.org/)
* [Hashcat v6.0.0](https://hashcat.net/hashcat/) You don't really need version 6.0.0, but at the time of this release version 6.0.0 introduced 13.35% speed improvements on WPA/WPA2 cracking, so for this project it's a waste not to use at least version 6.0.0
* [Word Ninja](https://github.com/keredson/wordninja)

### Wordlists

This project comes with no wordlists, so you will need download them yourself. If you do not do this any wordlist attacks set up for hashcat will fail. All of these wordlists should be placed in the same folder.

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

### Configs

* Create an SSH key for your pwnagotchi (and optionally your AWS SSH key) and place it in the `ssh` folder. The SSH key for the pwnagotchi should be named `id_rsa`. The optional AWS SSH key should be named `aws.pem`
* If your pwnagotchi is not named `pwnagotchi` change the `pi@pwnagotchi.local` name in the `get-files-from-pwnagotchi.bat`
* `generate-hashcat-scripts.py`
  * Change the value for `fullProjectPath` to the FULL path to this `pwnagotchi-tools` folder
  * Change the value for `fullHashcatPath` to the FULL path to your hashcat install folder
  * Change the value for `fullWordListPath` to the FULL path to the folder where all of your wordlists are saved 

## Password cracking techniques

I have compiled a comprehensive list of attacks that includes many wordlist attacks, attacks that use the MAC address of the AP, attacks on router default passwords, and many brute force attacks. As passwords evolve this list will get less effective over time so, it is important to keep updating these attacks and to analyze your cracked passwords for new patterns and points of weakness. To help automate the process of using new attacks if you update the attack list in `generate-hashcat-scripts.py` and then run `generate-hashcat-scripts.py` new scripts will be generated for any networks listed as `waiting` in `network-cracked-status.json`.

| Attack | Keyspace | Notes |
|---|--:|---|
| known-wpa-passwords.txt quick-ssid.rule | ~1200 | known-wpa-passwords.txt is your list of cracked wifi passwords. Keyspace is calculated assuming a list of 20 passwords | 
| known-wpa-passwords.txt unix-ninja-leetspeak.rule | ~61420 | |
| known-wpa-passwords.txt rockyou-30000.rule | ~600000 | |
| known-wpa-passwords.txt d3ad0ne.rule | ~681980 | |
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
| netgear-spectrum.txt ?d?d?d | 158802000 | MANY netgear and other routers have a default password that is a word + word + 1-3 digits. If I could only run 1 attack this is the one I would run. |
| netgear-spectrum.txt ?d | 1588020 | |
| netgear-spectrum.txt ?d?d | 15880200 | |
| NAMES.DIC names.rule | 2595058 | Ex: lukewifi2020 |
| words_alpha.txt names.rule | 34789776 | Ex: pizzawifi |
| 4-digit-append.rule | ~1111000 | Uses `wordNinjaGenerator.py` to append all 1-4 digit number combinations to ssid words Ex: MyCafeWifi --> CafeWifi2020 Keyspace is generated assuming a wordlist generated from the SSID with 100 words. |
| ?d?d?d?d?d?d?d?d | 100000000 | all 8 digit number combos |
| openwall.net-all.txt quick-ssid.rule | 66436740 | simple wordlist |
| netgear-spectrum.txt quick-ssid.rule | 9528120 | Ex: breezyapplewifi |
| words_alpha.txt ?d | 3701040 | Ex: seashell1 |
| words_alpha.txt -1 !@$??#~%^&*^^ ?1 | 3701040 | Ex: seashell$ |
| words_alpha.txt -1 !@$??#~%^&*^^ ?d?1 | 37010400 | Ex: seashell1! |
| words_alpha.txt -1 !@$??#~%^&*^^ ?1?d | 37010400 | Ex: seashell!0 |
| words_alpha.txt ?d?d | 37010400 | Ex: seashell69 |
| words_alpha.txt -1 !@$??#~%^&*^^ ?d?d?1 | 370104000 | Ex: seashell92@ |
| words_alpha.txt ?d?d?d | 370104000 | Ex: seashell123 |
| ?d?d?d?d?d?d?d?d?d | 1000000000 | all 9 digit number combos |
| hashesorg2019 | 1279729139 | a modern wordlist with a great hit ratio |
| rockyou.txt quick-ssid.rule | 860663460 | rockyou is a classic wordlist. quick-ssid.rule has rules made for wifi cracking. It's worth noting that rockyou comes from a database dump and online account passwords are often different from wifi passwords. |
| NAMES.DIC rockyou-30000.rule | 828210000 | Ex: j0sh2009 |
| netgear-spectrum.txt unix-ninja-leetspeak.rule | 487680942 | Ex: br33zyappl3 |
| netgear-spectrum.txt ?d?d?d?d | 1588020000 | Ex: breezyapple2020 |
| Top1pt8Billion-WPA-probable-v2.txt | 1800000000 | Top1pt8Billion-WPA-probable-v2.txt is a popular wordlist. It claims to be 'WPA probable' but really they just cut out all passwords less then 8 chars. That doesn't make it wifi probable. |
| Top24Million-WPA-probable-v2.txt quick-ssid.rule | 1439564880 | |
| passphrases.txt passphrases.rule | 1441673030 | This is from the [passphrases repo](https://github.com/initstring/passphrase-wordlist). This SHOULD help with passwords like 'youshallnotpass' and 'maytheforcebewithyou' |
| Custom-WPA | 185866729 | This is a large wordlist. Ex: au7h0rized |
| Super-WPA | 982963903 | This is a large wordlist. Ex: au7h0rized |
| ?h?h?h?h?h?h?h?h | 4294967296 | MANY router default passwords are 8 hex chars (0-9,a-f) |
| ?H?H?H?H?H?H?H?H | 4294967296 | MANY router default passwords are 8 hex chars (0-9,A-F) |
| ?d?d?d?d?d?d?d?d?d?d | 10000000000 | This is, by far, the longest attack, but is covers ALL 10 digit number combos, which includes ALL US phone numbers and area codes. |
| Total: | 31,815,469,794 | At 290 kH/s (GTX 1070 FE) it would take 30.5 hours to run all attacks. At 390 kH/s (GTX 1080 FE) it would take 22.7 hours to run all attacks. |

## Some thoughts on wifi cracking and pwnagotchi

### What is wifi cracking

Specifically, `wifi cracking` is the process of obtaining the password to a wifi network. There is tremendous value in getting the wifi password for a network and here are some examples:
* Once you have the wifi password, you can decrypt the encryption the router placed on web traffic of devices connected to that wifi. Most sites will still use `https` so there is a whole other layer of encryption you will not break, but any sites using `http` will have their data sent in the clear.
* Once on a network you can scan for other vulnerable devices and interact with them. For example, you could play a video on a chromecast or turn on and off [smart switches.](https://github.com/softScheck/tplink-smartplug)
* Once you have the password you can place new devices on the network like a [signal owl](https://shop.hak5.org/products/signal-owl) to monitor devices, monitor traffic, and coordinate other attacks.
* You can have free internet access.

### The real difficulty of wifi cracking

I had passively heard about wifi cracking methods before I started this project from reading articles like these ([1](https://www.guru99.com/how-to-hack-wireless-networks.html), [2](https://medium.com/bugbountywriteup/how-i-hacked-into-my-neighbours-wifi-and-harvested-credentials-487fab106bfc), [3](https://thehackernews.com/2018/08/how-to-hack-wifi-password.html)). These articles explain that wifi cracking is as easy as capturing the wifi handshake and running a password cracker to get the password. This does little to explain that attempting to crack a WPA/WPA2 password is by far the hardest part of wifi cracking. In my experience the odds of successfully cracking a wifi password is far less than 40%, so wifi cracking is not as easy as these articles make it out to be. This process is so hard because WPA/WPA2 is very slow to crack and wifi passwords are hard to guess.

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

* Thanks to CyrisXD for writing [Pwnagetty](https://github.com/CyrisXD/Pwnagetty). I use Pwnagetty to convert pcap files to pmkid/hccapx files. I modified the script so much it hardly looks like the original, but still, thank you CyrisXD.
* I made liberal use of the WPA/WPA2 password cracking techniques from [PSKracker](https://github.com/soxrok2212/PSKracker) by soxrok2212. To discover wordlist words for default passwords soxrok2212 searches for wifi routers on ebay and then looks at the photos to find default passwords written on the serial number sticker. That's brilliant!
* I totally got the idea to use [word ninja](https://github.com/keredson/wordninja) on the ssid from dizcza's [repo.](https://github.com/dizcza/hashcat-wpa-server)
* I used the hashcat rules and wordlists for complex passwords from initstring's [repo.](https://github.com/initstring/passphrase-wordlist)
* The [pwnagotchi](https://pwnagotchi.ai/) project was created by [evilsocket](https://twitter.com/evilsocket) and [hexwaxwing](https://twitter.com/gniwxawxeh). Unfortunately, very serious allegations that evilsocket domestically abused hexwaxwing have brought to light disturbing behavior I cannot support. As a result, many references to evilsocket on this page have been removed.
