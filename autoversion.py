"""
Script to increment the version number of modified css file or js bundle 
based upon the flag set. Default is js.
"""
import re
import argparse

# Parses for css/js flag
parser = argparse.ArgumentParser(description='parser')
parser.add_argument('--mode', action='store', dest='mode', default='js')
args = parser.parse_args()

f = open('app/templates/index.html','r+')
contents = f.read().splitlines()
replaced = []

# Reads through each line and searches for cs/jss version 
for line in contents:
    # Increments the version number of the css/js flag
    if re.search(args.mode+r'\?version=\d+', line):
        matches = re.findall(r'version=\d+', line)
        nums = re.findall(r'\d+', matches[0])
        numPlus = str(int(nums[0])+1)
        newLine = re.sub(r'version=\d+', 'version='+numPlus, line)
        replaced.append(newLine)
    else:
        replaced.append(line)

f.seek(0)
f.write('\n'.join(replaced))
f.close()
