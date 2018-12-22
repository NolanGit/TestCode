import xlwt
import time

wbk = xlwt.Workbook()
sheet = wbk.add_sheet('sheet 1')
for i in range(10):
    sheet.write(i+1, 0, '%s' % time.strftime("%Y%m%d%H%M%S", time.localtime()))
    time.sleep(1)
wbk.save('%s.xls' % time.strftime("%Y%m%d%H%M%S", time.localtime()))
