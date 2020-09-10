#!/bin/sh

ssh -o IdentitiesOnly=yes -i ./ssh/id_rsa pi@pwnagotchi.local "sudo cp -r /root/handshakes/ /home/pi/handshakes"
mkdir handshakes\pcap
scp -o IdentitiesOnly=yes -r -i ./ssh/id_rsa pi@pwnagotchi.local:/home/pi/handshakes/.  ./handshakes/pcap
ssh -o IdentitiesOnly=yes -i ./ssh/id_rsa pi@pwnagotchi.local "sudo rm -rf /home/pi/handshakes"
