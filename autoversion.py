import re

f = open('app/templates/index.html','r+')
contents = f.read().splitlines()
replaced = []

for line in contents:
    if re.search(r'version=\d+', line):
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
