from flask import Flask,render_template

<<<<<<< HEAD
app = Flask(__name__, template_folder='dist',static_folder='dist',static_url_path='/dist')
@app.route('/')
@app.route('/<any>')
def index(any=None):
    return render_template('index.html')
=======

>>>>>>> master
'''
@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
<<<<<<< HEAD
    return app.send_static_file(path)
'''
=======
    return app.send_static_file(path)'''
>>>>>>> master
if __name__=='__main__':
	app.run(debug=True)