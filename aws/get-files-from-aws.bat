scp -i "../ssh/aws.pem" ubuntu@ec2.compute-1.amazonaws.com:/home/ubuntu/hashcat/hashcat-output.txt "../hashcat/hashcat-output.txt"
scp -i "../ssh/aws.pem" ubuntu@ec2.compute-1.amazonaws.com:/home/ubuntu/hashcat/hashcat-potfile.txt "../hashcat/hashcat-potfile.txt"
scp -i "../ssh/aws.pem" -r ubuntu@ec2.compute-1.amazonaws.com:/home/ubuntu/hashcat/sessions/* "../hashcat/sessions"
