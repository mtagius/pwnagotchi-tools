import wordninja
import sys
import itertools

splitList = wordninja.split(sys.argv[1])
for i in range(len(splitList)):
    for p in itertools.product(splitList, repeat=(i + 1)):
        print(''.join(p))