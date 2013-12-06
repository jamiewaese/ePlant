import xml.etree.ElementTree as ET
import simplejson as json

output = {}
output['outlines'] = []
output['groups'] = []

tree = ET.parse('efp.svg')
root = tree.getroot()

groups = root.findall('{http://www.w3.org/2000/svg}g')

for group in groups:
    id = group.get('id')
    if id == 'outlines':
        paths = group.findall('{http://www.w3.org/2000/svg}path')
        for path in paths:
            output['outlines'].append(path.get('d').replace(' ', ''))
        continue
    if id == 'labels':
        continue
    item = {}
    item['name'] = id
    item['paths'] = []
    paths = group.findall('{http://www.w3.org/2000/svg}path') + group.findall('{http://www.w3.org/2000/svg}g/{http://www.w3.org/2000/svg}path')
    for path in paths:
        item['paths'].append(path.get('d').replace(' ', ''))
    output['groups'].append(item)

f = open('efp.json', 'w')
f.write(json.dumps(output, indent="\t"))
f.close()
        
