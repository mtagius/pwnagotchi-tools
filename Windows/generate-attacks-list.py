from config import WORDLISTS, DICTIONARIES, RULES, MASKS

def generate_attack_list(attack_type):
    attack_list = []

    for wordlist in WORDLISTS:
        for rule in RULES:
            attack_list.append(["-a 0", wordlist, rule])

    for dictionary in DICTIONARIES:
        for rule in RULES:
            attack_list.append(["-a 0", dictionary, rule])

    for rule in RULES:
        attack_list.append(["-a 0", "", rule])

    for mask in MASKS:
        attack_list.append(["-a 3", mask])

    for wordlist in WORDLISTS:
        for mask in MASKS:
            attack_list.append(["-a 6", wordlist, mask])

    for dictionary in DICTIONARIES:
        for mask in MASKS:
            attack_list.append(["-a 6", dictionary, mask])

    return attack_list

def write_attacks_to_file(attacks):
    with open("attacks_list.py", "w") as file:
        file.write("# attacks_list.py\n")
        file.write("# Generated attacks list\n\n")
        file.write("attacks = [\n")
        for attack in attacks:
            file.write(f"    {attack},\n")
        file.write("]\n")

if __name__ == "__main__":
    attack_type = 0  # Set the desired attack type
    attacks = generate_attack_list(attack_type)
    
    write_attacks_to_file(attacks)
