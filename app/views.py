from flask import render_template
from flask import request
from app import app
import json

@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Miguel'} # fake user
    return render_template('index.html', title='Home', user=user)

scoreList = {'A': 1, 'B': 2, 'C': 3}
@app.route('/scores', methods=['GET'])
def scores():
    return json.dumps(scoreList)

@app.route('/submit', methods=['POST'])
def submit():
    print('name: '+request.json['name']+' score: '+str(request.json['score']))
    return ''
