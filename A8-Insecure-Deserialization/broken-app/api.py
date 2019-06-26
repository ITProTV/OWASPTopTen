from flask import Blueprint, jsonify, request
import db
import middleware

api = Blueprint('api', __name__)



@api.route('/pets', methods=["GET", "POST"])
@middleware.accept_yaml
def show():
    if request.method == 'GET':
        return jsonify(db.pets)
    else:
        print(request.data)
        name = (request.form['name'] 
                if 'name' in request.form 
                else request.data['name'])
        kind = (request.form['kind'] 
                if 'kind' in request.form 
                else request.data['kind'])
        pet = db.insert(name, kind)
        return jsonify(dict(msg='success', pet=pet))

@api.route('/pets/name/<string:name>')
@middleware.accept_yaml
def by_name(name):
    return jsonify(db.find_by_name(name))

@api.route('/pets/kind/<string:kind>')
@middleware.accept_yaml
def by_kind(kind):
    return jsonify(db.find_by_kind(kind))

@api.route('/pets/<int:identifier>')
@middleware.accept_yaml
def by_id(identifier):
    return jsonify(db.find_by_id(identifier))

