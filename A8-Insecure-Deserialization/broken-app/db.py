

pets = [
    {'id': 1, 'name': 'skittle', 'kind': 'dog'},
    {'id': 2, 'name': 'leroy', 'kind': 'dog'},
    {'id': 3, 'name': 'fluffer', 'kind': 'cat'},
    {'id': 4, 'name': 'bitey', 'kind': 'gerbil'},
    {'id': 5, 'name': 'cuddles', 'kind': 'snake'},
    {'id': 6, 'name': 'cheesy poofs', 'kind': 'goldfish'},
]

def find_by_id(id):
    return next(pet for pet in pets if pet['id'] == id)

def find_by_name(name):
    return list(pet for pet in pets if pet['name'] == name)

def find_by_kind(kind):
    return list(pet for pet in pets if pet['kind'] == kind)

def insert(name, kind):
    id = len(pets) + 1
    pet = dict(id=id, name=name, kind=kind)
    pets.append(pet)
    return pet 
