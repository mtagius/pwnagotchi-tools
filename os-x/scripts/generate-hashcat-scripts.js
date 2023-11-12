const fs = require("fs");
const path = require("path");
const config = require("../config");
const attacks = require(`.${config.HASHCAT_ATTACK_LISTS}`);

function generateHashcatCommands(attacks) {
    const hcCapxFiles = fs.readdirSync(config.LOCAL_HCCAPX_DIRECTORY).filter(file => file.endsWith(".hc22000"));

    for (const hcCapxFile of hcCapxFiles) {
        const hcCapxFilePath = path.join(config.LOCAL_HCCAPX_DIRECTORY, hcCapxFile);
        const sessionName = `${path.basename(hcCapxFile, path.extname(hcCapxFile))}_${getRandomInt()}`;
        const outputFilePath = `./hashcat/${path.basename(hcCapxFile, path.extname(hcCapxFile))}-output.txt`;
        const scriptFilePath = path.join(config.HASHCAT_ATTACK_SCRIPTS, `${path.basename(hcCapxFile, path.extname(hcCapxFile))}.txt`);

        // Create an array to store script lines
        const scriptLines = [];

        for (const attack of attacks) {
            const attackType = attack[0];
            switch (attackType) {
                case "--attack-mode=0":
                    scriptLines.push(generateType0Command(attack, sessionName, outputFilePath, hcCapxFilePath));
                    break;
                case "--attack-mode=3":
                    scriptLines.push(generateType3Command(attack, sessionName, outputFilePath, hcCapxFilePath));
                    break;
                case "--attack-mode=6":
                    scriptLines.push(generateType6Command(attack, sessionName, outputFilePath, hcCapxFilePath));
                    break;
                // Add more cases for other attack types if needed
                default:
                    console.error(`Unknown attack type: ${attackType}`);
            }
        }

        // Write the script lines to the script file
        fs.writeFileSync(scriptFilePath, scriptLines.join("\n"), "utf8");
    }
}

function generateType0Command(attack, sessionName, outputFilePath, hcCapxFilePath) {
    const attackType = attack[0];
    const wordlist = attack[1];
    const rule = attack[2];

    return `hashcat --hash-type=${config.HASH_TYPE} ${attackType} --session ${sessionName} --hwmon-temp-abort=${config.ABORT_TEMPERATURE} -w ${config.ABORT_WAIT_TIME} --potfile-path "${config.HASHCAT_POTFILE_PATH}" --outfile="${outputFilePath}" "${hcCapxFilePath}" --rules-file="${rule}" -S "${wordlist}"`;
}

function generateType3Command(attack, sessionName, outputFilePath, hcCapxFilePath) {
    const attackType = attack[0];
    const mask = attack[1];

    return `hashcat --hash-type=${config.HASH_TYPE} ${attackType} --session ${sessionName} --hwmon-temp-abort=${config.ABORT_TEMPERATURE} -w ${config.ABORT_WAIT_TIME} --potfile-path "${config.HASHCAT_POTFILE_PATH}" --outfile="${outputFilePath}" "${hcCapxFilePath}" -S "${mask}"`;
}

function generateType6Command(attack, sessionName, outputFilePath, hcCapxFilePath) {
    const attackType = attack[0];
    const wordlist = attack[1];
    const rule = attack[2];
    const mask = attack[3];

    return `hashcat --hash-type=${config.HASH_TYPE} ${attackType} --session ${sessionName} --hwmon-temp-abort=${config.ABORT_TEMPERATURE} -w ${config.ABORT_WAIT_TIME} --potfile-path "${config.HASHCAT_POTFILE_PATH}" --outfile="${outputFilePath}" "${hcCapxFilePath}" --rules-file="${rule}" -S "${wordlist}" "${mask}"`;
}

// Function to generate a random 4-digit integer
function getRandomInt() {
    return Math.floor(1000 + Math.random() * 9000);
}

generateHashcatCommands(attacks);
