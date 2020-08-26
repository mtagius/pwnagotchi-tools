import os
from tabulate import tabulate

networksCracked = []

def hasNetworkalreadyBeenCracked(resultHash):
    cracked = False
    for network in networksCracked:
        if network[2].split(":")[0] == resultHash.split(":")[0]:
            cracked = True
            break
    return cracked


def detectCrackedNetworks():
    with open("./hashcat/hashcat-output.txt") as hashcatOutput:
        results = hashcatOutput.readlines()
        for result in results:
            resultHash = result.split(":")[0] + ":" + result.split(":")[1]
            if(not hasNetworkalreadyBeenCracked(resultHash)):
                ssid = result.split(":")[2]
                password = result.split(":")[3].strip()
                networksCracked.append([ssid, password, resultHash])

def printCrackedNetworks():
    print('''
 ▄▄· ▄▄▄   ▄▄▄·  ▄▄· ▄ •▄ ▄▄▄ .·▄▄▄▄       ▐ ▄ ▄▄▄ .▄▄▄▄▄▄▄▌ ▐ ▄▌      ▄▄▄  ▄ •▄ .▄▄ · 
▐█ ▌▪▀▄ █·▐█ ▀█ ▐█ ▌▪█▌▄▌▪▀▄.▀·██▪ ██     •█▌▐█▀▄.▀·•██  ██· █▌▐█▪     ▀▄ █·█▌▄▌▪▐█ ▀. 
██ ▄▄▐▀▀▄ ▄█▀▀█ ██ ▄▄▐▀▀▄·▐▀▀▪▄▐█· ▐█▌    ▐█▐▐▌▐▀▀▪▄ ▐█.▪██▪▐█▐▐▌ ▄█▀▄ ▐▀▀▄ ▐▀▀▄·▄▀▀▀█▄
▐███▌▐█•█▌▐█ ▪▐▌▐███▌▐█.█▌▐█▄▄▌██. ██     ██▐█▌▐█▄▄▌ ▐█▌·▐█▌██▐█▌▐█▌.▐▌▐█•█▌▐█.█▌▐█▄▪▐█
·▀▀▀ .▀  ▀ ▀  ▀ ·▀▀▀ ·▀  ▀ ▀▀▀ ▀▀▀▀▀•     ▀▀ █▪ ▀▀▀  ▀▀▀  ▀▀▀▀ ▀▪ ▀█▄▀▪.▀  ▀·▀  ▀ ▀▀▀▀ 
    ''')
    print(tabulate(networksCracked, headers=['SSID', 'Password', "Hash"]))


detectCrackedNetworks()
printCrackedNetworks()
