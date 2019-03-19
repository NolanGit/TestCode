import datetime

list=[]
today = datetime.datetime.now()
for x in range(14):
    offset = datetime.timedelta(days=x)
    re_date = (today + offset).strftime('%Y-%m-%d')
    list.append(re_date)
print(list)