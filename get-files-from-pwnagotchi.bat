ssh -i ./ssh/id_rsa pi@pwnagotchi.local "sudo cp -r /root/handshakes/ /home/pi/handshakes"
mkdir handshakes\pcap
scp -r -i ./ssh/id_rsa pi@pwnagotchi.local:/home/pi/handshakes/.  ./handshakes/pcap
ssh -i ./ssh/id_rsa pi@pwnagotchi.local "sudo rm -rf /home/pi/handshakes"