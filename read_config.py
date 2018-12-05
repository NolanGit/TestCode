import os
import sys 
import configparser


str = sys._getframe().f_code.co_filename
list = str.split('\\')
final_path = ''
for y in range(len(list) - 1):
    if y == 0:
        final_path = list[0]
    else:
        final_path = final_path + '\\' + list[y]
cf = configparser.ConfigParser()
cf.read(os.path.join(final_path,'demo.config'))
print(cf.get('demo_config','PI'))