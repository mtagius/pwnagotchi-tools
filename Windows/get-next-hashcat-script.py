import json

networkCrackedStatusData = {}
totalWaiting = 0
totalExhausted = 0
totalCracked = 0
foundNextScript = False

with open('network-cracked-status.json') as f:
    networkCrackedStatusData = json.load(f)

for network in networkCrackedStatusData.keys():
    if(networkCrackedStatusData[network]["status"] == "waiting" and foundNextScript == False):
        print("\nNext script ready to run:")
        print("\n" + network.replace(".pmkid", "").replace(".hc22000", "") + ".bat")
        print("SSID: " + networkCrackedStatusData[network]["ssid"])
        print("BSSID: " + networkCrackedStatusData[network]["bssid"])
        print("Status: " + networkCrackedStatusData[network]["status"])
        print("Version: " + networkCrackedStatusData[network]["version"])
        foundNextScript = True
    if(networkCrackedStatusData[network]["status"] == "waiting"):
        totalWaiting += 1
    elif(networkCrackedStatusData[network]["status"] == "exhausted"):
        totalExhausted += 1
    elif(networkCrackedStatusData[network]["status"] == "cracked"):
        totalCracked += 1
        
print("\nTotal Networks:  " + str(len(networkCrackedStatusData)) + "\n")
print("Total Waiting:   " + str(totalWaiting))
print("Total Exhausted: " + str(totalExhausted))
print("Total Cracked:   " + str(totalCracked))
print("Success Rate:    " + str(round(totalCracked * 100 / (totalCracked + totalExhausted), 1)) + "%")
