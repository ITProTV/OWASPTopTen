from flask import Flask, render_template, request, redirect
app = Flask(__name__)


@app.route('/')
def hello():
    return render_template('index.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST': 
      #SSH Credentials
      ## username: justin
      ## password: cheese
      ## port: 3333
      print('Now working with', reqest.form)
      return redirect('/contact')
       
    return render_template('contact.html') 
