#!/usr/bin/env node
const fs = require("fs");
const commander = require("commander");
const sftpClient = require("ssh2-sftp-client");

const {
	HOST_IP,
	USERNAME,
	PASSWORD,
	HANDSHAKE_DIRECTORY,
	PORT,
	LOCAL_PCAP_DIRECTORY
} = require("../config");

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
			`);
}

//=====================================
// Download all files from Pwnagotchi
//=====================================
async function getFiles() {
	const client = new sftpClient();
	const config = {
		host: HOST_IP,
		username: USERNAME,
		password: PASSWORD,
		handshakeDir: HANDSHAKE_DIRECTORY,
		port: PORT,
		localDir: LOCAL_PCAP_DIRECTORY
	}

	// if "/pcap" doesn"t exist, create it.
	if (!fs.existsSync(LOCAL_PCAP_DIRECTORY)) {
		fs.mkdirSync(LOCAL_PCAP_DIRECTORY);
	}
	// connect to pwnagotchi and get files
	try {
		await client.connect(config);
		console.log("Connecting to Pwnagotchi... \n");
		let count = 0;
		client.on("download", info => {
			count++
			process.stdout.write(`Downloaded ${count} captures...` + "\r");
		});
		let rslt = await client.downloadDir(HANDSHAKE_DIRECTORY, LOCAL_PCAP_DIRECTORY);
		console.log(`\n`);
		return rslt;
	} finally {
		client.end();
	}
}

//=====================================
// Remove processed files from Pwnagotchi
//=====================================
async function removeFiles() {
	console.log("Removing processed files from Pwnagotchi...\n");
	const client = new sftpClient();
	const src = config.handshakeDir;

	// connect to pwnagotchi and remove files
	try {
		await client.connect(config);       
		let list = await client.list(src, "*.pcap");
		for (let file of list) {
			await client.delete(src + file.name);
		}
		
	} finally {
		client.end();
	}
}

//=================
// Main Process
//=================
async function main() {
	try {
		logo();

		commander
			.option("-r, --remove", "Delete handshake files after processing.")
			.parse(process.argv);

		await getFiles();

		// if "./handshakes/pmkid" doesn"t exist, create it.
		if (!fs.existsSync("./handshakes/pmkid")) {
			fs.mkdirSync("./handshakes/pmkid");
		}
		// if "./handshakes/hccapx" doesn"t exist, create it.
		if (!fs.existsSync("./handshakes/hccapx")) {
			fs.mkdirSync("./handshakes/hccapx");
		}

		if (commander.remove) {
            await removeFiles();
        }

        process.exit(0);
	} catch (err) {
		console.log("Main catch: " + err);
	}
}

main();
