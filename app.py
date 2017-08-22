from flask import Flask,render_template

app = Flask(__name__, static_folder='dist',static_url_path='/dist',template_folder='dist')

@app.route('/<any>')
@app.route('/')
def index(any=None):
    return render_template('index.html')
'''
@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)'''
if __name__=='__main__':
	app.run(debug=True)