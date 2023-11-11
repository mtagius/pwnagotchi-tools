scp -o IdentitiesOnly=yes -i "../ssh/aws.pem" -r "../hashcat/" ubuntu@.compute-1.amazonaws.com:/home/ubuntu
scp -o IdentitiesOnly=yes -i "../ssh/aws.pem" "./aws-initial-provision.sh" ubuntu@.compute-1.amazonaws.com:/home/ubuntu
scp -o IdentitiesOnly=yes -i "../ssh/aws.pem" "./set-nividia-settings.sh" ubuntu@.compute-1.amazonaws.com:/home/ubuntu