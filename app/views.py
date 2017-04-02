from flask import render_template
from flask import request
from app import app
from operator import itemgetter
import json

@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Miguel'} # fake user
    return render_template('index.html', title='Home', user=user)

allScores = [['John', 250], ['Billy', 500], ['Joe', 750], ['Kyle', 1000]]

@app.route('/scores', methods=['GET'])
def scores():
    scoreList = sorted(allScores, key=itemgetter(1), reverse=True)[:8]
    return json.dumps(scoreList)

@app.route('/submit', methods=['POST'])
def submit():
    print('name: '+request.json['name']+' score: '+str(request.json['score']))
    allScores.append([request.json['name'], request.json['score']])
    return ''
