import json

with open('./public/data/Penguins/2010.json') as data_file:
    data = json.load(data_file)

itemsToRemove = []

for element in reversed(data):
    if element['GP'] == 'GP':
        data.remove(element)

with open('data.json', 'w') as data_file:
    data = json.dump(data, data_file)