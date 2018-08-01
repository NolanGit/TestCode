#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
relative_path_begin_location = 30
'''
global qqq
qqq = 0


def get_all_files_print(dir_path):
    global qqq
    # 遍历dir_path下所有文件，包括子目录
    files = os.listdir(dir_path)
    for file in files:
        file_path = os.path.join(dir_path, file)
        if os.path.isdir(file_path):
            get_all_files_print(file_path)
        else:
            qqq += 1
            print(os.path.join(dir_path, file_path))
            print(qqq)
'''


def get_all_files(dir_path):
    # 遍历dir_path下所有文件，包括子目录
    files = os.listdir(dir_path)
    for file in files:
        file_path = os.path.join(dir_path, file)
        if os.path.isfile(file_path):
            yield file_path
        # get_all_files(file_path)
        else:
            # print(os.path.join(dir_path, file_path))
            # return(os.path.join(dir_path, file_path))
            for i in get_all_files(file_path):
                yield i

# 递归遍历/root目录下所有文件
print('begin')

y = (get_all_files('C:\\Users\\sunhaoran\\test'))
x = []
for n in y:
    x.append(n)
print(x)

'''
q = get_all_files_print('C:\\Users\\sunhaoran\\test\\01_war')
# print(os.path.join(dir_path, file_path)[relative_path_begin_location:])
'''
