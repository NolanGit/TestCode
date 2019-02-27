s = "123".rjust(5)
print('demodemodemodemodemo')
print(s)
s = "123".ljust(5)
print(s)
s = "123".center(5)
print(s)
s = "一".ljust(5)
print(s+'end')
s = "一二".ljust(5)
print(s+'end')
s = "一二三".ljust(5)
print(s+'end')


import re
def len_zh(data):
    temp = re.findall('[^a-zA-Z0-9.]+', data)
    count = 0
    for i in temp:
        count += len(i)
    return(count)
 
str1=('你好')
str2=('ab')

#调用ljust前先计算中文字符个数
zh = len_zh(str1)
#动态修正填充字符数
print(str1.ljust(20-zh)+'end')

zh = len_zh(str2)
#动态修正填充字符数
print(str2.ljust(20-zh)+'end')