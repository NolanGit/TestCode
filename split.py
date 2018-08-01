import os

str = 'C:/Users/sunhaoran/test/GCloud-Check_20180628-20180705_阶段包.zip'
list = str.split('/')
y = 0
path1 = ''
for y in range(len(list) - 1):
    if y == 0:
        path1 = list[0]
    else:
        path1 = path1 + '/' + list[y]
print(path1)
