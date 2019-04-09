from flask import Flask,render_template,request,jsonify
import json
import time
from itkvtk import MRFeatures

formdata={ "date": { "year": 2017, "month": 6, "day": 15 }, 
"priorStudy": "yes", 
"modalityPriorStudy": "mr", 
"datePriorStudy": { "year": 2017, "month": 6, "day": 1 }, 
"observationNumber": 1, 
"diameter": 15, 
"segments": [ False, True, True, False, False, False, False, False, False ], 
"isSeenPriorStudy": "yes", 
"diameterPriorStudy": 10, 
"observationType": "mass", 
"whichMass": "NoneAbove", 
"arterialPhaseEnhancement": "Hypo", 
"washout": "yes", 
"capsule": "yes", 
"ancillaryFeatures": [ True, True, False, False, False, False, False, False ], 
"t2Signal": "MildToModerateHyperintensity", 
"sureOfCategory": "yes", 
"adjustCategory": "", 
"sureOfCategorySecond": "", 
"adjustCategorySecond": "" }



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

        result=MRFeatures.getresult()
        formdata['washout']=result['washout']
        formdata['capsule']=result['capsule']
        formdata['arterialPhaseEnhancement']=result['arterialPhaseEnhancement']
        # formdata['washout']='no'
        # formdata['capsule']='no'
        # formdata['arterialPhaseEnhancement']='Hyper'
        # time.sleep(20)
        print formdata
        return jsonify(formdata)
    else:
        print 'GET!'
        return jsonify({'flaskdata':'GET!'})

if __name__=='__main__':
	app.run(debug=True,threaded=True,port=4201)