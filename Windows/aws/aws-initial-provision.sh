#!/bin/bash

echo 'deb http://http.kali.org/kali kali-rolling main contrib non-free' >> /etc/apt/sources.list
echo 'deb-src http://http.kali.org/kali kali-rolling main contrib non-free' >> /etc/apt/sources.list
apt-get -y --allow-unauthenticated update
apt-get -y --allow-unauthenticated install build-essential
apt-get -y --allow-unauthenticated install hashcat
apt-get -y --allow-unauthenticated install linux-image-extra-virtual
touch /etc/modprobe.d/blacklist-nouveau.conf
cat <<EOF >> /etc/modprobe.d/blacklist-nouveau.conf
blacklist nouveau
blacklist lbm-nouveau
options nouveau modeset=0
alias nouveau off
alias lbm-nouveau off
EOF
echo options nouveau modeset=0 | sudo tee -a /etc/modprobe.d/nouveau-kms.conf

update-initramfs -u
apt-get -y install --allow-unauthenticated nvidia-384

reboot