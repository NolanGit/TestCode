import re


def check(str):
    my_re = re.compile(r'[A-Z]', re.S)
    res = re.findall(my_re, str)
    print(len(res))
    print(res)
    if len(res):
        print('含有英文字符')
    else:
        print('不含有英文字符')
if __name__ == '__main__':
    str = 'APP'
    check(str)
    str1 = '你好123'
    check(str1)
