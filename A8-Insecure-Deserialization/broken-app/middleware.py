from flask import request
from functools import wraps
import yaml

def accept_yaml(f):
    @wraps(f)
    def inner(*args, **kwargs):
        length = (int(request.headers['Content-Length']) 
                    if 'Content-Length' in request.headers 
                    else 0)
        content_type = (request.headers['Content-Type'] 
                    if 'Content-Type' in request.headers
                    else '')
        if (content_type == 'application/x-yaml' and length < 1024):
            data = yaml.load(request.get_data(as_text=True))
            request.data = data
        return f(*args, **kwargs)
    return inner
