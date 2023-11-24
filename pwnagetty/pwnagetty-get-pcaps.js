#!/usr/bin/env node
const fs = require("fs");
const config = require("../config");
const sshClient = require("ssh2").Client;
const commander = require("commander");
const sftpClient = require("ssh2-sftp-client");

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

const sshConfig = {
	host: config.PWNAGOTCHI_SSH.HOST_ADDRESS,
	username: config.PWNAGOTCHI_SSH.USERNAME,
	password: config.PWNAGOTCHI_SSH.PASSWORD,
	port: config.PWNAGOTCHI_SSH.PORT,
	localDir: config.LOCAL_PCAP_DIRECTORY,
	handshakeDir: config.HANDSHAKE_DIRECTORY
}

const sftpConfig = {
	host: config.PWNAGOTCHI_SSH.HOST_ADDRESS,
	username: config.PWNAGOTCHI_SSH.USERNAME,
	password: config.PWNAGOTCHI_SSH.PASSWORD,
	port: config.PWNAGOTCHI_SSH.PORT
}

//=================================================================
// Copy all .pcap files to an accessable folder on the Pwnagotchi
//=================================================================
async function moveFiles() {
	const ssh = new sshClient();
	const commandToExecute =
		`
		sudo rm -rf ${config.HANDSHAKE_DIRECTORY} 2>/dev/null &&
		mkdir -p ${config.HANDSHAKE_DIRECTORY} 2>/dev/null &&
		sudo cp -r /root/handshakes/ ~/ &&
		ls -a ${config.HANDSHAKE_DIRECTORY}
		`

	ssh.setMaxListeners(100);

	ssh.on("ready", () => {
		console.log("Connected to the Pwnagotchi.");

		ssh.exec(commandToExecute, (err, stream) => {
			if (err)
				throw err;
			stream.on("close", (code, signal) => {
				console.log(`Command execution closed with code ${code}.`);
				ssh.end();
			}).on("data", data => {
				console.log(`Command output:\n${data}`);
			}).stderr.on("data", data => {
				console.error(`Error output:\n${data}`);
			});
		});
	}).connect(sshConfig);
}

//=====================================
// Download all files from Pwnagotchi
//=====================================
async function getFiles() {
	const client = new sftpClient();

	// if "/pcap" doesn"t exist, create it.
	if (!fs.existsSync(config.LOCAL_PCAP_DIRECTORY)) {
		fs.mkdirSync(config.LOCAL_PCAP_DIRECTORY);
	}

	// connect to pwnagotchi and get files.
	try {
		await client.connect(sftpConfig);
		console.log("Connecting to Pwnagotchi...\n");

		let count = 0;
		client.on("download", info => {
			count++;
			process.stdout.write(`Downloaded ${count} captures...` + "\r");
		});

		let rslt = await client.downloadDir(config.PWNAGOTCHI_HANDSHAKES, config.LOCAL_PCAP_DIRECTORY);
		console.log(`\n`);
		return rslt;
	} finally {
		client.end();
	}
}

//=========================================
// Remove processed files from Pwnagotchi
//=========================================
async function removeFiles() {
	console.log("Removing processed files from Pwnagotchi...\n");
	const client = new sftpClient();
	const src = config.handshakeDir;

	// Connect to pwnagotchi and remove files.
	try {
		await client.connect(configObject);

		let list = await client.list(src, "*.pcap");
		for (let file of list) {
			await client.delete(src + file.name);
		}
		
	} finally {
		client.end();
	}
}

//===============
// Main Process
//===============
async function main() {
	try {
		logo();

		commander
			.option("-r, --remove", "Delete handshake files after processing.")
			.parse(process.argv);

		await moveFiles();
		await getFiles();

		// if "./handshakes/pmkid" doesn"t exist, create it.
		if (!fs.existsSync(config.LOCAL_PMKID_DIRECTORY)) {
			fs.mkdirSync(config.LOCAL_PMKID_DIRECTORY);
		}

		// if "./handshakes/hccapx" doesn"t exist, create it.
		if (!fs.existsSync(config.LOCAL_HCCAPX_DIRECTORY)) {
			fs.mkdirSync(config.LOCAL_HCCAPX_DIRECTORY);
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
