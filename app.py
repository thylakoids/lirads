from flask import Flask,render_template,request,jsonify
import json
app = Flask(__name__, template_folder='dist',static_folder='dist',static_url_path='')
@app.route('/')
@app.route('/V2013')
@app.route('/home')
@app.route('/about')
@app.route('/V2014')
@app.route('/v2017')
def index():
    return render_template('index.html')

@app.route('/test', methods=['GET', 'POST'])
def test():
    if request.method == 'POST':
    	data = json.loads(request.get_data())
    	print 'POST'
 	print data
 	return jsonify(data)
    else:
        print 'GET!'
        return jsonify({'flaskdata':'GET!'})

@app.route('/<path:path>')
def static_proxy(path):
    # send_static_file will guess the correct MIME type
    return app.send_static_file(path)

if __name__=='__main__':
	app.run(debug=True)