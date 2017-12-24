from eve import Eve
from random import randint
import base64
import os
from flask import request,make_response,jsonify
from flask_cors import CORS
import eye_jaundice
import numpy as np

people = {
'schema': {
    'tests':{
        'type': 'string',
        'required': True
        }
},
    'resource_methods':['GET','POST'],
}

settings = {
    'IF_MATCH': False,
    'DOMAIN': {
        'people' : people
}
}                

app = Eve(settings=settings)

CORS(app)
def do_work(resource, docs):
    i = randint(0,9)
    if resource == 'people':
        for doc in docs:
            
            imgdata = base64.b64decode(doc['tests'][22:])
            print np.array(imgdata).shape
            filename = '/home/anshuman/coding_practice/sandbox/downloaded-images/' +  str(i)  + '.png'
            with open(filename, 'wb') as f:
                f.write(imgdata)
            isJaundice = eye_jaundice.findJaundice(filename)
            print isJaundice
            if isJaundice:
                return isJaundice
            else:
                return isJaundice

app.on_insert += do_work

if __name__ == '__main__':
    app.run(host = '192.168.8.223', port = 8777, ssl_context = 'adhoc')
