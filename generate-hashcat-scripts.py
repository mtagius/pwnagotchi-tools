# Import configurations from config.py
from config import (
    HASHCAT_PATH,
	PROJECT_PATH,
	WORDLIST_PATH,
	HASHCAT_SCRIPT_VERSION,
	TEMP_ABORT,
	WORKLOAD_PROFILE,
	HASHCAT_POTFILE_PATH,
	HASHCAT_OUTPUT_PATH,
	RULE_PATH,
	WORD_NINJA_PATH
)

import os
import re
import argparse
import sys
import json
import time

from random import randint

# Global data
network_cracked_status_data = {}
network_bssid_data = {}
session_scripts = []

if len(sys.argv) > 1:
    filename = sys.argv[1]
else:
    # If no filename provided, process all files in the folder
    filenames = [f for f in os.listdir("./handshakes/pmkid") if f.endswith(".pmkid")]
    if not filenames:
        print("No .pmkid files found in the folder.")
        sys.exit(1)
    print(f"Processing all .pmkid files in the folder: {filenames}")

def update_network_cracked_status(status):
	global filename
	network_cracked_status_data = {}

	with open('network-cracked-status.json') as f:
		network_cracked_status_data = json.load(f)

	# Check if the key exists before updating the status
	if filename in network_cracked_status_data:
		network_cracked_status_data[filename]['status'] = status
		with open('network-cracked-status.json', 'w') as f:
			json.dump(network_cracked_status_data, f, indent=4)
		print("\n" + filename)
		if status == "cracked":
			print('''
			▄▄· ▄▄▄   ▄▄▄·  ▄▄· ▄ •▄ ▄▄▄ .·▄▄▄▄  
			▐█ ▌▪▀▄ █·▐█ ▀█ ▐█ ▌▪█▌▄▌▪▀▄.▀·██▪ ██ 
			██ ▄▄▐▀▀▄ ▄█▀▀█ ██ ▄▄▐▀▀▄·▐▀▀▪▄▐█· ▐█▌
			▐███▌▐█•█▌▐█ ▪▐▌▐███▌▐█.█▌▐█▄▄▌██. ██ 
			·▀▀▀ .▀  ▀ ▀  ▀ ·▀▀▀ ·▀  ▀ ▀▀▀ ▀▀▀▀▀• 
			''')
		else:
			print('''
			▄▄▄ .▐▄• ▄  ▄ .▄ ▄▄▄· ▄• ▄▌.▄▄ · ▄▄▄▄▄▄▄▄ .·▄▄▄▄  
			▀▄.▀· █▌█▌▪██▪▐█▐█ ▀█ █▪██▌▐█ ▀. •██  ▀▄.▀·██▪ ██ 
			▐▀▀▪▄ ·██· ██▀▐█▄█▀▀█ █▌▐█▌▄▀▀▀█▄ ▐█.▪▐▀▀▪▄▐█· ▐█▌
			▐█▄▄▌▪▐█·█▌██▌▐▀▐█ ▪▐▌▐█▄█▌▐█▄▪▐█ ▐█▌·▐█▄▄▌██. ██ 
			▀▀▀ •▀▀ ▀▀▀▀▀ · ▀  ▀  ▀▀▀  ▀▀▀▀  ▀▀▀  ▀▀▀ ▀▀▀▀▀• 
			''')  
		time.sleep(15)
	else:
		print(f"{filename} not found in network-cracked-status.json")

