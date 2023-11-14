#!/usr/bin/env node
const fs = require("fs");
const { exec } = require("child_process");

//================
// Configuration 
//================
const config = {
	localDir: "/handshakes/pcap/" //shared folder setup in vagrant
};

let successfulPMKIDs = 0;
let successfulHCCAPXs = 0;

//=======================
// Console log the logo
//=======================
logo = () => {
	console.log(`

	██████╗ ██╗    ██╗███╗   ██╗ █████╗  ██████╗ ███████╗████████╗████████╗██╗   ██╗
	██╔══██╗██║    ██║████╗  ██║██╔══██╗██╔════╝ ██╔════╝╚══██╔══╝╚══██╔══╝╚██╗ ██╔╝
	██████╔╝██║ █╗ ██║██╔██╗ ██║███████║██║  ███╗█████╗     ██║      ██║    ╚████╔╝ 
	██╔═══╝ ██║███╗██║██║╚██╗██║██╔══██║██║   ██║██╔══╝     ██║      ██║     ╚██╔╝  
	██║     ╚███╔███╔╝██║ ╚████║██║  ██║╚██████╔╝███████╗   ██║      ██║      ██║   
	╚═╝      ╚══╝╚══╝ ╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝      ╚═╝      ╚═╝   
																						
	   
					|===============================================|
					| Github: https://github.com/CyrisXD/Pwnagetty  |
					| Twitter: @sudo_overflow                       |
					|===============================================|

			`)
}

readBSSIDsFile = () => {
	return new Promise((resolve, reject) => {
		fs.readFile("bssids.json", function (err, data) {
			if (err) {
				reject("Unable to read bssids.json file: " + err);
				return
			};

			let json = JSON.parse(data)
			resolve(json)
		});
	})
}

//======================================
// Get all pcap files in the directory
//======================================
readDir = () => {
	return new Promise((resolve, reject) => {
		fs.readdir(config.localDir, function (err, files) {
			//handling error
			if (err) {
				reject("Unable to scan directory: " + err);
			}
			resolve(files);
		});
	})
}

//================================================================
// Extract BSSID from PCAP file - Terrible way using Aircrack-ng
//================================================================
function grabBSSID(file) {
	return new Promise((resolve, reject) => {
		let aircrack = exec(`aircrack-ng ${config.localDir}${file}`, function (error, stdout) {
			if (error) {
				resolve(resolve);
			}
		});

		aircrack.stdout.on("data", (data) => {
			if (data.indexOf("Choosing first network as target.") > -1 || data.indexOf("Index number of target network?") > -1) {
				if (data.match(/\b([0-9A-F]{2}[:-]){5}([0-9A-F]){2}\b/gmi)) {
					let mac = data.match(/\b([0-9A-F]{2}[:-]){5}([0-9A-F]){2}\b/gmi);
					aircrack.kill("SIGTERM");
					resolve(mac[0]);

				} else {
					resolve();
				}
			}
		})
	});

}

//================================================
// Convert the pcap file to pmkid or hccapx file
//================================================
function convertFile(file) {
	return new Promise((resolve, reject) => {
		// Exclude ".gitkeep" files
		if (file === ".gitkeep") {
			resolve("Skipped");
			return;
		}

		// We favour PMKID"s, if we find that we ignore handshakes, if no PMKID is found then we look for a handshake.
		let convertPMKIDs = exec(`hcxpcaptool -z /handshakes/pmkid/${file.replace(".pcap", "")}.pmkid ${config.localDir + file}`, function (error, stdout) {
			if (error) { reject(error) };

			if (stdout.includes("PMKID(s) written")) {
				console.log(`Found PMKID in ${file}`);
				successfulPMKIDs++;
				resolve("pmkid");
			} else {
				let convertHCCAPX = exec(`hcxpcapngtool -o /handshakes/hccapx/${file.replace(".pcap", "")}.hc22000 ${config.localDir + file}`, function (error, stdout) {
					if (error) {
						reject(error);
						console.log(error);
					};
					if (stdout.includes("handshake(s) written")) {
						console.log(`Found HCCAPX in ${file}`);
						successfulHCCAPXs++;
						resolve("hccapx");
					} else {
						resolve("No PMKID or HCCAPX found.");
					}
				});
			}
		});
	})
}

//===============
// Main Process
//===============
async function main() {
	try {
		logo();

		let bssids = await readBSSIDsFile();
		let files  = await readDir();

		// if "/pmkid" doesn"t exist, create it.
		if (!fs.existsSync("../../../handshakes/pmkid")) {
			fs.mkdirSync("../../../handshakes/pmkid");
		}
		// if "/hccapx" doesn"t exist, create it.
		if (!fs.existsSync("../../../handshakes/hccapx")) {
			fs.mkdirSync("../../../handshakes/hccapx");
		}

		// Loop over all pcap files
		for (let file of files) {
			// get ssid from filename
			let pos = file.lastIndexOf("_");
			var ssid = file.substring(0, pos);

			console.log(`\nProcessing: ${ssid}`);

			if (bssids[file] == undefined) {
				let result = await convertFile(file);
				if (result == "pmkid" || result == "hccapx") {
					let BSSID = await grabBSSID(file);
					bssids[file] = {
						"ssid": ssid,
						"bssid": BSSID,
						"type": result
					};

					console.log(`Successfully processed ${ssid}.\n`);
				} else {
					console.log(result);
				}
			} else {
				if (bssids[file]["type"] == "pmkid") {
					successfulPMKIDs++;
				} else if (bssids[file]["type"] == "hccapx") {
					successfulHCCAPXs++;
				}
				console.log(`${ssid} has already been converted.\n`);
			}
		};

		fs.writeFileSync("bssids.json", JSON.stringify(bssids), () => {
			console.log("Saved bssids.json...\n\n");
		})

		let numFilesWithNoKeyMaterial = files.length - (successfulHCCAPXs + successfulPMKIDs);
		let percentFilesWithNoKeyMaterial = Math.round(((numFilesWithNoKeyMaterial * 100) / files.length) * 100) / 100;

		console.log(`\n${files.length} total PCAP files found.`);
		console.log(`${successfulPMKIDs} successful PMKIDs found.`);
		console.log(`${successfulHCCAPXs} successful HCCAPXs found.\n`);
		console.log(`${numFilesWithNoKeyMaterial} files (${percentFilesWithNoKeyMaterial}%) did not have key material.\n\n`);

		process.exit(0);
	} catch (err) {
		console.log("Main catch: " + err);
	}
}

main();
