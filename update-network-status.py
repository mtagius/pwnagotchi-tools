import sys
import json
import re
import time

# this script has one argument, the filename of the pmkid/hccapx file whose status will be updated
filename = sys.argv[1]

def updateNetworkCrackedStatus(status):
    global filename
    networkCrackedStatusData = {}
    with open('network-cracked-status.json') as f:
        networkCrackedStatusData = json.load(f)
    networkCrackedStatusData[filename]['status'] = status
    with open('network-cracked-status.json', 'w') as f:
        json.dump(networkCrackedStatusData, f, indent=4)
    print("\n" + filename)
    if(status == "cracked"):
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
    time.sleep(30)                                     

if(".pmkid" in filename):
    status = "exhausted"
    with open("./hashcat/hashcat-output.txt") as hashcatOutput:
        results = hashcatOutput.readlines()
        for result in results:
            result = result.split(":")[-4] + ":" + result.split(":")[-3]
            with open("./handshakes/pmkid/" + filename) as pmkidFile:
                pmkids = pmkidFile.readlines()
                for pmkid in pmkids:
                    pmkid = pmkid.split("*")[1] + ":" + pmkid.split("*")[2]
                    if(pmkid == result):
                        status = "cracked"
                        break
    updateNetworkCrackedStatus(status)
else:
    ssid = filename.split("_")[0]
    status = "exhausted"
    with open("./hashcat/hashcat-output.txt") as hashcatOutput:
        results = hashcatOutput.readlines()
        for result in results:
            result = result.split(":")[-2]
            result = re.sub('\W+','', result)
            if(ssid == result):
                status = "cracked"
                break
    updateNetworkCrackedStatus(status)