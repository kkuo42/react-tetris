from flask import render_template
from flask import request
from app import app

@app.route('/')
@app.route('/index')
def index():
    user = {'nickname': 'Miguel'} # fake user
    return render_template('index.html', title='Home', user=user)

@app.route('/submit', methods=['POST'])
def submit():
    print('name: '+request.json['name']+' score: '+str(request.json['score']))
    return ''
