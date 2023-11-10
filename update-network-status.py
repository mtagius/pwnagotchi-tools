import sys
import json
import re
import time

filename = sys.argv[1]

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

if ".pmkid" in filename:
	status = "exhausted"
	with open("./hashcat/hashcat-output.txt") as hashcat_output:
		results = hashcat_output.readlines()
		for result in results:
			result = result.split(":")[-4] + ":" + result.split(":")[-3]
			with open("./handshakes/pmkid/" + filename) as pmkid_file:
				pmkids = pmkid_file.readlines()
				for pmkid in pmkids:
					pmkid = pmkid.split("*")[1] + ":" + pmkid.split("*")[2]
					if pmkid == result:
						status = "cracked"
						break
	update_network_cracked_status(status)
else:
	ssid = filename.split("_")[0]
	status = "exhausted"
	with open("./hashcat/hashcat-output.txt") as hashcat_output:
		results = hashcat_output.readlines()
		for result in results:
			result = result.split(":")[-2]
			result = re.sub(r'\W+', '', result)
			if ssid == result:
				status = "cracked"
				break
	update_network_cracked_status(status)