def generate_hashcat_script(filename, override=False):
	global HASHCAT_SCRIPT_VERSION
	global session_scripts
	global PROJECT_PATH
	global HASHCAT_PATH
	global WORDLIST_PATH

	ssid = filename.split("_")[0]
	session = ""
	hash_type = ""
	file_id = ""

	if ".hc22000" in filename:
		hash_type = "-m 22000"
		file_id = filename.split(".hc22000")[0]
	else:
		hash_type = "-m 22000"
		file_id = filename.split(".pmkid")[0]
	session = "--session " + file_id

	# Check if the file is already tracked and override is False
	if not override and filename in network_cracked_status_data:
		print(f"{filename} is already being tracked.")
		return

	attacks = [
		["-a 0", "known-wpa-passwords.txt", "quick-ssid.rule"],
		["-a 3", "-1 !@$??#~%^&*^^ wifi?d?d?d?1"],
		["-a 6", "known-wpa-passwords.txt", "-1 !@$??#~%^&*^^ ?d?d?1"]
	]

	f = open("./hashcat/scripts/" + file_id + ".bat", "w")
	script = f":: {HASHCAT_SCRIPT_VERSION}\n"
	script += f'cd {" /d " if PROJECT_PATH[0] != HASHCAT_PATH[0] else ""}"{HASHCAT_PATH}"\n'

	for attack in attacks:
		hashcat_command = f'hashcat {attack[0]} {hash_type} {session}_{randint(1000, 9999)} {TEMP_ABORT} {WORKLOAD_PROFILE}'

		if "0" in attack[0]:
			if "bssid.rule" in attack[2]:
				hashcat_command += f'echo {get_bssid(filename)} |'
			elif "ssid-ninja.rule" in attack[2] or "4-digit-append.rule" in attack[2]:
				hashcat_command += f'python "{WORD_NINJA_PATH}\\wordNinjaGenerator.py" {ssid} |'

		hashcat_command += f' {hash_type} {session}_{randint(1000, 9999)} {TEMP_ABORT} {WORKLOAD_PROFILE} {HASHCAT_OUTPUT_PATH} {HASHCAT_POTFILE_PATH}'

		if "0" in attack[0]:
			if "bssid.rule" in attack[2]:
				hashcat_command += f' -r "{RULE_PATH}{attack[2]}"'
			elif "ssid-ninja.rule" in attack[2] or "4-digit-append.rule" in attack[2]:
				hashcat_command += f' -r "{RULE_PATH}{attack[2]}"'
			else:
				hashcat_command += f' "{WORDLIST_PATH}{attack[1]}"'
				if len(attack) > 2:
					hashcat_command += f' -r "{RULE_PATH}{attack[2]}"'
		elif "1" in attack[0]:
			hashcat_command += f' "{WORDLIST_PATH}{attack[1]}" "{WORDLIST_PATH}{attack[2]}"'
		elif "3" in attack[0]:
			hashcat_command += f' {attack[1]}'
		elif "6" in attack[0]:
			hashcat_command += f' "{WORDLIST_PATH}{attack[1]}" {attack[2]}'

		script += hashcat_command + "\n"

	f.write(script)
	f.close()

	session_scripts.append(file_id + ".bat")
	update_network_cracked_status("exhausted")

def process_attack_type_0(attack, hashcat_command, ssid):
	global filename
	if "bssid.rule" in attack[1]:
		return f'echo {get_bssid(filename)} | {hashcat_command} -r "{RULE_PATH}{attack[1]}"'
	elif ("ssid-ninja.rule" in attack[1]) or ("4-digit-append.rule" in attack[1]):
		return f'python "{WORD_NINJA_PATH}\\wordNinjaGenerator.py" {ssid} | {hashcat_command} -r "{RULE_PATH}{attack[1]}"'
	else:
		return process_wordlist_attack(attack, hashcat_command)

def process_attack_type_1(attack, hashcat_command):
	return f'{hashcat_command} "{WORDLIST_PATH}{attack[1]}" "{WORDLIST_PATH}{attack[2]}"'

def process_attack_type_3(attack, hashcat_command):
	return f'{hashcat_command} {attack[1]}'

def process_attack_type_6(attack, hashcat_command):
	return f'{hashcat_command} "{WORDLIST_PATH}{attack[1]}" {attack[2]}'

def process_wordlist_attack(attack, hashcat_command):
	hashcat_command += f' "{WORDLIST_PATH}{attack[1]}"'
	if len(attack) > 2:
		hashcat_command += f' -r "{RULE_PATH}{attack[2]}"'
	return hashcat_command + "\n"

