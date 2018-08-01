#!/usr/bin/python
# encoding:utf-8
import json
import requests
from bs4 import BeautifulSoup

baseurl = 'http://api.jisuapi.com/gold/shgold?appkey=96863eaf1905582a'
r = requests.get(baseurl)
data = json.loads(r.text)
print(((data['result'])[0])['price'])
