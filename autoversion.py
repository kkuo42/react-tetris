import re
import argparse

# Parses for css/js flag
parser = argparse.ArgumentParser(description='parser')
parser.add_argument('--mode', action='store', dest='mode', default='js')
args = parser.parse_args()

f = open('app/templates/index.html','r+')
contents = f.read().splitlines()
replaced = []

# Increments the version number of the css/js flag
for line in contents:
    rawString = args.mode+r'\?version=\d+'
    if re.search(rawString, line):
        matches = re.findall(r'version=\d+', line)
        numbers = re.findall(r'\d+', matches[0])
        numbers[0] = str(int(numbers[0])+1)
        newLine = re.sub(r'version=\d+', 'version='+numbers[0], line)
        replaced.append(newLine)
    else:
        replaced.append(line)

f.seek(0)
f.write('\n'.join(replaced))
f.close()
