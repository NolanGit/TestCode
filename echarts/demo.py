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

 
@app.route('/echarts',methods=['GET'])
def echarts():
    datas = {
		"data":[
			{"name":"allpe","num":100},
			{"name":"peach","num":123},
			{"name":"Pear","num":234},
			{"name":"avocado","num":20},
			{"name":"cantaloupe","num":1},
			{"name":"Banana","num":77},
			{"name":"Grape","num":43},
			{"name":"apricot","num":0}
		]
	}
    content = json.dumps(datas)
    resp = Response_headers(content)
    return (resp)

if __name__ == '__main__':
    # 运行项目
    app.run(debug=True)