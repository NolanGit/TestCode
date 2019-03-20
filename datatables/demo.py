#coding:utf-8

from flask import Flask,render_template,url_for

from flask import Response
 
import json
# 生成Flask实例
app = Flask(__name__)
def Response_headers(content):
    resp = Response(content)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/')
def my_echart():
    # 在浏览器上渲染my_template.html模板
    return render_template('test.html')

 
@app.route('/datatables',methods=['GET'])
def datatables():
    datas = {
		"data":[
			{"id":1,"author":"allpe","name":100}
		]
	}
    content = json.dumps(datas)
    resp = Response_headers(content)
    return (resp)

if __name__ == '__main__':
    # 运行项目
    app.run(debug=True)