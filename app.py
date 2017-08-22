from flask import Flask,template_rendered

app = Flask(__name__, static_folder='dist')

@app.route('/')
def index():
    return template_rendered('index.html')
'''
@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)'''
if __name__=='__main__':
	app.run()