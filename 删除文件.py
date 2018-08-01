import shutil
import os
'''
my_file = 'C:\\Users\\sunhaoran\\新建文本文档.txt'
if os.path.exists(my_file):
    # 删除文件，可使用以下两种方法。
    os.remove(my_file)
'''

my_file = 'D:\\GCloud\\tomcat\\Tomcat8-checkOfCity\\apache-tomcat-6.0.41\\work\\Catalina\\localhost'
if os.path.exists(my_file):
    # 删除文件，可使用以下两种方法。
    shutil.rmtree(my_file)
print('done')