def get_bssid(filename):
	global network_bssid_data
	pcap_file_name = filename.replace(".pmkid", ".pcap")
	pcap_file_name = pcap_file_name.replace(".hc22000", ".pcap")

	try:
		bssid = network_bssid_data[pcap_file_name]["bssid"]
	except KeyError:
		raw_mac = re.findall(r'(?:[0-9A-Fa-f]{2}){6}', filename.split("_")[-1])[0].upper()
		bssid = ':'.join([raw_mac[i: i + 2] for i in range(0, len(raw_mac), 2)])

	return bssid

def generate_script_for_batch():
	global session_scripts
	global PROJECT_PATH
	if len(session_scripts) > 1:
		f = open("./hashcat/scripts/batches/batch-" + str(randint(1000, 9999)) + ".bat", "w")
		batch_script = ""
		for script in session_scripts:
			batch_script += f'call "{PROJECT_PATH}hashcat\\scripts\\{script}"\n'
		f.write(batch_script)
		f.close()
		print(f"\nBatch script created for {len(session_scripts)} scripts")

def add_network_to_network_cracked_status_data(filename):
	global network_cracked_status_data
	global HASHCAT_SCRIPT_VERSION
	network_cracked_status_data[filename] = {
		"ssid": filename.split("_")[0],
		"bssid": get_bssid(filename),
		"status": "waiting",
		"version": HASHCAT_SCRIPT_VERSION
	}

def generate_scripts_for_pmkids_and_hccapxs(force_override=False):
    global HASHCAT_SCRIPT_VERSION
    for folder in ["pmkid", "hccapx"]:
        filenames = [f for f in os.listdir(f"./handshakes/{folder}") if f.endswith(".pmkid") or f.endswith(".hc22000")]
        if not filenames:
            print(f"No .pmkid or .hc22000 files found in the {folder} folder.")
            continue  # Skip to the next folder if no .pmkid or .hc22000 files are found
        for filename in filenames:
            if force_override or (filename not in network_cracked_status_data or
                                   (filename in network_cracked_status_data and network_cracked_status_data[filename]["status"] == "waiting")):
                add_network_to_network_cracked_status_data(filename)
                print(f"Generating hashcat script for {filename}")
                generate_hashcat_script(filename, force_override)


if __name__ == "__main__":
	parser = argparse.ArgumentParser(description="Generate hashcat scripts.")
	parser.add_argument("--override", action="store_true", help="Override existing tracking and regenerate scripts.")
	args = parser.parse_args()

	def print_logo():
		print('''
			 ▄ .▄ ▄▄▄· .▄▄ ·  ▄ .▄ ▄▄·  ▄▄▄· ▄▄▄▄▄    .▄▄ ·  ▄▄· ▄▄▄  ▪   ▄▄▄·▄▄▄▄▄
			██▪▐█▐█ ▀█ ▐█ ▀. ██▪▐█▐█ ▌▪▐█ ▀█ •██      ▐█ ▀. ▐█ ▌▪▀▄ █·██ ▐█ ▄█•██  
			██▀▐█▄█▀▀█ ▄▀▀▀█▄██▀▐███ ▄▄▄█▀▀█  ▐█.▪    ▄▀▀▀█▄██ ▄▄▐▀▀▄ ▐█· ██▀· ▐█.▪
			██▌▐▀▐█ ▪▐▌▐█▄▪▐███▌▐▀▐███▌▐█ ▪▐▌ ▐█▌·    ▐█▄▪▐█▐███▌▐█•█▌▐█▌▐█▪·• ▐█▌·
			▀▀▀ · ▀  ▀  ▀▀▀▀ ▀▀▀ ··▀▀▀  ▀  ▀  ▀▀▀      ▀▀▀▀ ·▀▀▀ .▀  ▀▀▀▀.▀    ▀▀▀ 
					   ▄▄ • ▄▄▄ . ▐ ▄
		''')

	print_logo()

	generate_scripts_for_pmkids_and_hccapxs(args.override)
	generate_script_for_batch()
